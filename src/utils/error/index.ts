import axios, { AxiosError } from "axios";

/**
 * Get error message from error (Axios Error, Default Error and Unexpected Error)
 * @param error
 * @returns
 */
export function getErrorMessage(error: unknown): string {
  // Axios error
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    // Error from server
    if (axiosError.response) {
      const data = axiosError.response.data as any;

      // Standard error
      if (data?.error?.message) {
        return data.error.message;
      }

      // Non-standard error
      return data?.message || axiosError.message;
    }

    // Network error
    if (axiosError.request) {
      return "NETWORK_ERROR";
    }

    // Other error
    return axiosError.message;
  }

  // Default error
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error. Please contact with admin!";
}
