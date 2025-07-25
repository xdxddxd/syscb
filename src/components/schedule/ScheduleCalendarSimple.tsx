'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Button } from '@/components/ui/button';
import '@/styles/fullcalendar-debug.css';

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

interface ScheduleCalendarProps {
  schedules: Schedule[];
  employees: Employee[];
  branches: Branch[];
  onDateClick: (date: Date) => void;
  onEventClick: (schedule: Schedule) => void;
  onEventDrop: (scheduleId: string, newDate: Date) => void;
  view: 'month' | 'week' | 'day' | 'list';
  onViewChange: (view: 'month' | 'week' | 'day' | 'list') => void;
}

export function ScheduleCalendar({
  schedules,
  employees,
  branches,
  onDateClick,
  onEventClick,
  onEventDrop,
  view,
  onViewChange
}: ScheduleCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [isReady, setIsReady] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  // Aguardar dados estarem carregados antes de renderizar o calendário
  useEffect(() => {
    // Considerar pronto quando pelo menos employees e branches estão carregados
    if (employees.length >= 0 && branches.length >= 0) {
      setIsReady(true);
    }
  }, [employees, branches, schedules]);

  const getViewType = () => {
    switch (view) {
      case 'month': return 'dayGridMonth';
      case 'week': return 'timeGridWeek';
      case 'day': return 'timeGridDay';
      case 'list': return 'listWeek';
      default: return 'dayGridMonth';
    }
  };

  // Atualizar visualização quando view mode mudar
  useEffect(() => {
    if (calendarRef.current && isReady) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(getViewType());
    }
  }, [view, isReady]);

  // Forçar re-renderização quando eventos mudarem
  useEffect(() => {
    if (calendarRef.current && isReady) {
      const calendarApi = calendarRef.current.getApi();
      // Pequeno delay para garantir que os eventos foram processados
      setTimeout(() => {
        calendarApi.refetchEvents();
      }, 100);
    }
  }, [schedules, isReady, events]);

  // useEffect para processar e combinar eventos
  useEffect(() => {
    console.log('=== PROCESSING EVENTS ===');
    
    // Função para polimorfizar Schedule para FullCalendar Event
    const transformScheduleToEvent = (schedule: Schedule) => {
      console.log('🔍 Processing schedule:', schedule);
      
      // Validar se os dados necessários estão presentes
      if (!schedule.date || !schedule.startTime || !schedule.endTime) {
        console.warn('❌ Schedule com dados incompletos:', {
          id: schedule.id,
          date: schedule.date,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          fullSchedule: schedule
        });
        return null;
      }

      console.log('✅ Schedule has required fields:', {
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime
      });

      // Extrair apenas a parte da data (YYYY-MM-DD) do ISO string
      let eventStart: string;
      let eventEnd: string;

      try {
        // Extrair apenas a data (YYYY-MM-DD) removendo a parte de tempo
        const dateOnly = schedule.date.split('T')[0]; // "2025-07-24"
        
        // Garantir que os horários estão no formato correto
        const startTime = schedule.startTime.includes(':') 
          ? (schedule.startTime.split(':').length === 2 ? `${schedule.startTime}:00` : schedule.startTime)
          : `${schedule.startTime}:00:00`;
        
        const endTime = schedule.endTime.includes(':')
          ? (schedule.endTime.split(':').length === 2 ? `${schedule.endTime}:00` : schedule.endTime)
          : `${schedule.endTime}:00:00`;

        console.log('⏰ Time processing:', {
          originalDate: schedule.date,
          dateOnly,
          originalStart: schedule.startTime,
          originalEnd: schedule.endTime,
          processedStart: startTime,
          processedEnd: endTime
        });

        // Formato ISO correto para FullCalendar: YYYY-MM-DDTHH:mm:ss
        eventStart = `${dateOnly}T${startTime}`;
        eventEnd = `${dateOnly}T${endTime}`;

        console.log('📅 Date processing:', {
          eventStart,
          eventEnd
        });

        // Validar se as datas são válidas
        const startDate = new Date(eventStart);
        const endDate = new Date(eventEnd);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.warn('❌ Datas inválidas para schedule:', {
            original: schedule,
            generated: { eventStart, eventEnd },
            startDateValid: !isNaN(startDate.getTime()),
            endDateValid: !isNaN(endDate.getTime())
          });
          return null;
        }

        console.log('✅ Valid dates created:', {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        });

      } catch (error) {
        console.error('❌ Error processing schedule:', schedule, error);
        return null;
      }

      // Determinar cor baseada no status
      let backgroundColor = '#ef4444';
      let borderColor = '#dc2626';
      
      switch (schedule.status) {
        case 'CONFIRMED':
          backgroundColor = '#10b981';
          borderColor = '#059669';
          break;
        case 'SCHEDULED':
          backgroundColor = '#3b82f6';
          borderColor = '#2563eb';
          break;
        case 'CANCELLED':
          backgroundColor = '#6b7280';
          borderColor = '#4b5563';
          break;
        case 'COMPLETED':
          backgroundColor = '#8b5cf6';
          borderColor = '#7c3aed';
          break;
        default:
          backgroundColor = '#ef4444';
          borderColor = '#dc2626';
      }

      const event = {
        id: schedule.id.toString(),
        title: `${schedule.employee?.name || 'Funcionário'} - ${schedule.branch?.name || 'Filial'}`,
        start: eventStart,
        end: eventEnd,
        backgroundColor,
        borderColor,
        textColor: '#ffffff',
        extendedProps: {
          scheduleId: schedule.id,
          employeeId: schedule.employeeId,
          branchId: schedule.branchId,
          status: schedule.status,
          shiftType: schedule.shiftType,
          notes: schedule.notes,
          originalSchedule: schedule
        }
      };

      console.log('✅ Event created successfully:', event);
      return event;
    };

    // Converter schedules reais para eventos usando a função de polimorfismo
    console.log('Converting schedules to events...');
    const realEvents = schedules
      .map(transformScheduleToEvent)
      .filter(event => event !== null); // Remover eventos inválidos

    console.log('Generated real events:', realEvents);

    // Usar apenas os eventos reais
    const allEvents = realEvents;
    
    console.log('=== EVENTS DEBUG ===');
    console.log('IsReady:', isReady);
    console.log('Schedules length:', schedules.length);
    console.log('Final events array:', allEvents);
    console.log('Real events count:', realEvents.length);
    console.log('Total events count:', allEvents.length);
    console.log('====================');

    // Atualizar o state dos eventos
    setEvents(allEvents);
    
    console.log('Events state updated:', allEvents);
    console.log('Current events state length:', allEvents.length);
  }, [schedules, isReady]);

  // Monitor events state changes
  useEffect(() => {
    console.log('Events state changed:', events);
    console.log('Events length:', events.length);
  }, [events]);

  const handleDateClick = useCallback((info: any) => {
    onDateClick(info.date);
  }, [onDateClick]);

  const handleEventClick = useCallback((info: any) => {
    // Verificar se é um evento real com dados de schedule
    if (info.event.extendedProps?.originalSchedule) {
      onEventClick(info.event.extendedProps.originalSchedule);
    } else {
      console.log('Evento clicado não possui dados de schedule:', info.event);
    }
  }, [onEventClick]);

  return (
    <div className="h-full">
      {/* Debug Info */}
      {/* <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm font-medium text-blue-900">
          📊 Status do Calendário
        </div>
        <div className="text-sm text-blue-700 mt-1">
          • Escalas carregadas: {schedules.length}
        </div>
        <div className="text-sm text-blue-700">
          • Total de eventos no state: {events.length}
        </div>
        <div className="text-sm text-blue-700">
          • Calendário pronto: {isReady ? 'Sim' : 'Não'}
        </div>
        <div className="text-sm text-blue-700">
          • Visualização atual: {view}
        </div>
      </div> */}

      {/* Toolbar de Visualização */}
      <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('month')}
          >
            Mês
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('week')}
          >
            Semana
          </Button>
          <Button
            variant={view === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('day')}
          >
            Dia
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('list')}
          >
            Lista
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => calendarRef.current?.getApi().prev()}
          >
            ← Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => calendarRef.current?.getApi().today()}
          >
            Hoje
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => calendarRef.current?.getApi().next()}
          >
            Próximo →
          </Button>
        </div>
      </div>

      {/* FullCalendar Simplificado */}
      <div className="bg-white rounded-lg border p-4">
        {!isReady ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Carregando calendário...</span>
          </div>
        ) : (
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView={getViewType()}
            headerToolbar={false}
            height="auto"
            locale="pt-br"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            editable={false}
            selectable={true}
            weekends={true}
            dayMaxEvents={false}
            eventDisplay="block"
            displayEventTime={true}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            noEventsContent="Nenhuma escala encontrada"
          />
        )}
      </div>
    </div>
  );
}
