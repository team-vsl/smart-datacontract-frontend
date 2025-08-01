// Import types
import type { ChangeStateFn, TSetStateFn } from "src/hooks/use-state-manager";
import type { TResPayload } from "@/objects/api/types";
import type {
  TApproveRLReqPayload,
  TRejectRLReqPayload,
} from "@/objects/ruleset/types";

export type TRulesetUploadFormErrors = {
  name?: string | null;
  content?: string | null;
  [key: string]: string | null | undefined;
};
export type TRulesetUploadForm = {
  name?: string;
  content?: string;
  errors?: TRulesetUploadFormErrors;
};

// Define a function to get initial state
function getInitialState() {
  return {
    isOpen: true,
    currentRulesetId: null as string | null,
    uploadRulesetForm: {
      name: "",
      content: "",
      errors: {},
    } as TRulesetUploadForm,
    result: null as TResPayload<
      TApproveRLReqPayload | TRejectRLReqPayload | undefined
    > | null,
  };
}

// Define a build function to get state modifiers
function buildStateModifiers(
  changeState: ChangeStateFn<ReturnType<typeof getInitialState>>,
  setState: TSetStateFn<ReturnType<typeof getInitialState>>
) {
  return {
    setCurrentRulesetId(contractId: string | null) {
      changeState("currentRulesetId", () => {
        return contractId;
      });
    },
    setResult(
      result: TResPayload<
        TApproveRLReqPayload | TRejectRLReqPayload | undefined
      > | null
    ) {
      changeState("result", () => {
        return result;
      });
    },
    setForm(data: TRulesetUploadForm) {
      changeState("uploadRulesetForm", (state) => {
        return { ...state, ...data };
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

export const UploadRLStateManager = { getInitialState, buildStateModifiers };
