import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function GET(request: NextRequest) {
  try {
    console.log('Verify API: Starting token verification...');
    
    const token = request.cookies.get('auth-token')?.value;
    console.log('Verify API: Token found:', !!token);
    console.log('Verify API: Token length:', token?.length || 0);

    if (!token) {
      console.log('Verify API: No token found in cookies');
      return NextResponse.json(
        { error: 'Token não encontrado' },
        { status: 401 }
      );
    }

    console.log('Verify API: Attempting to verify token...');
    const { payload: decoded } = await jwtVerify(token, JWT_SECRET);
    console.log('Verify API: Token verified successfully, payload:', decoded);
    
    return NextResponse.json({
      user: {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      },
      authenticated: true
    });
  } catch (error) {
    console.error('Verify API: Token verification failed:', error);
    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 401 }
    );
  }
}
