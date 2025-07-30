import { STATE_DICT } from "@/utils/constants/dc";

export type URulesetState = (typeof STATE_DICT)[keyof typeof STATE_DICT];

// Ruleset Types
export type TRuleset = {
  id: string;
  name: string;
  version?: string;
  state: URulesetState;
  description?: string;
  reason?: string;
  validationStatus?: string;
  owner?: string;
  approvedBy?: string;
  rejectedBy?: string;
  updatedAt?: string;
  createdAt: string;
};

export type TApproveRLReqPayload = TRuleset;

export type TRejectRLReqPayload = TRuleset;

export type TUploadRLReqPayload = TRuleset;
