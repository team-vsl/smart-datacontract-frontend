// Import types
import type { ChangeStateFn, TSetStateFn } from "src/hooks/use-state-manager";
import type { TResPayload } from "@/objects/api/types";
import type {
  TApproveRLReqPayload,
  TRejectRLReqPayload,
} from "@/objects/ruleset/types";

// Define a function to get initial state
function getInitialState() {
  return {
    isOpen: true,
    currentRulesetName: null as string | null,
    currentRulesetVersion: null as string | null,
    currentJobName: null as string | null,
    result: null as TResPayload<
      TApproveRLReqPayload | TRejectRLReqPayload | undefined
    > | null,
  };
}

// Define a build function to get state modifiers
function buildStateModifiers(
  changeState: ChangeStateFn<ReturnType<typeof getInitialState>>,
  setState: TSetStateFn<ReturnType<typeof getInitialState>>,
) {
  return {
    setCurrentRulesetName(contractName: string | null) {
      changeState("currentRulesetName", () => {
        return contractName;
      });
    },
    setCurrentRulesetVersion(contractVersion: string | null) {
      changeState("currentRulesetVersion", () => {
        return contractVersion;
      });
    },
    setCurrentJobName(jobName: string | null) {
      changeState("currentJobName", () => {
        return jobName;
      });
    },
    setResult(
      result: TResPayload<
        TApproveRLReqPayload | TRejectRLReqPayload | undefined
      > | null,
    ) {
      changeState("result", () => {
        return result;
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

export const CheckRLStateManager = { getInitialState, buildStateModifiers };
