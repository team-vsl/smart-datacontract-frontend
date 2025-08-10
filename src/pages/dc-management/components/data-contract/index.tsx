import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import CodeView from "@cloudscape-design/code-view/code-view";
import yamlHighlight from "@cloudscape-design/code-view/highlight/yaml";

// Import constants
import { CONFIGS } from "@/utils/constants/configs";
import { STATE_DICT } from "@/utils/constants/dc";

// Import hooks
import { useStateManager } from "@/hooks/use-state-manager";

// Import objects
import * as DataContractAPI from "@/objects/data-contract/api";
import * as DataContractHelpers from "@/objects/data-contract/helpers";

// Import states
import { useDataContractState, dataContractStActions } from "@/states/data-contract";
import { DCStateManager } from "./state";

// Import utils
import * as ErrorUtils from "@/utils/error";

// Import types
import type { TDataContract } from "@/objects/data-contract/types";

type TDataContractListProps = {
  dcs: Array<TDataContract>;
  isFetching: boolean;
  isError: boolean;
  isIdle: boolean;
  error: unknown;
  setCurrentDataContractName(id: string): void;
  handleGetContractsByState(state?: string): void;
};

type TDataContractDetailProps = {
  currentDataContractContent: string;
  currentDataContract: TDataContract | null;
  isFetching: boolean;
  isError: boolean;
  isIdle: boolean;
  error: unknown;
  handleGetContract(name?: string): void;
};

type DataContractProps = {};

const _stateOptions = [
  { label: "Chọn trạng thái", value: "" },
  { label: "Đang hoạt động", value: STATE_DICT.APPROVED },
  { label: "Đang chờ xử lý", value: STATE_DICT.PENDING },
  { label: "Đã từ chối", value: STATE_DICT.REJECTED },
];

