'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  Download,
  Filter,
  FileText,
  Users,
  Building2,
  DollarSign,
  Clock,
  Target,
  Activity
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const reportTypes = [
  {
    title: 'Vendas por Período',
    description: 'Análise de vendas mensais, trimestrais e anuais',
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    category: 'vendas'
  },
  {
    title: 'Performance por Consultor',
    description: 'Ranking e métricas individuais da equipe',
    icon: <Users className="h-8 w-8 text-green-600" />,
    category: 'equipe'
  },
  {
    title: 'Análise de Imóveis',
    description: 'Estatísticas por tipo, região e preço',
    icon: <Building2 className="h-8 w-8 text-purple-600" />,
    category: 'imoveis'
  },
  {
    title: 'Funil de Conversão',
    description: 'Taxa de conversão do pipeline de vendas',
    icon: <Target className="h-8 w-8 text-orange-600" />,
    category: 'conversao'
  },
  {
    title: 'Relatório Financeiro',
    description: 'Receitas, despesas e margem de lucro',
    icon: <DollarSign className="h-8 w-8 text-yellow-600" />,
    category: 'financeiro'
  },
  {
    title: 'Tempo Médio de Venda',
    description: 'Análise do ciclo de vendas por categoria',
    icon: <Clock className="h-8 w-8 text-red-600" />,
    category: 'tempo'
  }
];

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [dateRange, setDateRange] = useState('30d');

  const filteredReports = selectedCategory === 'todos' 
    ? reportTypes 
    : reportTypes.filter(report => report.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios e Análises</h1>
          <p className="text-muted-foreground">
            Insights detalhados e métricas de performance do negócio
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros Avançados
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar Tudo
          </Button>
        </div>
      </div>

      {/* KPIs Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Taxa Conversão</p>
                <p className="text-2xl font-bold">14.6%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold">32d</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Crescimento</p>
                <p className="text-2xl font-bold">+23%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Meta Mês</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">NPS Score</p>
                <p className="text-2xl font-bold">8.4</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Categoria</label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="todos">Todos os Relatórios</option>
                <option value="vendas">Vendas</option>
                <option value="equipe">Equipe</option>
                <option value="imoveis">Imóveis</option>
                <option value="conversao">Conversão</option>
                <option value="financeiro">Financeiro</option>
                <option value="tempo">Tempo</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Período</label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 3 meses</option>
                <option value="1y">Último ano</option>
                <option value="custom">Período personalizado</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Formato</label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-muted rounded-lg">
                  {report.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {report.description}
                  </p>
                  <div className="mt-4 space-y-2">
                    <Badge variant="outline" className="text-xs">
                      {report.category}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Visualizar
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Relatórios Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Gerados Recentemente</CardTitle>
          <CardDescription>Acesse relatórios criados nos últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Vendas Julho 2025', type: 'PDF', date: '24/07/2025 14:30', size: '2.3 MB' },
              { name: 'Performance Equipe Q2', type: 'Excel', date: '23/07/2025 09:15', size: '1.8 MB' },
              { name: 'Análise Imóveis Centro', type: 'PDF', date: '22/07/2025 16:45', size: '3.1 MB' },
              { name: 'Relatório Financeiro Mensal', type: 'PDF', date: '21/07/2025 11:20', size: '2.7 MB' },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.type} • {report.date} • {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
