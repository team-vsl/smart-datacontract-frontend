import { API } from "../api";

// Import helpers
import { createMockPayload } from "../api/helpers";

const api = new API({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

type TDCGenerateRequestParams = {
  userInput: string;
  team: string;
  isMock: boolean;
};

/**
 * Gửi một yêu cầu tới API để tạo Data Contract
 * @param params
 */
export async function requestToGenerateDataContract(
  params: TDCGenerateRequestParams
) {
  const { userInput, team, isMock = false } = params;
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    // Tạm thời thì setup đại cấu trúc mẫu trả về từ Data Contract Generate.
    // Sau này sẽ xử lý sau.
    return createMockPayload({
      output: {
        message: {
          content: [
            {
              text: "Đây là data contract mà bạn mới tạo xong ...",
              role: "assistant",
            },
          ],
        },
      },
    });
  }

  const response = await api.post(
    `/teams/${team}/data-contract`,
    {
      userInput,
    },
    { headers: tokenHeader }
  );

  return response.data;
}
