import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to get employee name
function getEmployeeName(employeeId: string): string {
  const employees = [
    { id: 'emp-1', name: 'Maria Santos Silva' },
    { id: 'emp-2', name: 'João Costa Oliveira' },
    { id: 'emp-3', name: 'Ana Oliveira Lima' },
    { id: 'emp-4', name: 'Roberto Silva Almeida' },
    { id: 'emp-5', name: 'Fernanda Ribeiro Costa' }
  ];
  
  const employee = employees.find(emp => emp.id === employeeId);
  return employee ? employee.name : '';
}

// GET /api/users/[id] - Get specific user
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const transformedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      employeeId: user.employeeId,
      employeeName: user.employeeId ? getEmployeeName(user.employeeId) : '',
      isActive: user.isActive,
      lastLogin: user.lastLogin?.toLocaleString('pt-BR') || 'Nunca',
      createdAt: user.createdAt.toLocaleDateString('pt-BR'),
      permissions: user.permissions || {}
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuário' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userData = await request.json();
    
    const userExists = await prisma.user.findUnique({
      where: { id: params.id }
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
      
      if (existingUser && existingUser.id !== params.id) {
        return NextResponse.json(
          { error: 'Email já está em uso' },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        name: userData.name || userExists.name,
        email: userData.email?.toLowerCase() || userExists.email,
        phone: userData.phone || userExists.phone,
        role: userData.role || userExists.role,
        employeeId: userData.employeeId || userExists.employeeId,
        isActive: userData.isActive !== undefined ? userData.isActive : userExists.isActive,
        permissions: userData.permissions || userExists.permissions,
      }
    });

    const transformedUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      employeeId: updatedUser.employeeId,
      employeeName: updatedUser.employeeId ? getEmployeeName(updatedUser.employeeId) : '',
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

// DELETE /api/users/[id] - Delete user
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userExists = await prisma.user.findUnique({
      where: { id: params.id }
    });
    
    if (!userExists) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: params.id }
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
