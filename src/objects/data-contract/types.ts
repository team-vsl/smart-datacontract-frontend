// Data Contract Types
export interface DataContract {
  id: string;
  name: string;
  version: string;
  state: 'active' | 'pending' | 'archived';
  createdAt: string;
  owner?: string;
  description?: string;
  schema?: any;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  reason?: string;
}