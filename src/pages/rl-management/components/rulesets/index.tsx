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
  TextFilter,
} from "@cloudscape-design/components";

// Import constants
import { STATE_DICT } from "@/utils/constants/dc";

// Import objects
import * as RulesetAPI from "@/objects/ruleset/api";

// Import hooks
import { useStateManager } from "@/hooks/use-state-manager";

// Import states
import { RLStateManager } from "./state";

// Import types
import type { TRuleset } from "@/objects/ruleset/types";

type RulesetsProps = {
  rulesets: TRuleset[];
};

export function Rulesets(props: RulesetsProps) {
  // State cho ruleset
  const [state, stateFns] = useStateManager(
    RLStateManager.getInitialState(),
    RLStateManager.buildStateModifiers
  );

  // Sử dụng useQuery để lọc ruleset theo trạng thái
  const {
    data: filteredRulesets = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["rulesets", state.currentRulesetState],
    queryFn: async function () {
      if (!state.currentRulesetState) return [];
      console.log("Đang lọc theo trạng thái:", state.currentRulesetState);
      try {
        const filtered = await RulesetAPI.reqGetRulesetsByState({
          state: state.currentRulesetState,
          isMock: true,
        });
        console.log("Kết quả lọc:", filtered);
        return filtered;
      } catch (error) {
        console.error("Error fetching rulesets:", error);
        return [];
      }
    },
    enabled: !!state.currentRulesetState, // Chỉ gọi khi có state.currentRulesetState
    retry: 1,
    staleTime: 5000, // Cache for 5 seconds
  });

  // Hàm xử lý khi chọn trạng thái
  const handleStateChange = (value: string) => {
    stateFns.setCurrentRulesetState(value);
  };

  // Hàm xử lý khi submit ID/tên ruleset
  const handleGetRuleset = async () => {
    if (!state.currentRulesetId) return;

    try {
      // Tìm ruleset theo ID hoặc tên từ API
      const foundRuleset = await RulesetAPI.reqGetRuleset({
        id: state.currentRulesetId,
        isMock: true,
      });

      if (foundRuleset) {
        stateFns.setCurrentRuleset(foundRuleset);
      } else {
        alert(
          `Không tìm thấy ruleset với ID hoặc tên: ${state.currentRulesetId}`
        );
      }
    } catch (error) {
      console.error("Error finding ruleset:", error);
      alert(`Lỗi khi tìm ruleset: ${error}`);
    }
  };

  // Chuyển đổi danh sách trạng thái cho Select component
  const stateOptions = [
    { label: "Chọn trạng thái", value: "" },
    { label: "Đang hoạt động", value: STATE_DICT.APPROVED },
    { label: "Đang chờ xử lý", value: STATE_DICT.PENDING },
    { label: "Đã từ chối", value: STATE_DICT.REJECTED },
  ];

  return (
    <ExpandableSection
      headerText="Get/List Rulesets"
      variant="container"
      defaultExpanded={state.isOpen}
      onChange={({ detail }) => stateFns.setIsOpen(detail.expanded)}
    >
      <SpaceBetween size="l">
        {/* Phần tương tác */}
        <ColumnLayout columns={2}>
          {/* List Rulesets - Dropdown chọn state */}
          <Container header={<Header variant="h3">List Rulesets</Header>}>
            <FormField label="Trạng thái">
              <Select
                selectedOption={
                  stateOptions.find(
                    (option) => option.value === state.currentRulesetState
                  ) || null
                }
                onChange={({ detail }) =>
                  detail.selectedOption &&
                  handleStateChange(detail.selectedOption.value as string)
                }
                options={stateOptions}
                placeholder="Chọn trạng thái"
              />
            </FormField>
          </Container>

          {/* Get Ruleset - Input ID/Name và nút Submit */}
          <Container header={<Header variant="h3">Get Ruleset</Header>}>
            <SpaceBetween size="xs" direction="horizontal">
              <Input
                value={state.currentRulesetId || ""}
                onChange={({ detail }) =>
                  stateFns.setCurrentRulesetId(detail.value)
                }
                placeholder="Nhập ID hoặc tên Ruleset"
              />
              <Button onClick={handleGetRuleset} variant="primary">
                Tìm kiếm
              </Button>
            </SpaceBetween>
          </Container>
        </ColumnLayout>

        {/* Phần kết quả (view) */}
        {/* Hiển thị loading state */}
        {isLoading && (
          <StatusIndicator type="loading">Đang tải dữ liệu...</StatusIndicator>
        )}

        {/* Hiển thị lỗi */}
        {isError && (
          <StatusIndicator type="error">
            {error?.message || "Không thể tải dữ liệu"}
          </StatusIndicator>
        )}

        {/* Hiển thị danh sách ruleset */}
        {!isLoading &&
          !isError &&
          filteredRulesets.length > 0 &&
          state.currentRulesetState &&
          !state.currentRuleset && (
            <Container
              header={
                <Header variant="h3">
                  Danh sách Ruleset - Trạng thái: {state.currentRulesetState}
                </Header>
              }
            >
              <Table
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
                    cell: (item) => item.version || "1.0.0",
                    sortingField: "version",
                  },
                  {
                    id: "state",
                    header: "Trạng thái",
                    cell: (item) => (
                      <StatusIndicator
                        type={
                          item.state === STATE_DICT.APPROVED
                            ? "success"
                            : item.state === STATE_DICT.PENDING
                            ? "in-progress"
                            : item.state === STATE_DICT.REJECTED
                            ? "error"
                            : "stopped"
                        }
                      >
                        {item.state}
                      </StatusIndicator>
                    ),
                  },
                ]}
                items={filteredRulesets}
                onSelectionChange={({ detail }) => {
                  if (detail.selectedItems.length > 0) {
                    stateFns.setCurrentRuleset(detail.selectedItems[0]);
                  }
                }}
                selectionType="single"
                trackBy="id"
                empty={
                  <Box textAlign="center" color="inherit">
                    <b>Không có dữ liệu</b>
                    <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                      Không tìm thấy ruleset nào với trạng thái đã chọn.
                    </Box>
                  </Box>
                }
              />
            </Container>
          )}

        {/* Hiển thị thông báo khi không có ruleset */}
        {!isLoading &&
          !isError &&
          filteredRulesets.length === 0 &&
          state.currentRulesetState &&
          !state.currentRuleset && (
            <Box textAlign="center" color="text-body-secondary">
              {state.currentRulesetState === STATE_DICT.APPROVED && (
                <p>Không có ruleset nào ở trạng thái active.</p>
              )}
              {state.currentRulesetState === STATE_DICT.REJECTED && (
                <p>Không có ruleset nào ở trạng thái rejected.</p>
              )}
              {state.currentRulesetState === STATE_DICT.PENDING && (
                <p>Không có ruleset nào ở trạng thái pending.</p>
              )}
            </Box>
          )}

        {/* Hiển thị chi tiết ruleset */}
        {state.currentRuleset && (
          <Container
            header={
              <Header
                variant="h3"
                actions={
                  <Button
                    onClick={() => stateFns.setCurrentRuleset(null)}
                    variant="primary"
                  >
                    Quay lại danh sách
                  </Button>
                }
              >
                Chi tiết Ruleset
              </Header>
            }
          >
            <ColumnLayout columns={2} variant="text-grid">
              <FormField label="ID">{state.currentRuleset.id}</FormField>
              <FormField label="Tên">{state.currentRuleset.name}</FormField>
              <FormField label="Version">
                {state.currentRuleset.version || "1.0.0"}
              </FormField>
              <FormField label="Trạng thái">
                <StatusIndicator
                  type={
                    state.currentRuleset.state === STATE_DICT.APPROVED
                      ? "success"
                      : state.currentRuleset.state === STATE_DICT.PENDING
                      ? "in-progress"
                      : state.currentRuleset.state === STATE_DICT.REJECTED
                      ? "error"
                      : "stopped"
                  }
                >
                  {state.currentRuleset.state}
                </StatusIndicator>
              </FormField>
              <FormField label="Ngày tạo">
                {state.currentRuleset.createdAt}
              </FormField>
              {state.currentRuleset.reason && (
                <FormField label="Lý do từ chối">
                  <Box color="text-status-error">
                    {state.currentRuleset.reason}
                  </Box>
                </FormField>
              )}
            </ColumnLayout>

            {state.currentRuleset.description && (
              <Box margin={{ top: "l" }}>
                <FormField label="Mô tả">
                  {state.currentRuleset.description}
                </FormField>
              </Box>
            )}
          </Container>
        )}
      </SpaceBetween>
    </ExpandableSection>
  );
}
