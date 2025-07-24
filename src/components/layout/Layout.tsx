'use client';

import { useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { useAuthStore, useAppStore } from '@/stores';
import { 
  Home,
  Building,
  Users,
  FileText,
  BarChart,
  Cog,
  Menu,
  X
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const t = useTranslations();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  const navigation = [
    { name: 'Dashboard', href: '/pt-BR', icon: Home, current: false },
    { name: 'Propriedades', href: '/pt-BR/properties', icon: Building, current: false },
    { name: 'Leads', href: '/pt-BR/leads', icon: Users, current: false },
    { name: 'Contratos', href: '/pt-BR/contracts', icon: FileText, current: false },
    { name: 'Inventário', href: '/pt-BR/inventory', icon: BarChart, current: false },
    { name: 'Funcionários', href: '/pt-BR/employees', icon: Users, current: false },
    { name: 'Financeiro', href: '/pt-BR/financial', icon: BarChart, current: false },
    { name: 'Usuários', href: '/pt-BR/users', icon: Users, current: false },
    { name: 'Configurações', href: '/pt-BR/settings', icon: Cog, current: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-card shadow-xl border-r">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-semibold text-foreground">Casa Branca</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-r bg-card overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 py-4 border-b">
            <h1 className="text-xl font-semibold text-foreground">Casa Branca</h1>
          </div>
          
          <nav className="flex-1 space-y-1 px-2 pb-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-40 flex h-16 flex-shrink-0 items-center bg-card border-b px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="border-r border-border px-4 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 justify-between">
            <div className="flex flex-1">
              <h2 className="text-lg font-semibold text-foreground ml-4 lg:ml-0">
                {t('dashboard.title')}
              </h2>
            </div>
            
            <div className="ml-4 flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">{user?.name}</span>
              <button
                onClick={logout}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {t('navigation.logout')}
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
