export type UserRole = 'admin' | 'manager' | 'agent';

export interface UserPermission {
  id: string;
  userId: string;
  resource: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  branchId: string;
  isActive: boolean;
  salary?: number;
  commissionRate?: number;
  createdAt: string;
  updatedAt: string;
  permissions: UserPermission[];
}
