import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();

// GET /api/branches - List all branches
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json({ error: 'Token de autenticação não encontrado' }, { status: 401 });
    }

    try {
      verify(token.value, process.env.JWT_SECRET || 'fallback-secret');
    } catch (error) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build where clause
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { address: { path: ['city'], string_contains: search } },
        { contact: { path: ['email'], string_contains: search } }
      ]
    } : {};

    // Get branches with pagination
    const [branches, total] = await Promise.all([
      prisma.branch.findMany({
        where: where as any,
        include: {
          manager: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { name: 'asc' },
        skip: offset,
        take: limit
      }),
      prisma.branch.count({ where: where as any })
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      branches,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });

  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/branches - Create new branch
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json({ error: 'Token de autenticação não encontrado' }, { status: 401 });
    }

    try {
      verify(token.value, process.env.JWT_SECRET || 'fallback-secret');
    } catch (error) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, address, contact, managerId, isActive, settings } = body;

    // Validate required fields
    if (!name || !code || !address || !contact) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, code, address, contact' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existingBranch = await prisma.branch.findUnique({
      where: { code }
    });

    if (existingBranch) {
      return NextResponse.json(
        { error: 'Código da filial já existe' },
        { status: 400 }
      );
    }

    // Create branch
    const branch = await prisma.branch.create({
      data: {
        name,
        code,
        address,
        contact,
        managerId,
        isActive: isActive ?? true,
        settings: settings || {
          timezone: 'America/Sao_Paulo',
          currency: 'BRL',
          language: 'pt-BR'
        }
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(branch, { status: 201 });

  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
