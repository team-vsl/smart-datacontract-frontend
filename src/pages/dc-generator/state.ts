// Import types
import type { TDCEditorState } from "./types";
import type { ChangeStateFn, TSetStateFn } from "src/hooks/use-state-manager";

// Define a function to get initial state
function getInitialState(code: string) {
  const _state: TDCEditorState = {
    isEditable: false,
    canSubmit: false,
    code: code,
  };

  return _state;
}

// Define a build function to get state modifiers
function buildStateModifiers(
  changeState: ChangeStateFn<TDCEditorState>,
  setState: TSetStateFn<TDCEditorState>
) {
  return {
    setCanSubmit(status: boolean) {
      changeState("canSubmit", function () {
        return status;
      });
    },
    setContent(code: string) {
      changeState("code", function () {
        return code;
      });
    },
    setEditable(status: boolean) {
      changeState("isEditable", function () {
        return status;
      });
    },
    reset() {
      setState(getInitialState(""));
    },
  };
}

export const DCGeneratorStateManager = { getInitialState, buildStateModifiers };
