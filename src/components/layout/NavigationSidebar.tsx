'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Building2, 
  Users, 
  FileText, 
  Package, 
  DollarSign, 
  Clock, 
  Bell, 
  Settings, 
  Menu, 
  X,
  ChevronRight,
  LogOut,
  BarChart3,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useAuthStore } from '@/stores';
import { useSidebar } from '@/components/providers/SidebarProvider';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  badge?: number;
  description?: string;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/pt-BR', icon: Home, description: 'Visão geral do sistema' },
  { name: 'Usuários', href: '/pt-BR/users', icon: Users, description: 'Gestão de usuários' },
  { name: 'Filiais', href: '/pt-BR/branches', icon: Building2, description: 'Gestão de filiais' },
  { name: 'Imóveis', href: '/pt-BR/properties', icon: Building2, description: 'Gestão de propriedades' },
  { name: 'Clientes', href: '/pt-BR/clients', icon: Users, description: 'CRM e relacionamento' },
  { name: 'Contratos', href: '/pt-BR/contracts', icon: FileText, description: 'Documentos e acordos' },
  { name: 'Inventário', href: '/pt-BR/inventory', icon: Package, description: 'Controle de estoque' },
  { name: 'Financeiro', href: '/pt-BR/financial', icon: DollarSign, description: 'Receitas e comissões' },
  { name: 'Funcionários', href: '/pt-BR/employees', icon: Clock, description: 'Gestão de pessoal' },
  { name: 'Escalas', href: '/pt-BR/employees/schedule', icon: Calendar, description: 'Escala de trabalho' },
  { name: 'Relatórios', href: '/pt-BR/reports', icon: BarChart3, description: 'Análises e métricas' },
  { name: 'Configurações', href: '/pt-BR/settings', icon: Settings, description: 'Configurações do sistema' },
  { name: 'Notificações', href: '/pt-BR/notifications', icon: Bell, badge: 3, description: 'Central de avisos' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();

  const isActive = (href: string) => {
    if (href === '/pt-BR') {
      return pathname === '/pt-BR';
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    router.push('/pt-BR');
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
          className="bg-background/80 backdrop-blur-sm border-border/40 shadow-lg hover:scale-105 transition-transform"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-card/50 backdrop-blur-xl border-r border-border/40 transition-all duration-300 z-30",
          isCollapsed ? "lg:w-20" : "lg:w-72"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-border/40 flex-shrink-0">
            {!isCollapsed && (
              <div className="flex items-center space-x-3 animate-fade-in">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Casa Branca
                </span>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors hover:scale-105"
            >
              <ChevronRight className={cn("h-4 w-4 transition-transform", isCollapsed ? "rotate-0" : "rotate-180")} />
            </Button>
          </div>

          {/* Navigation - Com scroll */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <div
                  key={item.name}
                  className="transform hover:translate-x-1 transition-transform duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02]",
                      active
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className={cn(
                      "flex-shrink-0 h-5 w-5 transition-colors",
                      active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    
                    {!isCollapsed && (
                      <div className="ml-3 flex-1 flex items-center justify-between animate-fade-in">
                        <div>
                          <div className="text-sm font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground/70 mt-0.5">
                              {item.description}
                            </div>
                          )}
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-2 h-5 min-w-[20px] text-xs animate-bounce-gentle">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border/40 p-3 flex-shrink-0">
            <div className="flex items-center space-x-3 px-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              {!isCollapsed && (
                <div className="flex-1 min-w-0 animate-fade-in">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.name || 'Usuário'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || 'email@exemplo.com'}
                  </p>
                </div>
              )}
            </div>
            
            {!isCollapsed && (
              <div className="flex justify-between space-x-1 mt-3 animate-fade-in">
                <ThemeToggle />
                
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:scale-105 transition-transform">
                  <Settings className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:scale-105 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          {/* Overlay */}
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-background/20 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileOpen(false)}
          />
          
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-card/95 backdrop-blur-xl border-r border-border/40 animate-slide-left">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-border/40">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Casa Branca
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation - Com scroll */}
            <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto h-[calc(100vh-8rem)] scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <div
                    key={item.name}
                    className="transform hover:translate-x-1 transition-transform duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                        active
                          ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Icon className={cn(
                        "flex-shrink-0 h-5 w-5 mr-3 transition-colors",
                        active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground/70 mt-0.5">
                              {item.description}
                            </div>
                          )}
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-2 h-5 min-w-[20px] text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="border-t border-border/40 p-3">
              <div className="flex items-center space-x-3 px-3 py-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.name || 'Usuário'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || 'email@exemplo.com'}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between space-x-1 mt-3">
                <ThemeToggle />
                
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:scale-105 transition-transform">
                  <Settings className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:scale-105 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
