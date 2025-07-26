'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: any;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        console.log('AuthContext: Checking authentication...');
        const response = await fetch('/api/auth/verify', {
          credentials: 'include'
        });
        console.log('AuthContext: Verify response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('AuthContext: Verify successful, data:', data);
          
          if (data.authenticated && data.user) {
            setUser({
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              permissions: data.user.permissions || {}
            });
          }
        } else {
          console.log('AuthContext: Verify failed, clearing user data');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // Não usar localStorage, confiar apenas no cookie JWT
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/pt-BR/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
