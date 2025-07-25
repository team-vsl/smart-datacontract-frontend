import { create } from "zustand";

type TDCGeneratorState = {
  isEditable: boolean;
  canSubmit: boolean;
  code: string;
};

type TDCGeneratorActions = {
  setCanSubmit(status: boolean): void;
  setContent(code: string): void;
  setEditable(status: boolean): void;
  reset(): void;
};

const _initialState: TDCGeneratorState = {
  isEditable: false,
  canSubmit: false,
  code: "string",
};

const useDCGeneratorState = create<TDCGeneratorState>(() => {
  return { ..._initialState };
});

const dcGeneratorStActions: TDCGeneratorActions = {
  setCanSubmit(status: boolean) {
    useDCGeneratorState.setState((state) => {
      return { ...state, canSubmit: status };
    });
  },
  setContent(code: string) {
    useDCGeneratorState.setState((state) => {
      return { ...state, code };
    });
  },
  setEditable(status: boolean) {
    useDCGeneratorState.setState((state) => {
      return { ...state, isEditable: status };
    });
  },
  reset() {
    useDCGeneratorState.setState(() => {
      return { ..._initialState };
    });
  },
};

export {
  type TDCGeneratorState,
  type TDCGeneratorActions,
  useDCGeneratorState,
  dcGeneratorStActions,
};
