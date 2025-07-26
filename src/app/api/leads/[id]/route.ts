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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const params = await context.params;
    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
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
            city: true,
            photos: true
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

    if (!lead) {
      return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
    }

    return NextResponse.json(lead);

  } catch (error) {
    console.error('Erro ao buscar lead:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const params = await context.params;
    const data = await request.json();
    const {
      name,
      email,
      phone,
      status,
      source,
      interest,
      budget,
      notes,
      propertyId,
      agentId
    } = data;

    // Verificar se o lead existe
    const existingLead = await prisma.lead.findUnique({
      where: { id: params.id }
    });

    if (!existingLead) {
      return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
    }

    // Validações
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Nome, email e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o agent existe (se fornecido)
    if (agentId && agentId !== existingLead.agentId) {
      const agent = await prisma.user.findUnique({
        where: { id: agentId }
      });

      if (!agent) {
        return NextResponse.json(
          { error: 'Agente não encontrado' },
          { status: 400 }
        );
      }
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

    const updateData: any = {
      name,
      email,
      phone,
      status,
      source,
      interest,
      notes,
      propertyId: propertyId || null,
      lastContactAt: new Date()
    };

    if (budget !== undefined) {
      updateData.budget = budget ? parseFloat(budget) : null;
    }

    if (agentId) {
      updateData.agentId = agentId;
    }

    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(lead);

  } catch (error) {
    console.error('Erro ao atualizar lead:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const params = await context.params;
    // Verificar se o lead existe
    const existingLead = await prisma.lead.findUnique({
      where: { id: params.id }
    });

    if (!existingLead) {
      return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
    }

    await prisma.lead.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Lead excluído com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir lead:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
