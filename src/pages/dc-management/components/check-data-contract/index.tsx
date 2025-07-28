import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  ColumnLayout,
} from "@cloudscape-design/components";

// Import constants
import { DC_STATE_DICT } from "@/utils/constants/dc";

// Import hooks
import { useStateManager } from "@/hooks/use-state-manager";

// Import objects
import * as DataContractAPI from "@/objects/data-contract/api";

// Import states
import {
  useDataContractState,
  dataContractStActions,
} from "@/states/data-contract";
import { CheckDCStateManager } from "./state";

// Import types
import type { TDataContract } from "@/objects/data-contract/types";

type CheckDataContractProps = {};

export function CheckDataContract(props: CheckDataContractProps) {
  // Lấy queryClient để invalidate queries
  const queryClient = useQueryClient();

  const { dcs } = useDataContractState();

  // State cho check data contract
  const [state, stateFns] = useStateManager(
    CheckDCStateManager.getInitialState(),
    CheckDCStateManager.buildStateModifiers
  );

  // Sử dụng useMutation để approve data contract
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      // Kiểm tra data contract có tồn tại không
      const contract = await DataContractAPI.reqGetDataContract({
        id,
        isMock: true,
      });

      if (!contract) {
        throw new Error(`Không tìm thấy Data Contract với ID: ${id}`);
      }

      // Approve data contract và cập nhật state
      const updatedContract = await DataContractAPI.reqApproveDataContract({
        id,
      });

      dataContractStActions.updateDataContract(updatedContract);

      // Lấy contract đã cập nhật
      return updatedContract;
    },
    onSuccess: (updatedContract: TDataContract | undefined) => {
      // Invalidate queries để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: ["dataContracts"] });

      stateFns.setResult({
        message: `Data Contract ${state.currentContractId} đã được chấp thuận`,
        data: updatedContract,
      });
    },
    onError: (error: any) => {
      stateFns.setResult({
        error,
        data: undefined,
      });
    },
  });

  // Sử dụng useMutation để reject data contract
  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      // Kiểm tra data contract có tồn tại không
      const contract = await DataContractAPI.reqGetDataContract({ id });

      if (!contract) {
        throw new Error(`Không tìm thấy Data Contract với ID: ${id}`);
      }

      // Reject data contract và cập nhật state
      const updatedContract = await DataContractAPI.reqRejectDataContract({
        id,
      });

      dataContractStActions.updateDataContract(updatedContract);

      // Lấy contract đã cập nhật
      return updatedContract;
    },
    onError: (error: Error) => {
      stateFns.setResult({
        message: error.message,
        data: undefined,
      });
    },
  });

  // Hàm xử lý khi approve data contract
  const handleApprove = () => {
    if (!state.currentContractId) return;
    approveMutation.mutate(state.currentContractId);
  };

  // Hàm xử lý khi reject data contract
  const handleReject = () => {
    if (!state.currentContractId) return;
    rejectMutation.mutate(state.currentContractId);
  };

  return (
    <ExpandableSection
      headerText="Check Data Contract"
      variant="container"
      defaultExpanded={state.isOpen}
      onChange={({ detail }) => stateFns.setIsOpen(detail.expanded)}
    >
      <SpaceBetween size="l">
        {/* Phần tương tác */}
        <Container header={<Header variant="h3">Tương tác</Header>}>
          <SpaceBetween size="xs" direction="horizontal" alignItems="end">
            <Input
              placeholder="Nhập Data Contract ID hoặc Name"
              value={state.currentContractId || ""}
              onChange={({ detail }) =>
                stateFns.setCurrentContractId(detail.value)
              }
              disabled={approveMutation.isPending || rejectMutation.isPending}
            />
            <Button
              variant="primary"
              onClick={handleApprove}
              disabled={
                !state.currentContractId ||
                approveMutation.isPending ||
                rejectMutation.isPending
              }
              loading={approveMutation.isPending}
            >
              Approve
            </Button>
            <Button
              variant="normal"
              onClick={handleReject}
              disabled={
                !state.currentContractId ||
                approveMutation.isPending ||
                rejectMutation.isPending
              }
              loading={rejectMutation.isPending}
            >
              Reject
            </Button>
          </SpaceBetween>
        </Container>

        {/* Phần kết quả */}
        <Container header={<Header variant="h3">Kết quả</Header>}>
          {approveMutation.isPending || rejectMutation.isPending ? (
            <StatusIndicator type="loading">
              Đang xử lý yêu cầu...
            </StatusIndicator>
          ) : state.result && state.result.data ? (
            <SpaceBetween size="m">
              <StatusIndicator
                type={
                  state.result.data.state === DC_STATE_DICT.APPROVED
                    ? "success"
                    : state.result.data.state === DC_STATE_DICT.REJECTED
                    ? "error"
                    : "warning"
                }
              >
                {state.result.message}
              </StatusIndicator>

              {state.result && state.result.data && (
                <Box>
                  <ColumnLayout columns={2} variant="text-grid">
                    <FormField label="ID">{state.result.data.id}</FormField>
                    <FormField label="Tên">{state.result.data.name}</FormField>
                    <FormField label="Version">
                      {state.result.data.version}
                    </FormField>
                    <FormField label="Trạng thái">
                      <StatusIndicator
                        type={
                          state.result.data.state === DC_STATE_DICT.APPROVED
                            ? "success"
                            : "error"
                        }
                      >
                        {state.result.data.state}
                      </StatusIndicator>
                    </FormField>

                    {state.result.data.state === DC_STATE_DICT.APPROVED && (
                      <>
                        <FormField label="Thời gian chấp thuận">
                          {state.result.data.updatedAt &&
                            new Date(
                              state.result.data.updatedAt
                            ).toLocaleString()}
                        </FormField>
                        <FormField label="Người chấp thuận">
                          {state.result.data.approvedBy}
                        </FormField>
                      </>
                    )}

                    {state.result.data.state === DC_STATE_DICT.REJECTED && (
                      <>
                        <FormField label="Thời gian từ chối">
                          {state.result.data.updatedAt &&
                            new Date(
                              state.result.data.updatedAt
                            ).toLocaleString()}
                        </FormField>
                        <FormField label="Người từ chối">
                          {state.result.data.rejectedBy}
                        </FormField>
                      </>
                    )}
                  </ColumnLayout>

                  {state.result &&
                    state.result.data &&
                    state.result.data.reason && (
                      <Box margin={{ top: "m" }}>
                        <FormField label="Lý do từ chối">
                          <Box color="text-status-error">
                            {state.result.data.reason}
                          </Box>
                        </FormField>
                      </Box>
                    )}
                </Box>
              )}
            </SpaceBetween>
          ) : (
            <Box textAlign="center" color="text-body-secondary">
              <em>
                Chưa có kết quả. Vui lòng nhập ID và chọn Approve hoặc Reject.
              </em>
            </Box>
          )}
        </Container>
      </SpaceBetween>
    </ExpandableSection>
  );
}
