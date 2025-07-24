import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH /api/users/[id]/toggle-status - Toggle user active status
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isActive } = await request.json();
    
    const userExists = await prisma.user.findUnique({
      where: { id: params.id }
    });

    if (!userExists) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { isActive }
    });
    
    return NextResponse.json({ 
      id: params.id,
      isActive: updatedUser.isActive,
      message: `Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso`
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    return NextResponse.json(
      { error: 'Erro ao alterar status do usuário' },
      { status: 500 }
    );
  }
}
