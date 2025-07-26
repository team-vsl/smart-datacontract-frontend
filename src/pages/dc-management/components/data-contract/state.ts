// Import types
import type { ChangeStateFn, TSetStateFn } from "src/hooks/use-state-manager";
import type { TDataContract } from "@/objects/data-contract/types";

// Define a function to get initial state
function getInitialState() {
  return {
    isOpen: true,
    currentContractState: null as string | null,
    currentContractId: null as string | null,
    currentContract: null as TDataContract | null,
  };
}

// Define a build function to get state modifiers
function buildStateModifiers(
  changeState: ChangeStateFn<ReturnType<typeof getInitialState>>,
  setState: TSetStateFn<ReturnType<typeof getInitialState>>
) {
  return {
    setCurrentContract(newContract: TDataContract | null) {
      changeState("currentContract", () => {
        return newContract;
      });
    },
    setCurrentContractId(contractId: string | null) {
      changeState("currentContractId", () => {
        return contractId;
      });
    },
    setCurrentContractState(contractState: string | null) {
      changeState("currentContractState", () => {
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

export const DCStateManager = { getInitialState, buildStateModifiers };
