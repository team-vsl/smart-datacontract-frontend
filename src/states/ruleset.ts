import { create } from "zustand";

// Import types
import type { TRuleset } from "@/objects/ruleset/types";

type TRulesetState = {
  rls: Array<TRuleset>;
};

type TRulesetActions = {
  /**
   * Set danh sách ruleset mới
   * @param rls
   */
  setRLS(rls: Array<TRuleset>): void;
  /**
   * Thêm một ruleset mới và trong list
   * @param rl
   */
  addRuleset(rl: TRuleset): void;
  /**
   * Xoá một ruleset khỏi list theo id
   * @param rlId
   */
  removeRuleset(rlId: string): void;
  /**
   * Cập nhật một ruleset mới
   * @param rl
   */
  updateRuleset(rl: TRuleset): void;
  reset(): void;
};

const _initialState: TRulesetState = {
  rls: [],
};

const useRulesetState = create<TRulesetState>(() => {
  return {
    ..._initialState,
  };
});

const rulesetStActions: TRulesetActions = {
  setRLS(rls: Array<TRuleset>) {
    useRulesetState.setState((state) => {
      return {
        ...state,
        rls,
      };
    });
  },
  addRuleset(rl: TRuleset) {
    useRulesetState.setState((state) => {
      state.rls.push(rl);

      return {
        ...state,
        rls: state.rls,
      };
    });
  },
  removeRuleset(rlId: string) {
    useRulesetState.setState((state) => {
      const idx = state.rls.findIndex((rl) => rl.id === rlId);

      if (idx < 0) return state;

      state.rls.splice(idx, 1);

      return {
        ...state,
        rls: state.rls,
      };
    });
  },
  updateRuleset(rl: TRuleset) {
    useRulesetState.setState((state) => {
      const idx = state.rls.findIndex((rl) => rl.id === rl.id);

      state.rls.splice(idx, 1, rl);

      return {
        ...state,
        rls: state.rls,
      };
    });
  },
  reset() {
    useRulesetState.setState(() => {
      return {
        ..._initialState,
      };
    });
  },
};

export {
  type TRulesetState,
  type TRulesetActions,
  useRulesetState,
  rulesetStActions,
};
