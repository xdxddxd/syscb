'use client';

import { 
  Home,
  Users,
  FileText,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardContent() {
  const stats = [
    {
      name: 'Total de Propriedades',
      stat: '150',
      icon: Home,
      change: '12%',
      changeType: 'increase',
    },
    {
      name: 'Usuários Ativos',
      stat: '1.200',
      icon: Users,
      change: '5%',
      changeType: 'increase',
    },
    {
      name: 'Documentos Processados',
      stat: '3.400',
      icon: FileText,
      change: '8%',
      changeType: 'increase',
    },
    {
      name: 'Receita Mensal',
      stat: 'R$ 50.000',
      icon: DollarSign,
      change: '15%',
      changeType: 'increase',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'lead',
      title: 'Novo lead registrado',
      description: 'João Silva demonstrou interesse em apartamento no Centro',
      time: '2 horas atrás',
    },
    {
      id: 2,
      type: 'contract',
      title: 'Contrato assinado',
      description: 'Venda de casa na Rua das Flores finalizada',
      time: '4 horas atrás',
    },
    {
      id: 3,
      type: 'property',
      title: 'Novo imóvel cadastrado',
      description: 'Apartamento de 3 quartos no Bairro Novo',
      time: '1 dia atrás',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Título da página */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">Visão geral das estatísticas e atividades</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-lg bg-card px-4 py-5 shadow border sm:px-6 sm:py-6">
            <dt>
              <div className="absolute rounded-md bg-primary p-3">
                <item.icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-muted-foreground">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-foreground">{item.stat}</p>
              <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                <span>+{item.change}</span>
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Conteúdo principal em grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Atividade recente */}
        <div className="rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Atividades Recentes</h3>
            <div className="mt-5">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {activity.type === 'lead' && 'L'}
                              {activity.type === 'contract' && 'C'}
                              {activity.type === 'property' && 'P'}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                          <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="rounded-lg bg-card shadow border">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-foreground">Ações Rápidas</h3>
            <div className="mt-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button className="inline-flex items-center justify-center">
                  Adicionar Propriedade
                </Button>
                <Button className="inline-flex items-center justify-center" variant="secondary">
                  Adicionar Lead
                </Button>
                <Button className="inline-flex items-center justify-center" variant="outline">
                  Adicionar Contrato
                </Button>
                <Button className="inline-flex items-center justify-center" variant="outline">
                  Relatórios Financeiros
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de vendas (placeholder) */}
      <div className="rounded-lg bg-card shadow border">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-foreground">Vendas dos últimos 6 meses</h3>
          <div className="mt-5">
            <div className="h-64 flex items-center justify-center bg-muted rounded-md">
              <p className="text-muted-foreground">Gráfico de vendas será implementado aqui</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
