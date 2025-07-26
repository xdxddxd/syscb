'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Plus, 
  Download,
  BarChart3,
  PieChart,
  Filter,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  Users,
  Building2
} from 'lucide-react';

interface FinancialData {
  metrics: {
    revenue: { current: number; change: number; trend: 'up' | 'down' };
    expenses: { current: number; change: number; trend: 'up' | 'down' };
    commissions: { current: number; change: number; trend: 'up' | 'down' };
    profit: { current: number; change: number; trend: 'up' | 'down' };
  };
  monthlyData: Array<{ month: number; revenue: number; expenses: number; profit: number }>;
  categoryDistribution: Array<{ category: string; type: string; amount: number }>;
  recentTransactions: Array<{
    id: string;
    type: string;
    category: string;
    description: string;
    amount: number;
    date: string;
    employee?: string;
    branch?: string;
  }>;
  topExpenseCategories: Array<{ category: string; amount: number }>;
  user: { name: string; role: string; branch?: string };
}

interface FinancialRecord {
  id: string;
  type: 'REVENUE' | 'EXPENSE' | 'COMMISSION';
  category: string;
  description: string;
  amount: number;
  date: string;
  contractId?: string;
  employeeId?: string;
  employee?: { id: string; name: string; email: string };
  branch?: { id: string; name: string };
}

interface NewTransaction {
  type: 'REVENUE' | 'EXPENSE' | 'COMMISSION';
  category: string;
  description: string;
  amount: string;
  date: string;
  employeeId?: string;
}

