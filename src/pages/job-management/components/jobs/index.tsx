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
} from "@cloudscape-design/components";

// Import constants
import { CONFIGS } from "@/utils/constants/configs";

// Import hooks
import { useStateManager } from "@/hooks/use-state-manager";

// Import objects
import * as JobAPI from "@/objects/job/api";

// Import states
import { jobStActions, useJobState } from "@/states/job";
import { JobStateManager } from "./state";

// Import utils
import * as ErrorUtils from "@/utils/error";

// Import types
import type { TJob } from "@/objects/job/types";

type TJobListProps = {
  jbs: Array<TJob>;
  isFetching: boolean;
  isError: boolean;
  isIdle: boolean;
  error: Error | null;
  setCurrentJobName(name: string): void;
  handleGetJobs(): void;
};

type TJobDetailProps = {
  currentJob: TJob | null;
  isFetching: boolean;
  isError: boolean;
  isIdle: boolean;
  error: Error | null;
  handleGetJob(): void;
};

type TJobProps = {};

/**
 * Component dùng để hiện thị thông tin của Job theo dạng bảng
 * @param props
 * @returns
 */
function JobList(props: TJobListProps) {
  const canDisplayResult =
    props.jbs.length > 0 && !props.isFetching && !props.isError;

  const [selectedItems, setSelectedItems] = useState();

  return (
    <Container
      header={
        <Header variant="h3">
          <div className="flex items-center">
            <p className="me-3">Job List</p>
            <Button
              iconName="refresh"
              ariaLabel="Refresh"
              loadingText="Refreshing table content"
              onClick={() => {
                props.handleGetJobs();
              }}
              loading={props.isFetching}
              disabled={props.isFetching}
            />
            <div className="ms-3">
              {props.isFetching && (
                <StatusIndicator type="loading">
                  Loading Jobs...
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
      <Table<TJob>
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
            id: "jobMode",
            header: "Job Mode",
            cell: (item) => item.jobMode,
            sortingField: "jobMode",
          },
          {
            id: "createdOn",
            header: "Created Date",
            cell: (item) => new Date(item.createdOn).toLocaleString(),
            sortingField: "createdOn",
          },
        ]}
        items={props.jbs}
        onSelectionChange={({ detail }) => {
          if (detail.selectedItems.length > 0) {
            setSelectedItems(detail.selectedItems as any);
            props.setCurrentJobName(detail.selectedItems[0].name);
          }
        }}
        selectionType="single"
        trackBy="id"
        empty={
          <Box textAlign="center" color="inherit">
            <b>No data</b>
            <Box padding={{ bottom: "s" }} variant="p" color="inherit">
              Cannot find any Job
            </Box>
          </Box>
        }
      />
    </Container>
  );
}

/**
 * Component dùng để hiện thị các thông tin chi tiết của một Job
 * @param props
 * @returns
 */
function JobDetail(props: TJobDetailProps) {
  const canDisplayResult = !props.isFetching && !props.isError && !props.isIdle;

  return (
    <Container
      header={
        <Header variant="h3">
          <div className="flex items-center">
            <p className="me-3">Job Detail</p>
            <Button
              iconName="refresh"
              ariaLabel="Refresh"
              loadingText="Refreshing table content"
              onClick={() => {
                props.handleGetJob();
              }}
              loading={props.isFetching}
              disabled={props.isFetching}
            />
            <div className="ms-3">
              {props.isFetching && (
                <StatusIndicator type="loading">
                  Loading detail of Job...
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

      {canDisplayResult && props.currentJob && (
        <ColumnLayout columns={2} variant="text-grid">
          <FormField label="Name">{props.currentJob.name}</FormField>
          <FormField label="Mode">{props.currentJob.jobMode}</FormField>
          <FormField label="Created Date">
            {new Date(props.currentJob.createdOn).toLocaleString()}
          </FormField>
        </ColumnLayout>
      )}
    </Container>
  );
}

/**
 * Component hiển thị phần tương tác và kết quả của Job
 * @param props
 * @returns
 */
export default function Job(props: TJobProps) {
  const { jbs } = useJobState();

  // State cho job
  const [state, stateFns] = useStateManager(
    JobStateManager.getInitialState(),
    JobStateManager.buildStateModifiers,
  );

  // Sử dụng useQuery để lấy chi tiết job
  const jobQuerier = useQuery({
    queryKey: ["job", state.currentJobName],
    queryFn: async () =>
      await JobAPI.reqGetJob({
        jobName: state.currentJobName || "",
        isMock: CONFIGS.IS_MOCK_API,
      }),
    enabled: false,
  });

  const jobsQuerier = useQuery({
    queryKey: ["jobs"],
    queryFn: async () =>
      await JobAPI.reqGetJobs({
        isMock: CONFIGS.IS_MOCK_API,
      }),
    enabled: false,
  });

  const handleGetJob = async function () {
    if (!state.currentJobName && state.currentJobName !== "") return;
    try {
      const result = await jobQuerier.refetch();
      if (result.data) {
        stateFns.setCurrentJob(result.data as TJob);
      } else {
      }
    } catch (error) {}
  };

  const handleGetJobs = async function () {
    try {
      const result = await jobsQuerier.refetch();
      if (result.data) {
        jobStActions.setJBS(result.data as TJob[]);
      } else {
      }
    } catch (error) {}
  };

  useEffect(() => {
    handleGetJobs();
  }, []);

  useEffect(() => {
    if (state.currentJobName && state.currentJobName !== "") {
      handleGetJob();
    }
  }, [state.currentJobName]);

  return (
    <ExpandableSection
      headerText="Get/List Job"
      variant="container"
      defaultExpanded={state.isOpen}
      onChange={({ detail }) => stateFns.setIsOpen(detail.expanded)}
    >
      <SpaceBetween size="l">
        {/* Phần tương tác */}
        <ColumnLayout columns={1}>
          {/* Get Job - Input ID/Name và nút Submit */}
          <Container header={<Header variant="h3">Get Job</Header>}>
            <SpaceBetween size="xs" direction="horizontal">
              <Input
                value={state.currentJobName || ""}
                onChange={({ detail }) =>
                  stateFns.setCurrentJobName(detail.value)
                }
                placeholder="Enter Job name"
              />
              <Button onClick={handleGetJob} variant="primary">
                Search
              </Button>
            </SpaceBetween>
          </Container>
        </ColumnLayout>

        {/* Phần kết quả (view) */}
        {/* Hiển thị danh sách job */}
        <JobList
          jbs={jbs}
          isFetching={jobsQuerier.isFetching}
          isError={jobsQuerier.isError}
          isIdle={!jobsQuerier.isEnabled && !jobsQuerier.isSuccess}
          error={jobsQuerier.error}
          setCurrentJobName={stateFns.setCurrentJobName}
          handleGetJobs={handleGetJobs}
        />

        {/* Hiển thị chi tiết job */}
        <JobDetail
          currentJob={state.currentJob}
          isFetching={jobQuerier.isFetching}
          isError={jobQuerier.isError}
          isIdle={!jobQuerier.isEnabled && !jobQuerier.isSuccess}
          error={jobQuerier.error}
          handleGetJob={handleGetJob}
        />
      </SpaceBetween>
    </ExpandableSection>
  );
}
