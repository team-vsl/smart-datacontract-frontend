// API functions for ruleset management
import { API } from "../api/index";

// Import types
import type { TRuleset } from "./types";

// Initialize API instance
const api = new API({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

type _Base = {
  isMock?: boolean;
};

export type TGetAllRulesetsParams = _Base & {};

export type TGetRulesetsByStateParams = _Base & {
  state: string;
};

export type TGetRulesetParams = _Base & {
  id: string;
};

export type TApproveRulesetParams = _Base & {
  id: string;
};

export type TRejectRulesetParams = _Base & {
  id: string;
};

/**
 * Gửi một yêu cầu để lấy tất cả các ruleset
 * @param params
 * @returns
 */
export async function reqGetAllRulesets(params: TGetAllRulesetsParams) {
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
  const response = await api.get(`/rulesets`, {
    headers: tokenHeader,
  });
  return response.data.data;
}

/**
 * Gửi một yêu cầu để lấy các ruleset theo state
 * @param params
 * @returns
 */
export async function reqGetRulesetsByState(params: TGetRulesetsByStateParams) {
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
  const response = await api.get(`/rulesets?state=${params.state}`, {
    headers: tokenHeader,
  });
  return response.data.data;
}

/**
 * Gửi một yêu cầu để lấy ruleset
 * @param params
 * @returns
 */
export async function reqGetRuleset(params: TGetRulesetParams) {
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
  const response = await api.get(`/rulesets/${params.id}`, {
    headers: tokenHeader,
  });
  return response.data.data;
}

export async function reqApproveRuleset(params: TApproveRulesetParams) {
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
  const response = await api.post(`/rulesets/${params.id}`, undefined, {
    headers: tokenHeader,
  });
  return response.data.data;
}

export async function reqRejectRuleset(params: TRejectRulesetParams) {
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
  const response = await api.post(`/rulesets/${params.id}`, undefined, {
    headers: tokenHeader,
  });
  return response.data.data;
}
