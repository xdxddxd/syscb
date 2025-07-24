'use client';
import React, { useState, useEffect } from 'react';
import { useBranchStore } from '@/stores/branchStore';
import { Branch, BranchFormData } from '@/types/branch';
import { BranchDataTable } from '@/components/branches/BranchDataTableNew';
import { BranchForm } from '@/components/branches/BranchForm';

export default function BranchesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | undefined>(undefined);

  const { 
    branches, 
    loading, 
    error, 
    fetchBranches, 
    addBranch, 
    updateBranch, 
    deleteBranch 
  } = useBranchStore();

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleAdd = () => {
    setEditingBranch(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setIsFormOpen(true);
  };

  const handleSave = async (branchData: BranchFormData) => {
    if (editingBranch) {
      await updateBranch(editingBranch.id, branchData);
    } else {
      await addBranch(branchData);
    }
    setIsFormOpen(false);
    setEditingBranch(undefined);
  };

  const handleDelete = async (branchId: string) => {
    await deleteBranch(branchId);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBranch(undefined);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-destructive">Erro: {error}</div>
          <button 
            onClick={fetchBranches}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BranchDataTable
        data={branches}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <BranchForm
        branch={editingBranch}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
      />
    </div>
  );
}
