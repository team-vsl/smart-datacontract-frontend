// Ruleset Types
export interface Ruleset {
  id: string;
  name: string;
  version?: string;
  state: 'active' | 'pending' | 'rejected';
  createdAt: string;
  description?: string;
  reason?: string;
  content: {
    rules?: Array<{
      id: string;
      name: string;
      condition: string;
    }>;
    raw?: string;
  };
  validationStatus?: string;
  owner?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
}