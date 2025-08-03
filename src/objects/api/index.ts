import axios from "axios";

// Import from utils
import * as CookieUtils from "@/utils/cookie";
import * as StringUtils from "@/utils/string";

// Import types
import type { Axios, AxiosRequestConfig, AxiosInterceptorOptions } from "axios";
import type {
  TAxiosInterceptor,
  TKindOfOnFulfilled,
  TResPayload,
} from "./types";

export class API {
  private _http!: Axios;

  constructor(config?: AxiosRequestConfig) {
    this._http = axios.create(config);
  }

  static getToken(name: string = "tkn") {
    return CookieUtils.readCookie(CookieUtils.TOKEN_NAME + name);
  }

  static generateBearerToken(token: string, isHTTPHeader: boolean = false) {
    const result = `Bearer ${token}`;
    if (isHTTPHeader) return { Authorization: result };
    return result;
  }

  /**
   * Unsubscribe the listener.
   * @param type
   * @param id
   */
  unHook<Type extends keyof TAxiosInterceptor>(type: Type, id: number) {
    this._http.interceptors[type].eject(id);
  }

  /**
   * Subscribe a listener to the lifecycle of a request.
   * @param type
   * @param onFulfilled
   * @param onRejected
   * @param options
   * @returns
   */
  hook<Type extends keyof TKindOfOnFulfilled>(
    type: Type,
    onFulfilled?: TKindOfOnFulfilled[Type] | null | undefined,
    onRejected?: ((error: any) => any) | null,
    options?: AxiosInterceptorOptions
  ) {
    if (type === "request") {
      onFulfilled;
      return this._http.interceptors.request.use(
        onFulfilled as TKindOfOnFulfilled["request"],
        onRejected,
        options
      );
    }

    return this._http.interceptors.response.use(
      onFulfilled as TKindOfOnFulfilled["response"],
      onRejected
    );
  }

  /**
   * Make a HTTP Get request
   * @param path
   * @param config
   * @returns
   */
  async get<TData>(path: string, config?: AxiosRequestConfig) {
    try {
      const response = await this._http.get<TResPayload<TData>>(
        StringUtils.formatURL(path),
        config
      );
      return response;
    } catch (e: any) {
      throw e;
    }
  }

  /**
   * Make a HTTP Post request
   * @param path
   * @param config
   * @returns
   */
  async post<TData, T = any>(
    path: string,
    data: T,
    config?: AxiosRequestConfig
  ) {
    try {
      const response = await this._http.post<TResPayload<TData>>(
        StringUtils.formatURL(path),
        data,
        config
      );
      return response;
    } catch (e: any) {
      throw e;
    }
  }

  /**
   * Make a HTTP Put request
   * @param path
   * @param data
   * @param config
   * @returns
   */
  async put<TData, T = any>(
    path: string,
    data: T,
    config?: AxiosRequestConfig
  ) {
    try {
      const response = await this._http.put<TResPayload<TData>>(
        StringUtils.formatURL(path),
        data,
        config
      );
      return response;
    } catch (e: any) {
      throw e;
    }
  }

  /**
   * Make a HTTP Patch request
   * @param path
   * @param data
   * @param config
   * @returns
   */
  async patch<TData, T = any>(
    path: string,
    data: T,
    config?: AxiosRequestConfig
  ) {
    try {
      const response = await this._http.patch<TResPayload<TData>>(
        StringUtils.formatURL(path),
        data,
        config
      );
      return response;
    } catch (e: any) {
      throw e;
    }
  }

  /**
   * Make a HTTP Delete request
   * @param path
   * @param data
   * @param config
   * @returns
   */
  async delete<TData>(path: string, config?: AxiosRequestConfig) {
    try {
      const response = await this._http.delete<TResPayload<TData>>(
        StringUtils.formatURL(path),
        config
      );
      return response;
    } catch (e: any) {
      throw e;
    }
  }
}
