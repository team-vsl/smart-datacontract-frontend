import { create } from "zustand";

type TMainLayoutState = {
  activeHref: string;
  sideNavigation: {
    isOpen: boolean;
  };
  helpPanel: {
    isOpen: boolean;
  };
};

type TMainLayoutActions = {
  /**
   * Set giá trị mới cho href theo url
   * @param href
   */
  setActiveHref(href: string): void;
  /**
   * Set giá trị mở hoặc đóng cho Side Navigation
   * @param status
   */
  setNavigationOpen(status: boolean): void;
  /**
   * Set giá trị hoặc đóng cho Help Panel
   * @param status
   */
  setHelpPanelOpen(status: boolean): void;
};

const _initialState: TMainLayoutState = {
  activeHref: location.pathname,
  sideNavigation: {
    isOpen: true,
  },
  helpPanel: {
    isOpen: false,
  },
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
  setNavigationOpen(status: boolean) {
    useMainLayoutState.setState((state) => {
      return {
        ...state,
        sideNavigation: { ...state.sideNavigation, isOpen: status },
      };
    });
  },
  setHelpPanelOpen(status: boolean) {
    useMainLayoutState.setState((state) => {
      return {
        ...state,
        helpPanel: { ...state.helpPanel, isOpen: status },
      };
    });
  },
};

export {
  type TMainLayoutState,
  type TMainLayoutActions,
  useMainLayoutState,
  mainLayoutStActions,
};
