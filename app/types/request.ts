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
}

export interface Request {
  _id: string;
  request_type: RequestType;
  status: RequestStatus;
  employee: Employee;
  asset_id: string;
  asset_template: AssetTemplate;
  reason: string;
  notes?: string;
  transfer_to?: Employee;
  replacement_reason?: string;
  approved_by?: Employee;
  approved_at?: string;
  completed_at?: string;
  created_at: string;
} 