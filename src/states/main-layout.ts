import { create } from "zustand";

type TMainLayoutState = {
  activeHref: string;
};

type TMainLayoutActions = {
  /**
   * Set giá trị mới cho href theo url
   * @param href
   */
  setActiveHref(href: string): void;
};

const _initialState: TMainLayoutState = {
  activeHref: location.pathname,
};

const useMainLayoutState = create<TMainLayoutState>(() => {
  return {
    ..._initialState,
  };
});

const mainLayoutStActions: TMainLayoutActions = {
  setActiveHref(href) {
    useMainLayoutState.setState((state) => {
      return { ...state, activeHref: href };
    });
  },
};

export {
  type TMainLayoutState,
  type TMainLayoutActions,
  useMainLayoutState,
  mainLayoutStActions,
};
