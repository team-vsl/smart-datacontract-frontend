import { DC_STATE_DICT } from "@/utils/constants/dc";

export type UDataContractState =
  (typeof DC_STATE_DICT)[keyof typeof DC_STATE_DICT];

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

export type TApproveDCReqPayload = TDataContract;

export type TRejectDCReqPayload = TDataContract;
