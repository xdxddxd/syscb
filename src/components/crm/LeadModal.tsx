'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Save, 
  X, 
  User, 
  Phone, 
  Mail, 
  DollarSign, 
  MapPin,
  Building,
  Calendar,
  FileText
} from 'lucide-react';

interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  interest: string;
  budget?: number;
  notes: string;
  agentId?: string;
  propertyId?: string;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
}

interface Property {
  id: string;
  title: string;
  type: string;
  price: number;
  neighborhood: string;
  city: string;
}

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (leadData: Lead) => void;
  lead?: Lead | null;
  initialStatus?: string;
  employees: Employee[];
  properties: Property[];
  loading?: boolean;
}

const statusOptions = [
  { value: 'NEW', label: 'Novo', color: 'bg-blue-100 text-blue-800' },
  { value: 'CONTACTED', label: 'Contatado', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'QUALIFIED', label: 'Qualificado', color: 'bg-purple-100 text-purple-800' },
  { value: 'PROPOSAL', label: 'Proposta', color: 'bg-orange-100 text-orange-800' },
  { value: 'CLOSED', label: 'Fechado', color: 'bg-green-100 text-green-800' },
  { value: 'LOST', label: 'Perdido', color: 'bg-red-100 text-red-800' }
];

const sourceOptions = [
  { value: 'WEBSITE', label: 'Website', icon: '🌐' },
  { value: 'PHONE', label: 'Telefone', icon: '📞' },
  { value: 'EMAIL', label: 'Email', icon: '📧' },
  { value: 'REFERRAL', label: 'Indicação', icon: '👥' },
  { value: 'SOCIAL', label: 'Redes Sociais', icon: '📱' },
  { value: 'WALK_IN', label: 'Visita', icon: '🚶' }
];

export function LeadModal({
  isOpen,
  onClose,
  onSave,
  lead,
  initialStatus,
  employees,
  properties,
  loading = false
}: LeadModalProps) {
  const [formData, setFormData] = useState<Lead>({
    name: '',
    email: '',
    phone: '',
    status: initialStatus || 'NEW',
    source: 'WEBSITE',
    interest: '',
    budget: undefined,
    notes: '',
    agentId: '',
    propertyId: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lead) {
      setFormData({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        source: lead.source,
        interest: lead.interest,
        budget: lead.budget,
        notes: lead.notes,
        agentId: lead.agentId || '',
        propertyId: lead.propertyId || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: initialStatus || 'NEW',
        source: 'WEBSITE',
        interest: '',
        budget: undefined,
        notes: '',
        agentId: '',
        propertyId: ''
      });
    }
    setErrors({});
  }, [lead, initialStatus, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData.interest.trim() && !formData.propertyId) {
      newErrors.interest = 'Interesse ou propriedade deve ser informado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const saveData = {
      ...formData,
      budget: formData.budget || undefined
    };

    onSave(saveData);
  };

  const selectedProperty = properties.find(p => p.id === formData.propertyId);
  const selectedAgent = employees.find(e => e.id === formData.agentId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {lead ? 'Editar Lead' : 'Novo Lead'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário Principal */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: João Silva Santos"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="joao@email.com"
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                        className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="budget">Orçamento</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        budget: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      placeholder="500000"
                      className="pl-10"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Valor em reais que o cliente pretende investir
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Interesse & Configurações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center gap-2">
                              <Badge className={status.color}>{status.label}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="source">Origem</Label>
                    <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceOptions.map(source => (
                          <SelectItem key={source.value} value={source.value}>
                            <div className="flex items-center gap-2">
                              <span>{source.icon}</span>
                              <span>{source.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="property">Propriedade de Interesse</Label>
                  <Select value={formData.propertyId} onValueChange={(value) => setFormData(prev => ({ ...prev, propertyId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma propriedade (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhuma propriedade específica</SelectItem>
                      {properties.map(property => (
                        <SelectItem key={property.id} value={property.id}>
                          <div className="flex items-center justify-between w-full">
                            <span className="truncate">{property.title}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              R$ {property.price.toLocaleString('pt-BR')}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="interest">Interesse Geral</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="interest"
                      value={formData.interest}
                      onChange={(e) => setFormData(prev => ({ ...prev, interest: e.target.value }))}
                      placeholder="Ex: Casa 3 quartos na Zona Sul"
                      className={`pl-10 ${errors.interest ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.interest && <p className="text-sm text-red-500 mt-1">{errors.interest}</p>}
                </div>

                <div>
                  <Label htmlFor="agent">Consultor Responsável</Label>
                  <Select value={formData.agentId} onValueChange={(value) => setFormData(prev => ({ ...prev, agentId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um consultor" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{employee.name} - {employee.position}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Observações sobre o cliente, preferências, histórico..."
                      className="pl-10 min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Preview do Lead</CardTitle>
              </CardHeader>
              <CardContent>
                {formData.name ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          {formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{formData.name}</h3>
                        <Badge className={statusOptions.find(s => s.value === formData.status)?.color}>
                          {statusOptions.find(s => s.value === formData.status)?.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.email || 'Email não informado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{formData.phone || 'Telefone não informado'}</span>
                      </div>
                      {formData.budget && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium">R$ {formData.budget.toLocaleString('pt-BR')}</span>
                        </div>
                      )}
                    </div>

                    {selectedProperty && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-2">Propriedade de Interesse:</h4>
                        <div className="text-sm">
                          <p className="font-medium">{selectedProperty.title}</p>
                          <p className="text-muted-foreground">{selectedProperty.neighborhood}</p>
                          <p className="text-green-600 font-semibold">
                            R$ {selectedProperty.price.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    )}

                    {formData.interest && (
                      <div className="text-sm">
                        <span className="font-medium">Interesse: </span>
                        <span>{formData.interest}</span>
                      </div>
                    )}

                    {selectedAgent && (
                      <div className="text-sm">
                        <span className="font-medium">Consultor: </span>
                        <span>{selectedAgent.name}</span>
                      </div>
                    )}

                    <div className="text-sm">
                      <span className="font-medium">Origem: </span>
                      <span>
                        {sourceOptions.find(s => s.value === formData.source)?.icon}{' '}
                        {sourceOptions.find(s => s.value === formData.source)?.label}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Preencha os dados para ver o preview do lead
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Lead'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
