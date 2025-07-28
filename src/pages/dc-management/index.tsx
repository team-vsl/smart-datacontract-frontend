import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  ContentLayout,
  Header,
  SpaceBetween,
} from "@cloudscape-design/components";

// Import components
import { DataContract } from "./components/data-contract";
import { CheckDataContract } from "./components/check-data-contract";

// Import objects
import * as DataContractAPI from "@/objects/data-contract/api";

// Import states
import { dataContractStActions } from "@/states/data-contract";

// Import types
import type { TDataContract } from "@/objects/data-contract/types";

export default function DataContractManagementPage() {
  // Sử dụng useQuery để lấy dữ liệu từ API
  const { data: dcs } = useQuery({
    queryKey: ["allDataContracts"],
    queryFn: () =>
      DataContractAPI.reqGetAllDataContracts({
        isMock: true,
      }),
    refetchInterval: 1000, // Refetch every second to sync with API changes
  });

  // Đồng bộ state với dữ liệu từ API
  useEffect(() => {
    if (dcs) {
      dataContractStActions.setDCS(dcs as TDataContract[]);
    }
  }, [dcs]);

  return (
    <ContentLayout
      header={
        <Header variant="h1" description="Quản lý Data Contract">
          Data Contract Management
        </Header>
      }
    >
      <SpaceBetween size="m">
        <DataContract />
        <CheckDataContract />
      </SpaceBetween>
    </ContentLayout>
  );
}
