'use client';
import { create } from 'zustand';
import { Branch, BranchFormData } from '@/types/branch';

interface BranchState {
  branches: Branch[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchBranches: () => Promise<void>;
  addBranch: (branch: BranchFormData) => Promise<void>;
  updateBranch: (id: string, branch: Partial<BranchFormData>) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
  getBranchById: (id: string) => Branch | undefined;
}

// Mock data
const mockBranches: Branch[] = [
  {
    id: 'branch-1',
    name: 'Matriz São Paulo',
    code: 'SP001',
    address: {
      street: 'Av. Paulista',
      number: '1000',
      complement: 'Sala 100',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      country: 'Brasil'
    },
    contact: {
      phone: '(11) 3456-7890',
      email: 'sp@empresa.com.br',
      website: 'www.empresa.com.br'
    },
    manager: {
      id: 'user-1',
      name: 'João Silva',
      email: 'joao.silva@empresa.com.br'
    },
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    settings: {
      timezone: 'America/Sao_Paulo',
      currency: 'BRL',
      language: 'pt-BR'
    }
  },
  {
    id: 'branch-2',
    name: 'Filial Rio de Janeiro',
    code: 'RJ001',
    address: {
      street: 'Av. Copacabana',
      number: '500',
      neighborhood: 'Copacabana',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22070-011',
      country: 'Brasil'
    },
    contact: {
      phone: '(21) 2345-6789',
      email: 'rj@empresa.com.br'
    },
    manager: {
      id: 'user-2',
      name: 'Maria Santos',
      email: 'maria.santos@empresa.com.br'
    },
    isActive: true,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
    settings: {
      timezone: 'America/Sao_Paulo',
      currency: 'BRL',
      language: 'pt-BR'
    }
  }
];

export const useBranchStore = create<BranchState>((set, get) => ({
  branches: [],
  loading: false,
  error: null,

  fetchBranches: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ branches: mockBranches, loading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar filiais', loading: false });
    }
  },

  addBranch: async (branchData: BranchFormData) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newBranch: Branch = {
        ...branchData,
        id: `branch-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      set(state => ({
        branches: [...state.branches, newBranch],
        loading: false
      }));
    } catch (error) {
      set({ error: 'Erro ao criar filial', loading: false });
    }
  },

  updateBranch: async (id: string, branchData: Partial<BranchFormData>) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        branches: state.branches.map(branch =>
          branch.id === id
            ? { ...branch, ...branchData, updatedAt: new Date().toISOString() }
            : branch
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Erro ao atualizar filial', loading: false });
    }
  },

  deleteBranch: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        branches: state.branches.filter(branch => branch.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Erro ao excluir filial', loading: false });
    }
  },

  getBranchById: (id: string) => {
    return get().branches.find(branch => branch.id === id);
  }
}));
