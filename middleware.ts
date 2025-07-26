import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const publicPaths = ['/pt-BR/login', '/api/auth/login', '/api/auth/logout', '/test-auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internal routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for token
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/pt-BR/login', request.url));
  }

  try {
    // Verify token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    console.log('Middleware: Verifying token...');
    console.log('Token length:', token.length);
    console.log('Secret used:', process.env.JWT_SECRET || 'your-secret-key');
    
    await jwtVerify(token, secret);
    console.log('Middleware: Token verified successfully');
    return NextResponse.next();
  } catch (error) {
    console.error('Token verification failed:', error);
    
    // Clear invalid token
    const response = NextResponse.redirect(new URL('/pt-BR/login', request.url));
    response.cookies.set('auth-token', '', {
      maxAge: 0,
      path: '/'
    });
    
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes that handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
