import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Table,
} from "@cloudscape-design/components";

// Import constants
import { DC_STATE_DICT } from "@/utils/constants/dc";

// Import hooks
import { useStateManager } from "@/hooks/use-state-manager";

// Import objects
import * as DataContractAPI from "@/objects/data-contract/api";

// Import states
import { useDataContractState } from "@/states/data-contract";
import { DCStateManager } from "./state";

// Import types
import type { TDataContract } from "@/objects/data-contract/types";

type DataContractProps = {};

const _stateOptions = [
  { label: "Chọn trạng thái", value: "" },
  { label: "Đang hoạt động", value: DC_STATE_DICT.ACTIVE },
  { label: "Đang chờ xử lý", value: DC_STATE_DICT.PENDING },
  { label: "Đã từ chối", value: DC_STATE_DICT.REJECTED },
];

export function DataContract(props: DataContractProps) {
  const { dcs } = useDataContractState();

  // State cho data contract
  const [state, stateFns] = useStateManager(
    DCStateManager.getInitialState(),
    DCStateManager.buildStateModifiers
  );

  // Sử dụng useQuery để lấy danh sách data contracts theo trạng thái
  const {
    data: filteredContracts = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["dataContracts", state.currentContractState, dcs],
    queryFn: async () =>
      await DataContractAPI.reqGetDataContractsByState({
        state: state.currentContractState || "",
        isMock: true,
      }),
    enabled: !!state.currentContractState, // Chỉ gọi khi có state.currentContractState
  });

  // Hàm xử lý khi chọn trạng thái
  const handleStateChange = function (value: string) {
    stateFns.setCurrentContractState(value);
  };

  // Sử dụng useQuery để lấy chi tiết data contract
  const {
    refetch: fetchContract,
    data: contractDetail,
    isPending: isPendingDetail,
    isError: isErrorDetail,
  } = useQuery({
    queryKey: ["dataContract", state.currentContractId],
    queryFn: async () =>
      await DataContractAPI.reqGetDataContract({
        id: state.currentContractId || "",
        isMock: true,
      }),
    enabled: false,
  });

  // Hàm xử lý khi submit ID/tên data contract
  const handleGetContract = async function () {
    if (!state.currentContractId) return;
    try {
      const result = await fetchContract();
      if (result.data) {
        stateFns.setCurrentContract(result.data as TDataContract);
      } else {
        alert(
          `Không tìm thấy Data Contract với ID: ${state.currentContractId}`
        );
      }
    } catch (error) {
      alert(`Lỗi khi tìm Data Contract: ${error}`);
    }
  };

  return (
    <ExpandableSection
      headerText="Get/List Data Contract"
      variant="container"
      defaultExpanded={state.isOpen}
      onChange={({ detail }) => stateFns.setIsOpen(detail.expanded)}
    >
      <SpaceBetween size="l">
        {/* Phần tương tác */}
        <ColumnLayout columns={2}>
          {/* List Data Contract - Dropdown chọn state */}
          <Container header={<Header variant="h3">List Data Contracts</Header>}>
            <FormField label="Trạng thái">
              <Select
                selectedOption={
                  _stateOptions.find(
                    (option) => option.value === state.currentContractState
                  ) || null
                }
                onChange={({ detail }) =>
                  detail.selectedOption &&
                  handleStateChange(detail.selectedOption.value as string)
                }
                options={_stateOptions}
                placeholder="Chọn trạng thái"
              />
            </FormField>
          </Container>

          {/* Get Data Contract - Input ID/Name và nút Submit */}
          <Container header={<Header variant="h3">Get Data Contract</Header>}>
            <SpaceBetween size="xs" direction="horizontal">
              <Input
                value={state.currentContractId || ""}
                onChange={({ detail }) =>
                  stateFns.setCurrentContractId(detail.value)
                }
                placeholder="Nhập ID hoặc tên Data Contract"
              />
              <Button onClick={handleGetContract} variant="primary">
                Tìm kiếm
              </Button>
            </SpaceBetween>
          </Container>
        </ColumnLayout>

        {/* Phần kết quả (view) */}
        <Container>
          {/* Hiển thị loading state */}
          {isPending && state.currentContractState && (
            <StatusIndicator type="loading">
              Đang tải dữ liệu...
            </StatusIndicator>
          )}

          {/* Hiển thị lỗi */}
          {isError && (
            <StatusIndicator type="error">
              {(error as Error)?.message || "Không thể tải dữ liệu"}
            </StatusIndicator>
          )}

          {/* Hiển thị danh sách data contract */}
          {!isPending &&
            !isError &&
            state.currentContractState &&
            !state.currentContract && (
              <Container
                header={
                  <Header variant="h3">
                    Danh sách Data Contract - Trạng thái:{" "}
                    {state.currentContractState}
                  </Header>
                }
              >
                {filteredContracts.length > 0 ? (
                  <Table<TDataContract>
                    columnDefinitions={[
                      {
                        id: "id",
                        header: "ID",
                        cell: (item) => item.id,
                        sortingField: "id",
                      },
                      {
                        id: "name",
                        header: "Tên",
                        cell: (item) => item.name,
                        sortingField: "name",
                      },
                      {
                        id: "version",
                        header: "Version",
                        cell: (item) => item.version,
                        sortingField: "version",
                      },
                      {
                        id: "state",
                        header: "Trạng thái",
                        cell: (item) => (
                          <StatusIndicator
                            type={
                              item.state === DC_STATE_DICT.ACTIVE
                                ? "success"
                                : item.state === DC_STATE_DICT.PENDING
                                ? "in-progress"
                                : item.state === DC_STATE_DICT.REJECTED
                                ? "stopped"
                                : "stopped"
                            }
                          >
                            {item.state}
                          </StatusIndicator>
                        ),
                      },
                    ]}
                    items={filteredContracts}
                    onSelectionChange={({ detail }) => {
                      if (detail.selectedItems.length > 0) {
                        stateFns.setCurrentContract(detail.selectedItems[0]);
                      }
                    }}
                    selectionType="single"
                    trackBy="id"
                    empty={
                      <Box textAlign="center" color="inherit">
                        <b>Không có dữ liệu</b>
                        <Box
                          padding={{ bottom: "s" }}
                          variant="p"
                          color="inherit"
                        >
                          Không tìm thấy data contract nào với trạng thái đã
                          chọn.
                        </Box>
                      </Box>
                    }
                  />
                ) : (
                  <Box textAlign="center" color="text-body-secondary">
                    {state.currentContractState === DC_STATE_DICT.ACTIVE && (
                      <p>
                        Không có data contract nào ở trạng thái{" "}
                        {DC_STATE_DICT.ACTIVE}.
                      </p>
                    )}
                    {state.currentContractState === DC_STATE_DICT.REJECTED && (
                      <p>
                        Không có data contract nào ở trạng thái{" "}
                        {DC_STATE_DICT.REJECTED}.
                      </p>
                    )}
                    {state.currentContractState === DC_STATE_DICT.PENDING && (
                      <p>
                        Không có data contract nào ở trạng thái{" "}
                        {DC_STATE_DICT.PENDING}.
                      </p>
                    )}
                  </Box>
                )}
              </Container>
            )}

          {/* Hiển thị chi tiết data contract */}
          {state.currentContract && (
            <Container
              header={
                <Header
                  variant="h3"
                  actions={
                    <Button
                      onClick={() => stateFns.setCurrentContract(null)}
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
                <FormField label="ID">{state.currentContract.id}</FormField>
                <FormField label="Tên">{state.currentContract.name}</FormField>
                <FormField label="Version">
                  {state.currentContract.version}
                </FormField>
                <FormField label="Trạng thái">
                  <StatusIndicator
                    type={
                      state.currentContract.state === DC_STATE_DICT.ACTIVE
                        ? "success"
                        : state.currentContract.state === DC_STATE_DICT.PENDING
                        ? "in-progress"
                        : state.currentContract.state === DC_STATE_DICT.REJECTED
                        ? "stopped"
                        : "stopped"
                    }
                  >
                    {state.currentContract.state}
                  </StatusIndicator>
                </FormField>
                <FormField label="Owner">
                  {state.currentContract.owner}
                </FormField>
                <FormField label="Ngày tạo">
                  {state.currentContract.createdAt}
                </FormField>
              </ColumnLayout>

              {state.currentContract.description && (
                <Box margin={{ top: "l" }}>
                  <FormField label="Mô tả">
                    {state.currentContract.description}
                  </FormField>
                </Box>
              )}

              {state.currentContract.schema && (
                <Box margin={{ top: "l" }}>
                  <FormField label="Schema">
                    <Box variant="code">
                      {JSON.stringify(state.currentContract.schema, null, 2)}
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
