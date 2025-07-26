'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Filter, 
  Users,
  TrendingUp,
  Calendar,
  Clock,
  LayoutGrid,
  List,
  RefreshCw,
  Download
} from 'lucide-react';
import { KanbanBoard } from '@/components/crm/KanbanBoard';
import { LeadModal } from '@/components/crm/LeadModal';
import { LeadCard } from '@/components/crm/LeadCard';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  interest: string;
  budget?: number;
  notes: string;
  createdAt: string;
  lastContactAt?: string;
  agent: {
    id: string;
    name: string;
    email: string;
  };
  property?: {
    id: string;
    title: string;
    type: string;
    price: number;
    neighborhood: string;
    city: string;
  };
  branch: {
    id: string;
    name: string;
  };
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface Property {
  id: string;
  title: string;
  type: string;
  price: number;
  neighborhood: string;
  city: string;
}

export default function ClientsPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [initialStatus, setInitialStatus] = useState<string>('');
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    agentId: 'all',
    source: 'all'
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        limit: '100',
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.agentId !== 'all' && { agentId: filters.agentId }),
        ...(filters.search && { search: filters.search })
      });

      const [leadsRes, employeesRes, propertiesRes] = await Promise.all([
        fetch(`/api/leads?${params}`, { credentials: 'include' }),
        fetch('/api/employees?limit=100', { credentials: 'include' }),
        fetch('/api/properties?limit=100', { credentials: 'include' }).catch(() => ({ ok: false }))
      ]);

      if (!leadsRes.ok || !employeesRes.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const [leadsData, employeesData] = await Promise.all([
        leadsRes.json(),
        employeesRes.json()
      ]);

      // Properties API pode não existir ainda, então vamos usar dados mock
      const propertiesData = { properties: [] };

      setLeads(leadsData.leads || []);
      setStats(leadsData.stats?.byStatus || {});
      setEmployees(employeesData.employees || []);
      setProperties(propertiesData.properties || []);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = (status: string = 'NEW') => {
    setEditingLead(null);
    setInitialStatus(status);
    setShowLeadModal(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setInitialStatus('');
    setShowLeadModal(true);
  };

  const handleSaveLead = async (leadData: any) => {
    try {
      const url = editingLead ? `/api/leads/${editingLead.id}` : '/api/leads';
      const method = editingLead ? 'PUT' : 'POST';

      console.log('Enviando dados do lead:', leadData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(leadData)
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Erro da API:', responseData);
        throw new Error(responseData.error || 'Erro ao salvar lead');
      }

      console.log('Lead salvo com sucesso:', responseData);
      await loadData();
      setShowLeadModal(false);
      setEditingLead(null);
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`Erro ao salvar lead: ${errorMessage}`);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) {
      return;
    }

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir lead');
      }

      await loadData();
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      alert('Erro ao excluir lead');
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;

      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...lead,
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      await loadData();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!lead.name.toLowerCase().includes(search) &&
          !lead.email.toLowerCase().includes(search) &&
          !lead.phone.includes(search) &&
          !lead.interest.toLowerCase().includes(search)) {
        return false;
      }
    }
    
    if (filters.status !== 'all' && lead.status !== filters.status) {
      return false;
    }
    
    if (filters.agentId !== 'all' && lead.agent.id !== filters.agentId) {
      return false;
    }

    return true;
  });

  const totalLeads = leads.length;
  const hotLeads = leads.filter(lead => lead.budget && lead.budget > 500000).length;
  const conversionRate = stats.NEW && stats.NEW > 0 ? Math.round(((stats.CLOSED || 0) / stats.NEW) * 100) : 0;
  const totalValue = leads.reduce((sum, lead) => sum + (lead.budget || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM - Pipeline de Vendas</h1>
          <p className="text-muted-foreground">
            Gerencie leads, acompanhe conversões e feche mais negócios
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => handleCreateLead()}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{totalLeads}</p>
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
                <p className="text-2xl font-bold">{conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Hot Leads</p>
                <p className="text-2xl font-bold">{hotLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Valor Pipeline</p>
                <p className="text-2xl font-bold">R$ {(totalValue / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <Input 
                placeholder="Buscar por nome, email, telefone..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full"
              />
            </div>
            
            <div>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="NEW">Novos</SelectItem>
                  <SelectItem value="CONTACTED">Contatados</SelectItem>
                  <SelectItem value="QUALIFIED">Qualificados</SelectItem>
                  <SelectItem value="PROPOSAL">Proposta</SelectItem>
                  <SelectItem value="CLOSED">Fechados</SelectItem>
                  <SelectItem value="LOST">Perdidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={filters.agentId} onValueChange={(value) => setFilters(prev => ({ ...prev, agentId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Consultor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os consultores</SelectItem>
                  {employees
                    .filter(employee => employee.user && employee.user.id && employee.user.id.trim() !== '' && employee.name)
                    .map(employee => (
                      <SelectItem key={employee.user!.id} value={employee.user!.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Button variant="outline" onClick={loadData} className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Aplicar Filtros
              </Button>
            </div>

            <div>
              <div className="flex gap-1">
                <Button
                  variant={view === 'kanban' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('kanban')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo Principal */}
      {view === 'kanban' ? (
        <KanbanBoard
          leads={filteredLeads}
          stats={stats}
          onEditLead={handleEditLead}
          onDeleteLead={handleDeleteLead}
          onStatusChange={handleStatusChange}
          onCreateLead={handleCreateLead}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredLeads.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum lead encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro lead ou ajuste os filtros
              </p>
              <Button onClick={() => handleCreateLead()}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Lead
              </Button>
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onEdit={handleEditLead}
                onDelete={handleDeleteLead}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      )}

      {/* Modal de Lead */}
      <LeadModal
        isOpen={showLeadModal}
        onClose={() => {
          setShowLeadModal(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        lead={editingLead}
        initialStatus={initialStatus}
        employees={employees}
        properties={properties}
        loading={loading}
      />
    </div>
  );
}
