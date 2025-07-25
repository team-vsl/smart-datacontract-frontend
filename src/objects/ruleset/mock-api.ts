// Mock API for rulesets
import { Ruleset } from "./types";

const mockRulesets: Ruleset[] = [
  {
    id: "rs-001",
    name: "Validation Rules",
    version: "1.0.0",
    state: "pending",
    createdAt: "2024-01-15",
    content: {
      rules: [
        {
          id: "rule-1",
          name: "Required Field Check",
          condition: "field != null"
        }
      ]
    }
  }
];

export const MockRulesetAPI = {
  getAllRulesets: async (): Promise<Ruleset[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockRulesets]), 500);
    });
  },

  getRulesetsByState: async (state: string): Promise<Ruleset[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockRulesets.filter(rs => rs.state === state);
        resolve(filtered);
      }, 500);
    });
  }
};