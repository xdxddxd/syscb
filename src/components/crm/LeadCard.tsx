'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Phone,
    Mail,
    MapPin,
    Calendar,
    Star,
    DollarSign,
    User,
    Building,
    Clock,
    MoreHorizontal,
    Edit,
    Trash2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

interface LeadCardProps {
    lead: Lead;
    onEdit: (lead: Lead) => void;
    onDelete: (leadId: string) => void;
    onStatusChange: (leadId: string, newStatus: string) => void;
}

const statusConfig = {
    NEW: { label: 'Novo', color: 'bg-blue-500 text-white', bgColor: 'bg-blue-50' },
    CONTACTED: { label: 'Contatado', color: 'bg-yellow-500 text-white', bgColor: 'bg-yellow-50' },
    QUALIFIED: { label: 'Qualificado', color: 'bg-purple-500 text-white', bgColor: 'bg-purple-50' },
    PROPOSAL: { label: 'Proposta', color: 'bg-orange-500 text-white', bgColor: 'bg-orange-50' },
    CLOSED: { label: 'Fechado', color: 'bg-green-500 text-white', bgColor: 'bg-green-50' },
    LOST: { label: 'Perdido', color: 'bg-red-500 text-white', bgColor: 'bg-red-50' }
};

const sourceConfig = {
    WEBSITE: { label: 'Website', icon: '🌐' },
    PHONE: { label: 'Telefone', icon: '📞' },
    EMAIL: { label: 'Email', icon: '📧' },
    REFERRAL: { label: 'Indicação', icon: '👥' },
    SOCIAL: { label: 'Redes Sociais', icon: '📱' },
    WALK_IN: { label: 'Visita', icon: '🚶' }
};

export function LeadCard({ lead, onEdit, onDelete, onStatusChange }: LeadCardProps) {
    const statusInfo = statusConfig[lead.status as keyof typeof statusConfig];
    const sourceInfo = sourceConfig[lead.source as keyof typeof sourceConfig];
    const isHotLead = lead.budget && lead.budget > 500000;
    const daysSinceContact = lead.lastContactAt
        ? Math.floor((new Date().getTime() - new Date(lead.lastContactAt).getTime()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4"
            style={{ borderLeftColor: statusInfo?.color.split(' ')[0].replace('bg-', '#') || '#gray' }}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 max-w-[70%]">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0  max-w-4/5">
                            <h3 className="font-semibold text-sm truncate">{lead.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className={`text-xs ${statusInfo?.color}`}>
                                    {statusInfo?.label}
                                </Badge>
                                {isHotLead && (
                                    <div className="flex items-center text-orange-500">
                                        <Star className="h-3 w-3 fill-current" />
                                        <span className="text-xs ml-1">Hot</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(lead)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(lead.id)}
                                className="text-red-600"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
                {/* Informações de Contato */}
                <div className="space-y-1">
                    <div className="flex items-center text-xs text-muted-foreground">
                        <Mail className="h-3 w-3 mr-2" />
                        <span className="truncate">{lead.email}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                        <Phone className="h-3 w-3 mr-2" />
                        <span>{lead.phone}</span>
                    </div>
                </div>

                {/* Interesse/Propriedade */}
                {lead.property ? (
                    <div className="bg-gray-50 rounded-lg p-2 space-y-1">
                        <div className="flex items-center text-xs font-medium">
                            <Building className="h-3 w-3 mr-1" />
                            <span className="truncate">{lead.property.title}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{lead.property.neighborhood}</span>
                            <span className="font-semibold text-green-600">
                                R$ {lead.property.price.toLocaleString('pt-BR')}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-2" />
                        <span className="truncate">{lead.interest}</span>
                    </div>
                )}

                {/* Budget */}
                {lead.budget && (
                    <div className="flex items-center text-xs">
                        <DollarSign className="h-3 w-3 mr-2 text-green-600" />
                        <span className="font-medium">
                            Orçamento: R$ {lead.budget.toLocaleString('pt-BR')}
                        </span>
                    </div>
                )}

                {/* Fonte */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                        <span className="mr-1">{sourceInfo?.icon}</span>
                        <span>{sourceInfo?.label}</span>
                    </div>
                    {daysSinceContact !== null && (
                        <div className={`text-xs px-2 py-1 rounded-full ${daysSinceContact > 7 ? 'bg-red-100 text-red-600' :
                                daysSinceContact > 3 ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-green-100 text-green-600'
                            }`}>
                            <Clock className="h-3 w-3 inline mr-1" />
                            {daysSinceContact === 0 ? 'Hoje' : `${daysSinceContact}d`}
                        </div>
                    )}
                </div>

                {/* Agente */}
                <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center text-xs text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        <span className="truncate">{lead.agent.name}</span>
                    </div>
                    <div className="flex space-x-1">
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                            <Phone className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                            <Mail className="h-3 w-3" />
                        </Button>
                    </div>
                </div>

                {/* Data de Criação */}
                <div className="text-xs text-muted-foreground">
                    Criado em {format(new Date(lead.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                </div>
            </CardContent>
        </Card>
    );
}
