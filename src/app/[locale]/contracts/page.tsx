'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Edit,
  User,
  Building2,
  DollarSign
} from 'lucide-react';

const contractStatuses = [
  { name: 'Rascunho', count: 8, color: 'bg-gray-500', variant: 'secondary' },
  { name: 'Aguardando', count: 12, color: 'bg-yellow-500', variant: 'default' },
  { name: 'Assinado', count: 23, color: 'bg-green-500', variant: 'default' },
  { name: 'Cancelado', count: 3, color: 'bg-red-500', variant: 'destructive' },
];

export default function ContractsPage() {
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Contratos</h1>
          <p className="text-muted-foreground">
            Criação, gestão e assinatura eletrônica de contratos imobiliários
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Modelos
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Contrato
          </Button>
        </div>
      </div>

      {/* Status dos Contratos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {contractStatuses.map((status) => (
          <Card key={status.name} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{status.name}</p>
                  <p className="text-2xl font-bold">{status.count}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${status.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Input 
                placeholder="Buscar contratos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                <option>Todos os status</option>
                <option>Rascunho</option>
                <option>Aguardando Assinatura</option>
                <option>Assinado</option>
                <option>Cancelado</option>
              </select>
            </div>
            <div>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                <option>Tipo de contrato</option>
                <option>Compra e Venda</option>
                <option>Locação</option>
                <option>Permuta</option>
                <option>Cessão</option>
              </select>
            </div>
            <div>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                <option>Todos os consultores</option>
                <option>Maria Santos</option>
                <option>João Costa</option>
                <option>Ana Oliveira</option>
              </select>
            </div>
            <div>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Contratos */}
      <div className="space-y-4">
        {[
          {
            id: 'CT-2025-001',
            title: 'Compra e Venda - Casa Jardim Europa',
            client: 'João Silva Santos',
            property: 'Casa 3 dorms - Jardim Europa',
            value: 'R$ 450.000',
            status: 'Assinado',
            statusIcon: <CheckCircle className="h-4 w-4 text-green-600" />,
            consultant: 'Maria Santos',
            created: '15/07/2025',
            signed: '22/07/2025',
            type: 'Compra e Venda'
          },
          {
            id: 'CT-2025-002',
            title: 'Locação - Apartamento Centro',
            client: 'Ana Paula Costa',
            property: 'Apartamento 2 dorms - Centro',
            value: 'R$ 2.800/mês',
            status: 'Aguardando',
            statusIcon: <Clock className="h-4 w-4 text-yellow-600" />,
            consultant: 'João Costa',
            created: '20/07/2025',
            signed: '-',
            type: 'Locação'
          },
          {
            id: 'CT-2025-003',
            title: 'Compra e Venda - Terreno Vila Madalena',
            client: 'Pedro Oliveira Lima',
            property: 'Terreno 400m² - Vila Madalena',
            value: 'R$ 320.000',
            status: 'Rascunho',
            statusIcon: <FileText className="h-4 w-4 text-gray-600" />,
            consultant: 'Ana Oliveira',
            created: '23/07/2025',
            signed: '-',
            type: 'Compra e Venda'
          },
          {
            id: 'CT-2025-004',
            title: 'Locação Comercial - Loja Shopping',
            client: 'Empresa XYZ Ltda',
            property: 'Loja 50m² - Shopping Center',
            value: 'R$ 8.500/mês',
            status: 'Cancelado',
            statusIcon: <XCircle className="h-4 w-4 text-red-600" />,
            consultant: 'Roberto Almeida',
            created: '18/07/2025',
            signed: '-',
            type: 'Locação Comercial'
          },
          {
            id: 'CT-2025-005',
            title: 'Compra e Venda - Cobertura Moema',
            client: 'Carlos Eduardo Santos',
            property: 'Cobertura 4 dorms - Moema',
            value: 'R$ 1.200.000',
            status: 'Aguardando',
            statusIcon: <Clock className="h-4 w-4 text-yellow-600" />,
            consultant: 'Fernanda Ribeiro',
            created: '21/07/2025',
            signed: '-',
            type: 'Compra e Venda'
          }
        ].map((contract, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-lg">{contract.title}</h3>
                        <Badge variant={contract.status === 'Assinado' ? 'default' : 
                                      contract.status === 'Aguardando' ? 'secondary' :
                                      contract.status === 'Cancelado' ? 'destructive' : 'outline'}>
                          <div className="flex items-center space-x-1">
                            {contract.statusIcon}
                            <span>{contract.status}</span>
                          </div>
                        </Badge>
                        <Badge variant="outline">{contract.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">#{contract.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">{contract.value}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Cliente</p>
                        <p className="font-medium">{contract.client}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Imóvel</p>
                        <p className="font-medium">{contract.property}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Consultor</p>
                        <p className="font-medium">{contract.consultant}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Criado: {contract.created}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>Assinado: {contract.signed}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </Button>
                      {contract.status !== 'Assinado' && contract.status !== 'Cancelado' && (
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modelos de Contrato */}
      <Card>
        <CardHeader>
          <CardTitle>Modelos de Contrato Disponíveis</CardTitle>
          <CardDescription>Templates pré-configurados para diferentes tipos de transação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Compra e Venda Residencial', desc: 'Contrato padrão para venda de imóveis residenciais', uses: 45 },
              { name: 'Locação Residencial', desc: 'Modelo para contratos de aluguel residencial', uses: 23 },
              { name: 'Locação Comercial', desc: 'Contrato especializado para imóveis comerciais', uses: 12 },
              { name: 'Permuta de Imóveis', desc: 'Template para troca de propriedades', uses: 8 },
              { name: 'Cessão de Direitos', desc: 'Contrato para cessão de direitos imobiliários', uses: 5 },
              { name: 'Promessa de Compra e Venda', desc: 'Modelo para promessa de transação futura', uses: 18 }
            ].map((template, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">{template.name}</h4>
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">{template.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{template.uses} usos</span>
                      <Button size="sm">Usar Modelo</Button>
                    </div>
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
