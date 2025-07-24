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

// GET - Listar escalas
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const branchId = searchParams.get('branchId');
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};
    
    if (employeeId) {
      where.employeeId = employeeId;
    }
    
    if (branchId) {
      where.branchId = branchId;
    }
    
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      
      where.date = {
        gte: startOfDay,
        lte: endOfDay
      };
    } else if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const [schedules, total] = await Promise.all([
      prisma.employeeSchedule.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              position: true,
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
        },
        orderBy: [
          { date: 'asc' },
          { startTime: 'asc' }
        ],
        skip,
        take: limit
      }),
      prisma.employeeSchedule.count({ where })
    ]);

    return NextResponse.json({
      schedules,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar nova escala
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verificar se o usuário tem permissão para criar escalas
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
      shiftType = 'REGULAR',
      notes
    } = body;

    // Validações
    if (!employeeId || !branchId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: employeeId, branchId, date, startTime, endTime' },
        { status: 400 }
      );
    }

    // Verificar se já existe uma escala para este funcionário nesta data
    const existingSchedule = await prisma.employeeSchedule.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: new Date(date)
        }
      }
    });

    if (existingSchedule) {
      return NextResponse.json(
        { error: 'Já existe uma escala para este funcionário nesta data' },
        { status: 400 }
      );
    }

    // Verificar se o funcionário e a filial existem
    const [employee, branch] = await Promise.all([
      prisma.employee.findUnique({ where: { id: employeeId } }),
      prisma.branch.findUnique({ where: { id: branchId } })
    ]);

    if (!employee) {
      return NextResponse.json({ error: 'Funcionário não encontrado' }, { status: 404 });
    }

    if (!branch) {
      return NextResponse.json({ error: 'Filial não encontrada' }, { status: 404 });
    }

    // Criar a escala
    const schedule = await prisma.employeeSchedule.create({
      data: {
        employeeId,
        branchId,
        date: new Date(date),
        startTime,
        endTime,
        shiftType,
        notes,
        createdBy: user.id
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            position: true,
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

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
