'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, User, Building, Copy, Save, X, Trash2, AlertTriangle } from 'lucide-react';
import { format, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  photo?: string;
}

interface Branch {
  id: string;
  name: string;
  address: string;
}

interface Schedule {
  id: string;
  employeeId: string;
  branchId: string;
  date: string;
  startTime: string;
  endTime: string;
  shiftType: 'REGULAR' | 'OVERTIME' | 'HOLIDAY' | 'WEEKEND' | 'NIGHT' | 'FLEXIBLE';
  status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  notes?: string;
  employee: Employee;
  branch: Branch;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduleData: any, replicateToMonth: boolean, selectedDays: string[]) => void;
  employees: Employee[];
  branches: Branch[];
  schedule?: Schedule | null;
  selectedDate?: Date;
  loading?: boolean;
  daySchedules?: Schedule[];
  onDeleteDate?: (date: string) => void;
  onDeleteSchedule?: (scheduleId: string) => void;
}

const shiftTypes = [
  { value: 'REGULAR', label: 'Regular', color: 'bg-blue-100 text-blue-800' },
  { value: 'OVERTIME', label: 'Hora Extra', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'HOLIDAY', label: 'Feriado', color: 'bg-red-100 text-red-800' },
  { value: 'WEEKEND', label: 'Fim de Semana', color: 'bg-purple-100 text-purple-800' },
  { value: 'NIGHT', label: 'Noturno', color: 'bg-gray-100 text-gray-800' },
  { value: 'FLEXIBLE', label: 'Flexível', color: 'bg-green-100 text-green-800' }
];

