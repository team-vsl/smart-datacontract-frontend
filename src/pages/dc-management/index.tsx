import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  // Sử dụng state để lưu trữ danh sách data contracts
  const [dataContracts, setDataContracts] = useState(initialDataContracts);

  // Sử dụng useQuery để lưu trữ danh sách trong cache
  useQuery({
    queryKey: ['allDataContracts'],
    queryFn: () => dataContracts,
    initialData: initialDataContracts,
  });

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
