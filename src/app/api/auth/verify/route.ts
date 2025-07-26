import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('Verify API: Starting token verification...');
    
    const user = await verifyToken(request);
    console.log('Verify API: Token verified:', !!user);

    if (!user) {
      console.log('Verify API: No valid token found');
      return NextResponse.json(
        { error: 'Token não encontrado ou inválido' },
        { status: 401 }
      );
    }

    // Buscar dados completos do usuário
    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        branchId: true,
        branch: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!userData) {
      console.log('Verify API: User not found in database');
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 401 }
      );
    }

    console.log('Verify API: User data found:', userData.name);
    
    return NextResponse.json({
      user: userData,
      authenticated: true
    });
  } catch (error) {
    console.error('Verify API: Token verification failed:', error);
    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 401 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
