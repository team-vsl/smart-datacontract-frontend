import { create } from "zustand";

// Import types
import type { TDataContract } from "@/objects/data-contract/types";

type TDataContractState = {
  dcs: Array<TDataContract>;
};

type TDataContractActions = {
  /**
   * Set danh sách data contract mới
   * @param dcs
   */
  setDCS(dcs: Array<TDataContract>): void;
  /**
   * Thêm một data contract mới và trong list
   * @param dc
   */
  addDataContract(dc: TDataContract): void;
  /**
   * Xoá một data contract khỏi list theo id
   * @param dc
   */
  removeDataContract(dcId: string): void;
  /**
   * Cập nhật một data contract mới
   * @param dc
   */
  updateDataContract(dc: TDataContract): void;
  reset(): void;
};

const _initialState: TDataContractState = {
  dcs: [],
};

const useDataContractState = create<TDataContractState>(() => {
  return {
    ..._initialState,
  };
});

const dataContractStActions: TDataContractActions = {
  setDCS(dcs: Array<TDataContract>) {
    useDataContractState.setState((state) => {
      return {
        ...state,
        dcs,
      };
    });
  },
  addDataContract(dc: TDataContract) {
    useDataContractState.setState((state) => {
      state.dcs.push(dc);

      return {
        ...state,
        dcs: state.dcs,
      };
    });
  },
  removeDataContract(dcId: string) {
    useDataContractState.setState((state) => {
      const idx = state.dcs.findIndex((dc) => dc.id === dcId);

      if (idx < 0) return state;

      state.dcs.splice(idx, 1);

      return {
        ...state,
        dcs: state.dcs,
      };
    });
  },
  updateDataContract(dc: TDataContract) {
    useDataContractState.setState((state) => {
      const idx = state.dcs.findIndex((dc) => dc.id === dc.id);

      state.dcs.splice(idx, 1, dc);

      return {
        ...state,
        dcs: state.dcs,
      };
    });
  },
  reset() {
    useDataContractState.setState(() => {
      return {
        ..._initialState,
      };
    });
  },
};

export {
  type TDataContractState,
  type TDataContractActions,
  useDataContractState,
  dataContractStActions,
};
