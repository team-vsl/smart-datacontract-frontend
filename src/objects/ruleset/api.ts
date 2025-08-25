// API functions for ruleset management
import { API } from "../api/index";

// Import constants
import { STATE_DICT } from "@/utils/constants/rl";

// Import mock data
import rls from "@/assets/mock-data/rulesets/data.json";

// Import types
import type { TRuleset } from "./types";
import type { TDataContract } from "../data-contract/types";

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
  version?: string;
  state?: string;
};

export type TActiveRulesetParams = _Base & {
  name: string;
  jobName: string;
  version: string;
  currentActiveRulesetName?: string;
  currentActiveRulesetVersion?: string;
};

export type TInactiveRulesetParams = _Base & {
  name: string;
  version: string;
};

export type TUploadRulesetParams = _Base & {
  content: string;
  name: string;
  version: string;
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
  const { name, state, isMock = false } = params || {};

  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve('Rules = [ColumnExists "id"]');
      }, 500);
    });
  }

  const response = await api.get<string>(`/rulesets/${name}?state=${state}`, {
    headers: tokenHeader,
  });

  return response.data;
}

export async function reqGetRulesetInfo(params: TGetRulesetParams) {
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

  const response = await api.get<TRuleset>(`/rulesets/${name}/info`, {
    headers: tokenHeader,
  });

  return response.data.data;
}

export async function reqActiveRuleset(params: TActiveRulesetParams) {
  const {
    name,
    version,
    jobName,
    currentActiveRulesetName,
    currentActiveRulesetVersion,
    isMock = false,
  } = params || {};

  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    const target = rls.find((rl) => rl.name === name);
    if (target) target.state = STATE_DICT.ACTIVE;

    return new Promise<TRuleset>((resolve) => {
      setTimeout(() => {
        resolve(target as TRuleset);
      }, 500);
    });
  }

  const response = await api.post<TRuleset>(
    `/rulesets/${name}/activation`,
    { jobName, version, currentActiveRulesetName, currentActiveRulesetVersion },
    {
      headers: tokenHeader,
    },
  );

  return response.data.data;
}

export async function reqInactiveRuleset(params: TInactiveRulesetParams) {
  const { name, version, isMock = false } = params || {};

  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    const target = rls.find((rl) => rl.name === name);
    if (target) target.state = STATE_DICT.INACTIVE;

    return new Promise<TRuleset>((resolve) => {
      setTimeout(() => {
        resolve(target as TRuleset);
      }, 500);
    });
  }

  const response = await api.post<TRuleset>(
    `/rulesets/${name}/inactivation`,
    { version },
    {
      headers: tokenHeader,
    },
  );

  return response.data.data;
}

export async function reqUploadRuleset(params: TUploadRulesetParams) {
  const { content, version, name, isMock = false } = params || {};

  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    return new Promise<TRuleset>((resolve) => {
      setTimeout(() => {
        resolve({} as TRuleset);
      }, 500);
    });
  }

  const response = await api.post<TRuleset>(
    `/ruleset/upload`,
    {
      content,
      version,
      name,
    },
    {
      headers: tokenHeader,
    },
  );

  return response.data.data;
}
