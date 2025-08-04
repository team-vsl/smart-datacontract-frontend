import {useState, useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
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
import {CONFIGS} from "@/utils/constants/configs";
import {STATE_DICT} from "@/utils/constants/dc";

// Import hooks
import {useStateManager} from "@/hooks/use-state-manager";

// Import objects
import * as DataContractAPI from "@/objects/data-contract/api";
import * as DataContractHelpers from "@/objects/data-contract/helpers";

// Import states
import {
  useDataContractState,
  dataContractStActions,
} from "@/states/data-contract";
import {DCStateManager} from "./state";

// Import types
import type {TDataContract} from "@/objects/data-contract/types";

type TDataContractListProps = {
  dcs: Array<TDataContract>;
  isFetching: boolean;
  isError: boolean;
  isIdle: boolean;
  error: Error | null;
  setCurrentDataContractId(id: string): void;
};

type TDataContractDetailProps = {
  currentDataContract: TDataContract | null;
  isFetching: boolean;
  isError: boolean;
  isIdle: boolean;
  error: Error | null;
};

type DataContractProps = {};

const _stateOptions = [
  {label: "Chọn trạng thái", value: ""},
  {label: "Đang hoạt động", value: STATE_DICT.APPROVED},
  {label: "Đang chờ xử lý", value: STATE_DICT.PENDING},
  {label: "Đã từ chối", value: STATE_DICT.REJECTED},
];

function DataContractList(props: TDataContractListProps) {
  const canDisplayResult =
    props.dcs.length > 0 && !props.isFetching && !props.isError;

  const [selectedItems, setSelectedItems] = useState();

  return (
    <Container
      header={
        <Header variant="h3">
          <div className="flex items-center">
            <p className="me-3">Data Contract List</p>
            {props.isFetching && (
              <StatusIndicator type="loading">
                Đang tải dữ liệu...
              </StatusIndicator>
            )}
            {/* Hiển thị lỗi */}
            {props.isError && (
              <StatusIndicator type="error">
                {(props.error as any)?.response.data.error.message || "Không thể tải dữ liệu"}
              </StatusIndicator>
            )}
          </div>
        </Header>
      }
    >
      <Table<TDataContract>
        selectedItems={selectedItems}
        ariaLabels={{
          selectionGroupLabel: "Items selection",
          itemSelectionLabel: ({selectedItems}, item) => item.name,
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
            cell: (item) => item.version,
            sortingField: "version",
          },
          {
            id: "state",
            header: "Trạng thái",
            cell: (item) => (
              <StatusIndicator
                type={
                  DataContractHelpers.getStatusIndicatorType(item.state) as any
                }
              >
                {item.state}
              </StatusIndicator>
            ),
          },
        ]}
        items={props.dcs || []}
        onSelectionChange={({detail}) => {
          if (detail.selectedItems.length > 0) {
            setSelectedItems(detail.selectedItems as any);
            props.setCurrentDataContractId(detail.selectedItems[0].id);
          }
        }}
        selectionType="single"
        trackBy="id"
        empty={
          <Box textAlign="center" color="inherit">
            <b>Không có dữ liệu</b>
            <Box padding={{bottom: "s"}} variant="p" color="inherit">
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
    <Container header={<Header variant="h3">Data Contract Detail</Header>}>
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
          {(props.error as any)?.response.data.error.message || "Không thể tải dữ liệu"}
        </StatusIndicator>
      )}

      {canDisplayResult && props.currentDataContract && (
        <>
          <ColumnLayout columns={2} variant="text-grid">
            <FormField label="ID">{props.currentDataContract.id}</FormField>
            <FormField label="Tên">{props.currentDataContract.name}</FormField>
            <FormField label="Version">
              {props.currentDataContract.version}
            </FormField>
            <FormField label="Trạng thái">
              <StatusIndicator
                type={
                  DataContractHelpers.getStatusIndicatorType(
                    props.currentDataContract?.state
                  ) as any
                }
              >
                {props.currentDataContract.state}
              </StatusIndicator>
            </FormField>
            <FormField label="Owner">
              {props.currentDataContract.owner}
            </FormField>
            <FormField label="Ngày tạo">
              {props.currentDataContract.createdAt}
            </FormField>
          </ColumnLayout>

          {props.currentDataContract.description && (
            <Box margin={{top: "l"}}>
              <FormField label="Mô tả">
                {props.currentDataContract.description}
              </FormField>
            </Box>
          )}

          {props.currentDataContract.schema && (
            <Box margin={{top: "l"}}>
              <FormField label="Schema">
                <Box variant="code">
                  {JSON.stringify(props.currentDataContract.schema, null, 2)}
                </Box>
              </FormField>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export function DataContract(props: DataContractProps) {
  const {dcs} = useDataContractState();

  // State cho data contract
  const [state, stateFns] = useStateManager(
    DCStateManager.getInitialState(),
    DCStateManager.buildStateModifiers
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
    queryKey: ["dataContract", state.currentContractId],
    queryFn: async () =>
      await DataContractAPI.reqGetDataContract({
        id: state.currentContractId || "",
        isMock: CONFIGS.IS_MOCK_API,
      }),
    enabled: false,
  });

  // Hàm xử lý khi chọn trạng thái
  const handleStateChange = function (value: string) {
    stateFns.setCurrentContractState(value);
  };

  // Hàm xử lý khi submit ID/tên data contract
  const handleGetContract = async function () {
    if (!state.currentContractId && state.currentContractId !== "") return;
    try {
      const result = await dcQuerier.refetch();
      if (result.data) {
        stateFns.setCurrentContract(result.data as TDataContract);
      }
      console.log("Get contract result:", result);
    } catch (error) {
      console.log("Get contract error:", error);
    }
  };

  const handleGetContractByState = async function () {
    if (!state.currentContractState && state.currentContractState !== "")
      return;
    try {
      const result = await dcsQuerier.refetch();
      if (result.data) {
        dataContractStActions.setDCS(result.data as TDataContract[]);
      }
      console.log("Get data contracts result:", result);
    } catch (error) {
      console.log("Get data contracts error:", error);
    }
  };

  // Lấy chi tiết data contract mới khi id thay đổi
  useEffect(() => {
    if (state.currentContractId && state.currentContractId !== "")
      handleGetContract();
  }, [state.currentContractId]);

  // Lấy data contract theo state
  useEffect(() => {
    handleGetContractByState();
  }, [state.currentContractState]);

  return (
    <ExpandableSection
      headerText="Get/List Data Contract"
      variant="container"
      defaultExpanded={state.isOpen}
      onChange={({detail}) => stateFns.setIsOpen(detail.expanded)}
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
                onChange={({detail}) =>
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
                onChange={({detail}) =>
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

        <DataContractList
          dcs={dcs}
          isFetching={dcsQuerier.isFetching}
          isError={dcsQuerier.isError}
          isIdle={!dcsQuerier.isEnabled && !dcsQuerier.isSuccess}
          error={dcsQuerier.error}
          setCurrentDataContractId={stateFns.setCurrentContractId}
        />

        <DataContractDetail
          currentDataContract={state.currentContract}
          isFetching={dcQuerier.isFetching}
          isError={dcQuerier.isError}
          isIdle={!dcQuerier.isEnabled && !dcQuerier.isSuccess}
          error={dcQuerier.error}
        />
      </SpaceBetween>
    </ExpandableSection>
  );
}
