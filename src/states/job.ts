import { create } from "zustand";

// Import types
import type { TJob, TJobRun } from "@/objects/job/types";

type TJobState = {
  jbrs: Array<TJobRun>;
  jbs: Array<TJob>;
};

type TJobActions = {
  /**
   * Set danh sách job mới
   * @param jbs
   */
  setJBS(jbs: Array<TJob>): void;
  /**
   * Set danh sách job run mới
   * @param jbrs
   */
  setJBRS(jbrs: Array<TJobRun>): void;
  /**
   * Thêm một job mới và trong list
   * @param rl
   */
  addJobRun(rl: TJobRun): void;
  /**
   * Xoá một job khỏi list theo id
   * @param rlId
   */
  removeJobRun(rlId: string): void;
  /**
   * Cập nhật một job mới
   * @param rl
   */
  updateJobRun(rl: TJobRun): void;
  reset(): void;
};

const _initialState: TJobState = {
  jbrs: [],
  jbs: [],
};

const useJobState = create<TJobState>(() => {
  return {
    ..._initialState,
  };
});

const jobStActions: TJobActions = {
  setJBS(jbs: Array<TJob>) {
    useJobState.setState((state) => {
      return {
        ...state,
        jbs,
      };
    });
  },
  setJBRS(jbrs: Array<TJobRun>) {
    useJobState.setState((state) => {
      return {
        ...state,
        jbrs,
      };
    });
  },
  addJobRun(rl: TJobRun) {
    useJobState.setState((state) => {
      state.jbrs.push(rl);

      return {
        ...state,
        jbrs: state.jbrs,
      };
    });
  },
  removeJobRun(rlId: string) {
    useJobState.setState((state) => {
      const idx = state.jbrs.findIndex((rl) => rl.id === rlId);

      if (idx < 0) return state;

      state.jbrs.splice(idx, 1);

      return {
        ...state,
        jbrs: state.jbrs,
      };
    });
  },
  updateJobRun(rl: TJobRun) {
    useJobState.setState((state) => {
      const idx = state.jbrs.findIndex((rl) => rl.id === rl.id);

      state.jbrs.splice(idx, 1, rl);

      return {
        ...state,
        jbrs: state.jbrs,
      };
    });
  },
  reset() {
    useJobState.setState(() => {
      return {
        ..._initialState,
      };
    });
  },
};

export { type TJobState, type TJobActions, useJobState, jobStActions };