function DataContractList(props: TDataContractListProps) {
  const canDisplayResult = props.dcs.length > 0 && !props.isFetching && !props.isError;

  const [selectedItems, setSelectedItems] = useState();

  return (
    <Container
      header={
        <Header variant="h3">
          <div className="flex items-center">
            <p className="me-3">Data Contract List</p>
            <Button
              iconName="refresh"
              ariaLabel="Refresh"
              loadingText="Refreshing table content"
              onClick={() => {
                props.handleGetContractsByState();
              }}
              loading={props.isFetching}
              disabled={props.isFetching}
            />
            <div className="ms-3">
              {props.isFetching && (
                <StatusIndicator type="loading">Đang tải dữ liệu...</StatusIndicator>
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
      <Table<TDataContract>
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
            cell: (item) => item.version,
            sortingField: "version",
          },
          {
            id: "team",
            header: "Team",
            cell: (item) => item.team,
            sortingField: "team",
          },
          {
            id: "state",
            header: "State",
            cell: (item) => (
              <StatusIndicator type={DataContractHelpers.getStatusIndicatorType(item.state) as any}>
                {item.state}
              </StatusIndicator>
            ),
          },
          {
            id: "createdAt",
            header: "Created Date",
            cell: (item) => new Date(item.createdAt).toLocaleString(),
          },
        ]}
        items={props.dcs || []}
        onSelectionChange={({ detail }) => {
          if (detail.selectedItems.length > 0) {
            setSelectedItems(detail.selectedItems as any);
            props.setCurrentDataContractName(detail.selectedItems[0].name);
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
    </Container>
  );
}

function DataContractDetail(props: TDataContractDetailProps) {
  const canDisplayResult = !props.isFetching && !props.isError && !props.isIdle;

  return (
    <Container
      header={
        <Header variant="h3">
          <div className="flex items-center">
            <p className="me-3">Data Contract Detail</p>
            <Button
              iconName="refresh"
              ariaLabel="Refresh"
              loadingText="Refreshing table content"
              onClick={() => {
                props.handleGetContract();
              }}
              loading={props.isFetching}
              disabled={props.isFetching}
            />
            <div className="ms-3">
              {/* Hiển thị loading state */}
              {props.isFetching && (
                <StatusIndicator type="loading">Đang tải dữ liệu...</StatusIndicator>
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
      {props.isIdle && (
        <Box variant="p" textAlign="center">
          Chọn một Job trên list để xem chi tiết
        </Box>
      )}

      {canDisplayResult && props.currentDataContract && (
        <>
          <ColumnLayout columns={2} variant="text-grid">
            <FormField label="Name">{props.currentDataContract.name}</FormField>
            <FormField label="Version">{props.currentDataContract.version}</FormField>
            <FormField label="State">
              <StatusIndicator
                type={
                  DataContractHelpers.getStatusIndicatorType(
                    props.currentDataContract?.state,
                  ) as any
                }
              >
                {props.currentDataContract.state}
              </StatusIndicator>
            </FormField>
            <FormField label="Owner">{props.currentDataContract.owner}</FormField>
            <FormField label="Team">{props.currentDataContract.team}</FormField>
            <FormField label="Created Date">
              {new Date(props.currentDataContract.createdAt).toLocaleString()}
            </FormField>
          </ColumnLayout>

          {props.currentDataContractContent && (
            <Box margin={{ top: "l" }} variant="div">
              <FormField label="Content" stretch={true}>
                <CodeView
                  lineNumbers
                  highlight={yamlHighlight}
                  content={props.currentDataContractContent}
                />
              </FormField>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export function DataContract(props: DataContractProps) {
  const { dcs } = useDataContractState();

  // State cho data contract
  const [state, stateFns] = useStateManager(
    DCStateManager.getInitialState(),
    DCStateManager.buildStateModifiers,
  );

  // Sử dụng useQuery để lấy danh sách data contracts theo trạng thái
  const dcsQuerier = useQuery({
    queryKey: ["dataContracts", state.currentContractState, dcs],
    queryFn: async function () {
      return await DataContractAPI.reqGetDataContractsByState({
        state: state.currentContractState || "",
        isMock: CONFIGS.IS_MOCK_API,
      });
    },
    enabled: false,
  });

  // Sử dụng useQuery để lấy chi tiết data contract
  const dcQuerier = useQuery({
    queryKey: ["dataContract", state.currentContractName],
    queryFn: async () =>
      await Promise.all([
        DataContractAPI.reqGetDataContractInfo({
          name: state.currentContractName || "",
          state: state.currentContractState || "",
          isMock: CONFIGS.IS_MOCK_API,
        }),
        DataContractAPI.reqGetDataContract({
          name: state.currentContractName || "",
          state: state.currentContractState || "",
          isMock: CONFIGS.IS_MOCK_API,
        }),
      ]),
    enabled: false,
  });

  // Hàm xử lý khi chọn trạng thái
  const handleStateChange = function (value: string) {
    stateFns.setCurrentContractState(value);
  };

  // Hàm xử lý khi submit ID/tên data contract
  const handleGetContract = async function () {
    if (!state.currentContractName && state.currentContractName !== "") return;
    try {
      const results = await dcQuerier.refetch();
      if (results.data) {
        const [dc, dcContent] = results.data;
        stateFns.setCurrentContract(dc as TDataContract);
        stateFns.setCurrentContractContent(dcContent);
      }
    } catch (error) {
      console.log("Get contract error:", error);
    }
  };

  const handleGetContractsByState = async function () {
    if (!state.currentContractState && state.currentContractState !== "") return;
    try {
      const result = await dcsQuerier.refetch();
      if (result.data) {
        dataContractStActions.setDCS(result.data as TDataContract[]);
      }
    } catch (error) {
      console.log("Get data contracts error:", error);
    }
  };

  // Lấy chi tiết data contract mới khi id thay đổi
  useEffect(() => {
    if (state.currentContractName && state.currentContractName !== "") handleGetContract();
  }, [state.currentContractName]);

  // Lấy data contract theo state
  useEffect(() => {
    handleGetContractsByState();
  }, [state.currentContractState]);

  return (
    <ExpandableSection
      headerText="Get/List Data Contract"
      variant="container"
      defaultExpanded={state.isOpen}
      onChange={({ detail }) => stateFns.setIsOpen(detail.expanded)}
    >
      <SpaceBetween size="l">
        {/* Phần tương tác */}
        <ColumnLayout columns={1}>
          {/* List Data Contract - Dropdown chọn state */}
          <Container header={<Header variant="h3">List Data Contracts</Header>}>
            <FormField label="Trạng thái">
              <Select
                selectedOption={
                  _stateOptions.find((option) => option.value === state.currentContractState) ||
                  null
                }
                onChange={({ detail }) =>
                  detail.selectedOption && handleStateChange(detail.selectedOption.value as string)
                }
                options={_stateOptions}
                placeholder="Chọn trạng thái"
              />
            </FormField>
          </Container>
        </ColumnLayout>

        <DataContractList
          dcs={dcs}
          isFetching={dcsQuerier.isFetching}
          isError={dcsQuerier.isError}
          isIdle={!dcsQuerier.isEnabled && !dcsQuerier.isSuccess}
          error={dcsQuerier.error}
          setCurrentDataContractName={stateFns.setCurrentContractName}
          handleGetContractsByState={handleGetContractsByState}
        />

        <DataContractDetail
          currentDataContractContent={state.currentDataContractContent || ""}
          currentDataContract={state.currentContract}
          isFetching={dcQuerier.isFetching}
          isError={dcQuerier.isError}
          isIdle={!dcQuerier.isEnabled && !dcQuerier.isSuccess}
          error={dcQuerier.error}
          handleGetContract={handleGetContract}
        />
      </SpaceBetween>
    </ExpandableSection>
  );
}
