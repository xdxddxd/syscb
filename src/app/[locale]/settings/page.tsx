'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  Webhook, 
  Key,
  Globe,
  Building2,
  Mail,
  Phone,
  MapPin,
  Camera,
  Upload,
  Check,
  X,
  Eye,
  EyeOff,
  Monitor,
  Smartphone,
  Laptop,
  Users,
  Lock,
  Unlock,
  RefreshCw,
  Download,
  AlertTriangle
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'company', name: 'Empresa', icon: Building2 },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'integrations', name: 'Integrações', icon: Webhook },
    { id: 'system', name: 'Sistema', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Gerencie suas informações de perfil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                    <Button size="sm" className="absolute -bottom-2 -right-2">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Foto de Perfil</h3>
                    <p className="text-sm text-muted-foreground">JPG, PNG ou GIF. Máximo 2MB.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nome</label>
                    <Input defaultValue="Maria Santos" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sobrenome</label>
                    <Input defaultValue="Silva" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">E-mail</label>
                    <Input defaultValue="maria.santos@empresa.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Telefone</label>
                    <Input defaultValue="(11) 99999-9999" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">CRECI</label>
                    <Input defaultValue="12345-F" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Cargo</label>
                    <Input defaultValue="Corretora Senior" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>Configure suas preferências de trabalho</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Idioma</label>
                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option>Português (Brasil)</option>
                      <option>English</option>
                      <option>Español</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Fuso Horário</label>
                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                      <option>America/Sao_Paulo</option>
                      <option>America/New_York</option>
                      <option>Europe/London</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'company':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>Dados da sua imobiliária</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-gray-400" />
                    </div>
                    <Button size="sm" className="absolute -bottom-2 -right-2">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Logo da Empresa</h3>
                    <p className="text-sm text-muted-foreground">PNG ou SVG. Recomendado 200x200px.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Razão Social</label>
                    <Input defaultValue="Imobiliária Santos Ltda" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">CNPJ</label>
                    <Input defaultValue="12.345.678/0001-90" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">CRECI Empresa</label>
                    <Input defaultValue="12345-J" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Telefone Principal</label>
                    <Input defaultValue="(11) 3333-4444" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Endereço</label>
                    <Input defaultValue="Rua das Flores, 123 - Centro - São Paulo/SP" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Website</label>
                    <Input defaultValue="www.imobiliariasantos.com.br" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">E-mail Comercial</label>
                    <Input defaultValue="contato@imobiliariasantos.com.br" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>Configure como você deseja receber notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { category: 'Novos Leads', email: true, push: true, sms: false },
                  { category: 'Agendamentos', email: true, push: true, sms: true },
                  { category: 'Contratos', email: true, push: false, sms: false },
                  { category: 'Relatórios', email: false, push: false, sms: false },
                  { category: 'Marketing', email: true, push: false, sms: false },
                  { category: 'Sistema', email: true, push: true, sms: false }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b">
                    <div>
                      <h4 className="font-medium">{item.category}</h4>
                      <p className="text-sm text-muted-foreground">Receber notificações sobre {item.category.toLowerCase()}</p>
                    </div>
                    <div className="flex space-x-6">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">E-mail</span>
                        {item.email ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-gray-400" />}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4" />
                        <span className="text-sm">Push</span>
                        {item.push ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-gray-400" />}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">SMS</span>
                        {item.sms ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-gray-400" />}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>Gerencie a segurança da sua conta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Senha Atual</label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Digite sua senha atual" 
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nova Senha</label>
                    <Input type="password" placeholder="Digite sua nova senha" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Confirmar Nova Senha</label>
                    <Input type="password" placeholder="Confirme sua nova senha" />
                  </div>
                  <Button>Alterar Senha</Button>
                </div>
                
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Autenticação de Dois Fatores</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h5 className="font-medium">2FA via SMS</h5>
                      <p className="text-sm text-muted-foreground">Receba códigos via SMS</p>
                    </div>
                    <Badge variant="outline">Inativo</Badge>
                  </div>
                  <Button variant="outline" className="mt-2">Configurar 2FA</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sessões Ativas</CardTitle>
                <CardDescription>Dispositivos conectados à sua conta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { device: 'Chrome - Windows', location: 'São Paulo, Brasil', current: true, icon: Monitor },
                    { device: 'Safari - iPhone', location: 'São Paulo, Brasil', current: false, icon: Smartphone },
                    { device: 'Edge - Windows', location: 'Rio de Janeiro, Brasil', current: false, icon: Laptop }
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <session.icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h5 className="font-medium">{session.device}</h5>
                          <p className="text-sm text-muted-foreground">{session.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {session.current && <Badge>Atual</Badge>}
                        {!session.current && (
                          <Button variant="outline" size="sm">Encerrar</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrações Disponíveis</CardTitle>
                <CardDescription>Conecte ferramentas externas ao seu sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'WhatsApp Business', description: 'Integração com WhatsApp para atendimento', status: 'Conectado', icon: '📱' },
                    { name: 'Google Analytics', description: 'Análise de tráfego do site', status: 'Conectado', icon: '📊' },
                    { name: 'Mailchimp', description: 'E-mail marketing automatizado', status: 'Desconectado', icon: '📧' },
                    { name: 'Zapier', description: 'Automação entre aplicativos', status: 'Desconectado', icon: '⚡' },
                    { name: 'Facebook Ads', description: 'Gestão de campanhas publicitárias', status: 'Conectado', icon: '📘' },
                    { name: 'Google Maps', description: 'Mapas e localização de imóveis', status: 'Conectado', icon: '🗺️' }
                  ].map((integration, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{integration.icon}</span>
                          <div>
                            <h4 className="font-medium">{integration.name}</h4>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={integration.status === 'Conectado' ? 'default' : 'outline'}>
                            {integration.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            {integration.status === 'Conectado' ? 'Configurar' : 'Conectar'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Sistema</CardTitle>
                <CardDescription>Versão e status do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Versão Atual</h4>
                      <p className="text-2xl font-bold">v2.1.4</p>
                      <p className="text-sm text-muted-foreground">Última atualização: 15/07/2025</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Status do Sistema</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-medium">Operacional</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Uso de Armazenamento</h4>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-blue-600 h-3 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">6.8 GB de 10 GB utilizados</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Backup</h4>
                      <p className="text-sm text-muted-foreground">Último backup: Hoje, 03:00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações do Sistema</CardTitle>
                <CardDescription>Manutenção e administração</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Download className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Exportar Dados</h4>
                        <p className="text-sm text-muted-foreground">Baixe uma cópia dos seus dados</p>
                      </div>
                    </div>
                    <Button variant="outline">Exportar</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <RefreshCw className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">Sincronizar Dados</h4>
                        <p className="text-sm text-muted-foreground">Atualizar informações com serviços externos</p>
                      </div>
                    </div>
                    <Button variant="outline">Sincronizar</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div>
                        <h4 className="font-medium text-red-600">Limpar Cache</h4>
                        <p className="text-sm text-muted-foreground">Limpe o cache do sistema (pode afetar performance temporariamente)</p>
                      </div>
                    </div>
                    <Button variant="outline">Limpar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências, segurança e integrações do sistema
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar de Navegação */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1">
          {renderTabContent()}
          
          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
            <Button variant="outline">Cancelar</Button>
            <Button>Salvar Alterações</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
