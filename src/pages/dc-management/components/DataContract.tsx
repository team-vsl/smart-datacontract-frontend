import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataContractAPI } from "../../../objects/api";
import type { DataContract } from "../../../objects/api";
import {
  Button,
  Container,
  Header,
  Select,
  Input,
  SpaceBetween,
  StatusIndicator,
  ExpandableSection,
  FormField,
  Box,
  ColumnLayout,
  Table
} from "@cloudscape-design/components";

// Use DataContract type from API
interface DataContractProps {
  dataContracts: DataContract[];
  setDataContracts: React.Dispatch<React.SetStateAction<DataContract[]>>;
}

export function DataContract({ dataContracts, setDataContracts }: DataContractProps) {
  
  // State cho data contract chi tiết
  const [selectedContract, setSelectedContract] = useState<DataContract | null>(null);
  // State cho các input
  const [contractState, setContractState] = useState<string>("");
  const [contractId, setContractId] = useState<string>("");
  // State cho accordion
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // Sử dụng useQuery để lấy danh sách data contracts theo trạng thái
  const { 
    data: filteredContracts = [], 
    isPending, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['dataContracts', contractState, dataContracts],
    queryFn: async () => await DataContractAPI.getDataContractsByState(contractState),
    enabled: !!contractState, // Chỉ gọi khi có contractState
  });

  // Hàm xử lý khi chọn trạng thái
  const handleStateChange = (value: string) => {
    setContractState(value);
    // useQuery sẽ tự động fetch lại dữ liệu khi contractState thay đổi
  };

  // Sử dụng useQuery để lấy chi tiết data contract
  const { 
    refetch: fetchContract,
    data: contractDetail,
    isPending: isPendingDetail,
    isError: isErrorDetail,
  } = useQuery({
    queryKey: ['dataContract', contractId],
    queryFn: async () => await DataContractAPI.getDataContractById(contractId),
    enabled: false, // Không tự động gọi, chỉ gọi khi nhấn nút Tìm kiếm
  });

  // Hàm xử lý khi submit ID/tên data contract
  const handleGetContract = async () => {
    if (!contractId) return;
    try {
      const result = await fetchContract();
      if (result.data) {
        setSelectedContract(result.data);
      } else {
        alert(`Không tìm thấy Data Contract với ID: ${contractId}`);
      }
    } catch (error) {
      alert(`Lỗi khi tìm Data Contract: ${error}`);
    }
  };

  // Chuyển đổi danh sách trạng thái cho Select component
  const stateOptions = [
    { label: "Chọn trạng thái", value: "" },
    { label: "Đang hoạt động", value: "active" },
    { label: "Đang chờ xử lý", value: "pending" },
    { label: "Đã lưu trữ", value: "archived" }
  ];

  return (
    <ExpandableSection
      headerText="Get/List Data Contract"
      variant="container"
      defaultExpanded={isOpen}
      onChange={({ detail }) => setIsOpen(detail.expanded)}
    >
        <SpaceBetween size="l">
          {/* Phần tương tác */}
          <ColumnLayout columns={2}>
            {/* List Data Contract - Dropdown chọn state */}
            <Container header={<Header variant="h3">List Data Contracts</Header>}>
              <FormField label="Trạng thái">
                <Select
                  selectedOption={stateOptions.find(option => option.value === contractState) || null}
                  onChange={({ detail }) => detail.selectedOption && handleStateChange(detail.selectedOption.value as string)}
                  options={stateOptions}
                  placeholder="Chọn trạng thái"
                />
              </FormField>
            </Container>

            {/* Get Data Contract - Input ID/Name và nút Submit */}
            <Container header={<Header variant="h3">Get Data Contract</Header>}>
              <SpaceBetween size="xs" direction="horizontal">
                <Input
                  value={contractId}
                  onChange={({ detail }) => setContractId(detail.value)}
                  placeholder="Nhập ID hoặc tên Data Contract"
                />
                <Button
                  onClick={handleGetContract}
                  variant="primary"
                >
                  Tìm kiếm
                </Button>
              </SpaceBetween>
            </Container>
          </ColumnLayout>

          {/* Phần kết quả (view) */}
          <Container>
            {/* Hiển thị loading state */}
            {isPending && contractState && (
              <StatusIndicator type="loading">Đang tải dữ liệu...</StatusIndicator>
            )}
            
            {/* Hiển thị lỗi */}
            {isError && (
              <StatusIndicator type="error">{(error as Error)?.message || 'Không thể tải dữ liệu'}</StatusIndicator>
            )}

            {/* Hiển thị danh sách data contract */}
            {!isPending && !isError && contractState && !selectedContract && (
              <Container header={<Header variant="h3">Danh sách Data Contract - Trạng thái: {contractState}</Header>}>
                {filteredContracts.length > 0 ? (
                  <Table
                    columnDefinitions={[
                      {
                        id: "id",
                        header: "ID",
                        cell: item => item.id,
                        sortingField: "id"
                      },
                      {
                        id: "name",
                        header: "Tên",
                        cell: item => item.name,
                        sortingField: "name"
                      },
                      {
                        id: "version",
                        header: "Version",
                        cell: item => item.version,
                        sortingField: "version"
                      },
                      {
                        id: "state",
                        header: "Trạng thái",
                        cell: item => (
                          <StatusIndicator type={
                            item.state === 'active' ? "success" :
                            item.state === 'pending' ? "in-progress" :
                            item.state === 'archived' ? "stopped" : "stopped"
                          }>
                            {item.state}
                          </StatusIndicator>
                        )
                      }
                    ]}
                    items={filteredContracts}
                    onSelectionChange={({ detail }) => {
                      if (detail.selectedItems.length > 0) {
                        setSelectedContract(detail.selectedItems[0]);
                      }
                    }}
                    selectionType="single"
                    trackBy="id"
                    empty={
                      <Box textAlign="center" color="inherit">
                        <b>Không có dữ liệu</b>
                        <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                          Không tìm thấy data contract nào với trạng thái đã chọn.
                        </Box>
                      </Box>
                    }
                  />
                ) : (
                  <Box textAlign="center" color="text-body-secondary">
                    {contractState === 'active' && (
                      <p>Không có data contract nào ở trạng thái active.</p>
                    )}
                    {contractState === 'archived' && (
                      <p>Không có data contract nào ở trạng thái archived.</p>
                    )}
                    {contractState === 'pending' && (
                      <p>Không có data contract nào ở trạng thái pending.</p>
                    )}
                  </Box>
                )}
              </Container>
            )}

            {/* Hiển thị chi tiết data contract */}
            {selectedContract && (
              <Container
                header={
                  <Header
                    variant="h3"
                    actions={
                      <Button
                        onClick={() => setSelectedContract(null)}
                        variant="primary"
                      >
                        Quay lại danh sách
                      </Button>
                    }
                  >
                    Chi tiết Data Contract
                  </Header>
                }
              >
                <ColumnLayout columns={2} variant="text-grid">
                  <FormField label="ID">{selectedContract.id}</FormField>
                  <FormField label="Tên">{selectedContract.name}</FormField>
                  <FormField label="Version">{selectedContract.version}</FormField>
                  <FormField label="Trạng thái">
                    <StatusIndicator type={
                      selectedContract.state === 'active' ? "success" :
                      selectedContract.state === 'pending' ? "in-progress" :
                      selectedContract.state === 'archived' ? "stopped" : "stopped"
                    }>
                      {selectedContract.state}
                    </StatusIndicator>
                  </FormField>
                  <FormField label="Owner">{selectedContract.owner}</FormField>
                  <FormField label="Ngày tạo">{selectedContract.createdAt}</FormField>
                </ColumnLayout>

                {selectedContract.description && (
                  <Box margin={{top: "l"}}>
                    <FormField label="Mô tả">{selectedContract.description}</FormField>
                  </Box>
                )}

                {selectedContract.schema && (
                  <Box margin={{top: "l"}}>
                    <FormField label="Schema">
                      <Box variant="code">
                        {JSON.stringify(selectedContract.schema, null, 2)}
                      </Box>
                    </FormField>
                  </Box>
                )}
              </Container>
            )}
          </Container>
        </SpaceBetween>
    </ExpandableSection>
  );
}