const statusOptions = [
  { value: 'SCHEDULED', label: 'Agendado', color: 'bg-gray-100 text-gray-800' },
  { value: 'CONFIRMED', label: 'Confirmado', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  { value: 'COMPLETED', label: 'Concluído', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'NO_SHOW', label: 'Faltou', color: 'bg-red-100 text-red-800' }
];

export function ScheduleModal({
  isOpen,
  onClose,
  onSave,
  employees,
  branches,
  schedule,
  selectedDate,
  loading = false,
  daySchedules = [],
  onDeleteDate,
  onDeleteSchedule
}: ScheduleModalProps) {
  const [formData, setFormData] = useState({
    employeeId: '',
    branchId: '',
    date: '',
    startTime: '08:00',
    endTime: '17:00',
    shiftType: 'REGULAR' as 'REGULAR' | 'OVERTIME' | 'HOLIDAY' | 'WEEKEND' | 'NIGHT' | 'FLEXIBLE',
    status: 'SCHEDULED' as 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW',
    notes: ''
  });

  const [replicateToMonth, setReplicateToMonth] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (schedule) {
      setFormData({
        employeeId: schedule.employeeId,
        branchId: schedule.branchId,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        shiftType: schedule.shiftType,
        status: schedule.status,
        notes: schedule.notes || ''
      });
      setReplicateToMonth(false);
      setSelectedDays([]);
    } else if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: format(selectedDate, 'yyyy-MM-dd'),
        employeeId: '',
        branchId: '',
        shiftType: 'REGULAR',
        status: 'SCHEDULED',
        notes: ''
      }));
      setReplicateToMonth(false);
      setSelectedDays([]);
    }
  }, [schedule, selectedDate, isOpen]);

  useEffect(() => {
    if (replicateToMonth && formData.date) {
      const startDate = new Date(formData.date);
      const endDate = endOfMonth(startDate);
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      setSelectedDays(days.map(day => format(day, 'yyyy-MM-dd')));
      setShowDaySelector(true);
    } else {
      setSelectedDays([]);
      setShowDaySelector(false);
    }
  }, [replicateToMonth, formData.date]);

  const handleSave = () => {
    if (!formData.employeeId || !formData.branchId || !formData.date) {
      return;
    }

    onSave(formData, replicateToMonth, selectedDays);
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleDeleteDate = () => {
    if (formData.date && onDeleteDate) {
      onDeleteDate(formData.date);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const handleDeleteClick = () => {
    if (daySchedules.length > 0) {
      setShowDeleteConfirm(true);
    }
  };

  const handleDeleteScheduleClick = (scheduleId: string) => {
    setScheduleToDelete(scheduleId);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    if (onDeleteSchedule) {
      onDeleteSchedule(scheduleId);
      setScheduleToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setScheduleToDelete(null);
  };

  const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
  const selectedBranch = branches.find(branch => branch.id === formData.branchId);

  const getDaysInMonth = () => {
    if (!formData.date) return [];
    
    const startDate = new Date(formData.date);
    const endDate = endOfMonth(startDate);
    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {schedule ? 'Editar Escala' : 'Nova Escala'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário Principal */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="employee">Funcionário</Label>
                  <Select value={formData.employeeId} onValueChange={(value: string) => setFormData(prev => ({ ...prev, employeeId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um funcionário" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={employee.photo} />
                              <AvatarFallback className="text-xs">
                                {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{employee.name} - {employee.position}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="branch">Filial</Label>
                  <Select value={formData.branchId} onValueChange={(value: string) => setFormData(prev => ({ ...prev, branchId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma filial" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span>{branch.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                  id="date"
                  type="date"
                  value={formData.date ? format(new Date(formData.date), 'yyyy-MM-dd') : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Hora Início</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Hora Fim</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Configurações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="shiftType">Tipo de Turno</Label>
                  <Select value={formData.shiftType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, shiftType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {shiftTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Badge className={type.color}>{type.label}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <Badge className={status.color}>{status.label}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Observações sobre a escala..."
                    rows={3}
                  />
                </div>

                {!schedule && (
                  <div className="flex items-center space-x-2 pt-4 border-t">
                    <Switch
                      id="replicate"
                      checked={replicateToMonth}
                      onCheckedChange={setReplicateToMonth}
                    />
                    <Label htmlFor="replicate" className="flex items-center gap-2">
                      <Copy className="h-4 w-4" />
                      Replicar para o mês inteiro
                    </Label>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview e Seleção de Dias */}
          <div className="space-y-4">
            {/* Escalas Existentes do Dia */}
            {formData.date && (
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Escalas do Dia: {format(new Date(formData.date), 'dd/MM/yyyy', { locale: ptBR })}
                      {daySchedules.length > 5 && (
                        <div className="flex items-center gap-1 ml-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <span className="text-xs text-amber-600 font-medium">Dia lotado</span>
                        </div>
                      )}
                    </CardTitle>
                    {daySchedules.length > 0 && onDeleteDate && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {daySchedules.length} escala(s)
                        </span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteClick}
                          className="flex items-center gap-1 hover:scale-105 transition-transform"
                          title={`Excluir todas as ${daySchedules.length} escalas desta data`}
                        >
                          <Trash2 className="h-3 w-3" />
                          Excluir Todas
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {daySchedules.length > 0 ? (
                    <>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {daySchedules.map((daySchedule) => (
                          <div key={daySchedule.id} className="group relative">
                            {scheduleToDelete === daySchedule.id ? (
                              // Card de confirmação de exclusão
                              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border-2 border-red-300 animate-pulse">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={daySchedule.employee.photo} />
                                    <AvatarFallback className="text-xs font-medium bg-red-500 text-white">
                                      {daySchedule.employee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold text-sm text-red-800">{daySchedule.employee.name}</p>
                                    <p className="text-xs text-red-600">Confirme a exclusão desta escala</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Clock className="h-3 w-3 text-red-600" />
                                      <span className="text-xs text-red-700">{daySchedule.startTime} - {daySchedule.endTime}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancelDelete}
                                    className="text-gray-600 hover:text-gray-800 border-gray-300"
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteSchedule(daySchedule.id)}
                                    className="flex items-center gap-1"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    Confirmar
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              // Card normal da escala
                              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-sm transition-all hover:from-gray-100 hover:to-gray-150 group-hover:border-gray-300">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={daySchedule.employee.photo} />
                                    <AvatarFallback className="text-xs font-medium bg-blue-500 text-white">
                                      {daySchedule.employee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold text-sm">{daySchedule.employee.name}</p>
                                    <p className="text-xs text-muted-foreground">{daySchedule.employee.position}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                      <Building className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground">{daySchedule.branch.name}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                      <Clock className="h-4 w-4 text-blue-600" />
                                      <span className="text-blue-700">{daySchedule.startTime} - {daySchedule.endTime}</span>
                                    </div>
                                    <div className="flex gap-1 mt-2">
                                      <Badge className={shiftTypes.find(t => t.value === daySchedule.shiftType)?.color}>
                                        {shiftTypes.find(t => t.value === daySchedule.shiftType)?.label}
                                      </Badge>
                                      <Badge className={statusOptions.find(s => s.value === daySchedule.status)?.color}>
                                        {statusOptions.find(s => s.value === daySchedule.status)?.label}
                                      </Badge>
                                    </div>
                                  </div>
                                  {onDeleteSchedule && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteScheduleClick(daySchedule.id)}
                                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 hover:scale-110"
                                      title="Excluir esta escala"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className={`mt-4 p-3 rounded-lg border ${
                        daySchedules.length > 5 
                          ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200' 
                          : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className={`font-semibold ${
                              daySchedules.length > 5 ? 'text-amber-900' : 'text-blue-900'
                            }`}>
                              Total de funcionários escalados:
                            </span>
                            <span className={`ml-2 font-bold ${
                              daySchedules.length > 5 ? 'text-amber-700' : 'text-blue-700'
                            }`}>
                              {daySchedules.length}
                            </span>
                            {daySchedules.length > 5 && (
                              <span className="ml-2 text-xs text-amber-600 font-medium">
                                (Dia com alta demanda)
                              </span>
                            )}
                          </div>
                          <div className={`text-xs ${
                            daySchedules.length > 5 ? 'text-amber-600' : 'text-blue-600'
                          }`}>
                            {daySchedules.length > 5 
                              ? 'Verificar carga de trabalho' 
                              : 'Fácil visualização para gestão'
                            }
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhuma escala encontrada para este dia</p>
                      <p className="text-xs mt-1">Este será o primeiro funcionário escalado</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Preview da Escala */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Preview da Escala</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEmployee && selectedBranch ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedEmployee.photo} />
                        <AvatarFallback>
                          {selectedEmployee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedEmployee.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedEmployee.position}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4" />
                      <span>{selectedBranch.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{formData.startTime} - {formData.endTime}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge className={shiftTypes.find(t => t.value === formData.shiftType)?.color}>
                        {shiftTypes.find(t => t.value === formData.shiftType)?.label}
                      </Badge>
                      <Badge className={statusOptions.find(s => s.value === formData.status)?.color}>
                        {statusOptions.find(s => s.value === formData.status)?.label}
                      </Badge>
                    </div>

                    {formData.date && (
                      <div className="text-sm">
                        <strong>Data:</strong> {format(new Date(formData.date), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    )}

                    {replicateToMonth && (
                      <div className="text-sm">
                        <strong>Total de dias:</strong> {selectedDays.length}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Selecione um funcionário e filial para ver o preview
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Seletor de Dias do Mês */}
            {showDaySelector && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Selecionar Dias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                      <div key={day} className="text-xs font-medium p-2 text-muted-foreground">
                        {day}
                      </div>
                    ))}
                    
                    {getDaysInMonth().map(day => {
                      const dayStr = format(day, 'yyyy-MM-dd');
                      const isSelected = selectedDays.includes(dayStr);
                      const isToday = isSameDay(day, new Date());
                      
                      return (
                        <Button
                          key={dayStr}
                          variant={isSelected ? 'default' : 'ghost'}
                          size="sm"
                          className={`h-8 w-8 p-0 ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                          onClick={() => toggleDay(dayStr)}
                        >
                          {format(day, 'd')}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDays(getDaysInMonth().map(d => format(d, 'yyyy-MM-dd')))}
                    >
                      Selecionar Todos
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDays([])}
                    >
                      Limpar Seleção
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading || !formData.employeeId || !formData.branchId}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirmar Exclusão</h3>
                <p className="text-sm text-gray-600">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                <strong>Você está prestes a excluir todas as escalas do dia:</strong>
              </p>
              <p className="text-sm text-red-700 font-medium mt-1">
                {formData.date && format(new Date(formData.date), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
              <p className="text-sm text-red-700 mt-2">
                Total de escalas que serão excluídas: <strong>{daySchedules.length}</strong>
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteDate}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Confirmar Exclusão
              </Button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
