// Import types
import type { ChangeStateFn, TSetStateFn } from "src/hooks/use-state-manager";
import type { TJobRun } from "@/objects/job/types";

// Define a function to get initial state
function getInitialState() {
  return {
    isOpen: true,
    jbrs: [] as Array<TJobRun>,
    currentJobRunId: null as string | null,
    currentJobRunState: null as string | null,
    currentJobName: null as string | null,
    currentJobRun: null as TJobRun | null,
  };
}

// Define a build function to get state modifiers
function buildStateModifiers(
  changeState: ChangeStateFn<ReturnType<typeof getInitialState>>,
  setState: TSetStateFn<ReturnType<typeof getInitialState>>
) {
  return {
    setJBRS(jbrs: Array<TJobRun>) {
      changeState("jbrs", () => {
        return jbrs;
      });
    },
    setCurrentJobRunId(jobRunId: string) {
      changeState("currentJobRunId", () => {
        return jobRunId;
      });
    },
    setCurrentJobRun(newJobRun: TJobRun | null) {
      changeState("currentJobRun", () => {
        return newJobRun;
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

export const JobRunStateManager = { getInitialState, buildStateModifiers };
