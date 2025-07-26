'use client';

import { useState, useEffect } from 'react';
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
  ArrowRight,
  Loader2
} from 'lucide-react';

interface DashboardData {
  metrics: {
    leads: { current: number; change: number; trend: 'up' | 'down' | 'neutral' };
    sales: { current: number; change: number; trend: 'up' | 'down' | 'neutral' };
    revenue: { current: number; change: number; trend: 'up' | 'down' | 'neutral' };
    properties: { current: number; change: number; trend: 'up' | 'down' | 'neutral' };
    pipeline: { leads: number; value: number };
  };
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    time: string;
    agent?: string;
    property?: string;
  }>;
  statusDistribution: Array<{ status: string; count: number }>;
  topPerformers: Array<{ agentId: string; name: string; sales: number }>;
  user: { name: string; role: string; branch?: string };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar dados do dashboard');
      }

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'NEW': { label: 'Novo', variant: 'secondary' as const },
      'CONTACTED': { label: 'Contatado', variant: 'outline' as const },
      'QUALIFIED': { label: 'Qualificado', variant: 'default' as const },
      'PROPOSAL': { label: 'Proposta', variant: 'secondary' as const },
      'CLOSED': { label: 'Fechado', variant: 'default' as const },
      'LOST': { label: 'Perdido', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'outline' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const dashboardMetrics = [
    { 
      name: 'Novos Leads', 
      value: data.metrics.leads.current.toString(), 
      change: `${data.metrics.leads.change >= 0 ? '+' : ''}${data.metrics.leads.change}%`, 
      icon: UserPlus, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: data.metrics.leads.trend
    },
    { 
      name: 'Vendas do Mês', 
      value: data.metrics.sales.current.toString(), 
      change: `${data.metrics.sales.change >= 0 ? '+' : ''}${data.metrics.sales.change}%`, 
      icon: CheckCircle, 
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: data.metrics.sales.trend
    },
    { 
      name: 'Receita', 
      value: formatCurrency(data.metrics.revenue.current), 
      change: `${data.metrics.revenue.change >= 0 ? '+' : ''}${data.metrics.revenue.change}%`, 
      icon: DollarSign, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      trend: data.metrics.revenue.trend
    },
    { 
      name: 'Propriedades', 
      value: data.metrics.properties.current.toString(), 
      change: 'Ativo', 
      icon: Building2, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: 'neutral' as const
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Bem-vindo de volta, {data.user.name}! 
            {data.user.branch && ` - ${data.user.branch}`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchDashboardData} variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.name}
                </CardTitle>
                <div className={`${metric.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {metric.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1 text-green-600" />}
                  {metric.trend === 'down' && <TrendingDown className="h-3 w-3 mr-1 text-red-600" />}
                  <span className={
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 
                    'text-muted-foreground'
                  }>
                    {metric.change}
                  </span>
                  <span className="ml-1">desde o mês passado</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pipeline e Performance */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recentActivities.length > 0 ? (
              data.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <UserPlus className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    {activity.agent && (
                      <p className="text-xs text-muted-foreground">
                        Agente: {activity.agent}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(activity.time)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma atividade recente
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Leads Qualificados</span>
                <span className="text-2xl font-bold">{data.metrics.pipeline.leads}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Valor do Pipeline</span>
                <span className="text-lg font-semibold text-green-600">
                  {formatCurrency(data.metrics.pipeline.value)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por Status e Top Performers */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Distribuição por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.statusDistribution.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                  </div>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topPerformers.length > 0 ? (
                data.topPerformers.map((performer, index) => (
                  <div key={performer.agentId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">{performer.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{performer.sales}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma venda este mês
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
