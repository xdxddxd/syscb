'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  IdentificationIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf: string;
  rg?: string;
  birthDate?: string;
  address?: string;
  position: string;
  department: string;
  creci?: string;
  salary?: number;
  commissionRate?: number;
  hireDate: string;
  terminationDate?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
  managerId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  manager?: {
    id: string;
    name: string;
    position: string;
  };
  subordinates?: {
    id: string;
    name: string;
    position: string;
  }[];
}

export default function EmployeeDetailsPage({ params }: { params: { id: string } }) {
  const { user, loading: isLoading } = useAuth();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && params.id) {
      loadEmployee();
    }
  }, [user, params.id]);

  const loadEmployee = async () => {
    try {
      setLoading(true);
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

      const data = await response.json();
      setEmployee(data);
    } catch (error) {
      console.error('Error loading employee:', error);
      setError('Erro ao carregar funcionário');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!employee) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir funcionário');
      }

      setSuccess('Funcionário excluído com sucesso');
      setTimeout(() => {
        router.push('/pt/employees');
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { color: 'bg-green-100 text-green-800', label: 'Ativo' },
      INACTIVE: { color: 'bg-yellow-100 text-yellow-800', label: 'Inativo' },
      TERMINATED: { color: 'bg-red-100 text-red-800', label: 'Demitido' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error && !employee) {
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
              href="/pt/employees"
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

  if (!employee) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/pt/employees"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Voltar para Funcionários
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
                <div className="flex items-center space-x-3 mt-1">
                  <p className="text-lg text-gray-600">{employee.position}</p>
                  {getStatusBadge(employee.status)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                href={`/pt/employees/${employee.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Editar
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Excluir
              </button>
            </div>
          </div>
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
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">{employee.email}</p>
                  </div>
                </div>

                {employee.phone && (
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Telefone</p>
                      <p className="text-sm text-gray-500">{employee.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <IdentificationIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">CPF</p>
                    <p className="text-sm text-gray-500">{formatCPF(employee.cpf)}</p>
                  </div>
                </div>

                {employee.rg && (
                  <div className="flex items-center space-x-3">
                    <IdentificationIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">RG</p>
                      <p className="text-sm text-gray-500">{employee.rg}</p>
                    </div>
                  </div>
                )}

                {employee.birthDate && (
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Data de Nascimento</p>
                      <p className="text-sm text-gray-500">{formatDate(employee.birthDate)}</p>
                    </div>
                  </div>
                )}

                {employee.address && (
                  <div className="flex items-start space-x-3 md:col-span-2">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Endereço</p>
                      <p className="text-sm text-gray-500">{employee.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Profissionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Cargo</p>
                    <p className="text-sm text-gray-500">{employee.position}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Departamento</p>
                    <p className="text-sm text-gray-500">{employee.department}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Data de Contratação</p>
                    <p className="text-sm text-gray-500">{formatDate(employee.hireDate)}</p>
                  </div>
                </div>

                {employee.terminationDate && (
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Data de Demissão</p>
                      <p className="text-sm text-gray-500">{formatDate(employee.terminationDate)}</p>
                    </div>
                  </div>
                )}

                {employee.creci && (
                  <div className="flex items-center space-x-3">
                    <IdentificationIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">CRECI</p>
                      <p className="text-sm text-gray-500">{employee.creci}</p>
                    </div>
                  </div>
                )}

                {employee.salary && (
                  <div className="flex items-center space-x-3">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Salário</p>
                      <p className="text-sm text-gray-500">{formatCurrency(employee.salary)}</p>
                    </div>
                  </div>
                )}

                {employee.commissionRate && (
                  <div className="flex items-center space-x-3">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Taxa de Comissão</p>
                      <p className="text-sm text-gray-500">{employee.commissionRate}%</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {employee.notes && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Observações
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{employee.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Manager */}
            {employee.manager && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Gerente/Supervisor
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{employee.manager.name}</p>
                    <p className="text-sm text-gray-500">{employee.manager.position}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Subordinates */}
            {employee.subordinates && employee.subordinates.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  Subordinados ({employee.subordinates.length})
                </h3>
                <div className="space-y-3">
                  {employee.subordinates.map((subordinate) => (
                    <div key={subordinate.id} className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{subordinate.name}</p>
                        <p className="text-xs text-gray-500">{subordinate.position}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audit Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Sistema</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Criado em</p>
                  <p className="text-sm text-gray-500">{formatDate(employee.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Última atualização</p>
                  <p className="text-sm text-gray-500">{formatDate(employee.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Confirmar Exclusão
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Tem certeza que deseja excluir o funcionário{' '}
                  <span className="font-medium">{employee.name}</span>?
                  Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteEmployee}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
