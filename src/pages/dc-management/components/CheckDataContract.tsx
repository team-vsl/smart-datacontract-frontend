import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DataContractAPI } from "../../../objects/api";
import type { DataContract } from "../../../objects/api";
import {
  Button,
  Container,
  Header,
  Input,
  SpaceBetween,
  StatusIndicator,
  ExpandableSection,
  FormField,
  Box,
  ColumnLayout
} from "@cloudscape-design/components";

// Use DataContract type from API

interface CheckDataContractProps {
  dataContracts: DataContract[];
  setDataContracts: React.Dispatch<React.SetStateAction<DataContract[]>>;
}

interface ResultData extends DataContract {
  status: "approved" | "rejected" | "error";
}

interface Result {
  status: "approved" | "rejected" | "error";
  message: string;
  data: ResultData | null;
}

export function CheckDataContract({ dataContracts, setDataContracts }: CheckDataContractProps) {
  // Lấy queryClient để invalidate queries
  const queryClient = useQueryClient();
  
  // State cho input và kết quả
  const [dataContractId, setDataContractId] = useState<string>("");
  const [result, setResult] = useState<Result | null>(null);
  // State cho accordion
  const [isOpen, setIsOpen] = useState<boolean>(true);
  
  // Sử dụng useMutation để approve data contract
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      // Kiểm tra data contract có tồn tại không
      const contract = await DataContractAPI.getDataContractById(id);
      if (!contract) {
        throw new Error(`Không tìm thấy Data Contract với ID: ${id}`);
      }
      
      // Approve data contract và cập nhật state
      const updatedContracts = await DataContractAPI.approveDataContract(id);
      setDataContracts(updatedContracts);
      
      // Lấy contract đã cập nhật
      return await DataContractAPI.getDataContractById(id);
    },
    onSuccess: (updatedContract: DataContract | undefined) => {
      // Invalidate queries để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: ['dataContracts'] });
      
      setResult({
        status: "approved",
        message: `Data Contract ${dataContractId} đã được chấp thuận`,
        data: updatedContract ? {
          ...updatedContract,
          status: "approved" as const
        } : null
      });
    },
    onError: (error: Error) => {
      setResult({
        status: "error",
        message: error.message,
        data: null
      });
    }
  });
  
  // Sử dụng useMutation để reject data contract
  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      // Kiểm tra data contract có tồn tại không
      const contract = await DataContractAPI.getDataContractById(id);
      if (!contract) {
        throw new Error(`Không tìm thấy Data Contract với ID: ${id}`);
      }
      
      // Reject data contract và cập nhật state
      const updatedContracts = await DataContractAPI.rejectDataContract(id, "Data schema không đáp ứng yêu cầu");
      setDataContracts(updatedContracts);
      
      // Lấy contract đã cập nhật
      return await DataContractAPI.getDataContractById(id);
    },
    onSuccess: (updatedContract: DataContract | undefined) => {
      // Invalidate queries để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: ['dataContracts'] });
      
      setResult({
        status: "rejected",
        message: `Data Contract ${dataContractId} đã bị từ chối`,
        data: updatedContract ? {
          ...updatedContract,
          status: "rejected" as const
        } : null
      });
    },
    onError: (error: Error) => {
      setResult({
        status: "error",
        message: error.message,
        data: null
      });
    }
  });

  // Hàm xử lý khi approve data contract
  const handleApprove = () => {
    if (!dataContractId) return;
    approveMutation.mutate(dataContractId);
  };

  // Hàm xử lý khi reject data contract
  const handleReject = () => {
    if (!dataContractId) return;
    rejectMutation.mutate(dataContractId);
  };

  return (
    <ExpandableSection
      headerText="Check Data Contract"
      variant="container"
      defaultExpanded={isOpen}
      onChange={({ detail }) => setIsOpen(detail.expanded)}
    >
        <SpaceBetween size="l">
          {/* Phần tương tác */}
          <Container header={<Header variant="h3">Tương tác</Header>}>
            <SpaceBetween size="xs" direction="horizontal" alignItems="end">
              <Input
                placeholder="Nhập Data Contract ID hoặc Name"
                value={dataContractId}
                onChange={({ detail }) => setDataContractId(detail.value)}
                disabled={approveMutation.isPending || rejectMutation.isPending}
              />
              <Button 
                variant="primary"
                onClick={handleApprove}
                disabled={!dataContractId || approveMutation.isPending || rejectMutation.isPending}
                loading={approveMutation.isPending}
              >
                Approve
              </Button>
              <Button 
                variant="normal"
                onClick={handleReject}
                disabled={!dataContractId || approveMutation.isPending || rejectMutation.isPending}
                loading={rejectMutation.isPending}
              >
                Reject
              </Button>
            </SpaceBetween>
          </Container>

          {/* Phần kết quả */}
          <Container header={<Header variant="h3">Kết quả</Header>}>
            {approveMutation.isPending || rejectMutation.isPending ? (
              <StatusIndicator type="loading">Đang xử lý yêu cầu...</StatusIndicator>
            ) : result ? (
              <SpaceBetween size="m">
                <StatusIndicator type={
                  result.status === "approved" ? "success" :
                  result.status === "rejected" ? "error" : "warning"
                }>
                  {result.message}
                </StatusIndicator>
                
                {result.data && (
                  <Box>
                    <ColumnLayout columns={2} variant="text-grid">
                      <FormField label="ID">{result.data.id}</FormField>
                      <FormField label="Tên">{result.data.name}</FormField>
                      <FormField label="Version">{result.data.version}</FormField>
                      <FormField label="Trạng thái">
                        <StatusIndicator type={result.data.status === "approved" ? "success" : "error"}>
                          {result.data.status}
                        </StatusIndicator>
                      </FormField>
                      
                      {result.data.status === "approved" && (
                        <>
                          <FormField label="Thời gian chấp thuận">
                            {result.data.approvedAt && new Date(result.data.approvedAt).toLocaleString()}
                          </FormField>
                          <FormField label="Người chấp thuận">
                            {result.data.approvedBy}
                          </FormField>
                        </>
                      )}
                      
                      {result.data.status === "rejected" && (
                        <>
                          <FormField label="Thời gian từ chối">
                            {result.data.rejectedAt && new Date(result.data.rejectedAt).toLocaleString()}
                          </FormField>
                          <FormField label="Người từ chối">
                            {result.data.rejectedBy}
                          </FormField>
                        </>
                      )}
                    </ColumnLayout>

                    {result.data.reason && (
                      <Box margin={{top: "m"}}>
                        <FormField label="Lý do từ chối">
                          <Box color="text-status-error">{result.data.reason}</Box>
                        </FormField>
                      </Box>
                    )}

                    {result.data.schema && (
                      <Box margin={{top: "m"}}>
                        <FormField label="Schema">
                          <Box variant="code">
                            {JSON.stringify(result.data.schema, null, 2)}
                          </Box>
                        </FormField>
                      </Box>
                    )}
                  </Box>
                )}
              </SpaceBetween>
            ) : (
              <Box textAlign="center" color="text-body-secondary">
                <em>Chưa có kết quả. Vui lòng nhập ID và chọn Approve hoặc Reject.</em>
              </Box>
            )}
          </Container>
        </SpaceBetween>
    </ExpandableSection>
  );
}