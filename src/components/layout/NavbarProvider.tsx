'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { SidebarProvider, useSidebar } from '@/components/providers/SidebarProvider';
import { Sidebar } from '@/components/layout/NavigationSidebar';

interface NavbarContextType {
  isNavbarVisible: boolean;
  setNavbarVisible: (visible: boolean) => void;
}

const NavbarContext = createContext<NavbarContextType | null>(null);

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within NavbarProvider');
  }
  return context;
}

interface NavbarProviderProps {
  children: React.ReactNode;
}

function NavbarContent({ children }: NavbarProviderProps) {
  const [isNavbarVisible, setNavbarVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Define rotas onde a navbar não deve aparecer
  const hideNavbarRoutes = ['/login', '/register', '/forgot-password'];
  const shouldHideNavbar = hideNavbarRoutes.some(route => pathname?.includes(route)) || !isAuthenticated;

  // Durante a hidratação, renderiza uma versão simples
  if (!mounted) {
    return (
      <NavbarContext.Provider value={{ isNavbarVisible, setNavbarVisible }}>
        <div className="flex h-screen bg-background">
          <div className="flex-1 flex flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </NavbarContext.Provider>
    );
  }

  return (
    <NavbarContext.Provider value={{ isNavbarVisible, setNavbarVisible }}>
      <div className="flex h-screen bg-background">
        {/* Navbar/Sidebar - só renderiza se autenticado e não em rotas de exclusão */}
        {!shouldHideNavbar && (
          <Sidebar />
        )}
        
        {/* Main Content - Adaptado para sidebar colapsado/expandido */}
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          !shouldHideNavbar 
            ? isCollapsed 
              ? 'lg:ml-20 ml-0' // Margem menor quando sidebar está colapsado
              : 'lg:ml-72 ml-0' // Margem normal quando sidebar está expandido
            : 'w-full' // Largura total quando sidebar está oculta
        }`}>
          <main className="flex-1 overflow-y-auto bg-background/50 backdrop-blur-sm">
            <div className="p-4 lg:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </NavbarContext.Provider>
  );
}

export function NavbarProvider({ children }: NavbarProviderProps) {
  return (
    <SidebarProvider>
      <NavbarContent>{children}</NavbarContent>
    </SidebarProvider>
  );
}
