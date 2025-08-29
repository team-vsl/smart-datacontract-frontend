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
import CodeView from "@cloudscape-design/code-view/code-view";

// Import constants
import { CONFIGS } from "@/utils/constants/configs";
import { STATE_DICT } from "@/utils/constants/rl";

// Import objects
import * as RulesetAPI from "@/objects/ruleset/api";
import * as RulesetHelpers from "@/objects/ruleset/helpers";

// Import hooks
import { useStateManager } from "@/hooks/use-state-manager";

// Import states
import { RLStateManager } from "./state";
import { useRulesetState, rulesetStActions } from "@/states/ruleset";

// Import utils
import * as ErrorUtils from "@/utils/error";

// Import types
import type { TRuleset } from "@/objects/ruleset/types";

type TRulesetListProps = {
  rls: Array<TRuleset>;
  isFetching: boolean;
  isError: boolean;
  isIdle: boolean;
  error: Error | null;
  setCurrentRulesetName(name: string): void;
  handleGetRulesets(): void;
};

type TRulesetDetailProps = {
  currentRulesetContent: string | null;
  currentRuleset: TRuleset | null;
  isFetching: boolean;
  isError: boolean;
  isIdle: boolean;
  error: Error | null;
  handleGetRuleset(): void;
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
            <Button
              iconName="refresh"
              ariaLabel="Refresh"
              loadingText="Refreshing table content"
              onClick={() => {
                props.handleGetRulesets();
              }}
              loading={props.isFetching}
              disabled={props.isFetching}
            />
            <div className="ms-3">
              {/* Hiển thị loading state */}
              {props.isFetching && (
                <StatusIndicator type="loading">
                  Loading Rulesets...
                </StatusIndicator>
              )}

              {/* Hiển thị lỗi */}
              {props.isError && (
                <StatusIndicator type="error">
                  {ErrorUtils.getErrorMessage(props.error)}
                </StatusIndicator>
              )}
            </div>
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
            id: "name",
            header: "Name",
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
            header: "State",
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
            console.log(detail.selectedItems[0].name);
            props.setCurrentRulesetName(detail.selectedItems[0].name);
          }
        }}
        selectionType="single"
        trackBy="name"
        empty={
          <Box textAlign="center" color="inherit">
            <b>No data</b>
            <Box padding={{ bottom: "s" }} variant="p" color="inherit">
              Cannot find any Ruleset with selected state.
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
    <Container
      header={
        <Header variant="h3">
          <div className="flex items-center">
            <p className="me-3">Ruleset Detail</p>
            <Button
              iconName="refresh"
              ariaLabel="Refresh"
              loadingText="Refreshing table content"
              onClick={() => {
                props.handleGetRuleset();
              }}
              loading={props.isFetching}
              disabled={props.isFetching}
            />
            <div className="ms-3">
              {/* Hiển thị loading state */}
              {props.isFetching && (
                <StatusIndicator type="loading">
                  Loading detail of Ruleset...
                </StatusIndicator>
              )}

              {/* Hiển thị lỗi */}
              {props.isError && (
                <StatusIndicator type="error">
                  {ErrorUtils.getErrorMessage(props.error)}
                </StatusIndicator>
              )}
            </div>
          </div>
        </Header>
      }
    >
      {canDisplayResult && props.currentRuleset && (
        <>
          <ColumnLayout columns={2} variant="text-grid">
            <FormField label="Name">{props.currentRuleset.name}</FormField>
            <FormField label="Version">
              {props.currentRuleset.version || ""}
            </FormField>
            <FormField label="State">
              <StatusIndicator
                type={
                  RulesetHelpers.getStatusIndicatorType(
                    props.currentRuleset.state,
                  ) as any
                }
              >
                {props.currentRuleset.state}
              </StatusIndicator>
            </FormField>
            <FormField label="Create Date">
              {props.currentRuleset.createdAt}
            </FormField>
          </ColumnLayout>

          {props.currentRulesetContent && (
            <Box margin={{ top: "l" }} variant="div">
              <FormField label="Content" stretch={true}>
                <CodeView lineNumbers content={props.currentRulesetContent} />
              </FormField>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default function Ruleset(props: TRulesetsProps) {
  const { rls } = useRulesetState();
  // State cho ruleset
  const [state, stateFns] = useStateManager(
    RLStateManager.getInitialState(),
    RLStateManager.buildStateModifiers,
  );

  const rulesetQuerier = useQuery({
    queryKey: ["ruleset", state.currentRulesetName],
    queryFn: async function () {
      if (!state.currentRulesetName || !state.currentRulesetState) return null;

      return await Promise.all([
        RulesetAPI.reqGetRulesetInfo({
          name: state.currentRulesetName,
          isMock: CONFIGS.IS_MOCK_API,
        }),
        RulesetAPI.reqGetRuleset({
          name: state.currentRulesetName,
          state: state.currentRulesetState,
          isMock: CONFIGS.IS_MOCK_API,
        }),
      ]);
    },
    enabled: false,
  });

  // Sử dụng useQuery để lọc ruleset theo trạng thái
  const rulesetsQuerier = useQuery({
    queryKey: ["rulesets", state.currentRulesetState],
    queryFn: async function () {
      if (!state.currentRulesetState) return [];

      return await RulesetAPI.reqGetRulesetsByState({
        state: state.currentRulesetState,
        isMock: CONFIGS.IS_MOCK_API,
      });
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

      if (result.data) {
        const [rl, rlContent] = result.data;
        stateFns.setCurrentRuleset(rl);
        stateFns.setCurrentRulesetContent(rlContent);
      }
    } catch (error) {
      console.error("Error finding ruleset:", error);
    }
  };

  const handleGetRulesetsByState = async () => {
    if (!state.currentRulesetState && state.currentRulesetState !== "") return;

    try {
      // Tìm ruleset theo ID hoặc tên từ API
      const result = await rulesetsQuerier.refetch();

      if (result.data) {
        rulesetStActions.setRLS(result.data);
      }
    } catch (error) {
      console.error("Error finding ruleset:", error);
    }
  };

  // Chuyển đổi danh sách trạng thái cho Select component
  const stateOptions = [
    { label: "Select state", value: "" },
    { label: "Activated", value: STATE_DICT.ACTIVE },
    { label: "Inactivated", value: STATE_DICT.INACTIVE },
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
  console.log(state.currentRulesetContent);
  return (
    <ExpandableSection
      headerText="Get/List Rulesets"
      variant="container"
      defaultExpanded={state.isOpen}
      onChange={({ detail }) => stateFns.setIsOpen(detail.expanded)}
    >
      <SpaceBetween size="l">
        {/* Phần tương tác */}
        <ColumnLayout columns={1}>
          {/* List Rulesets - Dropdown chọn state */}
          <Container header={<Header variant="h3">List Rulesets</Header>}>
            <FormField label="State">
              <Select
                selectedOption={
                  stateOptions.find(
                    (option) => option.value === state.currentRulesetState,
                  ) || null
                }
                onChange={({ detail }) =>
                  detail.selectedOption &&
                  handleStateChange(detail.selectedOption.value as string)
                }
                options={stateOptions}
                placeholder="Select state"
              />
            </FormField>
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
          handleGetRulesets={handleGetRulesetsByState}
        />

        <RulesetDetail
          currentRulesetContent={state.currentRulesetContent}
          currentRuleset={state.currentRuleset}
          isFetching={rulesetQuerier.isFetching}
          isError={rulesetQuerier.isError}
          isIdle={!rulesetQuerier.isEnabled && !rulesetQuerier.isSuccess}
          error={rulesetQuerier.error}
          handleGetRuleset={handleGetRuleset}
        />
      </SpaceBetween>
    </ExpandableSection>
  );
}
