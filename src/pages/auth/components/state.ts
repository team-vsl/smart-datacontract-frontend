// Import types
import type { ChangeStateFn, TSetStateFn } from "src/hooks/use-state-manager";

// Define a function to get initial state
function getInitialState() {
  return {
    canSeePassword: false,
    username: null as string | null,
    password: null as string | null,
    errorMessage: null as string | null,
  };
}

// Define a build function to get state modifiers
function buildStateModifiers(
  changeState: ChangeStateFn<ReturnType<typeof getInitialState>>,
  setState: TSetStateFn<ReturnType<typeof getInitialState>>
) {
  return {
    setCanSeePassword(status: boolean) {
      changeState("canSeePassword", () => {
        return status;
      });
    },
    setUsername(username: string | null) {
      changeState("username", () => {
        return username;
      });
    },
    setPassword(password: string | null) {
      changeState("password", () => {
        return password;
      });
    },
    setErrorMessage(errorMessage: string | null) {
      changeState("errorMessage", () => {
        return errorMessage;
      });
    },
    reset() {
      setState(getInitialState());
    },
  };
}

export const SignInFormStateManager = { getInitialState, buildStateModifiers };
