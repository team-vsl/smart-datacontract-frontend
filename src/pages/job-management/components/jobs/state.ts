// Import types
import type { ChangeStateFn, TSetStateFn } from "src/hooks/use-state-manager";
import type { TJob } from "@/objects/job/types";

// Define a function to get initial state
function getInitialState() {
  return {
    isOpen: true,
    currentJobState: null as string | null,
    currentJobName: null as string | null,
    currentJob: null as TJob | null,
  };
}

// Define a build function to get state modifiers
function buildStateModifiers(
  changeState: ChangeStateFn<ReturnType<typeof getInitialState>>,
  setState: TSetStateFn<ReturnType<typeof getInitialState>>
) {
  return {
    setCurrentJob(newJob: TJob | null) {
      changeState("currentJob", () => {
        return newJob;
      });
    },
    setCurrentJobName(contractId: string | null) {
      changeState("currentJobName", () => {
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

export const JobStateManager = { getInitialState, buildStateModifiers };
