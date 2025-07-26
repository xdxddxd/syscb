import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userInfo = await prisma.user.findUnique({
      where: { id: user.userId }
    });

    if (!userInfo) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Filtro por branch se o usuário não for ADMIN
    const where: any = { id: params.id };
    if (userInfo.role !== 'ADMIN') {
      where.branchId = userInfo.branchId;
    }

    const record = await prisma.financialRecord.findFirst({
      where,
      include: {
        employee: {
          select: { id: true, name: true, email: true }
        },
        branch: {
          select: { id: true, name: true }
        }
      }
    });

    if (!record) {
      return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 });
    }

    return NextResponse.json(record);

  } catch (error) {
    console.error('Erro ao buscar registro financeiro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userInfo = await prisma.user.findUnique({
      where: { id: user.userId }
    });

    if (!userInfo) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { type, category, description, amount, date, contractId, employeeId } = body;

    // Filtro por branch se o usuário não for ADMIN
    const where: any = { id: params.id };
    if (userInfo.role !== 'ADMIN') {
      where.branchId = userInfo.branchId;
    }

    // Verificar se o registro existe
    const existingRecord = await prisma.financialRecord.findFirst({ where });
    if (!existingRecord) {
      return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 });
    }

    // Validar tipo se fornecido
    if (type && !['REVENUE', 'EXPENSE', 'COMMISSION'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo inválido. Use: REVENUE, EXPENSE ou COMMISSION' },
        { status: 400 }
      );
    }

    // Atualizar registro
    const updatedRecord = await prisma.financialRecord.update({
      where: { id: params.id },
      data: {
        ...(type && { type: type as 'REVENUE' | 'EXPENSE' | 'COMMISSION' }),
        ...(category && { category }),
        ...(description && { description }),
        ...(amount && { amount: parseFloat(amount) }),
        ...(date && { date: new Date(date) }),
        ...(contractId !== undefined && { contractId: contractId || null }),
        ...(employeeId !== undefined && { employeeId: employeeId || null })
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

    return NextResponse.json(updatedRecord);

  } catch (error) {
    console.error('Erro ao atualizar registro financeiro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userInfo = await prisma.user.findUnique({
      where: { id: user.userId }
    });

    if (!userInfo) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Filtro por branch se o usuário não for ADMIN
    const where: any = { id: params.id };
    if (userInfo.role !== 'ADMIN') {
      where.branchId = userInfo.branchId;
    }

    // Verificar se o registro existe
    const existingRecord = await prisma.financialRecord.findFirst({ where });
    if (!existingRecord) {
      return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 });
    }

    // Deletar registro
    await prisma.financialRecord.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Registro deletado com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar registro financeiro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
