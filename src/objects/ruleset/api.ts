// API functions for ruleset management
import { API } from "../api/index";
import { Ruleset } from "./types";

// Initialize API instance
const api = new API({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Get all rulesets
export async function getAllRulesets(teamId: string): Promise<Ruleset[]> {
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
  const response = await api.get(`/teams/${teamId}/rulesets`, { headers: tokenHeader });
  return response.data;
}

// Get ruleset by state
export async function getRulesetsByState(teamId: string, state: string): Promise<Ruleset[]> {
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
  const response = await api.get(`/teams/${teamId}/rulesets?state=${state}`, { headers: tokenHeader });
  return response.data;
}

// Get ruleset by ID
export async function getRulesetById(id: string): Promise<Ruleset | undefined> {
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
  const response = await api.get(`/rulesets/${id}`, { headers: tokenHeader });
  return response.data;
}

// Note: Add ruleset endpoint not available in backend yet