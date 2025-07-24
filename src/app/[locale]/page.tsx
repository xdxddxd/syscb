'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/hooks/useTranslations';
import { useAuthStore } from '@/stores';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { UserRole } from '@/types';
import { 
  Building2, 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Clock,
  BarChart3
} from 'lucide-react';

const features = [
  {
    title: 'Gestão de Imóveis',
    description: 'Cadastre e gerencie propriedades com galeria de fotos e documentos.',
    icon: <Building2 className="h-6 w-6" />,
    href: '/pt-BR/properties'
  },
  {
    title: 'CRM Integrado',
    description: 'Gestão completa de leads e pipeline de vendas.',
    icon: <Users className="h-6 w-6" />,
    href: '/pt-BR/clients'
  },
  {
    title: 'Contratos',
    description: 'Criação e gestão de contratos com assinatura eletrônica.',
    icon: <FileText className="h-6 w-6" />,
    href: '/pt-BR/contracts'
  },
  {
    title: 'Dashboard Financeiro',
    description: 'Acompanhe receitas, despesas e comissões em tempo real.',
    icon: <DollarSign className="h-6 w-6" />,
    href: '/pt-BR/financial'
  },
  {
    title: 'Relatórios',
    description: 'Análises detalhadas e métricas de performance.',
    icon: <BarChart3 className="h-6 w-6" />,
    href: '/pt-BR/reports'
  },
  {
    title: 'Funcionários',
    description: 'Sistema de pontos com localização e verificação por selfie.',
    icon: <Clock className="h-6 w-6" />,
    href: '/pt-BR/employees'
  }
];

const stats = [
  {
    title: 'Propriedades Ativas',
    value: '2,847',
    description: 'Total de imóveis cadastrados',
    icon: <Building2 className="h-4 w-4" />,
    trend: { value: 12.5, label: 'desde o mês passado', isPositive: true }
  },
  {
    title: 'Vendas Este Mês',
    value: 'R$ 1.2M',
    description: 'Volume de vendas realizado',
    icon: <TrendingUp className="h-4 w-4" />,
    trend: { value: 8.3, label: 'comparado ao mês anterior', isPositive: true }
  },
  {
    title: 'Leads Ativos',
    value: '394',
    description: 'Potenciais clientes em negociação',
    icon: <Users className="h-4 w-4" />,
    trend: { value: 3.2, label: 'desde a semana passada', isPositive: false }
  },
  {
    title: 'Contratos Pendentes',
    value: '27',
    description: 'Aguardando assinatura',
    icon: <FileText className="h-4 w-4" />,
    trend: { value: 15.1, label: 'novos esta semana', isPositive: true }
  }
];

export default function HomePage() {
  const t = useTranslations();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/pt-BR/dashboard');
    }
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mb-6">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t('app.title') || 'Casa Branca'}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t('app.description') || 'Sistema de Gestão Imobiliária'}
            </p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Acesso Rápido
            </h3>
            <p className="text-sm text-muted-foreground">
              Faça login para acessar o sistema completo de gestão imobiliária.
            </p>
            
            <div className="flex items-center justify-center pt-4">
              <button 
                onClick={() => {
                  // Login como demo
                  useAuthStore.getState().setUser({
                    id: 'demo-user',
                    name: 'Usuário Demo',
                    email: 'demo@casabranca.com',
                    role: UserRole.ADMIN,
                    isActive: true,
                    branchId: 'branch-1',
                    permissions: [],
                    phone: '(11) 99999-9999',
                    createdAt: new Date(),
                    updatedAt: new Date()
                  });
                }}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                Entrar como Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-col gap-4 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                Bem-vindo, {user?.name?.split(' ')[0] || 'Usuário'}!
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                Visão geral do seu sistema de gestão imobiliária
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 space-y-8">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={stat.title} className="bg-card rounded-lg border p-6 transition-all hover:shadow-lg">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </h3>
                  <div className="h-4 w-4 text-muted-foreground">
                    {stat.icon}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs font-medium ${
                      stat.trend.isPositive ? "text-green-600" : "text-red-600"
                    }`}>
                      {stat.trend.isPositive ? "+" : ""}{stat.trend.value}%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      {stat.trend.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Funcionalidades */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Principais Funcionalidades
              </h2>
              <p className="text-muted-foreground">
                Explore todas as ferramentas disponíveis para gerenciar seu negócio imobiliário.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <a
                  key={feature.title}
                  href={feature.href}
                  className="block cursor-pointer"
                >
                  <div className="h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300 bg-card rounded-lg p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <div className="w-6 h-6 text-primary">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Dashboard Content */}
          <DashboardContent />
        </div>
      </div>
    </div>
  );
}
