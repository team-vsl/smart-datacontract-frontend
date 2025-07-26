// API functions for ruleset management
import { API } from "../api/index";

// Import types
import type { TRuleset } from "./types";

// Initialize API instance
const api = new API({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export type TGetAllRulesetsParams = {};

// Get all rulesets
export async function reqGetAllRulesets(teamId: string) {
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
  const response = await api.get(`/teams/${teamId}/rulesets`, {
    headers: tokenHeader,
  });
  return response.data;
}

// Get ruleset by state
export async function reqGetRulesetsByState(teamId: string, state: string) {
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
  const response = await api.get(`/teams/${teamId}/rulesets?state=${state}`, {
    headers: tokenHeader,
  });
  return response.data;
}

// Get ruleset by ID
export async function reqGetRulesetById(id: string) {
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
  const response = await api.get(`/rulesets/${id}`, { headers: tokenHeader });
  return response.data;
}

// Note: Add ruleset endpoint not available in backend yet
