export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  photo?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
}

export interface Schedule {
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
