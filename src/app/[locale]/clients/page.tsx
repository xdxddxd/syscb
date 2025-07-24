'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  TrendingUp,
  Users,
  Star,
  Clock
} from 'lucide-react';

const clientStages = [
  { name: 'Lead', count: 45, color: 'bg-blue-500' },
  { name: 'Interessado', count: 23, color: 'bg-yellow-500' },
  { name: 'Proposta', count: 12, color: 'bg-orange-500' },
  { name: 'Negociação', count: 8, color: 'bg-purple-500' },
  { name: 'Fechado', count: 15, color: 'bg-green-500' },
];

export default function ClientsPage() {
  const [selectedStage, setSelectedStage] = useState('Todos');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM - Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie leads, prospects e pipeline de vendas
          </p>
        </div>
        <Button className="w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
                <p className="text-2xl font-bold">103</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
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
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Novos (30d)</p>
                <p className="text-2xl font-bold">28</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Visual */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline de Vendas</CardTitle>
          <CardDescription>Visualização do funil de conversão</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            {clientStages.map((stage) => (
              <div
                key={stage.name}
                className={`flex-1 p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                  selectedStage === stage.name ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedStage(stage.name)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{stage.name}</h3>
                    <p className="text-2xl font-bold">{stage.count}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input placeholder="Buscar por nome, email, telefone..." />
            </div>
            <div>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                <option>Todos os estágios</option>
                <option>Lead</option>
                <option>Interessado</option>
                <option>Proposta</option>
                <option>Negociação</option>
                <option>Fechado</option>
              </select>
            </div>
            <div>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                <option>Todos os consultores</option>
                <option>João Silva</option>
                <option>Maria Santos</option>
                <option>Pedro Costa</option>
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

      {/* Lista de Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">João Silva Santos</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Interessado</Badge>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-muted-foreground ml-1">Hot Lead</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">2 dias atrás</span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      joao.silva@email.com
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      (11) 99999-9999
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      Interessado em: Casa - Jardim Europa
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">
                      Consultor: Maria Santos
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="sm">Ver Detalhes</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-center space-x-2">
        <Button variant="outline" size="sm" disabled>
          Anterior
        </Button>
        <Button variant="outline" size="sm">1</Button>
        <Button variant="outline" size="sm">2</Button>
        <Button variant="outline" size="sm">3</Button>
        <Button variant="outline" size="sm">
          Próximo
        </Button>
      </div>
    </div>
  );
}
