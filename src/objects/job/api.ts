import { API } from "../api";

// Import constants
import { STATE_DICT } from "@/utils/constants/dc";

// Import helpers
import { createMockPayload } from "../api/helpers";

// Import mock data
import jbs from "@/assets/mock-data/job/data.json";
import jbrs from "@/assets/mock-data/job-run/data.json";

// Import types
import type { TResPayload } from "../api/types";
import type { TJobRun, TJob } from "./types";

const api = new API({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

type _TBase = {
  isMock?: boolean;
};

export type TStartJobRunParams = _TBase & {
  jobName: string;
};

export type TGetJobRunParams = _TBase & {
  id: string;
  jobName: string;
};

export type TGetJobParams = _TBase & {
  jobName: string;
};

/**
 * Gửi một yêu cầu tới API để tạo Data Contract
 * @param params
 */
export async function reqStartJobRun(params: TStartJobRunParams) {
  const { jobName, isMock = false } = params || {};
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    // Tạm thời thì setup đại cấu trúc mẫu trả về từ Data Contract Generate.
    // Sau này sẽ xử lý sau.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message:
            "Đây là data contract mà mình đã tạo, bằng cách là tổng hợp các yêu cầu " +
            "của bạn và những dữ liệu mà mình đang có. Bên dưới là kết quả",
          data: {},
        });
      }, 2000);
    });
  }

  const response = await api.post(
    `/glue-jobs/${jobName}`,
    {},
    { headers: tokenHeader }
  );

  return response.data.data;
}

/**
 * Gửi một yêu cầu để lấy toàn bộ data contracts
 * @param params
 */
export async function reqGetJobRun(params: TGetJobRunParams) {
  const { id, jobName, isMock = false } = params || {};
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    return new Promise<TJobRun[]>((resolve) => {
      setTimeout(() => {
        resolve(jbrs as TJobRun[]);
      }, 500);
    });
  }

  const response = await api.get<TJobRun[]>(
    `/glue-jobs/${jobName}/run-status/${id}`,
    {
      headers: tokenHeader,
    }
  );

  return response.data.data;
}

/**
 * Gửi một yêu cầu để lấy toàn bộ data contracts
 * @param params
 */
export async function reqGetJob(params: TGetJobParams) {
  const { jobName, isMock = false } = params || {};
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    const target = jbs.filter((dc) => dc.name === jobName);

    return new Promise<TJob[]>((resolve) => {
      setTimeout(() => {
        resolve(target as TJob[]);
      }, 500);
    });
  }

  const response = await api.get<TJob[]>(`/glue-jobs/${jobName}`, {
    headers: tokenHeader,
  });

  return response.data.data;
}
