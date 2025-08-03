import { API } from "../api";

// Import types
import type { TUser, TSignInResPayload } from "./types";

const api = new API({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export type TSignInParams = {
  username: string;
  password: string;
  idToken?: string;
};

/**
 * Gửi một request tới server các thông tin của người dùng để
 * xác nhận mà lấy uỷ quyền để thực hiện các chức năng
 * @param params
 * @returns
 */
export async function signin(params: TSignInParams) {
  const { username, password, idToken } = params;

  let body = {
    username,
    password,
    idToken,
  };

  const response = await api.post<TSignInResPayload>("/auth/sign-in", body);

  return response.data.data;
}
