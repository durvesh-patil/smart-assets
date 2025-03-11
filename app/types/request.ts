export enum RequestType {
  REPLACEMENT = 'replacement',
  TRANSFER = 'transfer',
  RETURN = 'return'
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Employee {
  _id: string;
  employeeNo: number;
  fullName: string;
}

export interface AssetTemplate {
  _id: string;
  name: string;
  fields: {
    label: string;
    type: string;
    required: boolean;
  }[];
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

interface Asset {
  _id: string;
  name?: string;
  template_id: AssetTemplate;
  data: Record<string, string | number | boolean | null>;
}

export interface Request {
  _id: string;
  request_type: RequestType;
  status: RequestStatus;
  employee: User | null;
  asset_id: string;
  asset?: Asset;
  asset_template: string;
  reason: string;
  notes?: string;
  transfer_to?: Employee;
  replacement_reason?: string;
  approved_by?: Employee;
  approved_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
} 