import {STATE_DICT} from "@/utils/constants/dc";

export type UDataContractState = (typeof STATE_DICT)[keyof typeof STATE_DICT];

// Data Contract Types
export type TDataContract = {
  name: string;
  version?: string;
  state: UDataContractState;
  team?: string;
  owner?: string;
  updatedAt: string;
};

export type TApproveDCResPayload = TDataContract;

export type TRejectDCResPayload = TDataContract;
