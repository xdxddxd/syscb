import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - List employees for select options (simplified data)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    
    // Build where clause
    const where: any = {};
    
    // Only include active employees if specified
    if (active === 'true') {
      where.isActive = true;
      where.status = 'ACTIVE';
    }

    const employees = await prisma.employee.findMany({
      where,
      select: {
        id: true,
        name: true,
        position: true,
        department: true,
        creci: true,
        email: true,
        isActive: true,
        status: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees list:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar lista de funcionários' },
      { status: 500 }
    );
  }
}
