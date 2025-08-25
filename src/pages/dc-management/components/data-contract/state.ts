// Import types
import type {ChangeStateFn, TSetStateFn} from "src/hooks/use-state-manager";
import type {TDataContract} from "@/objects/data-contract/types";

// Define a function to get initial state
function getInitialState() {
  return {
    isOpen: true,
    currentDataContractContent: null as string | null,
    currentContractState: null as string | null,
    currentContractName: null as string | null,
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
    setCurrentContractContent(content: string | null) {
      changeState("currentDataContractContent", () => {
        return content;
      });
    },
    setCurrentContractName(contractName: string | null) {
      changeState("currentContractName", () => {
        return contractName;
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

export const DCStateManager = {getInitialState, buildStateModifiers};
