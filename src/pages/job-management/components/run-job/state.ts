// Import types
import type { ChangeStateFn, TSetStateFn } from "src/hooks/use-state-manager";
import type { TRunJobReqResult } from "@/objects/job/types";

// Define a function to get initial state
function getInitialState() {
  return {
    isOpen: true,
    isRunning: false,
    currentJobName: null as string | null,
    result: null as TRunJobReqResult | null,
  };
}

// Define a build function to get state modifiers
function buildStateModifiers(
  changeState: ChangeStateFn<ReturnType<typeof getInitialState>>,
  setState: TSetStateFn<ReturnType<typeof getInitialState>>
) {
  return {
    setResult(result: TRunJobReqResult | null) {
      changeState("result", () => {
        return result;
      });
    },
    setCurrentJobName(contractId: string | null) {
      changeState("currentJobName", () => {
        return contractId;
      });
    },
    setIsRunning(status?: boolean) {
      changeState("isRunning", () => {
        return Boolean(status);
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

export const RunJobStateManager = { getInitialState, buildStateModifiers };
