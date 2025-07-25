'use client';

import { Schedule } from '@/types/schedule';

interface DebugScheduleProps {
  schedules: Schedule[];
}

export function DebugSchedule({ schedules }: DebugScheduleProps) {
  // Criar eventos de teste simples
  const testEvents = [
    {
      id: 'test-1',
      title: 'Evento Teste 1',
      start: '2025-07-25T09:00:00',
      end: '2025-07-25T17:00:00'
    }
  ];

  // Converter schedules para eventos com logs detalhados
  const realEvents = schedules.map((schedule, index) => {
    console.log(`=== Schedule ${index} ===`);
    console.log('Raw schedule:', schedule);
    console.log('Date:', schedule.date);
    console.log('Start time:', schedule.startTime);
    console.log('End time:', schedule.endTime);
    console.log('Employee:', schedule.employee);
    console.log('Branch:', schedule.branch);

    const event = {
      id: `real-${schedule.id}`,
      title: `${schedule.employee?.name || 'Sem Nome'} - ${schedule.branch?.name || 'Sem Filial'}`,
      start: `${schedule.date}T${schedule.startTime}:00`,
      end: `${schedule.date}T${schedule.endTime}:00`
    };

    console.log('Generated event:', event);
    console.log('========================');
    
    return event;
  });

  console.log('=== SUMMARY ===');
  console.log('Total schedules:', schedules.length);
  console.log('Total real events:', realEvents.length);
  console.log('Test events:', testEvents);
  console.log('Real events:', realEvents);

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-bold text-yellow-800 mb-3">Debug Information</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Schedules carregados:</strong> {schedules.length}
        </div>
        
        <div>
          <strong>Eventos de teste:</strong> {testEvents.length}
        </div>
        
        <div>
          <strong>Eventos reais gerados:</strong> {realEvents.length}
        </div>
        
        {schedules.length > 0 && (
          <div className="mt-4">
            <strong>schedule:</strong>
            <pre className="text-xs bg-white p-2 rounded border mt-1">
              {JSON.stringify(schedules, null, 2)}
            </pre>
          </div>
        )}
        
        {realEvents.length > 0 && (
          <div className="mt-4">
            <strong>Primeiro evento real:</strong>
            <pre className="text-xs bg-white p-2 rounded border mt-1">
              {JSON.stringify(realEvents[0], null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
