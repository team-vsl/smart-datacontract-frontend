import {
  ContentLayout,
  Header,
  SpaceBetween,
} from "@cloudscape-design/components";

// Import components
import { DataContract } from "./components/data-contract";
import { CheckDataContract } from "./components/check-data-contract";

export default function DataContractManagementPage() {
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
