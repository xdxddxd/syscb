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

export const useBranchStore = create<BranchState>((set, get) => ({
  branches: [],
  loading: false,
  error: null,

  fetchBranches: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/branches', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar filiais');
      }

      const data = await response.json();
      set({ branches: data.branches, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Erro ao carregar filiais', loading: false });
    }
  },

  addBranch: async (branchData: BranchFormData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(branchData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar filial');
      }

      const newBranch = await response.json();
      set(state => ({
        branches: [...state.branches, newBranch],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Erro ao criar filial', loading: false });
      throw error;
    }
  },

  updateBranch: async (id: string, branchData: Partial<BranchFormData>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/branches/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(branchData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar filial');
      }

      const updatedBranch = await response.json();
      set(state => ({
        branches: state.branches.map(branch =>
          branch.id === id ? updatedBranch : branch
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Erro ao atualizar filial', loading: false });
      throw error;
    }
  },

  deleteBranch: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/branches/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir filial');
      }

      set(state => ({
        branches: state.branches.filter(branch => branch.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Erro ao excluir filial', loading: false });
      throw error;
    }
  },

  getBranchById: (id: string) => {
    return get().branches.find(branch => branch.id === id);
  }
}));
