'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useBranchStore } from '@/stores/branchStore';
import { Branch, BranchFormData } from '@/types/branch';
import { BranchDataTable } from '@/components/branches/BranchDataTableNew';
import { BranchForm } from '@/components/branches/BranchForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, XCircle, CheckCircle, Building2, Plus } from 'lucide-react';

export default function BranchesPage() {
  const { user, loading: isLoading } = useAuth();
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | undefined>(undefined);
  const [success, setSuccess] = useState('');

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
    if (!isLoading && !user) {
      router.push('/pt-BR/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchBranches();
    }
  }, [user, fetchBranches]);

  const handleAdd = () => {
    setEditingBranch(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setIsFormOpen(true);
  };

  const handleSave = async (branchData: BranchFormData) => {
    try {
      if (editingBranch) {
        await updateBranch(editingBranch.id, branchData);
        setSuccess('Filial atualizada com sucesso');
      } else {
        await addBranch(branchData);
        setSuccess('Filial criada com sucesso');
      }
      setIsFormOpen(false);
      setEditingBranch(undefined);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleDelete = async (branchId: string) => {
    try {
      await deleteBranch(branchId);
      setSuccess('Filial excluída com sucesso');
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBranch(undefined);
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
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Filiais</h1>
          <p className="text-muted-foreground">
            Gerencie suas filiais e pontos de atendimento
          </p>
        </div>
        <Button onClick={handleAdd} className="w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Nova Filial
        </Button>
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
                onClick={() => window.location.reload()}
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

      {/* Branch Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total de Filiais</p>
                <p className="text-2xl font-bold">{branches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Filiais Ativas</p>
                <p className="text-2xl font-bold">{branches.filter(b => b.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Filiais Inativas</p>
                <p className="text-2xl font-bold">{branches.filter(b => !b.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branches Table */}
      <BranchDataTable
        data={branches}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Branch Form Modal */}
      <BranchForm
        branch={editingBranch}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
      />
    </div>
  );
}
