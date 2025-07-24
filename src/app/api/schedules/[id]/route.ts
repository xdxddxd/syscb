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
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { employee: true }
    });
    return user;
  } catch (error) {
    return null;
  }
}

// GET - Buscar escala específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const schedule = await prisma.employeeSchedule.findUnique({
      where: { id: params.id },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            position: true,
            department: true,
            photo: true,
            phone: true,
            email: true
          }
        },
        branch: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true
          }
        }
      }
    });

    if (!schedule) {
      return NextResponse.json({ error: 'Escala não encontrada' }, { status: 404 });
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar escala
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verificar se o usuário tem permissão para atualizar escalas
    if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    const body = await request.json();
    const {
      employeeId,
      branchId,
      date,
      startTime,
      endTime,
      shiftType,
      status,
      notes
    } = body;

    // Verificar se a escala existe
    const existingSchedule = await prisma.employeeSchedule.findUnique({
      where: { id: params.id }
    });

    if (!existingSchedule) {
      return NextResponse.json({ error: 'Escala não encontrada' }, { status: 404 });
    }

    // Se estiver mudando o funcionário ou a data, verificar conflitos
    if ((employeeId && employeeId !== existingSchedule.employeeId) || 
        (date && new Date(date).getTime() !== existingSchedule.date.getTime())) {
      
      const conflictingSchedule = await prisma.employeeSchedule.findFirst({
        where: {
          employeeId: employeeId || existingSchedule.employeeId,
          date: new Date(date || existingSchedule.date),
          id: { not: params.id }
        }
      });

      if (conflictingSchedule) {
        return NextResponse.json(
          { error: 'Já existe uma escala para este funcionário nesta data' },
          { status: 400 }
        );
      }
    }

    // Atualizar a escala
    const schedule = await prisma.employeeSchedule.update({
      where: { id: params.id },
      data: {
        ...(employeeId && { employeeId }),
        ...(branchId && { branchId }),
        ...(date && { date: new Date(date) }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(shiftType && { shiftType }),
        ...(status && { status }),
        ...(notes !== undefined && { notes })
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            position: true,
            department: true,
            photo: true
          }
        },
        branch: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir escala
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verificar se o usuário tem permissão para excluir escalas
    if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    // Verificar se a escala existe
    const existingSchedule = await prisma.employeeSchedule.findUnique({
      where: { id: params.id }
    });

    if (!existingSchedule) {
      return NextResponse.json({ error: 'Escala não encontrada' }, { status: 404 });
    }

    // Excluir a escala
    await prisma.employeeSchedule.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Escala excluída com sucesso' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
