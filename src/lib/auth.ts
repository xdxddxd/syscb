import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  branch?: string;
  iat?: number;
  exp?: number;
}

export const verifyToken = async (request?: Request): Promise<TokenPayload | null> => {
  try {
    let token: string | undefined;

    if (request) {
      // Para API routes, pegar do header ou cookie
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        const cookieHeader = request.headers.get('cookie');
        if (cookieHeader) {
          const authCookie = cookieHeader
            .split(';')
            .find(c => c.trim().startsWith('auth-token='));
          if (authCookie) {
            token = authCookie.split('=')[1];
          }
        }
      }
    } else {
      // Para server components, usar cookies()
      const cookieStore = await cookies();
      token = cookieStore.get('auth-token')?.value;
    }

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function signToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export async function getCurrentUser(request?: Request): Promise<TokenPayload | null> {
  return verifyToken(request);
}
