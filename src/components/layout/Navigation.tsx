'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Building2, Home, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Card } from '@/components/ui/card';

const navigation = [
  { name: 'Dashboard', href: '/pt-BR', icon: Home },
  { name: 'Usuários', href: '/pt-BR/users', icon: Users },
  { name: 'Filiais', href: '/pt-BR/branches', icon: Building2 },
  { name: 'Configurações', href: '/pt-BR/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <Card className="w-64 h-screen border-r">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-foreground">
            Casa Branca
          </h1>
          <p className="text-sm text-muted-foreground">
            Sistema de Gestão
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tema</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function TopBar() {
  return (
    <Card className="border-b rounded-none">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Casa Branca Consultoria
          </h1>
          <p className="text-sm text-muted-foreground">
            Sistema de Gestão Imobiliária
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </Card>
  );
}
