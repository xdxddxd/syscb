'use client';

import { useState } from 'react';
import { LeadCard } from './LeadCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    source: string;
    interest: string;
    budget?: number;
    notes: string;
    createdAt: string;
    lastContactAt?: string;
    agent: {
        id: string;
        name: string;
        email: string;
    };
    property?: {
        id: string;
        title: string;
        type: string;
        price: number;
        neighborhood: string;
        city: string;
    };
    branch: {
        id: string;
        name: string;
    };
}

interface KanbanBoardProps {
    leads: Lead[];
    stats: Record<string, number>;
    onEditLead: (lead: Lead) => void;
    onDeleteLead: (leadId: string) => void;
    onStatusChange: (leadId: string, newStatus: string) => void;
    onCreateLead: (status: string) => void;
}

const statusColumns = [
    {
        key: 'NEW',
        title: 'Novos Leads',
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        description: 'Leads recém-cadastrados'
    },
    {
        key: 'CONTACTED',
        title: 'Contatados',
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-50',
        description: 'Primeiro contato realizado'
    },
    {
        key: 'QUALIFIED',
        title: 'Qualificados',
        color: 'bg-purple-500',
        bgColor: 'bg-purple-50',
        description: 'Interesse confirmado'
    },
    {
        key: 'PROPOSAL',
        title: 'Proposta',
        color: 'bg-orange-500',
        bgColor: 'bg-orange-50',
        description: 'Proposta enviada'
    },
    {
        key: 'CLOSED',
        title: 'Fechados',
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        description: 'Vendas concluídas'
    },
    {
        key: 'LOST',
        title: 'Perdidos',
        color: 'bg-red-500',
        bgColor: 'bg-red-50',
        description: 'Leads perdidos'
    }
];

export function KanbanBoard({
    leads,
    stats,
    onEditLead,
    onDeleteLead,
    onStatusChange,
    onCreateLead
}: KanbanBoardProps) {
    const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    const handleDragStart = (lead: Lead) => {
        setDraggedLead(lead);
    };

    const handleDragOver = (e: React.DragEvent, columnKey: string) => {
        e.preventDefault();
        setDragOverColumn(columnKey);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        if (draggedLead && draggedLead.status !== newStatus) {
            onStatusChange(draggedLead.id, newStatus);
        }
        setDraggedLead(null);
        setDragOverColumn(null);
    };

    const getLeadsByStatus = (status: string) => {
        return leads.filter(lead => lead.status === status);
    };

    const calculateConversionRate = (fromStatus: string, toStatus: string) => {
        const fromCount = stats[fromStatus] || 0;
        const toCount = stats[toStatus] || 0;
        if (fromCount === 0) return 0;
        return Math.round((toCount / fromCount) * 100);
    };

    const getTotalValue = (status: string) => {
        return getLeadsByStatus(status)
            .reduce((total, lead) => total + (lead.budget || 0), 0);
    };

    return (
        <div className="h-full">
            {/* Estilos personalizados para o scroll */}
            <style jsx>{`
                .kanban-scroll::-webkit-scrollbar {
                    height: 8px;
                }
                .kanban-scroll::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                .kanban-scroll::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 4px;
                }
                .kanban-scroll::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
            `}</style>
            
            {/* Header com métricas de conversão */}
            <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Taxa Conversão</p>
                            <p className="text-lg font-bold text-green-600">
                                {calculateConversionRate('NEW', 'CLOSED')}%
                            </p>
                        </div>
                        <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Valor Pipeline</p>
                            <p className="text-lg font-bold">
                                R$ {getTotalValue('QUALIFIED').toLocaleString('pt-BR')}
                            </p>
                        </div>
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Vendas Mês</p>
                            <p className="text-lg font-bold text-green-600">
                                R$ {getTotalValue('CLOSED').toLocaleString('pt-BR')}
                            </p>
                        </div>
                        <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Hot Leads</p>
                            <p className="text-lg font-bold text-orange-600">
                                {leads.filter(lead => lead.budget && lead.budget > 500000).length}
                            </p>
                        </div>
                        <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Taxa Perda</p>
                            <p className="text-lg font-bold text-red-600">
                                {calculateConversionRate('NEW', 'LOST')}%
                            </p>
                        </div>
                        <TrendingDown className="h-6 w-6 text-red-600" />
                    </div>
                </Card>
            </div>

            {/* Kanban Board */}
            <div className="w-full">
                <div className="kanban-scroll flex gap-6 overflow-x-auto pb-6 min-h-0" style={{ scrollbarWidth: 'thin' }}>
                    {statusColumns.map((column) => {
                        const columnLeads = getLeadsByStatus(column.key);
                        const columnValue = getTotalValue(column.key);
                        const isDragOver = dragOverColumn === column.key;

                        return (
                            <div
                                key={column.key}
                                className={`flex-shrink-0 w-72 min-w-72 ${isDragOver ? 'scale-105' : ''} transition-transform duration-200`}
                                onDragOver={(e) => handleDragOver(e, column.key)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, column.key)}
                            >
                                <Card className={`h-full min-h-[500px] ${isDragOver ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
                                    <CardHeader className={`${column.bgColor} rounded-t-lg`}>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                                                {column.title}
                                            </CardTitle>
                                            <Badge variant="secondary" className="bg-white/80">
                                                {columnLeads.length}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{column.description}</p>

                                        {columnValue > 0 && (
                                            <div className="text-xs font-medium text-green-600">
                                                R$ {columnValue.toLocaleString('pt-BR')}
                                            </div>
                                        )}

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full mt-2 h-8 text-xs"
                                            onClick={() => onCreateLead(column.key)}
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Novo Lead
                                        </Button>
                                    </CardHeader>

                                    <CardContent className="p-3 space-y-3 h-96 overflow-y-auto">
                                        {columnLeads.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <Minus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">Nenhum lead</p>
                                                <p className="text-xs">Arraste leads aqui ou crie um novo</p>
                                            </div>
                                        ) : (
                                            columnLeads.map((lead) => (
                                                <div
                                                    key={lead.id}
                                                    draggable
                                                    onDragStart={() => handleDragStart(lead)}
                                                    className="cursor-move"
                                                >
                                                    <LeadCard
                                                        lead={lead}
                                                        onEdit={onEditLead}
                                                        onDelete={onDeleteLead}
                                                        onStatusChange={onStatusChange}
                                                    />
                                                </div>
                                            ))
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
