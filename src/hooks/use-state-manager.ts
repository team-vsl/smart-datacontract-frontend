import React from "react";

export type PreventUpdateFn<T, N extends keyof T> = (
  data: T[N],
  state: T
) => boolean;

export type ChangeStateCallbackFn<T, N extends keyof T> = (
  data: T[N],
  state: T
) => T[N];

export type ChangeStateFn<T> = <N extends keyof T>(
  name: N,
  fn: ChangeStateCallbackFn<T, N>,
  preventUpdate?: PreventUpdateFn<T, N>
) => void;

export type TSetStateFn<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * Use this function to get new state from `fn` and update it
 * @param state
 * @param name
 * @param fn
 * @returns
 */
function _getState<T, N extends keyof T>(
  state: T,
  name: N,
  fn: ChangeStateCallbackFn<T, N>
) {
  return { ...state, [name]: fn(state[name], state) };
}

/**
 * Use this hook to simplify the management of complex state of a component,
 * and build a more readable codebase (more maintainable). See more details
 * in the example
 * @param state
 * @returns
 *
 * @example
 * ```ts
 *  // In this example, we will learn how  to use this hook
 *  // 1. Create a new `state.ts` file in the same component file
 *  // 2. Define state and modifiers
 *  // 3. Export and use them
 *  // Note: you can use this example as a template
 *
 *  import { useStateManager } from "src/hooks/use-state-manager";
 *
 *  // Import types
 *  import type { ChangeStateFn, TSetStateFn } from "src/hooks/use-state-manager";
 *
 *  // Define type of state
 *  export type TUsersScreenState = ReturnType<typeof getInitialState>;
 *
 *  // Define a function to get initial state
 *  function getInitialState(users: Array<TUser>) {
 *    return {
 *      count: 0,
 *      isNewest: true,
 *      users: users || null
 *    }
 *  }
 *
 *  // Define a build function to get state modifiers
 *  function buildStateModifiers(
 *    changeState: ChangeStateFn<TUsersScreenState>,
 *    setState: TSetStateFn<TUsersScreenState>
 *  ) {
 *    return {
 *      setUssers(users: Array<TUser>) {
 *        changeState("users", () => return users);
 *      },
 *      addUsers(users?: Array<TUser> | null) {
 *      if (!users) return;
 *        changeState("users", (data) => { return data.concat(users); });
 *      },
 *      reset(data: any) {
 *        setState(getInitialState(data));
 *      }
 *    }
 *  }
 *
 *  export const UsersScreenStateManager = { getInitialState, buildStateModifiers };
 *  ```
 *
 * @example
 * ```ts
 *  // In this example, we will learn how to use the state manager
 *  // Import hooks
 *  import { useStateManager } from "src/hooks/use-state-manager";
 *
 *  import { UsersScreenStateManager } from "./state.ts";
 *
 *  export default function UsersScreen(props: any) {
 *    const [state, stModifiers] = useStateManager(
 *      UsersScreenStateManager.getInitialState(),
 *      UsersScreenStateManager.buildStateModifiers
 *    );
 *
 *    return <div></div>;
 *  }
 * ```
 */
export function useStateManager<T, O>(
  state: T,
  build: (changeState: ChangeStateFn<T>, setState: TSetStateFn<T>) => O
) {
  // Get state and setState
  const [$, set$] = React.useState<T>(state);

  // Get ESSFns from React.useMemo()
  const _fns = React.useMemo(() => {
    // Create `changeState` function.
    const changeState = function <N extends keyof T>(
      name: N,
      fn: ChangeStateCallbackFn<T, N>,
      /**
       * Use this function to prevent state updating by check
       * its condition
       */
      preventUpdate?: PreventUpdateFn<T, N>
    ) {
      set$(function (prevState) {
        if (preventUpdate && preventUpdate(prevState[name], prevState))
          return prevState;
        return _getState(prevState, name, fn);
      });
    };

    // Use build() to get object that contains functions for component use.
    return build(changeState as ChangeStateFn<T>, set$);
  }, []);

  return [$, _fns] as const;
}
