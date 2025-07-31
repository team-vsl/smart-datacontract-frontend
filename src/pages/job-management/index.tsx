import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ContentLayout,
  Header,
  SpaceBetween,
} from "@cloudscape-design/components";

// Import components
import Job from "./components/jobs";
import JobRun from "./components/job-runs";
import JobInfo from "./components/job";
import RunJob from "./components/run-job";

// Import objects
import * as JobAPI from "@/objects/job/api";

// Import states
import { jobStActions } from "@/states/job";

// Import types
import type { TJob, TJobRun } from "@/objects/job/types";

export default function JobManagementPage() {
  // Sử dụng useQuery để lấy dữ liệu từ API
  const {
    data: jbs,
    error,
    isPending,
  } = useQuery({
    queryKey: ["allJobs"],
    queryFn: () =>
      JobAPI.reqGetJobs({
        isMock: true,
      }),
    refetchInterval: 1000, // Refetch every second to sync with API changes
  });

  // Đồng bộ state với dữ liệu từ API
  useEffect(() => {
    if (jbs) {
      jobStActions.setJBS(jbs as TJob[]);
    }
  }, [jbs]);

  return (
    <ContentLayout
      header={
        <Header variant="h1" description="Quản lý Job">
          Job Management
        </Header>
      }
    >
      <SpaceBetween size="m">
        <Job isJobsFetchPending={isPending} jobFetchError={error} />
        <JobRun />
      </SpaceBetween>
    </ContentLayout>
  );
}
