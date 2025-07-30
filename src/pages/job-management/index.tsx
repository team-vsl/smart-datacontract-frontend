import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ContentLayout,
  Header,
  SpaceBetween,
} from "@cloudscape-design/components";

// Import components
import JobInfo from "./components/job";
import RunJob from "./components/run-job";

// Import objects
import * as DataContractAPI from "@/objects/data-contract/api";

// Import states
import { dataContractStActions } from "@/states/data-contract";

// Import types
import type { TDataContract } from "@/objects/data-contract/types";

export default function JobManagementPage() {
  // Sử dụng useQuery để lấy dữ liệu từ API
  const { data: dcs } = useQuery({
    queryKey: ["allJobs"],
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
        <Header variant="h1" description="Quản lý Job">
          Job Management
        </Header>
      }
    >
      <SpaceBetween size="m"></SpaceBetween>
    </ContentLayout>
  );
}
