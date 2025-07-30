import { create } from "zustand";

// Import types
import type { TJobRun } from "@/objects/job/types";

type TJobRunState = {
  jrs: Array<TJobRun>;
};

type TJobRunActions = {
  /**
   * Set danh sách ruleset mới
   * @param jrs
   */
  setJRS(jrs: Array<TJobRun>): void;
  /**
   * Thêm một ruleset mới và trong list
   * @param rl
   */
  addJobRun(rl: TJobRun): void;
  /**
   * Xoá một ruleset khỏi list theo id
   * @param rlId
   */
  removeJobRun(rlId: string): void;
  /**
   * Cập nhật một ruleset mới
   * @param rl
   */
  updateJobRun(rl: TJobRun): void;
  reset(): void;
};

const _initialState: TJobRunState = {
  jrs: [],
};

const useJobRunState = create<TJobRunState>(() => {
  return {
    ..._initialState,
  };
});

const rulesetStActions: TJobRunActions = {
  setJRS(jrs: Array<TJobRun>) {
    useJobRunState.setState((state) => {
      return {
        ...state,
        jrs,
      };
    });
  },
  addJobRun(rl: TJobRun) {
    useJobRunState.setState((state) => {
      state.jrs.push(rl);

      return {
        ...state,
        jrs: state.jrs,
      };
    });
  },
  removeJobRun(rlId: string) {
    useJobRunState.setState((state) => {
      const idx = state.jrs.findIndex((rl) => rl.id === rlId);

      if (idx < 0) return state;

      state.jrs.splice(idx, 1);

      return {
        ...state,
        jrs: state.jrs,
      };
    });
  },
  updateJobRun(rl: TJobRun) {
    useJobRunState.setState((state) => {
      const idx = state.jrs.findIndex((rl) => rl.id === rl.id);

      state.jrs.splice(idx, 1, rl);

      return {
        ...state,
        jrs: state.jrs,
      };
    });
  },
  reset() {
    useJobRunState.setState(() => {
      return {
        ..._initialState,
      };
    });
  },
};

export {
  type TJobRunState,
  type TJobRunActions,
  useJobRunState,
  rulesetStActions,
};
