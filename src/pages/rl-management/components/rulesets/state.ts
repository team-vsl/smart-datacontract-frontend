// Import types
import type { ChangeStateFn, TSetStateFn } from "src/hooks/use-state-manager";
import type { TRuleset } from "@/objects/ruleset/types";

// Define a function to get initial state
function getInitialState() {
  return {
    isOpen: true,
    currentRulesetState: null as string | null,
    currentRulesetId: null as string | null,
    currentRulesetName: null as string | null,
    currentRuleset: null as TRuleset | null,
  };
}

// Define a build function to get state modifiers
function buildStateModifiers(
  changeState: ChangeStateFn<ReturnType<typeof getInitialState>>,
  setState: TSetStateFn<ReturnType<typeof getInitialState>>
) {
  return {
    setCurrentRuleset(newRuleset: TRuleset | null) {
      changeState("currentRuleset", () => {
        return newRuleset;
      });
    },
    setCurrentRulesetId(contractId: string | null) {
      changeState("currentRulesetId", () => {
        return contractId;
      });
    },
    setCurrentRulesetName(name: string | null) {
      changeState("currentRulesetName", () => {
        return name;
      });
    },
    setCurrentRulesetState(contractState: string | null) {
      changeState("currentRulesetState", () => {
        return contractState;
      });
    },
    setIsOpen(status?: boolean) {
      changeState("isOpen", () => {
        return Boolean(status);
      });
    },
    reset() {
      setState(getInitialState());
    },
  };
}

export const RLStateManager = { getInitialState, buildStateModifiers };
