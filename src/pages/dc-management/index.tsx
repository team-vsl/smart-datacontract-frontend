import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  ContentLayout,
  Header,
  Link,
  SpaceBetween
} from "@cloudscape-design/components";
import { DataContract } from "./components/DataContract";
import { CheckDataContract } from "./components/CheckDataContract";
import { DataContractAPI, DataContract as DataContractType } from "../../objects/api";

export default function DataContractManagementPage() {
  // Sử dụng state để lưu trữ danh sách data contracts
  const [dataContracts, setDataContracts] = useState<DataContractType[]>([]);

  // Sử dụng useQuery để lấy dữ liệu từ API
  const { data: apiDataContracts } = useQuery({
    queryKey: ['allDataContracts'],
    queryFn: () => DataContractAPI.getAllDataContracts(),
    refetchInterval: 1000, // Refetch every second to sync with API changes
  });

  // Đồng bộ state với dữ liệu từ API
  useEffect(() => {
    if (apiDataContracts) {
      setDataContracts(apiDataContracts);
    }
  }, [apiDataContracts]);

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
        <SpaceBetween size="l">
          <DataContract 
            dataContracts={dataContracts} 
            setDataContracts={setDataContracts} 
          />
          <CheckDataContract 
            dataContracts={dataContracts} 
            setDataContracts={setDataContracts} 
          />
        </SpaceBetween>
      </Container>
    </ContentLayout>
  );
}
