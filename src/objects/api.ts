// Central API file for the application
import { initialDataContracts } from "../states/data-contract-state";
import { initialRulesets } from "../states/ruleset-state";

// Data Contract Types
export interface DataContract {
  id: string;
  name: string;
  version: string;
  state: string;
  createdAt: string;
  owner?: string;
  description?: string;
  schema?: any;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  reason?: string;
}

// Ruleset Types
export interface Ruleset {
  id: string;
  name: string;
  version?: string;
  state: "active" | "pending" | "rejected";
  createdAt: string;
  description?: string;
  reason?: string;
  content: {
    rules?: Array<{
      id: string;
      name: string;
      condition: string;
    }>;
    raw?: string;
  };
  validationStatus?: string;
  owner?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
}

// Global state to maintain data contracts
let globalDataContracts = [...initialDataContracts];
let globalRulesets = [...initialRulesets];


// Data Contract API Functions
export const DataContractAPI = {
  // Get all data contracts
  getAllDataContracts: async (): Promise<DataContract[]> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...globalDataContracts]);
      }, 500);
    });
  },

  // Get data contracts by state
  getDataContractsByState: async (state: string): Promise<DataContract[]> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = globalDataContracts.filter(contract => contract.state === state);
        resolve(filtered);
      }, 500);
    });
  },

  // Get data contract by ID
  getDataContractById: async (id: string): Promise<DataContract | undefined> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const contract = globalDataContracts.find(c => c.id === id);
        resolve(contract);
      }, 500);
    });
  },

  // Approve data contract
  approveDataContract: async (id: string): Promise<DataContract[]> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        globalDataContracts = globalDataContracts.map(contract => 
          contract.id === id ? { 
            ...contract, 
            state: "active",
            owner: "Data Engineer",
            description: "This is an approved data contract",
            schema: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                value: { type: "number" }
              }
            },
            approvedAt: new Date().toISOString(),
            approvedBy: "Data Engineer",
          } : contract
        );
        resolve([...globalDataContracts]);
      }, 500);
    });
  },

  // Reject data contract
  rejectDataContract: async (id: string, reason: string): Promise<DataContract[]> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        globalDataContracts = globalDataContracts.map(contract => 
          contract.id === id ? { 
            ...contract, 
            state: "archived",
            owner: "Data Engineer",
            description: "This data contract was rejected",
            schema: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                value: { type: "number" }
              }
            },
            rejectedAt: new Date().toISOString(),
            rejectedBy: "Data Engineer",
            reason: reason || "Data schema không đáp ứng yêu cầu",
          } : contract
        );
        resolve([...globalDataContracts]);
      }, 500);
    });
  }
};

// Ruleset API Functions
export const RulesetAPI = {
  // Get all rulesets
  getAllRulesets: async (): Promise<Ruleset[]> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...globalRulesets]);
      }, 500);
    });
  },

  // Get ruleset by state
  getRulesetsByState: async (state: string): Promise<Ruleset[]> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = globalRulesets.filter(ruleset => ruleset.state === state);
        resolve(filtered);
      }, 500);
    });
  },

  // Get ruleset by ID
  getRulesetById: async (id: string): Promise<Ruleset | undefined> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const ruleset = globalRulesets.find(r => r.id === id || r.name === id);
        resolve(ruleset);
      }, 500);
    });
  },

  // Add new ruleset
  addRuleset: async (ruleset: Ruleset): Promise<Ruleset[]> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Logic similar to addRuleset in ruleset-state.js
        const existingIndex = globalRulesets.findIndex(r => 
          r.name.toLowerCase().trim() === ruleset.name.toLowerCase().trim() && 
          r.state === "pending"
        );
        
        if (existingIndex >= 0) {
          // Replace existing ruleset
          globalRulesets[existingIndex] = {
            ...ruleset,
            id: globalRulesets[existingIndex].id
          };
        } else {
          // Add new ruleset
          globalRulesets.push(ruleset);
        }
        
        resolve([...globalRulesets]);
      }, 500);
    });
  },

  // Approve ruleset
  approveRuleset: async (id: string): Promise<Ruleset[]> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        globalRulesets = globalRulesets.map(ruleset => 
          ruleset.id === id ? { 
            ...ruleset, 
            state: "active",
            owner: "Data Engineer",
            description: "This is an approved ruleset",
            approvedAt: new Date().toISOString(),
            approvedBy: "Data Engineer",
          } : ruleset
        );
        resolve([...globalRulesets]);
      }, 500);
    });
  },

  // Reject ruleset
  rejectRuleset: async (id: string, reason: string): Promise<Ruleset[]> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        globalRulesets = globalRulesets.map(ruleset => 
          ruleset.id === id ? { 
            ...ruleset, 
            state: "rejected",
            owner: "Data Engineer",
            description: "This ruleset was rejected",
            rejectedAt: new Date().toISOString(),
            rejectedBy: "Data Engineer",
            reason: reason || "Ruleset không đáp ứng yêu cầu",
          } : ruleset
        );
        resolve([...globalRulesets]);
      }, 500);
    });
  }
};