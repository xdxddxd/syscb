'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Save,
  Plus
} from 'lucide-react';

interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  rg: string;
  birthDate: string;
  address: string;
  position: string;
  department: string;
  creci: string;
  salary: string;
  commissionRate: string;
  hireDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
  managerId: string;
  notes: string;
}

export default function NewEmployeePage() {
  const { user, loading: isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [managers, setManagers] = useState<any[]>([]);

  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    rg: '',
    birthDate: '',
    address: '',
    position: '',
    department: '',
    creci: '',
    salary: '',
    commissionRate: '',
    hireDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    managerId: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<EmployeeFormData>>({});

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/pt-BR/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadManagers();
    }
  }, [user]);

  const loadManagers = async () => {
    try {
      const response = await fetch('/api/employees?limit=100', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setManagers(data.employees);
      }
    } catch (error) {
      console.error('Error loading managers:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EmployeeFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    if (!formData.position.trim()) newErrors.position = 'Cargo é obrigatório';
    if (!formData.department.trim()) newErrors.department = 'Departamento é obrigatório';
    if (!formData.hireDate) newErrors.hireDate = 'Data de contratação é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      const submitData = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''),
        phone: formData.phone || undefined,
        rg: formData.rg || undefined,
        birthDate: formData.birthDate || undefined,
        address: formData.address || undefined,
        creci: formData.creci || undefined,
        salary: formData.salary ? Number(formData.salary) : undefined,
        commissionRate: formData.commissionRate ? Number(formData.commissionRate) : undefined,
        managerId: formData.managerId || undefined,
        notes: formData.notes || undefined
      };

      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar funcionário');
      }

      setSuccess('Funcionário criado com sucesso!');
      setTimeout(() => router.push('/employees'), 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof EmployeeFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/employees">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Funcionário</h1>
          <p className="text-muted-foreground">Adicione um novo funcionário ao sistema</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="border-green-500">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-600">{success}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nome completo do funcionário"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@exemplo.com"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                  className={errors.cpf ? 'border-destructive' : ''}
                />
                {errors.cpf && <p className="text-sm text-destructive">{errors.cpf}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input
                  id="rg"
                  name="rg"
                  value={formData.rg}
                  onChange={handleInputChange}
                  placeholder="12.345.678-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Endereço completo"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Profissionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Cargo *</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Ex: Corretor, Gerente, Assistente"
                  className={errors.position ? 'border-destructive' : ''}
                />
                {errors.position && <p className="text-sm text-destructive">{errors.position}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Departamento *</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Ex: Vendas, Administrativo, Marketing"
                  className={errors.department ? 'border-destructive' : ''}
                />
                {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="creci">CRECI</Label>
                <Input
                  id="creci"
                  name="creci"
                  value={formData.creci}
                  onChange={handleInputChange}
                  placeholder="Número do CRECI"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hireDate">Data de Contratação *</Label>
                <Input
                  id="hireDate"
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleInputChange}
                  className={errors.hireDate ? 'border-destructive' : ''}
                />
                {errors.hireDate && <p className="text-sm text-destructive">{errors.hireDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salário (R$)</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commissionRate">Taxa de Comissão (%)</Label>
                <Input
                  id="commissionRate"
                  name="commissionRate"
                  type="number"
                  value={formData.commissionRate}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="ACTIVE">Ativo</option>
                  <option value="INACTIVE">Inativo</option>
                  <option value="TERMINATED">Demitido</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="managerId">Gerente/Supervisor</Label>
                <select
                  id="managerId"
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="">Selecione um gerente</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} - {manager.position}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Observações adicionais sobre o funcionário"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <Link href="/employees">
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Criando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Criar Funcionário
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
