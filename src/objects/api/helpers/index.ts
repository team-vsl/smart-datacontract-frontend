// Import types
import type { THandleHTTPRequestErrorOptions, TResPayload } from "../types";

/**
 * Handle error from HTTP Request, compatible with Axios
 * @param error
 */
function handleHTTPRequestError(error: any, options?: THandleHTTPRequestErrorOptions) {
  // Handle network errors
  if (error.response) {
    // The request was made and a response with status code outside the range of 2xx was received
    // We need to check if the response is created from our standard
    if (options && options.onResponseError) {
      if (error.response.data) {
        options.onResponseError(error, error.response.data.error);
      } else options.onResponseError(error);
    }
  } else if (error.request) {
    // The request was made and a response was not received
    if (options && options.onNeworkError) {
      options.onNeworkError(error);
    }
  } else {
    // Something happened in setting up the request that triggered an error
    if (options && options.onOtherErrors) {
      options.onOtherErrors(error);
    }
  }

  // Throw error to parent execution to process this error
  if (options && options.canThrowErrorWhenReachEnd) {
    throw error;
  }
}

/**
 * Tạo một payload giả cho response
 * @param data
 * @returns
 */
function createMockPayload<T>(data: T) {
  const payload: TResPayload<T> = {
    error: undefined,
    data,
  };

  return payload;
}

export { handleHTTPRequestError, createMockPayload };
