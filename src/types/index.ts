// Tipos principais do sistema de gestão imobiliária

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  branchId: string;
  permissions: Permission[];
  isActive: boolean;
  salary?: number;
  commissionRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  AGENT = 'agent',
  ASSISTANT = 'assistant'
}

export interface Permission {
  id: string;
  resource: string; // properties, leads, contracts, etc.
  actions: PermissionAction[];
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete'
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  managerId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  address: Address;
  details: PropertyDetails;
  photos: string[];
  documents: string[];
  ownerId?: string;
  agentId: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PropertyType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  COMMERCIAL = 'commercial',
  LAND = 'land'
}

export enum PropertyStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  RENTED = 'rented',
  RESERVED = 'reserved'
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyDetails {
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  furnished?: boolean;
  petFriendly?: boolean;
  features: string[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  interest: string;
  budget?: number;
  notes: string;
  agentId: string;
  propertyId?: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
  lastContactAt?: Date;
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  CLOSED = 'closed',
  LOST = 'lost'
}

export enum LeadSource {
  WEBSITE = 'website',
  SOCIAL = 'social',
  REFERRAL = 'referral',
  ADVERTISING = 'advertising',
  OTHER = 'other'
}

export interface Contract {
  id: string;
  type: ContractType;
  status: ContractStatus;
  propertyId: string;
  clientId: string;
  agentId: string;
  value: number;
  commissionRate: number;
  commissionValue: number;
  startDate: Date;
  endDate?: Date;
  signedAt?: Date;
  documentUrl?: string;
  eSignatureId?: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ContractType {
  SALE = 'sale',
  RENT = 'rent',
  MANAGEMENT = 'management'
}

export enum ContractStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  SIGNED = 'signed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string; // CPF/CNPJ
  address?: Address;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  location: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryTransfer {
  id: string;
  itemId: string;
  fromBranchId: string;
  toBranchId: string;
  quantity: number;
  transferredBy: string;
  receivedBy?: string;
  status: TransferStatus;
  notes?: string;
  createdAt: Date;
  completedAt?: Date;
}

export enum TransferStatus {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface EmployeeCheckIn {
  id: string;
  employeeId: string;
  checkInTime: Date;
  checkOutTime?: Date;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  selfieUrl: string;
  points: number;
  notes?: string;
  branchId: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: Date;
  readAt?: Date;
}

export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success'
}

export interface FinancialRecord {
  id: string;
  type: FinancialType;
  category: string;
  description: string;
  amount: number;
  date: Date;
  contractId?: string;
  employeeId?: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum FinancialType {
  REVENUE = 'revenue',
  EXPENSE = 'expense',
  COMMISSION = 'commission'
}

export interface MarketAnalysis {
  id: string;
  propertyType: PropertyType;
  neighborhood: string;
  city: string;
  averagePrice: number;
  pricePerSqm: number;
  marketTrend: number; // percentage change
  competitorCount: number;
  analysisDate: Date;
  dataSource: string;
}

// Tipos para formulários e UI
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: FormErrors;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
