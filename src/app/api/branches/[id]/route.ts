import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const prisma = new PrismaClient();

// GET /api/branches/[id] - Get branch by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const branch = await prisma.branch.findUnique({
      where: { id: params.id },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        employees: {
          select: {
            id: true,
            name: true,
            position: true,
            status: true
          }
        }
      }
    });

    if (!branch) {
      return NextResponse.json({ error: 'Filial não encontrada' }, { status: 404 });
    }

    return NextResponse.json(branch);

  } catch (error) {
    console.error('Error fetching branch:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/branches/[id] - Update branch
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if branch exists
    const existingBranch = await prisma.branch.findUnique({
      where: { id: params.id }
    });

    if (!existingBranch) {
      return NextResponse.json({ error: 'Filial não encontrada' }, { status: 404 });
    }

    // Check if code already exists for another branch
    if (code && code !== existingBranch.code) {
      const branchWithCode = await prisma.branch.findUnique({
        where: { code }
      });

      if (branchWithCode && branchWithCode.id !== params.id) {
        return NextResponse.json(
          { error: 'Código da filial já existe' },
          { status: 400 }
        );
      }
    }

    // Update branch
    const branch = await prisma.branch.update({
      where: { id: params.id },
      data: {
        name,
        code,
        address,
        contact,
        managerId,
        isActive,
        settings
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

    return NextResponse.json(branch);

  } catch (error) {
    console.error('Error updating branch:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/branches/[id] - Delete branch
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if branch exists
    const existingBranch = await prisma.branch.findUnique({
      where: { id: params.id },
      include: {
        employees: true
      }
    });

    if (!existingBranch) {
      return NextResponse.json({ error: 'Filial não encontrada' }, { status: 404 });
    }

    // Check if branch has employees
    if (existingBranch.employees.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir filial com funcionários ativos' },
        { status: 400 }
      );
    }

    // Delete branch
    await prisma.branch.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Filial excluída com sucesso' });

  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
