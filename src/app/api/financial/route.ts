import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userInfo = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { branch: true }
    });

    if (!userInfo) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const type = url.searchParams.get('type') as 'REVENUE' | 'EXPENSE' | 'COMMISSION' | null;
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Filtro por branch se o usuário não for ADMIN
    const branchFilter = userInfo.role === 'ADMIN' ? {} : { branchId: userInfo.branchId || undefined };

    // Construir filtros
    const where: any = {
      ...branchFilter,
    };

    if (type) {
      where.type = type;
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const skip = (page - 1) * limit;

    // Buscar registros
    const [records, total] = await Promise.all([
      prisma.financialRecord.findMany({
        where,
        include: {
          employee: {
            select: { id: true, name: true, email: true }
          },
          branch: {
            select: { id: true, name: true }
          }
        },
        orderBy: { date: 'desc' },
        skip,
        take: limit
      }),
      prisma.financialRecord.count({ where })
    ]);

    return NextResponse.json({
      records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar registros financeiros:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userInfo = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { branch: true }
    });

    if (!userInfo) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se o usuário tem uma branch válida
    if (!userInfo.branchId) {
      return NextResponse.json({ error: 'Usuário não está associado a uma filial' }, { status: 400 });
    }

    const body = await request.json();
    const { type, category, description, amount, date, contractId, employeeId } = body;

    // Validação básica
    if (!type || !category || !description || !amount || !date) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: type, category, description, amount, date' },
        { status: 400 }
      );
    }

    // Validar tipo
    if (!['REVENUE', 'EXPENSE', 'COMMISSION'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo inválido. Use: REVENUE, EXPENSE ou COMMISSION' },
        { status: 400 }
      );
    }

    // Criar registro financeiro
    const record = await prisma.financialRecord.create({
      data: {
        type: type as 'REVENUE' | 'EXPENSE' | 'COMMISSION',
        category,
        description,
        amount: parseFloat(amount),
        date: new Date(date),
        contractId: contractId || null,
        employeeId: employeeId || null,
        branchId: userInfo.branchId
      },
      include: {
        employee: {
          select: { id: true, name: true, email: true }
        },
        branch: {
          select: { id: true, name: true }
        }
      }
    });

    return NextResponse.json(record, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar registro financeiro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
