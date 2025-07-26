'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Shield, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle,
  XCircle,
  Settings,
  UserPlus,
  Key
} from 'lucide-react';

// Interface for employees from API
interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  creci?: string;
  email: string;
  isActive: boolean;
  status: string;
}

// Sistema de módulos com permissões CRUD
const systemModules = [
  { id: 'dashboard', name: 'Dashboard', description: 'Página inicial e métricas gerais' },
  { id: 'properties', name: 'Imóveis', description: 'Gestão de propriedades e cadastros' },
  { id: 'clients', name: 'Clientes', description: 'CRM e gestão de leads' },
  { id: 'contracts', name: 'Contratos', description: 'Criação e gestão de contratos' },
  { id: 'financial', name: 'Financeiro', description: 'Dashboard financeiro e relatórios' },
  { id: 'reports', name: 'Relatórios', description: 'Análises e reports detalhados' },
  { id: 'employees', name: 'Funcionários', description: 'Gestão de equipe e ponto' },
  { id: 'marketing', name: 'Marketing', description: 'Campanhas e marketing digital' },
  { id: 'users', name: 'Usuários', description: 'Gestão de usuários do sistema' },
  { id: 'settings', name: 'Configurações', description: 'Configurações gerais do sistema' },
  { id: 'support', name: 'Suporte', description: 'Central de suporte e tickets' }
];

const permissionTypes = [
  { id: 'create', name: 'Criar', description: 'Adicionar novos registros' },
  { id: 'read', name: 'Visualizar', description: 'Ver e consultar informações' },
  { id: 'update', name: 'Editar', description: 'Modificar registros existentes' },
  { id: 'delete', name: 'Excluir', description: 'Remover registros do sistema' }
];

