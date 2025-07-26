'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Filter, 
  Users, 
  Building,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { ScheduleCalendar } from '@/components/schedule/ScheduleCalendarSimple';
import { ScheduleModal } from '@/components/schedule/ScheduleModal';
import { DebugSchedule } from '@/components/schedule/DebugSchedule';

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
  
  // Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Filters
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'list'>('month');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/pt-BR/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, selectedEmployee, selectedBranch]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados de um período mais amplo para mostrar todas as escalas
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1); // 1 mês atrás
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 2); // 2 meses à frente
      
      const params = new URLSearchParams({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        ...(selectedEmployee && selectedEmployee !== 'all' && { employeeId: selectedEmployee }),
        ...(selectedBranch && selectedBranch !== 'all' && { branchId: selectedBranch })
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
      
      // Debug: Log dos dados carregados
      console.log('Loaded schedules:', schedulesData.schedules);
      console.log('Loaded employees:', employeesData.employees);
      console.log('Loaded branches:', branchesData.branches);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedSchedule(null);
    setShowScheduleModal(true);
  };

  // Função para obter escalas do dia selecionado
  const getDaySchedules = (date: Date): Schedule[] => {
    if (!date) return [];
    
    const targetDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
    console.log('🔍 Debug getDaySchedules:', {
      clickedDate: date,
      targetDate,
      totalSchedules: schedules.length,
      scheduleDates: schedules.map(s => ({ id: s.id, date: s.date, dateOnly: s.date.split('T')[0] }))
    });
    
    const filteredSchedules = schedules.filter(schedule => {
      const scheduleDate = schedule.date.split('T')[0]; // Extract YYYY-MM-DD part
      return scheduleDate === targetDate;
    });
    
    console.log('✅ Filtered schedules for date:', targetDate, filteredSchedules);
    
    return filteredSchedules;
  };

  const handleDeleteDate = async (date: string) => {
    try {
      // Buscar todas as escalas da data específica
      const schedulesToDelete = schedules.filter(schedule => {
        const scheduleDate = schedule.date.split('T')[0];
        return scheduleDate === date;
      });

      if (schedulesToDelete.length === 0) {
        setError('Nenhuma escala encontrada para esta data');
        return;
      }

      // Excluir todas as escalas da data
      const deletePromises = schedulesToDelete.map(schedule => 
        fetch(`/api/schedules/${schedule.id}`, {
          method: 'DELETE',
          credentials: 'include'
        })
      );

      const responses = await Promise.all(deletePromises);
      const failedResponses = responses.filter(r => !r.ok);

      if (failedResponses.length > 0) {
        throw new Error(`Erro ao excluir ${failedResponses.length} escala(s)`);
      }

      setSuccess(`${schedulesToDelete.length} escala(s) excluída(s) com sucesso!`);
      loadData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir escala');
      }

      setSuccess('Escala excluída com sucesso!');
      loadData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEventClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setSelectedDate(new Date(schedule.date));
    setShowScheduleModal(true);
  };

  const handleEventDrop = async (scheduleId: string, newDate: Date) => {
    try {
      const schedule = schedules.find(s => s.id === scheduleId);
      if (!schedule) return;

      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...schedule,
          date: newDate.toISOString().split('T')[0]
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao mover escala');
      }

      setSuccess('Escala movida com sucesso!');
      loadData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleModalSubmit = async (formData: any, replicateToMonth: boolean, selectedDays: string[]) => {
    try {
      const isEditing = !!selectedSchedule;
      
      if (replicateToMonth && selectedDays.length > 0) {
        // Criar múltiplas escalas para os dias selecionados
        const promises = selectedDays.map(day => {
          const scheduleDate = new Date(day);
          return fetch('/api/schedules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              ...formData,
              date: scheduleDate.toISOString().split('T')[0]
            })
          });
        });
        
        const responses = await Promise.all(promises);
        const failedResponses = responses.filter(r => !r.ok);
        
        if (failedResponses.length > 0) {
          throw new Error(`Erro ao criar ${failedResponses.length} escala(s)`);
        }
        
        setSuccess(`${selectedDays.length} escala(s) criada(s) com sucesso!`);
      } else {
        // Criar/editar uma única escala
        const url = isEditing ? `/api/schedules/${selectedSchedule.id}` : '/api/schedules';
        const method = isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao salvar escala');
        }

        setSuccess(isEditing ? 'Escala atualizada com sucesso!' : 'Escala criada com sucesso!');
      }
      
      setShowScheduleModal(false);
      loadData();
    } catch (error: any) {
      setError(error.message);
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Escala de Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie horários e escalas da equipe com visualização avançada
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button onClick={() => handleDateClick(new Date())}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Escala
          </Button>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Funcionário
              </label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os funcionários" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os funcionários</SelectItem>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} - {emp.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Building className="h-4 w-4" />
                Filial
              </label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as filiais" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as filiais</SelectItem>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Status
              </label>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">Total: {schedules.length}</Badge>
                <Badge variant="default">
                  Confirmadas: {schedules.filter(s => s.status === 'CONFIRMED').length}
                </Badge>
                <Badge variant="outline">
                  Agendadas: {schedules.filter(s => s.status === 'SCHEDULED').length}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Information */}
      {/* <DebugSchedule schedules={schedules} /> */}

      {/* Calendar */}
      <Card>
        <CardContent className="p-6">
          <ScheduleCalendar
            schedules={schedules}
            employees={employees}
            branches={branches}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
            view={viewMode}
            onViewChange={setViewMode}
          />
        </CardContent>
      </Card>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <ScheduleModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          onSave={handleModalSubmit}
          employees={employees}
          branches={branches}
          selectedDate={selectedDate || undefined}
          schedule={selectedSchedule}
          daySchedules={selectedDate ? getDaySchedules(selectedDate) : []}
          onDeleteDate={handleDeleteDate}
          onDeleteSchedule={handleDeleteSchedule}
        />
      )}
    </div>
  );
}
