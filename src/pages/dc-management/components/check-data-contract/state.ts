// Import types
import type { ChangeStateFn, TSetStateFn } from "src/hooks/use-state-manager";
import type {
  TApproveDCReqPayload,
  TRejectDCReqPayload,
} from "@/objects/data-contract/types";
import type { TResPayload } from "@/objects/api/types";

// Define a function to get initial state
function getInitialState() {
  return {
    isOpen: true,
    currentContractId: null as string | null,
    result: null as TResPayload<
      TApproveDCReqPayload | TRejectDCReqPayload | undefined
    > | null,
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
    setResult(
      result: TResPayload<
        TApproveDCReqPayload | TRejectDCReqPayload | undefined
      > | null
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

export const CheckDCStateManager = { getInitialState, buildStateModifiers };
