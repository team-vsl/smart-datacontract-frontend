// Central API file for the application
import { API } from "./api";
import { DataContract } from "./data-contract/types";
import { Ruleset } from "./ruleset/types";

// Re-export types for backward compatibility
export type { DataContract, Ruleset };

// Initialize API instance
const api = new API({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Data Contract API Functions
export const DataContractAPI = {
  // Get all data contracts
  getAllDataContracts: async (teamId: string): Promise<DataContract[]> => {
    const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
    const response = await api.get(`/teams/${teamId}/data-contracts`, { headers: tokenHeader });
    return response.data;
  },

  // Get data contracts by state
  getDataContractsByState: async (teamId: string, state: string): Promise<DataContract[]> => {
    const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
    const response = await api.get(`/teams/${teamId}/data-contracts?state=${state}`, { headers: tokenHeader });
    return response.data;
  },

  // Get data contract by ID
  getDataContractById: async (id: string): Promise<DataContract | undefined> => {
    const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
    const response = await api.get(`/data-contracts/${id}`, { headers: tokenHeader });
    return response.data;
  },

  // Note: Approve/Reject endpoints not available in backend yet
};

// Ruleset API Functions
export const RulesetAPI = {
  // Get all rulesets
  getAllRulesets: async (teamId: string): Promise<Ruleset[]> => {
    const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
    const response = await api.get(`/teams/${teamId}/rulesets`, { headers: tokenHeader });
    return response.data;
  },

  // Get ruleset by state
  getRulesetsByState: async (teamId: string, state: string): Promise<Ruleset[]> => {
    const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
    const response = await api.get(`/teams/${teamId}/rulesets?state=${state}`, { headers: tokenHeader });
    return response.data;
  },

  // Get ruleset by ID
  getRulesetById: async (id: string): Promise<Ruleset | undefined> => {
    const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;
    const response = await api.get(`/rulesets/${id}`, { headers: tokenHeader });
    return response.data;
  },

  // Note: Add/Approve/Reject endpoints not available in backend yet
};