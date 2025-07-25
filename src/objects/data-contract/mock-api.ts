// Mock API for data contracts
import { DataContract } from "./types";

const mockDataContracts: DataContract[] = [
  {
    id: "dc-001",
    name: "User Data Contract",
    version: "1.0.0",
    state: "pending",
    createdAt: "2024-01-15"
  }
];

export const MockDataContractAPI = {
  getAllDataContracts: async (): Promise<DataContract[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockDataContracts]), 500);
    });
  },

  getDataContractsByState: async (state: string): Promise<DataContract[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockDataContracts.filter(dc => dc.state === state);
        resolve(filtered);
      }, 500);
    });
  }
};