export default function UsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Todos');
  const [users, setUsers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPermissions, setShowPermissions] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    role: string;
    employeeId: string;
    isActive: boolean;
    permissions: { [key: string]: { [key: string]: boolean } };
  }>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    employeeId: '',
    isActive: true,
    permissions: {}
  });
  
  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/pt-BR/login');
    }
  }, [user, authLoading, router]);

  // Initialize permissions for new user
  useEffect(() => {
    if (showForm && !editingUser) {
      const initialPermissions: { [key: string]: { [key: string]: boolean } } = {};
      systemModules.forEach(module => {
        initialPermissions[module.id] = {
          create: false,
          read: true, // Default read permission
          update: false,
          delete: false
        };
      });
      setFormData(prev => ({ ...prev, permissions: initialPermissions }));
    }
  }, [showForm, editingUser]);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
    loadEmployees();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
      } else {
        console.error('Failed to load users');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await fetch('/api/employees/list?active=true');
      if (response.ok) {
        const employeesData = await response.json();
        setEmployees(employeesData);
      } else {
        console.error('Failed to load employees');
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      setEmployees([]);
    }
  };

  // Check permissions for user management
  const canManageUsers = user?.permissions?.users?.update || user?.role === 'admin';

  if (authLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg p-6 flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Verificando autenticação...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const handlePermissionChange = (moduleId: string, permissionType: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleId]: {
          ...prev.permissions[moduleId],
          [permissionType]: value
        }
      }
    }));
  };

  const handleSelectAllPermissions = (moduleId: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleId]: {
          create: value,
          read: value,
          update: value,
          delete: value
        }
      }
    }));
  };

  const handleAdd = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      employeeId: user.employeeId,
      isActive: user.isActive,
      permissions: user.permissions || {}
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const method = editingUser ? 'PUT' : 'POST';
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: editingUser?.id
        }),
      });

      if (response.ok) {
        const savedUser = await response.json();
        
        if (editingUser) {
          // Update existing user
          setUsers(prev => prev.map(user => 
            user.id === editingUser.id ? savedUser : user
          ));
        } else {
          // Add new user
          setUsers(prev => [...prev, savedUser]);
        }

        setShowForm(false);
        setEditingUser(null);
        setFormData({
          name: '',
          email: '',
          phone: '',
          role: 'user',
          employeeId: '',
          isActive: true,
          permissions: {}
        });
        
        alert(editingUser ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
      } else {
        const error = await response.json();
        alert(`Erro ao salvar usuário: ${error.message}`);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Erro ao salvar usuário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(prev => prev.filter(user => user.id !== userId));
        alert('Usuário excluído com sucesso!');
      } else {
        const error = await response.json();
        alert(`Erro ao excluir usuário: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erro ao excluir usuário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPermissions = (user: any) => {
    setShowPermissions(user.id);
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, isActive: !currentStatus } : user
        ));
        alert(`Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
      } else {
        const error = await response.json();
        alert(`Erro ao alterar status: ${error.message}`);
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Erro ao alterar status. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'manager': return 'bg-blue-100 text-blue-700';
      case 'user': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'user': return 'Usuário';
      default: return 'Desconhecido';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'Todos' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Carregando...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Usuários</h1>
          <p className="text-slate-600">Gerencie usuários e suas permissões no sistema</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2" disabled={!canManageUsers}>
          <UserPlus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Todos">Todos os Papéis</option>
                <option value="admin">Administrador</option>
                <option value="manager">Gerente</option>
                <option value="user">Usuário</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-slate-600">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleName(user.role)}
                      </Badge>
                      {user.isActive ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ativo
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inativo
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {user.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {user.employeeName ? `${user.employeeName} - ${user.employeePosition || ''}` : 'Não vinculado'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Último acesso: {user.lastLogin}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewPermissions(user)}
                    title="Ver permissões"
                  >
                    <Shield className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(user)}
                    title="Editar usuário"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                    title={user.isActive ? 'Desativar usuário' : 'Ativar usuário'}
                    className={user.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}
                  >
                    {user.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(user.id)}
                    title="Excluir usuário"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-slate-600 mb-4">Não há usuários que correspondam aos filtros aplicados.</p>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Usuário
            </Button>
          </CardContent>
        </Card>
      )}

      {/* User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-black rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Básicas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome Completo</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Digite o nome completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Digite o email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Papel do Usuário</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">Usuário</option>
                      <option value="manager">Gerente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>

                {/* Employee Linking */}
                <div>
                  <label className="block text-sm font-medium mb-2">Vincular a Funcionário</label>
                  <select
                    value={formData.employeeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um funcionário</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} - {employee.position} {employee.creci ? `(CRECI: ${employee.creci})` : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Vinculação a um funcionário permite acesso aos dados de vendas e comissões
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Usuário ativo
                  </label>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Permissões do Sistema
                </h3>
                
                <div className="space-y-4">
                  {systemModules.map((module) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{module.name}</h4>
                          <p className="text-sm text-slate-600">{module.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const allSelected = formData.permissions[module.id] && 
                              Object.values(formData.permissions[module.id]).every(Boolean);
                            handleSelectAllPermissions(module.id, !allSelected);
                          }}
                        >
                          {formData.permissions[module.id] && 
                           Object.values(formData.permissions[module.id]).every(Boolean) 
                            ? 'Desmarcar Todas' 
                            : 'Marcar Todas'}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {permissionTypes.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`${module.id}-${permission.id}`}
                              checked={formData.permissions[module.id]?.[permission.id] || false}
                              onChange={(e) => handlePermissionChange(module.id, permission.id, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                            />
                            <label 
                              htmlFor={`${module.id}-${permission.id}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {permission.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t bg-slate-50 dark:bg-black flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowForm(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                disabled={loading || !formData.name || !formData.email}
              >
                {loading ? 'Salvando...' : editingUser ? 'Atualizar' : 'Criar'} Usuário
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions View Modal */}
      {showPermissions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Permissões do Usuário
                </h2>
                <Button variant="outline" size="sm" onClick={() => setShowPermissions(null)}>
                  ×
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {(() => {
                const user = users.find(u => u.id === showPermissions);
                if (!user) return <p>Usuário não encontrado</p>;
                
                return (
                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <h3 className="font-medium text-lg">{user.name}</h3>
                      <p className="text-slate-600 dark:text-slate-300">{user.email}</p>
                      <Badge className={getRoleColor(user.role)} variant="secondary">
                        {getRoleName(user.role)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {systemModules.map((module) => {
                        const modulePermissions = user.permissions?.[module.id] || {};
                        const hasAnyPermission = Object.values(modulePermissions).some(Boolean);
                        
                        return (
                          <div key={module.id} className={`border rounded-lg p-4 ${hasAnyPermission ? 'bg-green-50 dark:bg-green-900/20' : 'bg-slate-50 dark:bg-slate-700'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{module.name}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300">{module.description}</p>
                              </div>
                              {!hasAnyPermission && (
                                <Badge variant="outline" className="text-slate-500">
                                  Sem acesso
                                </Badge>
                              )}
                            </div>
                            
                            {hasAnyPermission && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {permissionTypes.map((permission) => (
                                  <div key={permission.id} className="flex items-center space-x-2">
                                    {modulePermissions[permission.id] ? (
                                      <Badge className="bg-green-100 text-green-700">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        {permission.name}
                                      </Badge>
                                    ) : (
                                      <span className="text-sm text-slate-400">
                                        {permission.name}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
