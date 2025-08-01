// API functions for ruleset management
import { API } from "../api/index";

// Import constants
import { STATE_DICT } from "@/utils/constants/dc";

// Import mock data
import rls from "@/assets/mock-data/rulesets/data.json";

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
  name: string;
};

export type TApproveRulesetParams = _Base & {
  id: string;
};

export type TRejectRulesetParams = _Base & {
  id: string;
};

export type TUploadRulesetParams = _Base & {
  data: TRuleset;
};

/**
 * Gửi một yêu cầu để lấy tất cả các ruleset
 * @param params
 * @returns
 */
export async function reqGetAllRulesets(params: TGetAllRulesetsParams) {
  const { isMock = false } = params || {};

  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    return new Promise<TRuleset[]>((resolve) => {
      setTimeout(() => {
        resolve(rls as TRuleset[]);
      }, 500);
    });
  }

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
  const { state, isMock = false } = params || {};

  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    const target = rls.filter((rl) => rl.state === state);

    return new Promise<TRuleset[]>((resolve) => {
      setTimeout(() => {
        resolve(target as TRuleset[]);
      }, 500);
    });
  }

  const response = await api.get<TRuleset[]>(`/rulesets?state=${state}`, {
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
  const { name, isMock = false } = params || {};

  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    const target = rls.find((rl) => rl.name === name);

    return new Promise<TRuleset>((resolve) => {
      setTimeout(() => {
        resolve(target as TRuleset);
      }, 500);
    });
  }

  const response = await api.get<TRuleset>(`/rulesets/${name}`, {
    headers: tokenHeader,
  });

  return response.data.data;
}

export async function reqApproveRuleset(params: TApproveRulesetParams) {
  const { id, isMock = false } = params || {};

  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    const target = rls.find((rl) => rl.id === id);
    if (target) target.state = STATE_DICT.APPROVED;

    return new Promise<TRuleset>((resolve) => {
      setTimeout(() => {
        resolve(target as TRuleset);
      }, 500);
    });
  }

  const response = await api.post<TRuleset>(
    `/rulesets/${params.id}`,
    undefined,
    {
      headers: tokenHeader,
    }
  );

  return response.data.data;
}

export async function reqRejectRuleset(params: TRejectRulesetParams) {
  const { id, isMock = false } = params || {};

  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    const target = rls.find((rl) => rl.id === id);
    if (target) target.state = STATE_DICT.APPROVED;

    return new Promise<TRuleset>((resolve) => {
      setTimeout(() => {
        resolve(target as TRuleset);
      }, 500);
    });
  }

  const response = await api.post<TRuleset>(
    `/rulesets/${params.id}`,
    undefined,
    {
      headers: tokenHeader,
    }
  );

  return response.data.data;
}

export async function reqUploadRuleset(params: TUploadRulesetParams) {
  const { data, isMock = false } = params || {};

  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    return new Promise<TRuleset>((resolve) => {
      setTimeout(() => {
        resolve(data as TRuleset);
      }, 500);
    });
  }

  const response = await api.post<TRuleset>(
    `/rulesets`,
    {
      ruleset: data,
    },
    {
      headers: tokenHeader,
    }
  );

  return response.data.data;
}
