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
      <Container header={<Header variant="h3">Result</Header>}>
        <StatusIndicator type="loading">Processing...</StatusIndicator>
      </Container>
    );

  if (!props.result || (props.result && !props.result.data))
    return (
      <Container header={<Header variant="h3">Result</Header>}>
        <Box textAlign="center" color="text-body-secondary">
          <em>There isn't any running job. Please select any job to run.</em>
        </Box>
      </Container>
    );

  const jobRun = props.result!.data!;

  console.log("Props:", props);

  return (
    <Container>
      <Header variant="h3">Result Detail</Header>
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
            : "Unknown"}
        </FormField>
      </ColumnLayout>
    </Container>
  );
}
