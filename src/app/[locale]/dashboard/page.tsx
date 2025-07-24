'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  DollarSign, 
  Calendar, 
  Phone, 
  Mail, 
  Eye, 
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Target,
  BarChart3,
  PieChart,
  Activity,
  UserPlus,
  Home,
  MessageSquare,
  FileText,
  ArrowRight
} from 'lucide-react';

const dashboardMetrics = [
  { 
    name: 'Vendas do Mês', 
    value: 'R$ 2.45M', 
    change: '+12.5%', 
    icon: DollarSign, 
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    trend: 'up'
  },
  { 
    name: 'Novos Leads', 
    value: '284', 
    change: '+8.2%', 
    icon: UserPlus, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    trend: 'up'
  },
  { 
    name: 'Imóveis Ativos', 
    value: '156', 
    change: '+5.1%', 
    icon: Building2, 
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    trend: 'up'
  },
  { 
    name: 'Taxa Conversão', 
    value: '18.5%', 
    change: '-2.3%', 
    icon: Target, 
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    trend: 'down'
  },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bom dia, Maria! 👋</h1>
          <p className="text-muted-foreground">
            Aqui está um resumo da sua performance hoje
          </p>
        </div>
        <div className="flex space-x-2">
          <select 
            className="h-10 px-3 rounded-md border border-input bg-background"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            Relatório Completo
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </span>
                    <span className="text-sm text-muted-foreground">vs mês anterior</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: 'Novo lead cadastrado',
                  description: 'João Silva interessado em Casa Jardim Europa',
                  time: '5 min atrás',
                  icon: UserPlus,
                  color: 'text-blue-600'
                },
                {
                  action: 'Visita agendada',
                  description: 'Ana Costa - Apartamento Centro, amanhã 14h',
                  time: '12 min atrás',
                  icon: Calendar,
                  color: 'text-green-600'
                },
                {
                  action: 'Proposta recebida',
                  description: 'R$ 420.000 para Casa Vila Madalena',
                  time: '25 min atrás',
                  icon: FileText,
                  color: 'text-purple-600'
                },
                {
                  action: 'Contrato assinado',
                  description: 'Venda de Apartamento Moema finalizada',
                  time: '1h atrás',
                  icon: CheckCircle,
                  color: 'text-green-600'
                },
                {
                  action: 'Novo imóvel cadastrado',
                  description: 'Cobertura 3 dorms - Zona Sul',
                  time: '2h atrás',
                  icon: Building2,
                  color: 'text-orange-600'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center`}>
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance do Time */}
        <Card>
          <CardHeader>
            <CardTitle>Performance do Time</CardTitle>
            <CardDescription>Ranking de vendas do mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Maria Santos',
                  position: 1,
                  sales: 'R$ 890.000',
                  deals: 5,
                  avatar: '👩‍💼'
                },
                {
                  name: 'João Costa',
                  position: 2,
                  sales: 'R$ 745.000',
                  deals: 4,
                  avatar: '👨‍💼'
                },
                {
                  name: 'Ana Oliveira',
                  position: 3,
                  sales: 'R$ 625.000',
                  deals: 3,
                  avatar: '👩‍💼'
                },
                {
                  name: 'Roberto Silva',
                  position: 4,
                  sales: 'R$ 580.000',
                  deals: 3,
                  avatar: '👨‍💼'
                }
              ].map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        agent.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                        agent.position === 2 ? 'bg-gray-100 text-gray-800' :
                        agent.position === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        {agent.position}
                      </span>
                      <span className="text-2xl">{agent.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">{agent.deals} negócios</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{agent.sales}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Agendamentos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Próximos Agendamentos</CardTitle>
              <CardDescription>Suas visitas e reuniões de hoje</CardDescription>
            </div>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Ver Agenda
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                time: '09:00',
                title: 'Visita - Apartamento Centro',
                client: 'Carlos Eduardo',
                location: 'Rua das Flores, 123',
                type: 'Visita',
                priority: 'Alta'
              },
              {
                time: '11:30',
                title: 'Reunião com João Silva',
                client: 'João Silva',
                location: 'Escritório',
                type: 'Reunião',
                priority: 'Média'
              },
              {
                time: '14:00',
                title: 'Apresentação - Casa Jardim Europa',
                client: 'Ana Paula Costa',
                location: 'Av. Europa, 456',
                type: 'Apresentação',
                priority: 'Alta'
              },
              {
                time: '16:30',
                title: 'Follow-up Lead Interessado',
                client: 'Pedro Oliveira',
                location: 'Telefone',
                type: 'Ligação',
                priority: 'Baixa'
              }
            ].map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-bold">{appointment.time}</p>
                    <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${
                      appointment.priority === 'Alta' ? 'bg-red-500' :
                      appointment.priority === 'Média' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{appointment.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{appointment.client}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{appointment.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{appointment.type}</Badge>
                  <Button variant="outline" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cards de Ação Rápida */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Cadastrar Imóvel</h3>
                <p className="text-sm text-muted-foreground">Adicionar novo imóvel ao sistema</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Novo Lead</h3>
                <p className="text-sm text-muted-foreground">Cadastrar interessado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Agendar Visita</h3>
                <p className="text-sm text-muted-foreground">Marcar apresentação</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
