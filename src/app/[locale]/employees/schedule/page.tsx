'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Calendar as CalendarIcon,
  Plus, 
  Search, 
  Filter, 
  Users, 
  Clock, 
  MapPin,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Building
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from 'date-fns';
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

export default function EmployeeSchedulePage() {
  const { user, loading: isLoading } = useAuth();
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Filters
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  
  // Create form
  const [newSchedule, setNewSchedule] = useState({
    employeeId: '',
    branchId: '',
    date: new Date(),
    startTime: '08:00',
    endTime: '17:00',
    shiftType: 'REGULAR' as const,
    notes: ''
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, currentWeek, selectedEmployee, selectedBranch]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Calculate week range
      const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
      
      const params = new URLSearchParams({
        startDate: weekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0],
        ...(selectedEmployee && { employeeId: selectedEmployee }),
        ...(selectedBranch && { branchId: selectedBranch })
      });

      const [schedulesRes, employeesRes, branchesRes] = await Promise.all([
        fetch(`/api/schedules?${params}`, { credentials: 'include' }),
        fetch('/api/employees?limit=100', { credentials: 'include' }),
        fetch('/api/branches?limit=100', { credentials: 'include' })
      ]);

      if (!schedulesRes.ok || !employeesRes.ok || !branchesRes.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const [schedulesData, employeesData, branchesData] = await Promise.all([
        schedulesRes.json(),
        employeesRes.json(),
        branchesRes.json()
      ]);

      setSchedules(schedulesData.schedules || []);
      setEmployees(employeesData.employees || []);
      setBranches(branchesData.branches || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async () => {
    try {
      setIsCreating(true);
      setError('');

      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...newSchedule,
          date: newSchedule.date.toISOString().split('T')[0]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar escala');
      }

      setSuccess('Escala criada com sucesso!');
      setShowCreateModal(false);
      setNewSchedule({
        employeeId: '',
        branchId: '',
        date: new Date(),
        startTime: '08:00',
        endTime: '17:00',
        shiftType: 'REGULAR',
        notes: ''
      });
      loadData();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!scheduleToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/schedules/${scheduleToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir escala');
      }

      setSuccess('Escala excluída com sucesso');
      setShowDeleteModal(false);
      setScheduleToDelete(null);
      loadData();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const getShiftTypeLabel = (type: string) => {
    const types = {
      REGULAR: 'Regular',
      OVERTIME: 'Hora Extra',
      HOLIDAY: 'Feriado',
      WEEKEND: 'Fim de Semana',
      NIGHT: 'Noturno',
      FLEXIBLE: 'Flexível'
    };
    return types[type as keyof typeof types] || type;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SCHEDULED: { variant: 'secondary' as const, label: 'Agendado' },
      CONFIRMED: { variant: 'default' as const, label: 'Confirmado' },
      CANCELLED: { variant: 'destructive' as const, label: 'Cancelado' },
      COMPLETED: { variant: 'default' as const, label: 'Concluído' },
      NO_SHOW: { variant: 'destructive' as const, label: 'Faltou' }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.SCHEDULED;
  };

  const getSchedulesForDay = (date: Date) => {
    return schedules.filter(schedule => 
      isSameDay(new Date(schedule.date), date)
    );
  };

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek, { weekStartsOn: 1 }),
    end: endOfWeek(currentWeek, { weekStartsOn: 1 })
  });

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
          <h1 className="text-3xl font-bold tracking-tight">Escala de Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie horários e escalas da equipe
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Escala
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="ghost" size="sm" onClick={() => setError('')} className="ml-auto">
                ×
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
              <Button variant="ghost" size="sm" onClick={() => setSuccess('')} className="ml-auto">
                ×
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os funcionários" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os funcionários</SelectItem>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name} - {emp.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as filiais" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as filiais</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setCurrentWeek(new Date())}
            >
              Semana Atual
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Week Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'dd MMM', { locale: ptBR })} - {' '}
            {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'dd MMM yyyy', { locale: ptBR })}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const daySchedules = getSchedulesForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <Card key={index} className={isToday ? 'ring-2 ring-primary' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">
                  {format(day, 'EEE', { locale: ptBR })}
                </CardTitle>
                <p className="text-xs text-center text-muted-foreground">
                  {format(day, 'dd/MM')}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {daySchedules.map(schedule => {
                    const statusBadge = getStatusBadge(schedule.status);
                    return (
                      <div key={schedule.id} className="p-2 border rounded-lg text-xs">
                        <div className="flex items-center space-x-1 mb-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {schedule.employee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium truncate">{schedule.employee.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            {schedule.startTime} - {schedule.endTime}
                          </span>
                          <Badge variant={statusBadge.variant} className="text-xs">
                            {statusBadge.label}
                          </Badge>
                        </div>
                        <div className="flex items-center mt-1">
                          <Building className="h-3 w-3 mr-1" />
                          <span className="text-muted-foreground truncate">{schedule.branch.name}</span>
                        </div>
                        <div className="flex space-x-1 mt-2">
                          <Button variant="ghost" size="sm" className="h-6 p-1">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 p-1">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 p-1 text-destructive"
                            onClick={() => {
                              setScheduleToDelete(schedule);
                              setShowDeleteModal(true);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {daySchedules.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Sem escalas
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Schedule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Nova Escala</CardTitle>
              <CardDescription>Criar uma nova escala para funcionário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={newSchedule.employeeId} onValueChange={(value) => 
                setNewSchedule(prev => ({ ...prev, employeeId: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} - {emp.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={newSchedule.branchId} onValueChange={(value) => 
                setNewSchedule(prev => ({ ...prev, branchId: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar filial" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(newSchedule.date, 'dd/MM/yyyy', { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newSchedule.date}
                    onSelect={(date) => date && setNewSchedule(prev => ({ ...prev, date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="time"
                  value={newSchedule.startTime}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                />
                <Input
                  type="time"
                  value={newSchedule.endTime}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>

              <Select value={newSchedule.shiftType} onValueChange={(value: any) => 
                setNewSchedule(prev => ({ ...prev, shiftType: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REGULAR">Regular</SelectItem>
                  <SelectItem value="OVERTIME">Hora Extra</SelectItem>
                  <SelectItem value="HOLIDAY">Feriado</SelectItem>
                  <SelectItem value="WEEKEND">Fim de Semana</SelectItem>
                  <SelectItem value="NIGHT">Noturno</SelectItem>
                  <SelectItem value="FLEXIBLE">Flexível</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Observações (opcional)"
                value={newSchedule.notes}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, notes: e.target.value }))}
              />
            </CardContent>
            <div className="flex justify-end space-x-2 p-6 pt-0">
              <Button variant="outline" onClick={() => setShowCreateModal(false)} disabled={isCreating}>
                Cancelar
              </Button>
              <Button onClick={handleCreateSchedule} disabled={isCreating}>
                {isCreating ? 'Criando...' : 'Criar Escala'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && scheduleToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Confirmar Exclusão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tem certeza que deseja excluir a escala de{' '}
                <span className="font-medium">{scheduleToDelete.employee.name}</span> para{' '}
                <span className="font-medium">{format(new Date(scheduleToDelete.date), 'dd/MM/yyyy')}</span>?
              </p>
            </CardContent>
            <div className="flex justify-end space-x-2 p-6 pt-0">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setScheduleToDelete(null);
                }}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteSchedule} disabled={isDeleting}>
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
