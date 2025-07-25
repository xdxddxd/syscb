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
  const token = cookieStore.get('auth-token')?.value;

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

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Dar permissões completas ao usuário atual
    const permissions = {
      dashboard: { create: true, read: true, update: true, delete: true },
      properties: { create: true, read: true, update: true, delete: true },
      clients: { create: true, read: true, update: true, delete: true },
      contracts: { create: true, read: true, update: true, delete: true },
      financial: { create: true, read: true, update: true, delete: true },
      reports: { create: true, read: true, update: true, delete: true },
      employees: { create: true, read: true, update: true, delete: true },
      marketing: { create: true, read: true, update: true, delete: true },
      users: { create: true, read: true, update: true, delete: true },
      settings: { create: true, read: true, update: true, delete: true },
      support: { create: true, read: true, update: true, delete: true }
    };

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        permissions: permissions
      }
    });

    return NextResponse.json({
      message: 'Permissões atualizadas com sucesso',
      permissions: updatedUser.permissions
    });
  } catch (error) {
    console.error('Error updating permissions:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
