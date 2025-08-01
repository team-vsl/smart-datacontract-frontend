import { create } from "zustand";

// Import constants
import { CONV_ROLES } from "@/objects/message/constants";

type TDCGeneratorState = {
  isEditable: boolean;
  canSubmit: boolean;
  code: string;
  messages: Array<any>;
  result: any;
};

type TDCGeneratorActions = {
  setCanSubmit(status: boolean): void;
  setContent(code: string): void;
  setEditable(status: boolean): void;
  addMessage(message: any, options?: any): void;
  setResult(result: any): void;
  reset(): void;
};

const _initialState: TDCGeneratorState = {
  isEditable: false,
  canSubmit: false,
  code: "string",
  messages: [],
  result: null,
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
  addMessage(message, options) {
    useDCGeneratorState.setState((state) => {
      const messages = state.messages;
      const lastMessage = messages[messages.length - 1];

      if (
        options?.canRemoveAIPlaceHolderMessage &&
        lastMessage?.role === CONV_ROLES.AI &&
        lastMessage?.isPlaceHolder
      ) {
        messages.pop();
      }

      if (!lastMessage || lastMessage.id !== message.id) {
        messages.push(message);
      }

      return {
        ...state,
        messages,
      };
    });
  },
  setResult(result: any) {
    useDCGeneratorState.setState((state) => {
      return { ...state, result };
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
