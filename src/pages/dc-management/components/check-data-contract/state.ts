// Import types
import type { ChangeStateFn, TSetStateFn } from "src/hooks/use-state-manager";
import type { TDataContract } from "@/objects/data-contract/types";

// Define a function to get initial state
function getInitialState() {
  return {
    isOpen: true,
    currentContractId: null as string | null,
  };
}

// Define a build function to get state modifiers
function buildStateModifiers(
  changeState: ChangeStateFn<ReturnType<typeof getInitialState>>,
  setState: TSetStateFn<ReturnType<typeof getInitialState>>
) {
  return {
    setCurrentContractId(contractId: string | null) {
      changeState("currentContractId", () => {
        return contractId;
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

export const CheckDCStateManager = { getInitialState, buildStateModifiers };
