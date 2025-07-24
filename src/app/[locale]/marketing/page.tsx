'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Globe, 
  Facebook, 
  Instagram, 
  MessageSquare,
  Eye,
  MousePointer,
  Phone,
  Calendar,
  Target,
  DollarSign,
  Share2,
  Edit,
  Camera,
  Video,
  Mail,
  Megaphone
} from 'lucide-react';

const marketingMetrics = [
  { name: 'Leads Gerados', value: '284', change: '+12%', icon: Users, color: 'text-blue-600' },
  { name: 'Conversão', value: '18.5%', change: '+2.3%', icon: Target, color: 'text-green-600' },
  { name: 'Custo por Lead', value: 'R$ 42', change: '-8%', icon: DollarSign, color: 'text-purple-600' },
  { name: 'ROI Campanhas', value: '324%', change: '+45%', icon: TrendingUp, color: 'text-orange-600' },
];

export default function MarketingPage() {
  const [selectedCampaign, setSelectedCampaign] = useState('Todas');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Digital</h1>
          <p className="text-muted-foreground">
            Gestão de campanhas, leads e performance de marketing imobiliário
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Relatórios
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Campanha
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {marketingMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change} vs mês anterior
                  </p>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campanhas Ativas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campanhas Ativas</CardTitle>
            <CardDescription>Performance das campanhas em andamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Apartamentos Zona Sul',
                  platform: 'Facebook + Instagram',
                  budget: 'R$ 2.500',
                  leads: 42,
                  conversions: 8,
                  status: 'Ativa',
                  icon: <Facebook className="h-5 w-5 text-blue-600" />
                },
                {
                  name: 'Casas de Luxo',
                  platform: 'Google Ads',
                  budget: 'R$ 3.200',
                  leads: 18,
                  conversions: 6,
                  status: 'Ativa',
                  icon: <Globe className="h-5 w-5 text-orange-600" />
                },
                {
                  name: 'Lançamento Residencial',
                  platform: 'Instagram',
                  budget: 'R$ 1.800',
                  leads: 64,
                  conversions: 12,
                  status: 'Pausada',
                  icon: <Instagram className="h-5 w-5 text-pink-600" />
                }
              ].map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {campaign.icon}
                    <div>
                      <h4 className="font-medium">{campaign.name}</h4>
                      <p className="text-sm text-muted-foreground">{campaign.platform}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{campaign.budget}</p>
                    <p className="text-sm text-muted-foreground">{campaign.leads} leads</p>
                  </div>
                  <Badge variant={campaign.status === 'Ativa' ? 'default' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
            <CardDescription>Performance das redes sociais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  platform: 'Instagram',
                  followers: '12.5K',
                  engagement: '4.2%',
                  posts: 23,
                  growth: '+8.5%',
                  icon: <Instagram className="h-6 w-6 text-pink-600" />
                },
                {
                  platform: 'Facebook',
                  followers: '8.9K',
                  engagement: '3.8%',
                  posts: 18,
                  growth: '+5.2%',
                  icon: <Facebook className="h-6 w-6 text-blue-600" />
                },
                {
                  platform: 'WhatsApp Business',
                  followers: '2.1K',
                  engagement: '15.3%',
                  posts: 45,
                  growth: '+12.1%',
                  icon: <MessageSquare className="h-6 w-6 text-green-600" />
                }
              ].map((social, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {social.icon}
                    <div>
                      <h4 className="font-medium">{social.platform}</h4>
                      <p className="text-sm text-muted-foreground">{social.followers} seguidores</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{social.engagement}</p>
                    <p className="text-sm text-green-600">{social.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funil de Conversão */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
          <CardDescription>Jornada do lead até a conversão</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { stage: 'Impressões', count: '45.2K', conversion: '100%', icon: Eye },
              { stage: 'Cliques', count: '2.8K', conversion: '6.2%', icon: MousePointer },
              { stage: 'Leads', count: '284', conversion: '10.1%', icon: Users },
              { stage: 'Contatos', count: '156', conversion: '54.9%', icon: Phone },
              { stage: 'Vendas', count: '23', conversion: '14.7%', icon: Target }
            ].map((stage, index) => (
              <div key={index} className="text-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <stage.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-medium">{stage.stage}</h4>
                  <p className="text-2xl font-bold">{stage.count}</p>
                  <p className="text-sm text-muted-foreground">{stage.conversion}</p>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 transform translate-x-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Biblioteca de Conteúdo</CardTitle>
            <CardDescription>Materiais de marketing disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'Fotos', count: 148, icon: Camera, color: 'text-blue-600' },
                { type: 'Vídeos', count: 23, icon: Video, color: 'text-purple-600' },
                { type: 'Templates', count: 45, icon: Edit, color: 'text-green-600' },
                { type: 'E-books', count: 12, icon: Mail, color: 'text-orange-600' }
              ].map((content, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    <content.icon className={`h-5 w-5 ${content.color}`} />
                    <span className="font-medium">{content.type}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-muted-foreground">{content.count} itens</span>
                    <Button variant="outline" size="sm">Ver Todos</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Ações</CardTitle>
            <CardDescription>Tarefas de marketing programadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  task: 'Post Instagram - Lançamento',
                  date: 'Hoje, 14:00',
                  status: 'Pendente',
                  priority: 'Alta'
                },
                {
                  task: 'E-mail Marketing - Newsletter',
                  date: 'Amanhã, 09:00',
                  status: 'Programado',
                  priority: 'Média'
                },
                {
                  task: 'Análise Campanha Facebook',
                  date: '26/07, 16:00',
                  status: 'Pendente',
                  priority: 'Baixa'
                },
                {
                  task: 'Criação Vídeo Tour Virtual',
                  date: '28/07, 10:00',
                  status: 'Em Progresso',
                  priority: 'Alta'
                }
              ].map((action, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex-1">
                    <h4 className="font-medium">{action.task}</h4>
                    <p className="text-sm text-muted-foreground">{action.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={action.priority === 'Alta' ? 'destructive' : 
                                  action.priority === 'Média' ? 'default' : 'secondary'}>
                      {action.priority}
                    </Badge>
                    <Badge variant="outline">{action.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automações */}
      <Card>
        <CardHeader>
          <CardTitle>Automações de Marketing</CardTitle>
          <CardDescription>Fluxos automatizados para nutrição de leads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'Boas-vindas Novos Leads',
                description: 'Sequência de e-mails para novos cadastros',
                leads: 45,
                conversion: '12.5%',
                status: 'Ativa'
              },
              {
                name: 'Reengajamento Leads Frios',
                description: 'Reativação de leads inativos há 30 dias',
                leads: 23,
                conversion: '8.7%',
                status: 'Ativa'
              },
              {
                name: 'Pós-Visita Follow-up',
                description: 'Acompanhamento após visitas aos imóveis',
                leads: 67,
                conversion: '24.2%',
                status: 'Pausada'
              }
            ].map((automation, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">{automation.name}</h4>
                      <Badge variant={automation.status === 'Ativa' ? 'default' : 'secondary'}>
                        {automation.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{automation.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>{automation.leads} leads</span>
                      <span className="text-green-600 font-medium">{automation.conversion}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Configurar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
