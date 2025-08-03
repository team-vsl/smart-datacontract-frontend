import {
  Container,
  Header,
  SpaceBetween,
  StatusIndicator,
  FormField,
  Box,
  ColumnLayout,
} from "@cloudscape-design/components";

// Import objects
import * as JobHelpers from "@/objects/job/helpers";

// Import constants
import { JOBRUN_STATE_DICT } from "@/utils/constants/job";

// Import types
import type { TRunJobReqResult } from "@/objects/job/types";

type RunJobResultPartProps = {
  isPending: boolean;
  result?: TRunJobReqResult;
};

/**
 * Component hiển thị kết quả tương tác với job run
 * @param props
 * @returns
 */
export default function ResultPart(props: RunJobResultPartProps) {
  if (props.isPending)
    return (
      <Container header={<Header variant="h3">Kết quả</Header>}>
        <StatusIndicator type="loading">Đang xử lý yêu cầu...</StatusIndicator>
      </Container>
    );

  if (!props.result || (props.result && !props.result.data))
    return (
      <Container header={<Header variant="h3">Kết quả</Header>}>
        <Box textAlign="center" color="text-body-secondary">
          <em>Chưa có job nào đang chạy, vui lòng chọn một job để chạy</em>
        </Box>
      </Container>
    );

  const jobRun = props.result!.data!;

  return (
    <Container>
      <Header variant="h3">Chi tiết kết quả</Header>
      <div className="mb-3">
        <StatusIndicator
          type={JobHelpers.getStatusIndicatorType(jobRun.jobRunState) as any}
        >
          {props.result.message}
        </StatusIndicator>
      </div>
      <ColumnLayout columns={2} variant="text-grid">
        <FormField label="ID">{jobRun.id}</FormField>
        <FormField label="Job Name">{jobRun.jobName}</FormField>
        <FormField label="Attempt">{jobRun.attempt}</FormField>
        <FormField label="Run state">
          <StatusIndicator
            type={JobHelpers.getStatusIndicatorType(jobRun.jobRunState) as any}
          >
            {jobRun.jobRunState}
          </StatusIndicator>
        </FormField>
        <FormField label="Started Date">
          {new Date(jobRun.startedOn).toLocaleString()}
        </FormField>
        <FormField label="Complete Date">
          {jobRun.completedOn
            ? new Date(jobRun.completedOn).toLocaleString()
            : "Chưa biết"}
        </FormField>
      </ColumnLayout>
    </Container>
  );
}
