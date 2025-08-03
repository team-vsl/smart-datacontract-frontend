import { create } from "zustand";

// Import utils
import { getItem, setItem } from "@/utils/browser-storage";

// Import types
import type { TUser } from "@/objects/identity/types";

type TIdentityState = {
  user: TUser | null;
  isAuthenticated: boolean;
};

type TIdentityActions = {
  /**
   * Sửa đổi thông tin của người dùng đã đăng nhập
   * @param user
   */
  setUser(user: TUser | null): void;
  /**
   * Sửa đổi giá trị của isAuthenticated
   * @param status
   */
  setIsAuthenticated(status: boolean): void;
  reset(): void;
};

const _initialState: TIdentityState = {
  user: null,
  isAuthenticated: false,
};

const useIdentityState = create<TIdentityState>(() => {
  return {
    ..._initialState,
  };
});

const identityStActions: TIdentityActions = {
  setUser(user) {
    useIdentityState.setState((state) => {
      return {
        ...state,
        user,
      };
    });
  },
  setIsAuthenticated(status: boolean) {
    useIdentityState.setState((state) => {
      return {
        ...state,
        isAuthenticated: status,
      };
    });
  },
  reset() {
    useIdentityState.setState(() => {
      return {
        ..._initialState,
      };
    });
  },
};

export {
  type TIdentityState,
  type TIdentityActions,
  useIdentityState,
  identityStActions,
};
