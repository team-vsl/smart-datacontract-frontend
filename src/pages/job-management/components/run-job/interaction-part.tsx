import {
  Button,
  Container,
  Header,
  Select,
  SpaceBetween,
  FormField,
} from "@cloudscape-design/components";

// Import states
import { useJobState } from "@/states/job";

type RunJobInteractionPartProps = {
  isRunning: boolean;
  currentJobName: string;
  setCurrentJobName(name: string): void;
  handleRunJob(): void;
};

export default function InteractionPart(props: RunJobInteractionPartProps) {
  const { jbs } = useJobState();

  // Danh sách job fix cứng
  const availableJobs = jbs.map((jb, index) => ({
    id: `job#${index}`,
    name: jb.name,
  }));

  // Chuyển đổi danh sách job sang định dạng cho Select component
  const selectOptions = availableJobs.map((job) => ({
    label: job.name,
    value: job.name,
  }));

  return (
    <Container>
      <Header variant="h3">Chạy Job</Header>
      <SpaceBetween size="m" direction="vertical">
        {/* Job Selection */}
        <FormField label="Tên Job">
          <Select
            selectedOption={
              selectOptions.find(
                (option) => option.value === props.currentJobName
              ) || null
            }
            onChange={({ detail }) =>
              detail.selectedOption &&
              props.setCurrentJobName(detail.selectedOption.value as string)
            }
            options={selectOptions}
            disabled={props.isRunning}
            placeholder="Chọn job"
          />
        </FormField>

        {/* Run Button */}
        <Button
          onClick={props.handleRunJob}
          disabled={props.isRunning || !props.currentJobName}
          variant="primary"
          loading={props.isRunning}
        >
          {props.isRunning ? "Đang chạy..." : "Chạy Job"}
        </Button>
      </SpaceBetween>
    </Container>
  );
}
