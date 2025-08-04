import { useState, useEffect } from "react";
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
import { CONFIGS } from "@/utils/constants/configs";
import { STATE_DICT } from "@/utils/constants/dc";

// Import objects
import * as RulesetAPI from "@/objects/ruleset/api";
import * as RulesetHelpers from "@/objects/ruleset/helpers";

// Import hooks
import { useStateManager } from "@/hooks/use-state-manager";

// Import states
import { RLStateManager } from "./state";
import { useRulesetState, rulesetStActions } from "@/states/ruleset";

// Import types
import type { TRuleset } from "@/objects/ruleset/types";

type TRulesetListProps = {
  rls: Array<TRuleset>;
  isFetching: boolean;
  isError: boolean;
  isIdle: boolean;
  error: Error | null;
  setCurrentRulesetName(name: string): void;
};

type TRulesetDetailProps = {
  currentRuleset: TRuleset | null;
  isFetching: boolean;
  isError: boolean;
  isIdle: boolean;
  error: Error | null;
};

type TRulesetsProps = {};

function RulesetList(props: TRulesetListProps) {
  const canDisplayResult =
    props.rls.length > 0 && !props.isFetching && !props.isError;

  const [selectedItems, setSelectedItems] = useState();

  return (
    <Container
      header={
        <Header variant="h3">
          <div className="flex items-center">
            <p className="me-3">Ruleset List</p>
            {props.isFetching && (
              <StatusIndicator type="loading">
                Đang tải dữ liệu...
              </StatusIndicator>
            )}
            {/* Hiển thị lỗi */}
            {props.isError && (
              <StatusIndicator type="error">
                {(props.error as Error)?.message || "Không thể tải dữ liệu"}
              </StatusIndicator>
            )}
          </div>
        </Header>
      }
    >
      <Table<TRuleset>
        selectedItems={selectedItems}
        ariaLabels={{
          selectionGroupLabel: "Items selection",
          itemSelectionLabel: ({ selectedItems }, item) => item.name,
        }}
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
                type={RulesetHelpers.getStatusIndicatorType(item.state) as any}
              >
                {item.state}
              </StatusIndicator>
            ),
          },
        ]}
        items={props.rls}
        onSelectionChange={({ detail }) => {
          if (detail.selectedItems.length > 0) {
            setSelectedItems(detail.selectedItems as any);
            props.setCurrentRulesetName(detail.selectedItems[0].name);
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
  );
}

function RulesetDetail(props: TRulesetDetailProps) {
  const canDisplayResult = !props.isFetching && !props.isError && !props.isIdle;

  return (
    <Container header={<Header variant="h3">Ruleset Detail</Header>}>
      {props.isIdle && (
        <Box variant="p" textAlign="center">
          Chọn một Job trên list để xem chi tiết
        </Box>
      )}

      {/* Hiển thị loading state */}
      {props.isFetching && (
        <StatusIndicator type="loading">Đang tải dữ liệu...</StatusIndicator>
      )}

      {/* Hiển thị lỗi */}
      {props.isError && (
        <StatusIndicator type="error">
          {(props.error as Error)?.message || "Không thể tải dữ liệu"}
        </StatusIndicator>
      )}

      {canDisplayResult && props.currentRuleset && (
        <ColumnLayout columns={2} variant="text-grid">
          <FormField label="ID">{props.currentRuleset.id}</FormField>
          <FormField label="Tên">{props.currentRuleset.name}</FormField>
          <FormField label="Version">
            {props.currentRuleset.version || ""}
          </FormField>
          <FormField label="Trạng thái">
            <StatusIndicator
              type={
                RulesetHelpers.getStatusIndicatorType(
                  props.currentRuleset.state
                ) as any
              }
            >
              {props.currentRuleset.state}
            </StatusIndicator>
          </FormField>
          <FormField label="Ngày tạo">
            {props.currentRuleset.createdAt}
          </FormField>

          {props.currentRuleset.reason && (
            <FormField label="Lý do từ chối">
              <Box color="text-status-error">{props.currentRuleset.reason}</Box>
            </FormField>
          )}

          {props.currentRuleset.description && (
            <Box margin={{ top: "l" }}>
              <FormField label="Mô tả">
                {props.currentRuleset.description}
              </FormField>
            </Box>
          )}
        </ColumnLayout>
      )}
    </Container>
  );
}

export default function Ruleset(props: TRulesetsProps) {
  const { rls } = useRulesetState();
  // State cho ruleset
  const [state, stateFns] = useStateManager(
    RLStateManager.getInitialState(),
    RLStateManager.buildStateModifiers
  );

  const rulesetQuerier = useQuery({
    queryKey: ["ruleset", state.currentRulesetName],
    queryFn: async function () {
      if (!state.currentRulesetName) return null;
      try {
        const ruleset = await RulesetAPI.reqGetRuleset({
          name: state.currentRulesetName,
          isMock: CONFIGS.IS_MOCK_API,
        });
        return ruleset;
      } catch (error) {
        console.error("Error fetching ruleset:", error);
        return null;
      }
    },
    enabled: false,
  });

  // Sử dụng useQuery để lọc ruleset theo trạng thái
  const rulesetsQuerier = useQuery({
    queryKey: ["rulesets", state.currentRulesetState],
    queryFn: async function () {
      if (!state.currentRulesetState) return [];
      console.log("Đang lọc theo trạng thái:", state.currentRulesetState);
      try {
        const filtered = await RulesetAPI.reqGetRulesetsByState({
          state: state.currentRulesetState,
          isMock: CONFIGS.IS_MOCK_API,
        });
        return filtered;
      } catch (error) {
        console.error("Error fetching rulesets:", error);
        return [];
      }
    },
    enabled: false,
  });

  // Hàm xử lý khi chọn trạng thái
  const handleStateChange = (value: string) => {
    stateFns.setCurrentRulesetState(value);
  };

  const handleGetRuleset = async () => {
    if (!state.currentRulesetName && state.currentRulesetName !== "") return;

    try {
      // Tìm ruleset theo ID hoặc tên từ API
      const result = await rulesetQuerier.refetch();
      console.log("Data:", result.data);

      if (result.data) {
        stateFns.setCurrentRuleset(result.data as TRuleset);
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

  const handleGetRulesetsByState = async () => {
    if (!state.currentRulesetState && state.currentRulesetState !== "") return;

    try {
      // Tìm ruleset theo ID hoặc tên từ API
      const result = await rulesetsQuerier.refetch();

      if (result.data) {
        rulesetStActions.setRLS(result.data);
      } else {
        alert(`Không tìm thấy ruleset với state: ${state.currentRulesetState}`);
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

  // Lấy chi tiết ruleset mới khi id thay đổi
  useEffect(() => {
    if (state.currentRulesetName && state.currentRulesetName !== "")
      handleGetRuleset();
  }, [state.currentRulesetName]);

  // Lấy ruleset theo state
  useEffect(() => {
    handleGetRulesetsByState();
  }, [state.currentRulesetState]);

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
        <RulesetList
          rls={rls}
          isFetching={rulesetsQuerier.isFetching}
          isError={rulesetsQuerier.isError}
          isIdle={!rulesetsQuerier.isEnabled && !rulesetsQuerier.isSuccess}
          error={rulesetsQuerier.error}
          setCurrentRulesetName={stateFns.setCurrentRulesetName}
        />

        <RulesetDetail
          currentRuleset={state.currentRuleset}
          isFetching={rulesetQuerier.isFetching}
          isError={rulesetQuerier.isError}
          isIdle={!rulesetQuerier.isEnabled && !rulesetQuerier.isSuccess}
          error={rulesetQuerier.error}
        />
      </SpaceBetween>
    </ExpandableSection>
  );
}
