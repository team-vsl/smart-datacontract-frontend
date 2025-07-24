import { create } from "zustand";

// Import configs
import { RouteConfigs } from "@/routes/route-configs";

// Import API from objects
import { DataContractAPI, RulesetAPI } from "@/objects/api";

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
  activeHref: RouteConfigs.Root.Path,
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

// Export API for easy access
export const API = {
  DataContract: DataContractAPI,
  Ruleset: RulesetAPI,
};

export {
  type TMainLayoutState,
  type TMainLayoutActions,
  useMainLayoutState,
  mainLayoutStActions,
};
