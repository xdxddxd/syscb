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
  Users, 
  Award, 
  Clock, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  BarChart3,
  TrendingUp,
  Star,
  Edit,
  MoreHorizontal
} from 'lucide-react';

const departments = [
  { name: 'Vendas', count: 8, color: 'bg-blue-500' },
  { name: 'Marketing', count: 3, color: 'bg-green-500' },
  { name: 'Administrativo', count: 4, color: 'bg-purple-500' },
  { name: 'Suporte', count: 2, color: 'bg-orange-500' },
];

export default function EmployeesPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie equipe, performance e desenvolvimento profissional
          </p>
        </div>
        <Button className="w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Novo Funcionário
        </Button>
      </div>

      {/* Métricas da Equipe */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Funcionários</p>
                <p className="text-2xl font-bold">17</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Top Performers</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Média Performance</p>
                <p className="text-2xl font-bold">8.7</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Aniversariantes</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Departamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Departamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {departments.map((dept) => (
              <div
                key={dept.name}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                  selectedDepartment === dept.name ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedDepartment(dept.name)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{dept.name}</h3>
                    <p className="text-2xl font-bold">{dept.count}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${dept.color}`} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input 
                placeholder="Buscar por nome, cargo, email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                <option>Todos os departamentos</option>
                <option>Vendas</option>
                <option>Marketing</option>
                <option>Administrativo</option>
                <option>Suporte</option>
              </select>
            </div>
            <div>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                <option>Todos os status</option>
                <option>Ativo</option>
                <option>Inativo</option>
                <option>Férias</option>
                <option>Licença</option>
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

      {/* Lista de Funcionários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          {
            name: 'Maria Santos Silva',
            position: 'Consultora Sênior',
            department: 'Vendas',
            email: 'maria.santos@casabranca.com',
            phone: '(11) 99999-1234',
            performance: 9.2,
            sales: 'R$ 450.000',
            status: 'Ativo',
            avatar: 'MS'
          },
          {
            name: 'João Pedro Costa',
            position: 'Consultor Júnior',
            department: 'Vendas',
            email: 'joao.costa@casabranca.com',
            phone: '(11) 99999-5678',
            performance: 8.7,
            sales: 'R$ 320.000',
            status: 'Ativo',
            avatar: 'JP'
          },
          {
            name: 'Ana Clara Oliveira',
            position: 'Coordenadora Marketing',
            department: 'Marketing',
            email: 'ana.oliveira@casabranca.com',
            phone: '(11) 99999-9012',
            performance: 9.5,
            sales: 'R$ 0',
            status: 'Ativo',
            avatar: 'AC'
          },
          {
            name: 'Carlos Eduardo Lima',
            position: 'Analista Administrativo',
            department: 'Administrativo',
            email: 'carlos.lima@casabranca.com',
            phone: '(11) 99999-3456',
            performance: 8.3,
            sales: 'R$ 0',
            status: 'Férias',
            avatar: 'CE'
          },
          {
            name: 'Fernanda Ribeiro',
            position: 'Consultora Plena',
            department: 'Vendas',
            email: 'fernanda.ribeiro@casabranca.com',
            phone: '(11) 99999-7890',
            performance: 8.9,
            sales: 'R$ 380.000',
            status: 'Ativo',
            avatar: 'FR'
          },
          {
            name: 'Roberto Almeida',
            position: 'Consultor Sênior',
            department: 'Vendas',
            email: 'roberto.almeida@casabranca.com',
            phone: '(11) 99999-2468',
            performance: 9.1,
            sales: 'R$ 520.000',
            status: 'Ativo',
            avatar: 'RA'
          }
        ].map((employee, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">{employee.avatar}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{employee.department}</Badge>
                        <Badge variant={employee.status === 'Ativo' ? 'default' : 'secondary'}>
                          {employee.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      {employee.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      {employee.phone}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Performance</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium ml-1">{employee.performance}</span>
                        </div>
                      </div>
                    </div>
                    
                    {employee.department === 'Vendas' && (
                      <div>
                        <p className="text-xs text-muted-foreground">Vendas (2025)</p>
                        <p className="text-sm font-medium text-green-600">{employee.sales}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Performance
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ranking de Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5" />
            Top 5 - Performance do Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Ana Clara Oliveira', score: 9.5, department: 'Marketing', change: '+0.3' },
              { name: 'Maria Santos Silva', score: 9.2, department: 'Vendas', change: '+0.1' },
              { name: 'Roberto Almeida', score: 9.1, department: 'Vendas', change: '-0.1' },
              { name: 'Fernanda Ribeiro', score: 8.9, department: 'Vendas', change: '+0.2' },
              { name: 'João Pedro Costa', score: 8.7, department: 'Vendas', change: '+0.4' },
            ].map((employee, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{employee.score}</p>
                  <p className={`text-sm ${employee.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {employee.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
