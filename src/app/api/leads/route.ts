import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

async function verifyToken(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { employee: true, branch: true }
    });
    return user;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const agentId = searchParams.get('agentId');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (agentId && agentId !== 'all') {
      where.agentId = agentId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { interest: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Buscar leads
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          property: {
            select: {
              id: true,
              title: true,
              type: true,
              price: true,
              neighborhood: true,
              city: true
            }
          },
          branch: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.lead.count({ where })
    ]);

    // Estatísticas por status
    const statusStats = await prisma.lead.groupBy({
      by: ['status'],
      _count: true,
      where: agentId && agentId !== 'all' ? { agentId } : {}
    });

    const stats = {
      total,
      byStatus: statusStats.reduce((acc: Record<string, number>, stat: any) => {
        acc[stat.status] = stat._count;
        return acc;
      }, {} as Record<string, number>)
    };

    return NextResponse.json({
      leads,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Dados recebidos para criar lead:', data);
    
    const {
      name,
      email,
      phone,
      status = 'NEW',
      source = 'WEBSITE',
      interest,
      budget,
      notes = '',
      propertyId,
      agentId
    } = data;

    // Validações
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Nome, email e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // Usar o agentId fornecido ou o usuário atual como agent
    const finalAgentId = agentId || user.id;
    console.log('agentId recebido:', agentId, 'user.id:', user.id, 'finalAgentId:', finalAgentId);

    // Verificar se o agent existe
    const agent = await prisma.user.findUnique({
      where: { id: finalAgentId },
      include: { branch: true }
    });

    console.log('Agent encontrado:', agent ? { id: agent.id, name: agent.name, email: agent.email } : 'null');

    if (!agent) {
      return NextResponse.json(
        { error: `Agente não encontrado com ID: ${finalAgentId}` },
        { status: 400 }
      );
    }

    // Garantir que temos um branchId válido
    let branchId = agent.branchId;
    if (!branchId && agent.branch) {
      branchId = agent.branch.id;
    }
    if (!branchId) {
      // Buscar a primeira filial disponível se o agente não tiver uma
      const firstBranch = await prisma.branch.findFirst();
      branchId = firstBranch?.id || '';
    }

    if (!branchId) {
      return NextResponse.json(
        { error: 'Nenhuma filial encontrada' },
        { status: 400 }
      );
    }

    // Verificar se a propriedade existe (se fornecida)
    if (propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: propertyId }
      });

      if (!property) {
        return NextResponse.json(
          { error: 'Propriedade não encontrada' },
          { status: 400 }
        );
      }
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        status,
        source,
        interest: interest || 'Interesse geral',
        budget: budget ? parseFloat(budget) : null,
        notes,
        agentId: finalAgentId,
        propertyId: propertyId || null,
        branchId: branchId,
        lastContactAt: new Date()
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        property: {
          select: {
            id: true,
            title: true,
            type: true,
            price: true,
            neighborhood: true,
            city: true
          }
        },
        branch: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    console.log('Lead criado com sucesso:', lead.id);
    return NextResponse.json(lead, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar lead:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
