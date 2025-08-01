// Import types
import type {
  AxiosInterceptorManager,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

type TAxiosInterceptor = {
  request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
  response: AxiosInterceptorManager<AxiosResponse>;
};

type TKindOfOnFulfilled = {
  request: (
    value: InternalAxiosRequestConfig<any>
  ) =>
    | InternalAxiosRequestConfig<any>
    | Promise<InternalAxiosRequestConfig<any>>;
  response: (
    value: AxiosResponse<any, any>
  ) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>;
};

type TErrorData = {
  title: string;
  message?: string;
  code: string;
};

type TResPayload<Data> = {
  error?: TErrorData;
  data: Data;
  message?: string;
};

type TResponse<T> = AxiosResponse<TResPayload<T>>;

type THandleHTTPRequestErrorOptions = {
  /**
   * Execute when there is an network error occured
   * @param error
   */
  onNeworkError?(error: any): void;
  /**
   * Execute when there is an error from server's response.
   * This function can receive the standard data from
   * our backend or general error data from all API Services
   * @param error
   * @param standardErrorData
   * @param errorData
   */
  onResponseError?(
    error: AxiosError<TResPayload<null>>,
    standardErrorData?: TErrorData,
    errorData?: any
  ): void;
  /**
   * Execute when there are any other errors
   * @param error
   */
  onOtherErrors?(error: any): void;
  canThrowErrorWhenReachEnd?: boolean;
};

export type {
  TAxiosInterceptor,
  TKindOfOnFulfilled,
  TErrorData,
  TResPayload,
  TResponse,
  THandleHTTPRequestErrorOptions,
};
