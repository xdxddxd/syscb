import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get employee by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        manager: {
          select: { id: true, name: true, position: true }
        },
        subordinates: {
          select: { id: true, name: true, position: true }
        }
      }
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Funcionário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar funcionário' },
      { status: 500 }
    );
  }
}

// PUT - Update employee
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id }
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Funcionário não encontrado' },
        { status: 404 }
      );
    }

    // Check if email or CPF conflicts with other employees
    if (data.email || data.cpf) {
      const conflictEmployee = await prisma.employee.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                data.email ? { email: data.email } : {},
                data.cpf ? { cpf: data.cpf } : {}
              ].filter(condition => Object.keys(condition).length > 0)
            }
          ]
        }
      });

      if (conflictEmployee) {
        return NextResponse.json(
          { error: 'Email ou CPF já está em uso por outro funcionário' },
          { status: 409 }
        );
      }
    }

    // Update employee
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        ...data,
        hireDate: data.hireDate ? new Date(data.hireDate) : undefined,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        terminationDate: data.terminationDate ? new Date(data.terminationDate) : undefined,
        salary: data.salary ? parseFloat(data.salary) : undefined,
        commissionRate: data.commissionRate ? parseFloat(data.commissionRate) : undefined
      },
      include: {
        manager: {
          select: { id: true, name: true, position: true }
        },
        subordinates: {
          select: { id: true, name: true, position: true }
        }
      }
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar funcionário' },
      { status: 500 }
    );
  }
}

// DELETE - Delete employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        subordinates: true
      }
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Funcionário não encontrado' },
        { status: 404 }
      );
    }

    // Check if employee has subordinates
    if (employee.subordinates.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir funcionário que possui subordinados' },
        { status: 400 }
      );
    }

    // Delete employee
    await prisma.employee.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Funcionário excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir funcionário' },
      { status: 500 }
    );
  }
}
