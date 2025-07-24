export interface Branch {
  id: string;
  name: string;
  code: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  manager?: {
    id: string;
    name: string;
    email: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  settings?: {
    timezone: string;
    currency: string;
    language: string;
  };
}

export type BranchFormData = Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>;
