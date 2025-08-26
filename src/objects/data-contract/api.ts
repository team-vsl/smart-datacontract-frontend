import { API } from "../api";

// Import constants
import { STATE_DICT } from "@/utils/constants/dc";

// Import helpers
import { createMockPayload } from "../api/helpers";

// Import mock data
import dcs from "@/assets/mock-data/data-contracts/data.json";

// Import types
import type { TResPayload } from "../api/types";
import type { TDataContract } from "./types";

const api = new API({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

type _TBase = {
  isMock?: boolean;
};

export type TDCGenerateRequestParams = _TBase & {
  userInput: string;
};

export type TGetAllDataContractsParams = _TBase & {};

export type TGetDataContractByStateParams = _TBase & {
  state: string;
};

export type TGetDataContractParams = _TBase & {
  name: string;
  version?: string;
  state?: string;
};

export type TApproveDataContractParams = _TBase & {
  name: string;
  version: string;
};

export type TApproveDataContractResPayload = {
  dataContractInfo: TDataContract;
  rulesetName: string;
};

export type TRejectDataContractParams = _TBase & {
  name: string;
  version: string;
};

export type TUploadDataContractParams = _TBase & {
  content: string;
};

/**
 * Gửi một yêu cầu tới API để tạo Data Contract
 * @param params
 */
export async function reqGenerateDataContract(
  params: TDCGenerateRequestParams,
) {
  const { userInput, isMock = false } = params || {};
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
    `/data-contract`,
    {
      content: userInput,
    },
    { headers: tokenHeader },
  );

  console.log("Data Contract Generation Response:", response);

  return response.data.data;
}

/**
 * Gửi một yêu cầu để lấy toàn bộ data contracts
 * @param params
 */
export async function reqGetAllDataContracts(
  params: TGetAllDataContractsParams,
) {
  const { isMock = false } = params || {};
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    return new Promise<TDataContract[]>((resolve) => {
      setTimeout(() => {
        resolve(dcs as TDataContract[]);
      }, 500);
    });
  }

  const response = await api.get<TDataContract[]>(`/data-contracts`, {
    headers: tokenHeader,
  });

  return response.data.data;
}

/**
 * Gửi một yêu cầu để lấy toàn bộ data contracts
 * @param params
 */
export async function reqGetDataContractsByState(
  params: TGetDataContractByStateParams,
) {
  const { state, isMock = false } = params || {};
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    const target = dcs.filter((dc) => dc.state === state);

    return new Promise<TDataContract[]>((resolve) => {
      setTimeout(() => {
        resolve(target as unknown as TDataContract[]);
      }, 500);
    });
  }

  const response = await api.get<TDataContract[]>(
    `/data-contracts?state=${state}`,
    {
      headers: tokenHeader,
    },
  );

  return response.data.data;
}

/**
 * Gửi một yêu cầu để lấy chi tiết một data contract theo id
 * @param params
 */
export async function reqGetDataContract(params: TGetDataContractParams) {
  const { name, state, isMock = false } = params || {};
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("version: 1.0.0");
      }, 500);
    });
  }

  const response = await api.get<string>(
    `/data-contracts/${name}?state=${state}`,
    {
      headers: tokenHeader,
    },
  );

  return response.data;
}

/**
 * Gửi một yêu cầu để lấy chi tiết một data contract theo id
 * @param params
 */
export async function reqGetDataContractInfo(params: TGetDataContractParams) {
  const { name, isMock = false } = params || {};
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    const target = dcs.find((dc) => dc.name === name);

    return new Promise<TDataContract>((resolve) => {
      setTimeout(() => {
        resolve(target as unknown as TDataContract);
      }, 500);
    });
  }

  const response = await api.get<TDataContract>(
    `/data-contracts/${name}/info`,
    {
      headers: tokenHeader,
    },
  );

  return response.data.data;
}

/**
 * Gửi một yêu cầu để từ duyệt một data contract
 * @param params
 */
export async function reqApproveDataContract(
  params: TApproveDataContractParams,
) {
  const { name, version, isMock = false } = params || {};
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    const target = dcs.find((dc) => dc.name === name);

    return new Promise<TApproveDataContractResPayload>((resolve) => {
      if (target) target.state = STATE_DICT.APPROVED;

      setTimeout(() => {
        resolve({
          dataContractInfo: target as unknown as TDataContract,
          rulesetName: `${target?.name} Ruleset`,
        });
      }, 500);
    });
  }

  const response = await api.post<TApproveDataContractResPayload>(
    `/data-contracts/${name}/approval`,
    {
      version,
    },
    {
      headers: tokenHeader,
    },
  );

  return response.data.data;
}

/**
 * Gửi một yêu cầu để từ chối duyệt một data contract
 * @param params
 */
export async function reqRejectDataContract(params: TRejectDataContractParams) {
  const { name, version, isMock = false } = params || {};
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    const target = dcs.find((dc) => dc.name === name);

    return new Promise<TDataContract>((resolve) => {
      if (target) target.state = STATE_DICT.REJECTED;

      setTimeout(() => {
        resolve(target as unknown as TDataContract);
      }, 500);
    });
  }

  const response = await api.post<TDataContract>(
    `/data-contracts/${name}/rejection`,
    {
      version,
    },
    {
      headers: tokenHeader,
    },
  );

  return response.data.data;
}

/**
 * Gửi một yêu cầu để tải lên data contract
 * @param params
 */
export async function reqUploadDataContract(params: TUploadDataContractParams) {
  const { content, isMock = false } = params || {};
  const tokenHeader = API.generateBearerToken(API.getToken(), true) as object;

  if (isMock) {
    return new Promise<TDataContract>((resolve) => {
      setTimeout(() => {
        resolve({
          name: "Uploaded Contract",
          version: "1.0.0",
          createdAt: new Date().toISOString(),
        } as TDataContract);
      }, 500);
    });
  }

  const response = await api.post<TDataContract>(
    "/data-contract/upload",
    { content },
    {
      headers: tokenHeader,
    },
  );

  return response.data.data;
}
