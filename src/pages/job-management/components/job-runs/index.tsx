import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Table,
} from "@cloudscape-design/components";

// Import constants
import { CONFIGS } from "@/utils/constants/configs";

// Import hooks
import { useStateManager } from "@/hooks/use-state-manager";

// Import objects
import * as JobHelpers from "@/objects/job/helpers";
import * as JobAPI from "@/objects/job/api";

// Import states
import { JobRunStateManager } from "./state";

// Import utils
import * as ErrorUtils from "@/utils/error";

// Import types
import type { TJobRun } from "@/objects/job/types";

type TJobRunListProps = {
  jbrs: Array<TJobRun>;
  isFetching: boolean;
  isError: boolean;
  isIdle: boolean;
  error: Error | null;
  setCurrentJobRun(jb: TJobRun): void;
  setCurrentJobRunId(id: string): void;
  handleGetJobRuns(): void;
};

type TJobRunDetailProps = {
  currentJobRun: TJobRun | null;
  isFetching: boolean;
  isError: boolean;
  isIdle: boolean;
  error: Error | null;
  setCurrentJobRun(job: TJobRun | null): void;
  handleGetJobRun(): void;
};

type TJobRunProps = {};

/**
 * Component dùng để hiện thị thông tin của Job Run theo dạng bảng
 * @param props
 * @returns
 */
