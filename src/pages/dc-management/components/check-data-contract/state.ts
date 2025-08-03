// Import types
import type { ChangeStateFn, TSetStateFn } from "src/hooks/use-state-manager";
import type { TResPayload } from "@/objects/api/types";
import type {
  TApproveDCResPayload,
  TRejectDCResPayload,
} from "@/objects/data-contract/types";

// Define a function to get initial state
function getInitialState() {
  return {
    isOpen: true,
    currentContractId: null as string | null,
    result: null as TResPayload<
      TApproveDCResPayload | TRejectDCResPayload | undefined
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
        TApproveDCResPayload | TRejectDCResPayload | undefined
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