export default function FinancialPage() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [page, setPage] = useState(1);
  
  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    type: 'REVENUE',
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchRecords();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [filterType, page]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/financial/dashboard', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar dados financeiros');
      }

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      setRecordsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (filterType !== 'all') {
        params.append('type', filterType);
      }

      const response = await fetch(`/api/financial?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar registros');
      }

      const result = await response.json();
      setRecords(result.records);
    } catch (err) {
      console.error('Erro ao buscar registros:', err);
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/financial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newTransaction)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar transação');
      }

      // Reset form
      setNewTransaction({
        type: 'REVENUE',
        category: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      });

      setIsDialogOpen(false);
      
      // Refresh data
      fetchDashboardData();
      fetchRecords();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao criar transação');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    
    try {
      const response = await fetch('/api/financial/sync', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro na sincronização');
      }

      const result = await response.json();
      
      let message = `Sincronização concluída!\n`;
      message += `${result.successful} contratos processados com sucesso\n`;
      message += `${result.failed} falharam\n\n`;
      
      if (result.results && result.results.length > 0) {
        message += `Detalhes:\n`;
        result.results.forEach((item: any) => {
          if (item.success) {
            message += `✅ ${item.property}\n`;
            message += `   Receita: R$ ${item.totalCommission?.toLocaleString('pt-BR') || 'N/A'}\n`;
            message += `   Comissão paga: R$ ${item.agentCommission?.toLocaleString('pt-BR') || 'N/A'}\n`;
            message += `   Lucro: R$ ${item.imobiliaryProfit?.toLocaleString('pt-BR') || 'N/A'}\n\n`;
          }
        });
      }
      
      alert(message);
      
      // Refresh data
      fetchDashboardData();
      fetchRecords();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro na sincronização');
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando dados financeiros...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar dados financeiros</h2>
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
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'REVENUE': return 'text-green-600 bg-green-100';
      case 'EXPENSE': return 'text-red-600 bg-red-100';
      case 'COMMISSION': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'REVENUE': return 'Receita';
      case 'EXPENSE': return 'Despesa';
      case 'COMMISSION': return 'Comissão';
      default: return type;
    }
  };

  const financialMetrics = [
    {
      name: 'Receitas',
      value: formatCurrency(data.metrics.revenue.current),
      change: `${data.metrics.revenue.change >= 0 ? '+' : ''}${data.metrics.revenue.change}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: data.metrics.revenue.trend
    },
    {
      name: 'Despesas',
      value: formatCurrency(data.metrics.expenses.current),
      change: `${data.metrics.expenses.change >= 0 ? '+' : ''}${data.metrics.expenses.change}%`,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      trend: data.metrics.expenses.trend
    },
    {
      name: 'Comissões',
      value: formatCurrency(data.metrics.commissions.current),
      change: `${data.metrics.commissions.change >= 0 ? '+' : ''}${data.metrics.commissions.change}%`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: data.metrics.commissions.trend
    },
    {
      name: 'Lucro Líquido',
      value: formatCurrency(data.metrics.profit.current),
      change: `${data.metrics.profit.change >= 0 ? '+' : ''}${data.metrics.profit.change}%`,
      icon: DollarSign,
      color: data.metrics.profit.current >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: data.metrics.profit.current >= 0 ? 'bg-green-100' : 'bg-red-100',
      trend: data.metrics.profit.trend
    }
  ];

  return (
    <div className="space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Financeiro</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {data.user.name}! 
            {data.user.branch && ` - ${data.user.branch}`}
          </p>
        </div>
        <div className="flex space-x-2">
          {data.user.role === 'ADMIN' && (
            <>
              <Button 
                variant="outline" 
                onClick={async () => {
                  try {
                    const response = await fetch('/api/test/create-contract', {
                      method: 'POST',
                      credentials: 'include'
                    });
                    const result = await response.json();
                    if (response.ok) {
                      alert('Contrato de teste criado! Agora clique em "Sincronizar Vendas"');
                    } else {
                      alert(`Erro: ${result.error}`);
                    }
                  } catch (error) {
                    alert('Erro ao criar contrato de teste');
                  }
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Contrato Teste
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSyncData}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    Sincronizar Vendas
                  </>
                )}
              </Button>
            </>
          )}
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Transação Financeira</DialogTitle>
                <DialogDescription>
                  Adicione uma nova receita, despesa ou comissão.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitTransaction}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Tipo</Label>
                    <Select 
                      value={newTransaction.type} 
                      onValueChange={(value) => setNewTransaction(prev => ({...prev, type: value as any}))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="REVENUE">Receita</SelectItem>
                        <SelectItem value="EXPENSE">Despesa</SelectItem>
                        <SelectItem value="COMMISSION">Comissão</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Categoria</Label>
                    <Input
                      id="category"
                      value={newTransaction.category}
                      onChange={(e) => setNewTransaction(prev => ({...prev, category: e.target.value}))}
                      className="col-span-3"
                      placeholder="Ex: Vendas, Marketing, Comissão de Venda"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">Valor</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction(prev => ({...prev, amount: e.target.value}))}
                      className="col-span-3"
                      placeholder="0,00"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction(prev => ({...prev, date: e.target.value}))}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">Descrição</Label>
                    <Textarea
                      id="description"
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction(prev => ({...prev, description: e.target.value}))}
                      className="col-span-3"
                      placeholder="Descrição detalhada da transação"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      'Criar Transação'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {financialMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {metric.trend === 'up' && <ArrowUp className="h-3 w-3 mr-1 text-green-600" />}
                      {metric.trend === 'down' && <ArrowDown className="h-3 w-3 mr-1 text-red-600" />}
                      <span className={
                        metric.trend === 'up' ? 'text-green-600' : 
                        metric.trend === 'down' ? 'text-red-600' : 
                        'text-muted-foreground'
                      }>
                        {metric.change}
                      </span>
                      <span className="ml-1">desde o mês passado</span>
                    </div>
                  </div>
                  <div className={`${metric.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Transações Recentes */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Transações Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.recentTransactions.length > 0 ? (
                    data.recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(transaction.type)}`}>
                            {getTypeLabel(transaction.type)}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">{transaction.category}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(transaction.date)}
                              {transaction.employee && ` • ${transaction.employee}`}
                            </p>
                          </div>
                        </div>
                        <div className={`text-lg font-semibold ${
                          transaction.type === 'REVENUE' || transaction.type === 'COMMISSION' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'EXPENSE' ? '-' : '+'}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Nenhuma transação encontrada
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Categorias de Despesas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Top Despesas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.topExpenseCategories.length > 0 ? (
                    data.topExpenseCategories.map((category, index) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium">{category.category}</span>
                        </div>
                        <span className="text-sm font-semibold text-red-600">
                          {formatCurrency(category.amount)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhuma despesa este mês
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Todas as Transações</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      <SelectItem value="REVENUE">Receitas</SelectItem>
                      <SelectItem value="EXPENSE">Despesas</SelectItem>
                      <SelectItem value="COMMISSION">Comissões</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {recordsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {records.length > 0 ? (
                    records.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded text-sm font-medium ${getTypeColor(record.type)}`}>
                            {getTypeLabel(record.type)}
                          </div>
                          <div>
                            <p className="font-medium">{record.description}</p>
                            <p className="text-sm text-muted-foreground">{record.category}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(record.date)}
                              {record.employee && ` • ${record.employee.name}`}
                              {record.branch && ` • ${record.branch.name}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`text-lg font-semibold ${
                            record.type === 'REVENUE' || record.type === 'COMMISSION' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {record.type === 'EXPENSE' ? '-' : '+'}
                            {formatCurrency(record.amount)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Nenhuma transação encontrada
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Distribuição por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.categoryDistribution.length > 0 ? (
                  data.categoryDistribution.map((item, index) => (
                    <div key={`${item.category}-${item.type}`} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                          {getTypeLabel(item.type)}
                        </div>
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <span className={`text-lg font-semibold ${
                        item.type === 'REVENUE' || item.type === 'COMMISSION' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma categoria encontrada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
