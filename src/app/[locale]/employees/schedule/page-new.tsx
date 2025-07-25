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
  Building,
  RefreshCw
} from 'lucide-react';
import { ScheduleCalendar } from '@/components/schedule/ScheduleCalendar';
import { ScheduleModal } from '@/components/schedule/ScheduleModal';
import { format } from 'date-fns';
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
  
  // Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Filters
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'list'>('month');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, currentDate, selectedEmployee, selectedBranch]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError('');

      // Obter dados do mês atual para o calendário
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
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

      console.log('Schedules data:', schedulesData);
      console.log('Employees data:', employeesData);
      console.log('Branches data:', branchesData);

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

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedSchedule(null);
    setShowScheduleModal(true);
  };

  const handleEventClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setSelectedDate(null);
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
          date: format(newDate, 'yyyy-MM-dd')
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

  const handleSaveSchedule = async (scheduleData: any, replicateToMonth: boolean, selectedDays: string[]) => {
    try {
      setSaving(true);
      setError('');

      if (replicateToMonth && selectedDays.length > 0) {
        // Criar múltiplas escalas
        const promises = selectedDays.map(date => 
          fetch('/api/schedules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              ...scheduleData,
              date: date
            })
          })
        );

        const responses = await Promise.all(promises);
        const failedResponses = responses.filter(r => !r.ok);
        
        if (failedResponses.length > 0) {
          throw new Error(`Erro ao criar ${failedResponses.length} escala(s)`);
        }

        setSuccess(`${selectedDays.length} escalas criadas com sucesso!`);
      } else if (selectedSchedule) {
        // Atualizar escala existente
        const response = await fetch(`/api/schedules/${selectedSchedule.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(scheduleData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao atualizar escala');
        }

        setSuccess('Escala atualizada com sucesso!');
      } else {
        // Criar nova escala
        const response = await fetch('/api/schedules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(scheduleData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao criar escala');
        }

        setSuccess('Escala criada com sucesso!');
      }

      setShowScheduleModal(false);
      setSelectedSchedule(null);
      setSelectedDate(null);
      loadData();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir escala');
      }

      setSuccess('Escala excluída com sucesso!');
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Escalas de Trabalho</h1>
          <p className="text-muted-foreground">
            Gerencie as escalas dos funcionários
          </p>
        </div>
        <Button onClick={() => handleDateClick(new Date())} className="w-fit">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError('')}
                className="ml-auto"
              >
                <Trash2 className="h-4 w-4" />
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
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total de Escalas</p>
                <p className="text-2xl font-bold">{schedules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Funcionários</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Filiais</p>
                <p className="text-2xl font-bold">{branches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Confirmadas</p>
                <p className="text-2xl font-bold">
                  {schedules.filter(s => s.status === 'CONFIRMED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <Button onClick={loadData} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendário de Escalas</CardTitle>
          <CardDescription>
            Clique em uma data para criar uma nova escala ou em um evento para editar
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
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
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setSelectedSchedule(null);
          setSelectedDate(null);
        }}
        onSave={handleSaveSchedule}
        employees={employees}
        branches={branches}
        schedule={selectedSchedule}
        selectedDate={selectedDate}
        loading={saving}
      />
    </div>
  );
}
