import { useState } from "react";
import {
  Container,
  ContentLayout,
  Header,
  Link,
} from "@cloudscape-design/components";
import { DataContractAccordion } from "./DataContractAccordion";
import { CheckDataContract } from "./CheckDataContract";
import { initialDataContracts } from "../../states/data-contract-state";

export default function DataContractManagementPage() {
  // Quản lý state chung cho cả hai component
  const [dataContracts, setDataContracts] = useState(initialDataContracts);

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
        <div className="space-y-4">
          <DataContractAccordion 
            dataContracts={dataContracts} 
            setDataContracts={setDataContracts} 
          />
          <CheckDataContract 
            dataContracts={dataContracts} 
            setDataContracts={setDataContracts} 
          />
        </div>
      </Container>
    </ContentLayout>
  );
}
