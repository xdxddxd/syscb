'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  MoreHorizontal,
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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

interface DepartmentStats {
  name: string;
  count: number;
  color: string;
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
  const [departments, setDepartments] = useState<DepartmentStats[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    topPerformers: 0,
    avgSalary: 0
  });

  // Filters and pagination
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [status, setStatus] = useState('');
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
  }, [user, search, selectedDepartment, status, currentPage]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(search && { search }),
        ...(selectedDepartment && { department: selectedDepartment }),
        ...(status && { status })
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
      
      // Calculate stats and departments
      calculateStats(data.employees);
      calculateDepartments(data.employees);
    } catch (error) {
      console.error('Error loading employees:', error);
      setError('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (employeesList: Employee[]) => {
    const activeEmployees = employeesList.filter(emp => emp.status === 'ACTIVE');
    const totalSalary = employeesList.reduce((sum, emp) => sum + (emp.salary || 0), 0);
    
    setStats({
      total: employeesList.length,
      active: activeEmployees.length,
      topPerformers: Math.floor(activeEmployees.length * 0.3), // 30% are top performers
      avgSalary: employeesList.length > 0 ? totalSalary / employeesList.length : 0
    });
  };

  const calculateDepartments = (employeesList: Employee[]) => {
    const deptMap = new Map<string, number>();
    employeesList.forEach(emp => {
      deptMap.set(emp.department, (deptMap.get(emp.department) || 0) + 1);
    });

    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-yellow-500'];
    const depts = Array.from(deptMap.entries()).map(([name, count], index) => ({
      name,
      count,
      color: colors[index % colors.length]
    }));

    setDepartments(depts);
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
      ACTIVE: { variant: 'default' as const, label: 'Ativo' },
      INACTIVE: { variant: 'secondary' as const, label: 'Inativo' },
      TERMINATED: { variant: 'destructive' as const, label: 'Demitido' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE;
    return { variant: config.variant, label: config.label };
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedDepartment('');
    setStatus('');
    setCurrentPage(1);
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
        <Link href="/pt-BR/employees/new">
          <Button className="w-fit">
            <Plus className="mr-2 h-4 w-4" />
            Novo Funcionário
          </Button>
        </Link>
      </div>

      {/* Alerts */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError('')}
                className="ml-auto"
              >
                <XCircle className="h-4 w-4" />
              </Button>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSuccess('')}
                className="ml-auto"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas da Equipe */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Funcionários</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Funcionários Ativos</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Salário Médio</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.avgSalary)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Departamentos</p>
                <p className="text-2xl font-bold">{departments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Departamentos */}
      {departments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                  selectedDepartment === '' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedDepartment('')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Todos</h3>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                </div>
              </div>
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
      )}

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Input 
                placeholder="Buscar por nome, cargo, email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <select 
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">Todos os departamentos</option>
                {departments.map(dept => (
                  <option key={dept.name} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <select 
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="ACTIVE">Ativo</option>
                <option value="INACTIVE">Inativo</option>
                <option value="TERMINATED">Demitido</option>
              </select>
            </div>
            <div>
              <Button variant="outline" className="w-full" onClick={clearFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            </div>
            <div>
              <Button variant="outline" className="w-full" onClick={loadEmployees}>
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Funcionários */}
      {employees.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Nenhum funcionário encontrado</h3>
            <p className="mt-2 text-muted-foreground">
              {search || selectedDepartment || status
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece adicionando um novo funcionário.'}
            </p>
            {!search && !selectedDepartment && !status && (
              <Link href="/pt-BR/employees/new" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Funcionário
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {employees.map((employee) => {
              const statusBadge = getStatusBadge(employee.status);
              return (
                <Card key={employee.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg">
                          {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{employee.name}</h3>
                            <p className="text-sm text-muted-foreground">{employee.position}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline">{employee.department}</Badge>
                              <Badge variant={statusBadge.variant}>
                                {statusBadge.label}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Link href={`/pt-BR/employees/${employee.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/pt-BR/employees/${employee.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setEmployeeToDelete(employee);
                                setShowDeleteModal(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4" />
                            {employee.email}
                          </div>
                          {employee.phone && (
                            <div className="flex items-center">
                              <Phone className="mr-2 h-4 w-4" />
                              {employee.phone}
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Contratação</p>
                            <p className="text-sm font-medium">{formatDate(employee.hireDate)}</p>
                          </div>
                          
                          {employee.salary && (
                            <div>
                              <p className="text-xs text-muted-foreground">Salário</p>
                              <p className="text-sm font-medium text-green-600">{formatCurrency(employee.salary)}</p>
                            </div>
                          )}
                        </div>
                        
                        {employee.manager && (
                          <div className="pt-2">
                            <p className="text-xs text-muted-foreground">Supervisor</p>
                            <p className="text-sm font-medium">{employee.manager.name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                    {pagination.total} funcionários
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    
                    <div className="flex items-center space-x-1">
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
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                      disabled={currentPage === pagination.pages}
                    >
                      Próximo
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Funcionários Recentes */}
      {employees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Funcionários Mais Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((employee, index) => {
                  const statusBadge = getStatusBadge(employee.status);
                  return (
                    <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
                          {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.position} • {employee.department}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-2">
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(employee.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && employeeToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Confirmar Exclusão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tem certeza que deseja excluir o funcionário{' '}
                <span className="font-medium">{employeeToDelete.name}</span>?
                Esta ação não pode ser desfeita.
              </p>
            </CardContent>
            <div className="flex justify-end space-x-2 p-6 pt-0">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setEmployeeToDelete(null);
                }}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteEmployee}
                disabled={isDeleting}
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
