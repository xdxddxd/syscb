import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware simplificado: nenhuma lógica de redirecionamento baseada em locais
  return NextResponse.next();
}

export const config = {
  // Manter o matcher para rotas relevantes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png).*)']
};
