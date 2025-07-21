import {
  Container,
  ContentLayout,
  Header,
  Link,
} from "@cloudscape-design/components";
import { DataContractAccordion } from "./DataContractAccordion";

export default function DataContractManagementPage() {
  return (
    <ContentLayout
      header={
        <Header variant="h1" info={<Link variant="info">Info</Link>}>
          Data Contract Management
        </Header>
      }
    >
      <Container
        header={
          <Header variant="h2" description="Quản lý Data Contract">
            Data Contract Management
          </Header>
        }
      >
        <DataContractAccordion />
      </Container>
    </ContentLayout>
  );
}