function JobRunList(props: TJobRunListProps) {
  const canDisplayResult =
    props.jbrs.length > 0 && !props.isFetching && !props.isError;

  const [selectedItems, setSelectedItems] = useState();

  return (
    <Container
      header={
        <Header variant="h3">
          <div className="flex items-center">
            <p className="me-3">Job Run List</p>
            <Button
              iconName="refresh"
              ariaLabel="Refresh"
              loadingText="Refreshing table content"
              onClick={() => {
                props.handleGetJobRuns();
              }}
              loading={props.isFetching}
              disabled={props.isFetching}
            />{" "}
            <div className="ms-3">
              {props.isFetching && (
                <StatusIndicator type="loading">
                  Loading Job Runs...
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
      <Table<TJobRun>
        selectedItems={selectedItems}
        ariaLabels={{
          selectionGroupLabel: "Items selection",
          itemSelectionLabel: ({ selectedItems }, item) => item.id,
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
            header: "Name",
            cell: (item) => item.jobName,
            sortingField: "name",
          },
          {
            id: "jobRunState",
            header: "Run state",
            cell: (item) => {
              const type = JobHelpers.getStatusIndicatorType(item.jobRunState);

              return (
                <StatusIndicator type={type as any}>
                  {item.jobRunState}
                </StatusIndicator>
              );
            },
            sortingField: "jobRunState",
          },
          {
            id: "startedOn",
            header: "Started Date",
            cell: (item) => new Date(item.startedOn).toLocaleString(),
            sortingField: "startedOn",
          },
        ]}
        items={props.jbrs}
        onSelectionChange={({ detail }) => {
          if (detail.selectedItems.length > 0) {
            setSelectedItems(detail.selectedItems as any);
            props.setCurrentJobRunId(detail.selectedItems[0].id);
          }
        }}
        selectionType="single"
        trackBy="id"
        empty={
          <Box textAlign="center" color="inherit">
            <b>No data</b>
            <Box padding={{ bottom: "s" }} variant="p" color="inherit">
              Cannot find any Job Run
            </Box>
          </Box>
        }
      />
    </Container>
  );
}

/**
 * Component dùng để hiện thị các thông tin chi tiết của một Job Run
 * @param props
 * @returns
 */
function JobRunDetail(props: TJobRunDetailProps) {
  const canDisplayResult = !props.isFetching && !props.isError && !props.isIdle;

  return (
    <Container
      header={
        <Header variant="h3">
          <div className="flex items-center">
            <p className="me-3">Job Run Detail</p>
            <Button
              iconName="refresh"
              ariaLabel="Refresh"
              loadingText="Refreshing table content"
              onClick={() => {
                props.handleGetJobRun();
              }}
              loading={props.isFetching}
              disabled={props.isFetching}
            />
            <div className="ms-3">
              {props.isFetching && (
                <StatusIndicator type="loading">
                  Loading detail of Job Run...
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
      {props.isIdle && (
        <Box variant="p" textAlign="center">
          Select one Job in list to view detail
        </Box>
      )}

      {props.currentJobRun && canDisplayResult && (
        <ColumnLayout columns={2} variant="text-grid">
          <FormField label="ID">{props.currentJobRun.id}</FormField>
          <FormField label="Job Name">{props.currentJobRun.jobName}</FormField>
          <FormField label="Attempt">{props.currentJobRun.attempt}</FormField>
          <FormField label="State">
            <StatusIndicator
              type={
                JobHelpers.getStatusIndicatorType(
                  props.currentJobRun.jobRunState,
                ) as any
              }
            >
              {props.currentJobRun.jobRunState}
            </StatusIndicator>
          </FormField>
          <FormField label="Started Date">
            {new Date(props.currentJobRun.startedOn).toLocaleString()}
          </FormField>
          <FormField label="Complete Date">
            {props.currentJobRun.completedOn
              ? new Date(props.currentJobRun.completedOn).toLocaleString()
              : "Chưa biết"}
          </FormField>
        </ColumnLayout>
      )}
    </Container>
  );
}

/**
 * Component hiển thị phần tương tác và kết quả của Job Run
 * @param props
 * @returns
 */
export default function JobRun(props: TJobRunProps) {
  // State cho job run
  const [state, stateFns] = useStateManager(
    JobRunStateManager.getInitialState(),
    JobRunStateManager.buildStateModifiers,
  );

  // Sử dụng useQuery để lấy chi tiết job run và job runs
  const jobRunQuerier = useQuery({
    queryKey: ["jobrun", state.currentJobName, state.currentJobRunId],
    queryFn: async () =>
      await JobAPI.reqGetJobRun({
        id: state.currentJobRunId || "",
        jobName: state.currentJobName || "",
        isMock: CONFIGS.IS_MOCK_API,
      }),
    enabled: false,
  });

  const jobRunsQuerier = useQuery({
    queryKey: ["jobruns", state.currentJobName],
    queryFn: async () =>
      await JobAPI.reqGetJobRuns({
        jobName: state.currentJobName || "",
        isMock: CONFIGS.IS_MOCK_API,
      }),
    enabled: false,
  });

  const handleGetJobRun = async function () {
    if (!state.currentJobName || !state.currentJobRunId) return;
    try {
      const result = await jobRunQuerier.refetch();
      if (result.data) {
        stateFns.setCurrentJobRun(result.data as TJobRun);
      }
    } catch (error) {}
  };

  const handleGetJobRuns = async function () {
    if (!state.currentJobName) return;
    try {
      const result = await jobRunsQuerier.refetch();
      if (result.data) {
        stateFns.setJBRS(result.data as TJobRun[]);
      } else {
      }
    } catch (error) {}
  };

  // Lấy job run mới khi currentJobRunId thay đổi
  useEffect(() => {
    if (state.currentJobRunId && state.currentJobRunId !== "") {
      handleGetJobRun();
    }
  }, [state.currentJobRunId]);

  return (
    <ExpandableSection
      headerText="Get/List Job Run"
      variant="container"
      defaultExpanded={state.isOpen}
      onChange={({ detail }) => stateFns.setIsOpen(detail.expanded)}
    >
      <SpaceBetween size="l">
        {/* Phần tương tác */}
        <ColumnLayout columns={1}>
          {/* Get Job - Input ID/Name và nút Submit */}
          <Container header={<Header variant="h3">List Job Run</Header>}>
            <SpaceBetween size="xs" direction="horizontal">
              <Input
                value={state.currentJobName || ""}
                onChange={({ detail }) =>
                  stateFns.setCurrentJobName(detail.value)
                }
                placeholder="Enter Job name"
              />
              <Button onClick={handleGetJobRuns} variant="primary">
                Search
              </Button>
            </SpaceBetween>
          </Container>
        </ColumnLayout>

        {/* Phần kết quả (view) */}
        {/* Hiển thị danh sách job run */}
        <JobRunList
          jbrs={state.jbrs}
          isFetching={jobRunsQuerier.isFetching}
          isError={jobRunsQuerier.isError}
          isIdle={!jobRunsQuerier.isEnabled && !jobRunQuerier.isSuccess}
          error={jobRunsQuerier.error}
          setCurrentJobRun={stateFns.setCurrentJobRun}
          setCurrentJobRunId={stateFns.setCurrentJobRunId}
          handleGetJobRuns={handleGetJobRuns}
        />

        {/* Hiển thị chi tiết job run */}
        <JobRunDetail
          currentJobRun={state.currentJobRun}
          isFetching={jobRunQuerier.isFetching}
          isError={jobRunQuerier.isError}
          isIdle={!jobRunQuerier.isEnabled && !jobRunQuerier.isSuccess}
          error={jobRunQuerier.error}
          setCurrentJobRun={stateFns.setCurrentJobRun}
          handleGetJobRun={handleGetJobRun}
        />
      </SpaceBetween>
    </ExpandableSection>
  );
}
