// API functions for ruleset management
import { initialRulesets } from "../../states/ruleset-state";
import { Ruleset } from "./types";

// Get all rulesets
export async function getAllRulesets(): Promise<Ruleset[]> {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialRulesets);
    }, 500);
  });
}

// Get ruleset by state
export async function getRulesetsByState(state: string): Promise<Ruleset[]> {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = initialRulesets.filter(ruleset => ruleset.state === state);
      resolve(filtered);
    }, 500);
  });
}

// Get ruleset by ID
export async function getRulesetById(id: string): Promise<Ruleset | undefined> {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const ruleset = initialRulesets.find(r => r.id === id || r.name === id);
      resolve(ruleset);
    }, 500);
  });
}

// Add new ruleset
export async function addRuleset(ruleset: Ruleset): Promise<Ruleset[]> {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Logic similar to addRuleset in ruleset-state.js
      const existingIndex = initialRulesets.findIndex(r => 
        r.name.toLowerCase().trim() === ruleset.name.toLowerCase().trim() && 
        r.state === "pending"
      );
      
      let updatedRulesets = [...initialRulesets];
      
      if (existingIndex >= 0) {
        // Replace existing ruleset
        updatedRulesets[existingIndex] = {
          ...ruleset,
          id: initialRulesets[existingIndex].id
        };
      } else {
        // Add new ruleset
        updatedRulesets.push(ruleset);
      }
      
      resolve(updatedRulesets);
    }, 500);
  });
}