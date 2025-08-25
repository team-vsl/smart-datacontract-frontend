import { STATE_DICT } from "@/utils/constants/rl";

export type URulesetState = (typeof STATE_DICT)[keyof typeof STATE_DICT];

// Ruleset Types
export type TRuleset = {
  id: string;
  name: string;
  version: string;
  state: URulesetState;
  team: string;
  owner: string;
  createdAt: string;
};

export type TApproveRLReqPayload = TRuleset;

export type TRejectRLReqPayload = TRuleset;

export type TUploadRLReqPayload = TRuleset;
