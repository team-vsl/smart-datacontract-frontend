import { STATE_DICT } from "@/utils/constants/dc";

export type UDataContractState = (typeof STATE_DICT)[keyof typeof STATE_DICT];

// Data Contract Types
export type TDataContract = {
  id: string;
  name: string;
  version: string;
  state: UDataContractState;
  owner?: string;
  description?: string;
  schema?: any;
  approvedBy?: string;
  rejectedBy?: string;
  reason?: string;
  updatedAt?: string;
  createdAt: string;
};

export type TApproveDCResPayload = TDataContract;

export type TRejectDCResPayload = TDataContract;
