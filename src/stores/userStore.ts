'use client';
import { create } from 'zustand';
import { User, UserPermission, UserRole } from '@/types/user';

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  branchId: string;
  permissions: UserPermission[];
  phone?: string;
  salary?: number;
  commissionRate?: number;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchUsers: () => Promise<void>;
  addUser: (user: UserFormData) => Promise<void>;
  updateUser: (id: string, user: Partial<UserFormData>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getUserById: (id: string) => User | undefined;
}

// Mock data
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'João Silva',
    email: 'joao.silva@empresa.com.br',
    role: 'admin',
    isActive: true,
    branchId: 'branch-1',
    permissions: [
      {
        id: 'perm-1',
        userId: 'user-1',
        resource: 'users',
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true
      },
      {
        id: 'perm-2',
        userId: 'user-1',
        resource: 'branches',
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    phone: '(11) 99999-9999',
    salary: 8500
  },
  {
    id: 'user-2',
    name: 'Maria Santos',
    email: 'maria.santos@empresa.com.br',
    role: 'manager',
    isActive: true,
    branchId: 'branch-2',
    permissions: [
      {
        id: 'perm-3',
        userId: 'user-2',
        resource: 'users',
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false
      },
      {
        id: 'perm-4',
        userId: 'user-2',
        resource: 'branches',
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false
      }
    ],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
    phone: '(21) 88888-8888',
    salary: 6500
  },
  {
    id: 'user-3',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@empresa.com.br',
    role: 'agent',
    isActive: true,
    branchId: 'branch-1',
    permissions: [
      {
        id: 'perm-5',
        userId: 'user-3',
        resource: 'users',
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false
      }
    ],
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
    phone: '(11) 77777-7777',
    salary: 4500
  }
];

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ users: mockUsers, loading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar usuários', loading: false });
    }
  },

  addUser: async (userData: UserFormData) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      set(state => ({
        users: [...state.users, newUser],
        loading: false
      }));
    } catch (error) {
      set({ error: 'Erro ao criar usuário', loading: false });
    }
  },

  updateUser: async (id: string, userData: Partial<UserFormData>) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        users: state.users.map(user =>
          user.id === id
            ? { ...user, ...userData, updatedAt: new Date().toISOString() }
            : user
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Erro ao atualizar usuário', loading: false });
    }
  },

  deleteUser: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        users: state.users.filter(user => user.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Erro ao excluir usuário', loading: false });
    }
  },

  getUserById: (id: string) => {
    return get().users.find(user => user.id === id);
  }
}));
