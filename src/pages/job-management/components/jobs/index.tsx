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
import { STATE_DICT } from "@/utils/constants/dc";

// Import hooks
import { useStateManager } from "@/hooks/use-state-manager";

// Import objects
import * as JobAPI from "@/objects/job/api";

// Import states
import { useJobState } from "@/states/job";
import { JobStateManager } from "./state";

// Import types
import type { TJob } from "@/objects/job/types";

type TJobListProps = {
  jbs: Array<TJob>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  setCurrentJob(jb: TJob): void;
};

type TJobDetailProps = {
  currentJob: TJob;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  setCurrentJob(job: TJob | null): void;
};

type TJobProps = {
  isJobsFetchPending: boolean;
  jobFetchError: Error | null;
};

/**
 * Component dùng để hiện thị thông tin của Job theo dạng bảng
 * @param props
 * @returns
 */
function JobList(props: TJobListProps) {
  return (
    <>
      {/* Hiển thị loading state */}
      {props.isPending && (
        <StatusIndicator type="loading">Đang tải dữ liệu...</StatusIndicator>
      )}

      {/* Hiển thị lỗi */}
      {props.isError && (
        <StatusIndicator type="error">
          {(props.error as Error)?.message || "Không thể tải dữ liệu"}
        </StatusIndicator>
      )}
      <Container
        header={<Header variant="h3">Job List (Auto-fetching)</Header>}
      >
        {props.jbs.length > 0 ? (
          <Table<TJob>
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
                cell: (item) => item.name,
                sortingField: "name",
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
                props.setCurrentJob(detail.selectedItems[0]);
              }
            }}
            selectionType="single"
            trackBy="id"
            empty={
              <Box textAlign="center" color="inherit">
                <b>Không có dữ liệu</b>
                <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                  Không tìm thấy job nào với trạng thái đã chọn.
                </Box>
              </Box>
            }
          />
        ) : (
          <Box textAlign="center" color="text-body-secondary">
            <p>Không tìm thấy job</p>
          </Box>
        )}
      </Container>
    </>
  );
}

/**
 * Component dùng để hiện thị các thông tin chi tiết của một Job
 * @param props
 * @returns
 */
function JobDetail(props: TJobDetailProps) {
  return (
    <>
      {/* Hiển thị loading state */}
      {props.isPending && (
        <StatusIndicator type="loading">Đang tải dữ liệu...</StatusIndicator>
      )}

      {/* Hiển thị lỗi */}
      {props.isError && (
        <StatusIndicator type="error">
          {(props.error as Error)?.message || "Không thể tải dữ liệu"}
        </StatusIndicator>
      )}

      <Container
        header={
          <Header
            variant="h3"
            actions={
              <Button
                onClick={() => props.setCurrentJob(null)}
                variant="primary"
              >
                Quay lại danh sách
              </Button>
            }
          >
            Job Detail
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <FormField label="Name">{props.currentJob.name}</FormField>
          <FormField label="Mode">{props.currentJob.jobMode}</FormField>
          <FormField label="Created Date">
            {new Date(props.currentJob.createdOn).toLocaleString()}
          </FormField>
        </ColumnLayout>
      </Container>
    </>
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
    JobStateManager.buildStateModifiers
  );

  // Sử dụng useQuery để lấy chi tiết job
  const {
    refetch: fetchJob,
    error,
    isPending,
  } = useQuery({
    queryKey: ["dataContract", state.currentJobName],
    queryFn: async () =>
      await JobAPI.reqGetJob({
        jobName: state.currentJobName || "",
        isMock: true,
      }),
    enabled: false,
  });

  // Hàm xử lý khi submit ID/tên job
  const handleGetJob = async function () {
    if (!state.currentJobName) return;
    try {
      const result = await fetchJob();
      if (result.data) {
        stateFns.setCurrentJob(result.data as TJob);
      } else {
        alert(`Không tìm thấy Job với tên: ${state.currentJobName}`);
      }
    } catch (error) {
      alert(`Lỗi khi tìm Job: ${error}`);
    }
  };

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
                placeholder="Nhập tên Job"
              />
              <Button onClick={handleGetJob} variant="primary">
                Tìm kiếm
              </Button>
            </SpaceBetween>
          </Container>
        </ColumnLayout>

        {/* Phần kết quả (view) */}
        {/* Hiển thị danh sách job */}
        {!state.currentJob && (
          <JobList
            jbs={jbs}
            isPending={props.isJobsFetchPending}
            isError={Boolean(props.jobFetchError)}
            error={props.jobFetchError}
            setCurrentJob={stateFns.setCurrentJob}
          />
        )}

        {/* Hiển thị chi tiết job */}
        {state.currentJob && (
          <JobDetail
            currentJob={state.currentJob}
            isPending={isPending}
            isError={Boolean(error)}
            error={error}
            setCurrentJob={stateFns.setCurrentJob}
          />
        )}
      </SpaceBetween>
    </ExpandableSection>
  );
}
