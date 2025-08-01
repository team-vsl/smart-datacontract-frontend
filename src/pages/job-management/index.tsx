import {
  ContentLayout,
  Header,
  SpaceBetween,
} from "@cloudscape-design/components";

// Import components
import Job from "./components/jobs";
import JobRun from "./components/job-runs";
import RunJob from "./components/run-job";

export default function JobManagementPage() {
  return (
    <ContentLayout
      header={
        <Header variant="h1" description="Quản lý Job">
          Job Management
        </Header>
      }
    >
      <SpaceBetween size="m">
        <Job />
        <JobRun />
        <RunJob />
      </SpaceBetween>
    </ContentLayout>
  );
}
