'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

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
  terminationDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
  managerId: string;
  notes: string;
}

export default function EditEmployeePage({ params }: { params: { id: string } }) {
  const { user, loading: isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
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
    hireDate: '',
    terminationDate: '',
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
    if (user && params.id) {
      loadEmployee();
      loadManagers();
    }
  }, [user, params.id]);

  const loadEmployee = async () => {
    try {
      setLoadingData(true);
      const response = await fetch(`/api/employees/${params.id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Funcionário não encontrado');
        } else {
          throw new Error('Erro ao carregar funcionário');
        }
        return;
      }

      const employee = await response.json();
      
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        cpf: employee.cpf || '',
        rg: employee.rg || '',
        birthDate: employee.birthDate ? employee.birthDate.split('T')[0] : '',
        address: employee.address || '',
        position: employee.position || '',
        department: employee.department || '',
        creci: employee.creci || '',
        salary: employee.salary ? employee.salary.toString() : '',
        commissionRate: employee.commissionRate ? employee.commissionRate.toString() : '',
        hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
        terminationDate: employee.terminationDate ? employee.terminationDate.split('T')[0] : '',
        status: employee.status || 'ACTIVE',
        managerId: employee.managerId || '',
        notes: employee.notes || ''
      });
    } catch (error) {
      console.error('Error loading employee:', error);
      setError('Erro ao carregar funcionário');
    } finally {
      setLoadingData(false);
    }
  };

  const loadManagers = async () => {
    try {
      const response = await fetch('/api/employees?limit=100', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        // Filter out current employee from managers list
        setManagers(data.employees.filter((emp: any) => emp.id !== params.id));
      }
    } catch (error) {
      console.error('Error loading managers:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EmployeeFormData> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{11}$/.test(formData.cpf.replace(/\D/g, ''))) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Cargo é obrigatório';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Departamento é obrigatório';
    }

    if (!formData.hireDate) {
      newErrors.hireDate = 'Data de contratação é obrigatória';
    }

    // Optional validations
    if (formData.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone deve estar no formato (11) 99999-9999';
    }

    if (formData.salary && (isNaN(Number(formData.salary)) || Number(formData.salary) < 0)) {
      newErrors.salary = 'Salário deve ser um número válido';
    }

    if (formData.commissionRate && (isNaN(Number(formData.commissionRate)) || Number(formData.commissionRate) < 0 || Number(formData.commissionRate) > 100)) {
      newErrors.commissionRate = 'Taxa de comissão deve ser entre 0 e 100';
    }

    if (formData.terminationDate && formData.hireDate && new Date(formData.terminationDate) < new Date(formData.hireDate)) {
      newErrors.terminationDate = 'Data de demissão deve ser posterior à data de contratação';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

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
        terminationDate: formData.terminationDate || undefined,
        managerId: formData.managerId || undefined,
        notes: formData.notes || undefined
      };

      const response = await fetch(`/api/employees/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar funcionário');
      }

      setSuccess('Funcionário atualizado com sucesso!');
      setTimeout(() => {
        router.push(`/pt-BR/employees/${params.id}`);
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Format CPF
    if (name === 'cpf') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    // Format phone
    if (name === 'phone') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof EmployeeFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error && loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/pt-BR/employees"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Voltar para Funcionários
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href={`/pt-BR/employees/${params.id}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Voltar para Funcionário
            </Link>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Editar Funcionário</h1>
          <p className="mt-2 text-gray-600">
            Atualize os dados do funcionário
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-600 p-1.5 hover:bg-red-100"
              >
                <span className="sr-only">Fechar</span>
                ×
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Nome completo do funcionário"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="email@exemplo.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                    CPF *
                  </label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.cpf ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                  {errors.cpf && (
                    <p className="mt-1 text-sm text-red-600">{errors.cpf}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="rg" className="block text-sm font-medium text-gray-700 mb-1">
                    RG
                  </label>
                  <input
                    type="text"
                    id="rg"
                    name="rg"
                    value={formData.rg}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="12.345.678-9"
                  />
                </div>

                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Endereço completo"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Profissionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo *
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.position ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Corretor, Gerente, Assistente"
                  />
                  {errors.position && (
                    <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Departamento *
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.department ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Vendas, Administrativo, Marketing"
                  />
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="creci" className="block text-sm font-medium text-gray-700 mb-1">
                    CRECI
                  </label>
                  <input
                    type="text"
                    id="creci"
                    name="creci"
                    value={formData.creci}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Número do CRECI"
                  />
                </div>

                <div>
                  <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Contratação *
                  </label>
                  <input
                    type="date"
                    id="hireDate"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.hireDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.hireDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.hireDate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="terminationDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Demissão
                  </label>
                  <input
                    type="date"
                    id="terminationDate"
                    name="terminationDate"
                    value={formData.terminationDate}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.terminationDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.terminationDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.terminationDate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                    Salário (R$)
                  </label>
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.salary ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.salary && (
                    <p className="mt-1 text-sm text-red-600">{errors.salary}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Taxa de Comissão (%)
                  </label>
                  <input
                    type="number"
                    id="commissionRate"
                    name="commissionRate"
                    value={formData.commissionRate}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.commissionRate ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  {errors.commissionRate && (
                    <p className="mt-1 text-sm text-red-600">{errors.commissionRate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ACTIVE">Ativo</option>
                    <option value="INACTIVE">Inativo</option>
                    <option value="TERMINATED">Demitido</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="managerId" className="block text-sm font-medium text-gray-700 mb-1">
                    Gerente/Supervisor
                  </label>
                  <select
                    id="managerId"
                    name="managerId"
                    value={formData.managerId}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione um gerente</option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name} - {manager.position}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Observações adicionais sobre o funcionário"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Link
                href={`/pt-BR/employees/${params.id}`}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
