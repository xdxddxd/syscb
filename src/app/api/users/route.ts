import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            position: true,
            department: true,
            creci: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data to match frontend expectations
    const transformedUsers = users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      employeeId: user.employeeId,
      employeeName: user.employee ? user.employee.name : '',
      employeePosition: user.employee ? user.employee.position : '',
      employeeDepartment: user.employee ? user.employee.department : '',
      employeeCreci: user.employee ? user.employee.creci : '',
      isActive: user.isActive,
      lastLogin: user.lastLogin?.toLocaleString('pt-BR') || 'Nunca',
      createdAt: user.createdAt.toLocaleDateString('pt-BR'),
      permissions: user.permissions || {}
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    // Validação básica
    if (!userData.name || !userData.email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 400 }
      );
    }

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email.toLowerCase(),
        phone: userData.phone || null,
        role: (userData.role || 'USER').toUpperCase(),
        employeeId: userData.employeeId || null,
        isActive: userData.isActive !== undefined ? userData.isActive : true,
        permissions: userData.permissions || {},
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            position: true,
            department: true,
            creci: true
          }
        }
      }
    });

    const transformedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      employeeId: user.employeeId,
      employeeName: user.employee ? user.employee.name : '',
      employeePosition: user.employee ? user.employee.position : '',
      employeeDepartment: user.employee ? user.employee.department : '',
      employeeCreci: user.employee ? user.employee.creci : '',
      isActive: user.isActive,
      lastLogin: user.lastLogin?.toLocaleString('pt-BR') || 'Nunca',
      createdAt: user.createdAt.toLocaleDateString('pt-BR'),
      permissions: user.permissions || {}
    };

    return NextResponse.json(transformedUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userData = await request.json();
    
    if (!userData.id) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userData.id }
    });

    if (!userExists) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se email já existe em outro usuário
    if (userData.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email.toLowerCase() }
      });
      
      if (existingUser && existingUser.id !== userData.id) {
        return NextResponse.json(
          { error: 'Email já está em uso' },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userData.id },
      data: {
        name: userData.name || userExists.name,
        email: userData.email?.toLowerCase() || userExists.email,
        phone: userData.phone || userExists.phone,
        role: userData.role ? userData.role.toUpperCase() : userExists.role,
        employeeId: userData.employeeId || userExists.employeeId,
        isActive: userData.isActive !== undefined ? userData.isActive : userExists.isActive,
        permissions: userData.permissions || userExists.permissions,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            position: true,
            department: true,
            creci: true
          }
        }
      }
    });

    const transformedUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      employeeId: updatedUser.employeeId,
      employeeName: updatedUser.employee ? updatedUser.employee.name : '',
      employeePosition: updatedUser.employee ? updatedUser.employee.position : '',
      employeeDepartment: updatedUser.employee ? updatedUser.employee.department : '',
      employeeCreci: updatedUser.employee ? updatedUser.employee.creci : '',
      isActive: updatedUser.isActive,
      lastLogin: updatedUser.lastLogin?.toLocaleString('pt-BR') || 'Nunca',
      createdAt: updatedUser.createdAt.toLocaleDateString('pt-BR'),
      permissions: updatedUser.permissions || {}
    };
    
    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { id }
    });

    if (!userExists) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir usuário' },
      { status: 500 }
    );
  }
}
