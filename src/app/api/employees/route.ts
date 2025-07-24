import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - List all employees with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const department = searchParams.get('department') || '';
    const position = searchParams.get('position') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (department) {
      where.department = { contains: department, mode: 'insensitive' };
    }

    if (position) {
      where.position = { contains: position, mode: 'insensitive' };
    }

    // Get employees with pagination
    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: {
          manager: {
            select: { id: true, name: true, position: true }
          },
          subordinates: {
            select: { id: true, name: true, position: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.employee.count({ where })
    ]);

    return NextResponse.json({
      employees,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar funcionários' },
      { status: 500 }
    );
  }
}

// POST - Create new employee
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'cpf', 'position', 'department', 'hireDate'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Campo obrigatório: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if email or CPF already exists
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        OR: [
          { email: data.email },
          { cpf: data.cpf }
        ]
      }
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Email ou CPF já cadastrado' },
        { status: 409 }
      );
    }

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        ...data,
        hireDate: new Date(data.hireDate),
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        terminationDate: data.terminationDate ? new Date(data.terminationDate) : null,
        salary: data.salary ? parseFloat(data.salary) : null,
        commissionRate: data.commissionRate ? parseFloat(data.commissionRate) : null
      },
      include: {
        manager: {
          select: { id: true, name: true, position: true }
        }
      }
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Erro ao criar funcionário' },
      { status: 500 }
    );
  }
}
