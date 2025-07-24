'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  UserGroupIcon,
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user, loading: isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    {
      title: 'Funcionários',
      description: 'Gerencie todos os funcionários da empresa',
      href: '/employees',
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      stats: 'CRUD Completo'
    },
    {
      title: 'Usuários',
      description: 'Controle de acesso e permissões',
      href: '/users',
      icon: UsersIcon,
      color: 'bg-green-500',
      stats: 'Sistema Completo'
    },
    {
      title: 'Relatórios',
      description: 'Análises e relatórios detalhados',
      href: '/reports',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      stats: 'Em breve'
    },
    {
      title: 'Financeiro',
      description: 'Controle financeiro e comissões',
      href: '/financial',
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
      stats: 'Em desenvolvimento'
    },
    {
      title: 'Imóveis',
      description: 'Gestão de propriedades e vendas',
      href: '/properties',
      icon: BuildingOfficeIcon,
      color: 'bg-red-500',
      stats: 'Planejado'
    },
    {
      title: 'Documentos',
      description: 'Gerenciamento de documentos',
      href: '/documents',
      icon: DocumentTextIcon,
      color: 'bg-indigo-500',
      stats: 'Planejado'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Bem-vindo de volta, {user.name || user.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name || 'Usuário'}</p>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Módulos do Sistema</h2>
          <p className="text-gray-600">
            Acesse os diferentes módulos do sistema de gestão
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isAvailable = item.href === '/employees' || item.href === '/users';
            
            return (
              <div
                key={item.title}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                  !isAvailable ? 'opacity-60' : ''
                }`}
              >
                {isAvailable ? (
                  <Link href={item.href} className="block p-6">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 p-3 rounded-lg ${item.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.stats === 'CRUD Completo' || item.stats === 'Sistema Completo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.stats}
                          </span>
                          <ArrowRightIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="block p-6 cursor-not-allowed">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 p-3 rounded-lg ${item.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.stats}
                          </span>
                          <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Status do Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Funcionários</p>
                  <p className="text-2xl font-semibold text-gray-900">Sistema Ativo</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Usuários</p>
                  <p className="text-2xl font-semibold text-gray-900">Autenticação OK</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Database</p>
                  <p className="text-2xl font-semibold text-gray-900">PostgreSQL</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">API</p>
                  <p className="text-2xl font-semibold text-gray-900">Operacional</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Recursos Implementados</h3>
          <div className="bg-white shadow rounded-lg">
            <ul className="divide-y divide-gray-200">
              <li className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Sistema de Funcionários</span> - CRUD completo implementado
                  </p>
                </div>
              </li>
              <li className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Autenticação JWT</span> - Sistema de login seguro
                  </p>
                </div>
              </li>
              <li className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Gerenciamento de Usuários</span> - Controle de acesso
                  </p>
                </div>
              </li>
              <li className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Database PostgreSQL</span> - Prisma ORM configurado
                  </p>
                </div>
              </li>
              <li className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">UI/UX Responsivo</span> - Interface moderna com Tailwind CSS
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
