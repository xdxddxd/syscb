'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon
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

interface EmployeesResponse {
  employees: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function EmployeesPage() {
  const { user, loading: isLoading } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters and pagination
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadEmployees();
    }
  }, [user, search, status, department, position, currentPage]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(search && { search }),
        ...(status && { status }),
        ...(department && { department }),
        ...(position && { position })
      });

      const response = await fetch(`/api/employees?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar funcionários');
      }

      const data: EmployeesResponse = await response.json();
      setEmployees(data.employees);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading employees:', error);
      setError('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/employees/${employeeToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir funcionário');
      }

      setSuccess('Funcionário excluído com sucesso');
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
      loadEmployees();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { color: 'bg-green-100 text-green-800', label: 'Ativo' },
      INACTIVE: { color: 'bg-yellow-100 text-yellow-800', label: 'Inativo' },
      TERMINATED: { color: 'bg-red-100 text-red-800', label: 'Demitido' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setDepartment('');
    setPosition('');
    setCurrentPage(1);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Funcionários</h1>
              <p className="mt-2 text-gray-600">
                Gerencie todos os funcionários da empresa
              </p>
            </div>
            <Link
              href="/employees/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Novo Funcionário
            </Link>
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
              <button
                onClick={() => setSuccess('')}
                className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-600 p-1.5 hover:bg-green-100"
              >
                <span className="sr-only">Fechar</span>
                ×
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nome, email, CPF..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="ACTIVE">Ativo</option>
                <option value="INACTIVE">Inativo</option>
                <option value="TERMINATED">Demitido</option>
              </select>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <input
                type="text"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Departamento"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Cargo
              </label>
              <input
                type="text"
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Cargo"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Employees List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {employees.length === 0 ? (
            <div className="text-center py-12">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum funcionário encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {search || status || department || position
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece adicionando um novo funcionário.'}
              </p>
              {!search && !status && !department && !position && (
                <div className="mt-6">
                  <Link
                    href="/employees/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Adicionar Funcionário
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-200">
                {employees.map((employee) => (
                  <li key={employee.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {employee.name}
                              </p>
                              {getStatusBadge(employee.status)}
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center text-sm text-gray-500">
                                <BriefcaseIcon className="h-4 w-4 mr-1" />
                                {employee.position}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                                {employee.department}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <EnvelopeIcon className="h-4 w-4 mr-1" />
                                {employee.email}
                              </div>
                              {employee.phone && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <PhoneIcon className="h-4 w-4 mr-1" />
                                  {employee.phone}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center text-sm text-gray-500">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                Contratado em {formatDate(employee.hireDate)}
                              </div>
                              {employee.salary && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                                  {formatCurrency(employee.salary)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/employees/${employee.id}`}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          title="Visualizar"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/employees/${employee.id}/edit`}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          title="Editar"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setEmployeeToDelete(employee);
                            setShowDeleteModal(true);
                          }}
                          className="inline-flex items-center p-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          title="Excluir"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                        disabled={currentPage === pagination.pages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próximo
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Mostrando{' '}
                          <span className="font-medium">
                            {((pagination.page - 1) * pagination.limit) + 1}
                          </span>{' '}
                          a{' '}
                          <span className="font-medium">
                            {Math.min(pagination.page * pagination.limit, pagination.total)}
                          </span>{' '}
                          de{' '}
                          <span className="font-medium">{pagination.total}</span>{' '}
                          resultados
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeftIcon className="h-5 w-5" />
                          </button>
                          
                          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                            let pageNum;
                            if (pagination.pages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= pagination.pages - 2) {
                              pageNum = pagination.pages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  pageNum === currentPage
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                            disabled={currentPage === pagination.pages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRightIcon className="h-5 w-5" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && employeeToDelete && (
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
                  <span className="font-medium">{employeeToDelete.name}</span>?
                  Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setEmployeeToDelete(null);
                  }}
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
