'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  XCircle,
  HelpCircle,
  Book,
  Video,
  FileText,
  Zap,
  Shield,
  Bug,
  Lightbulb,
  Headphones,
  Star,
  ThumbsUp,
  ThumbsDown,
  Send,
  Paperclip,
  Calendar,
  User,
  Bell,
  BarChart3
} from 'lucide-react';

const supportStats = [
  { name: 'Tickets Abertos', value: '12', change: '-3', icon: MessageSquare, color: 'text-blue-600' },
  { name: 'Tempo Médio', value: '2.5h', change: '-30m', icon: Clock, color: 'text-green-600' },
  { name: 'Satisfação', value: '94%', change: '+2%', icon: Star, color: 'text-yellow-600' },
  { name: 'Resolvidos Hoje', value: '8', change: '+3', icon: CheckCircle, color: 'text-purple-600' },
];

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suporte Técnico</h1>
          <p className="text-muted-foreground">
            Central de ajuda, documentação e atendimento técnico
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Book className="mr-2 h-4 w-4" />
            Documentação
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Ticket
          </Button>
        </div>
      </div>

      {/* Estatísticas do Suporte */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {supportStats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-xs ${stat.change.startsWith('+') || stat.change.startsWith('-2') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} vs ontem
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Acesso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Chat ao Vivo</h3>
                <p className="text-sm text-muted-foreground">Atendimento online imediato</p>
                <Badge variant="default" className="mt-2">Online</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Suporte por Telefone</h3>
                <p className="text-sm text-muted-foreground">(11) 4000-1234</p>
                <Badge variant="outline" className="mt-2">Seg-Sex 8h-18h</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">E-mail Suporte</h3>
                <p className="text-sm text-muted-foreground">suporte@sistema.com</p>
                <Badge variant="outline" className="mt-2">24h resposta</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meus Tickets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Meus Tickets</CardTitle>
              <CardDescription>Acompanhe o status dos seus chamados</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Input 
                placeholder="Buscar tickets..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <select className="h-10 px-3 rounded-md border border-input bg-background">
                <option>Todos os status</option>
                <option>Aberto</option>
                <option>Em Progresso</option>
                <option>Aguardando</option>
                <option>Resolvido</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 'ST-2025-001',
                title: 'Erro ao gerar relatório de vendas',
                category: 'Bug',
                priority: 'Alta',
                status: 'Em Progresso',
                created: '23/07/2025 14:30',
                lastUpdate: '24/07/2025 09:15',
                agent: 'Carlos Suporte',
                description: 'Relatório não está sendo gerado corretamente'
              },
              {
                id: 'ST-2025-002',
                title: 'Como configurar integração WhatsApp?',
                category: 'Dúvida',
                priority: 'Média',
                status: 'Resolvido',
                created: '22/07/2025 16:45',
                lastUpdate: '23/07/2025 10:30',
                agent: 'Ana Suporte',
                description: 'Preciso de ajuda para configurar a integração'
              },
              {
                id: 'ST-2025-003',
                title: 'Solicitação de nova funcionalidade - Dashboard',
                category: 'Melhoria',
                priority: 'Baixa',
                status: 'Aberto',
                created: '21/07/2025 11:20',
                lastUpdate: '21/07/2025 11:20',
                agent: 'Em análise',
                description: 'Gostaria de sugerir melhorias no dashboard'
              }
            ].map((ticket, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold">{ticket.title}</h4>
                          <Badge variant={ticket.status === 'Resolvido' ? 'default' : 
                                        ticket.status === 'Em Progresso' ? 'secondary' :
                                        ticket.status === 'Aberto' ? 'outline' : 'destructive'}>
                            {ticket.status}
                          </Badge>
                          <Badge variant="outline">{ticket.category}</Badge>
                          <Badge variant={ticket.priority === 'Alta' ? 'destructive' : 
                                        ticket.priority === 'Média' ? 'default' : 'secondary'}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">#{ticket.id}</p>
                        <p className="text-sm mt-2">{ticket.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Criado: {ticket.created}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Atualizado: {ticket.lastUpdate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>Agente: {ticket.agent}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                        {ticket.status === 'Resolvido' && (
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Base de Conhecimento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Base de Conhecimento</CardTitle>
            <CardDescription>Artigos e tutoriais mais acessados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Como criar um novo imóvel no sistema', category: 'Tutorial', views: 245, icon: FileText },
                { title: 'Configurando notificações de leads', category: 'Configuração', views: 189, icon: Bell },
                { title: 'Gerando relatórios personalizados', category: 'Relatórios', views: 167, icon: BarChart3 },
                { title: 'Integração com WhatsApp Business', category: 'Integração', views: 156, icon: MessageSquare },
                { title: 'Backup e restauração de dados', category: 'Segurança', views: 98, icon: Shield }
              ].map((article, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <article.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h5 className="font-medium">{article.title}</h5>
                      <p className="text-sm text-muted-foreground">{article.category}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {article.views} visualizações
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vídeos Tutoriais</CardTitle>
            <CardDescription>Aprenda através de vídeos explicativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Primeiros passos no sistema', duration: '5:30', views: 1234 },
                { title: 'Cadastrando imóveis completos', duration: '8:45', views: 987 },
                { title: 'Gestão de leads e follow-up', duration: '12:15', views: 756 },
                { title: 'Criando campanhas de marketing', duration: '7:20', views: 654 },
                { title: 'Relatórios e análises avançadas', duration: '15:30', views: 432 }
              ].map((video, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-red-100 rounded flex items-center justify-center">
                      <Video className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h5 className="font-medium">{video.title}</h5>
                      <p className="text-sm text-muted-foreground">{video.duration} • {video.views} visualizações</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Assistir</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Perguntas Frequentes</CardTitle>
          <CardDescription>Respostas para as dúvidas mais comuns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                question: 'Como faço para recuperar minha senha?',
                answer: 'Clique em "Esqueci minha senha" na tela de login e siga as instruções enviadas para seu e-mail.',
                category: 'Conta'
              },
              {
                question: 'Posso integrar o sistema com meu site?',
                answer: 'Sim, oferecemos APIs REST para integração completa com websites e outras plataformas.',
                category: 'Integração'
              },
              {
                question: 'Como configurar o backup automático?',
                answer: 'Acesse Configurações > Sistema > Backup e configure a frequência e destino dos backups.',
                category: 'Backup'
              },
              {
                question: 'Existe limite de usuários no sistema?',
                answer: 'O limite depende do seu plano. Consulte nossa página de preços ou contate o suporte.',
                category: 'Planos'
              }
            ].map((faq, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium flex items-center space-x-2">
                      <HelpCircle className="h-4 w-4 text-blue-600" />
                      <span>{faq.question}</span>
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2 ml-6">{faq.answer}</p>
                  </div>
                  <Badge variant="outline">{faq.category}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Nos Ajude a Melhorar</CardTitle>
          <CardDescription>Sua opinião é muito importante para nós</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Como você avalia nosso suporte?</label>
              <div className="flex space-x-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-6 w-6 text-yellow-400 cursor-pointer hover:text-yellow-500" />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Sugestões ou comentários</label>
              <textarea 
                className="w-full mt-2 p-3 border rounded-md resize-none h-24"
                placeholder="Conte-nos como podemos melhorar nosso atendimento..."
              />
            </div>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Enviar Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
