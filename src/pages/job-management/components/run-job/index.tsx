import { useState } from "react";
import {
  Button,
  Container,
  Header,
  Select,
  SpaceBetween,
  StatusIndicator,
  ExpandableSection,
  FormField,
  Box,
} from "@cloudscape-design/components";

type JobResult = {
  id: string;
  status: string;
  message: string;
  details?: any;
  timestamp?: string;
};

type RunJobProps = {
  onJobRunComplete?: (jobRunId: string) => void;
};

export function RunJob({ onJobRunComplete }: RunJobProps) {
  // State cho accordion
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // State cho job name (fix cứng các lựa chọn)
  const [jobName, setJobName] = useState<string>("data_quality_check");

  // State cho loading và kết quả
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [jobResult, setJobResult] = useState<JobResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Danh sách job fix cứng
  const availableJobs = [
    { id: "data_quality_check", name: "Data Quality Check" },
    { id: "data_transformation", name: "Data Transformation" },
    { id: "data_validation", name: "Data Validation" },
  ];

  // Hàm xử lý khi chạy job
  const handleRunJob = async () => {
    if (!jobName) return;

    setIsRunning(true);
    setJobResult(null);
    setError(null);

    try {
      // Giả lập API call với delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Tạo một job run ID ngẫu nhiên
      const jobRunId = `${jobName.substring(0, 2)}_${Math.floor(
        Math.random() * 10000
      )
        .toString()
        .padStart(4, "0")}`;

      // Giả lập kết quả từ FastAPI
      // Trong thực tế, bạn sẽ gọi API thực tế ở đây
      const mockResult: JobResult = {
        id: jobRunId,
        status: "success",
        message: `Job ${jobName} đã chạy thành công`,
        details: {
          processed_records: 1250,
          valid_records: 1200,
          invalid_records: 50,
          execution_time: "2.5s",
        },
        timestamp: new Date().toISOString(),
      };

      // Thông báo job run ID cho component cha
      if (onJobRunComplete) {
        onJobRunComplete(jobRunId);
      }

      setJobResult(mockResult);
    } catch (err) {
      console.error("Lỗi khi chạy job:", err);
      setError("Có lỗi xảy ra khi chạy job. Vui lòng thử lại sau.");
    } finally {
      setIsRunning(false);
    }
  };

  // Chuyển đổi danh sách job sang định dạng cho Select component
  const selectOptions = availableJobs.map((job) => ({
    label: job.name,
    value: job.id,
  }));

  return (
    <ExpandableSection
      headerText="Run Job"
      variant="container"
      defaultExpanded={isOpen}
      onChange={({ detail }) => setIsOpen(detail.expanded)}
    >
      <SpaceBetween size="l">
        {/* Phần tương tác */}
        <Container>
          <Header variant="h3">Chạy Job</Header>

          <SpaceBetween size="m" direction="vertical">
            {/* Job Selection */}
            <FormField label="Tên Job">
              <Select
                selectedOption={
                  selectOptions.find((option) => option.value === jobName) ||
                  null
                }
                onChange={({ detail }) =>
                  detail.selectedOption &&
                  setJobName(detail.selectedOption.value as string)
                }
                options={selectOptions}
                disabled={isRunning}
                placeholder="Chọn job"
              />
            </FormField>

            {/* Run Button */}
            <Button
              onClick={handleRunJob}
              disabled={isRunning || !jobName}
              variant="primary"
              loading={isRunning}
            >
              {isRunning ? "Đang chạy..." : "Chạy Job"}
            </Button>
          </SpaceBetween>
        </Container>

        {/* Phần kết quả */}
        {/* Loading state */}
        {isRunning && (
          <StatusIndicator type="loading">Đang chạy job...</StatusIndicator>
        )}

        {/* Error state */}
        {error && <StatusIndicator type="error">{error}</StatusIndicator>}

        {/* Success state */}
        {jobResult && (
          <Container>
            <StatusIndicator
              type={jobResult.status === "success" ? "success" : "warning"}
            >
              {jobResult.message}
            </StatusIndicator>

            {/* Job Run ID */}
            <Box margin={{ top: "l" }} padding="m">
              <Header variant="h3">Job Run ID</Header>
              <Box padding="s" variant="code">
                {jobResult.id}
              </Box>
            </Box>

            {/* Chi tiết kết quả */}
            {jobResult.details && (
              <Box margin={{ top: "l" }} padding="m">
                <Header variant="h3">Chi tiết kết quả</Header>
                <SpaceBetween size="m" direction="vertical">
                  {Object.entries(jobResult.details).map(([key, value]) => (
                    <FormField
                      key={key}
                      label={key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    >
                      {String(value)}
                    </FormField>
                  ))}
                  {jobResult.timestamp && (
                    <FormField label="Thời gian">
                      {new Date(jobResult.timestamp).toLocaleString()}
                    </FormField>
                  )}
                </SpaceBetween>
              </Box>
            )}
          </Container>
        )}

        {/* No result yet */}
        {!isRunning && !error && !jobResult && (
          <Box textAlign="center" color="text-body-secondary">
            Chọn job và nhấn "Chạy Job" để xem kết quả
          </Box>
        )}
      </SpaceBetween>
    </ExpandableSection>
  );
}
import { useState } from "react";
import {
  Button,
  Container,
  Header,
  Select,
  SpaceBetween,
  StatusIndicator,
  ExpandableSection,
  FormField,
  Box,
} from "@cloudscape-design/components";

type JobResult = {
  id: string;
  status: string;
  message: string;
  details?: any;
  timestamp?: string;
};

type RunJobProps = {
  onJobRunComplete?: (jobRunId: string) => void;
};

export function RunJob({ onJobRunComplete }: RunJobProps) {
  // State cho accordion
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // State cho job name (fix cứng các lựa chọn)
  const [jobName, setJobName] = useState<string>("data_quality_check");

  // State cho loading và kết quả
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [jobResult, setJobResult] = useState<JobResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Danh sách job fix cứng
  const availableJobs = [
    { id: "data_quality_check", name: "Data Quality Check" },
    { id: "data_transformation", name: "Data Transformation" },
    { id: "data_validation", name: "Data Validation" },
  ];

  // Hàm xử lý khi chạy job
  const handleRunJob = async () => {
    if (!jobName) return;

    setIsRunning(true);
    setJobResult(null);
    setError(null);

    try {
      // Giả lập API call với delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Tạo một job run ID ngẫu nhiên
      const jobRunId = `${jobName.substring(0, 2)}_${Math.floor(
        Math.random() * 10000
      )
        .toString()
        .padStart(4, "0")}`;

      // Giả lập kết quả từ FastAPI
      // Trong thực tế, bạn sẽ gọi API thực tế ở đây
      const mockResult: JobResult = {
        id: jobRunId,
        status: "success",
        message: `Job ${jobName} đã chạy thành công`,
        details: {
          processed_records: 1250,
          valid_records: 1200,
          invalid_records: 50,
          execution_time: "2.5s",
        },
        timestamp: new Date().toISOString(),
      };

      // Thông báo job run ID cho component cha
      if (onJobRunComplete) {
        onJobRunComplete(jobRunId);
      }

      setJobResult(mockResult);
    } catch (err) {
      console.error("Lỗi khi chạy job:", err);
      setError("Có lỗi xảy ra khi chạy job. Vui lòng thử lại sau.");
    } finally {
      setIsRunning(false);
    }
  };

  // Chuyển đổi danh sách job sang định dạng cho Select component
  const selectOptions = availableJobs.map((job) => ({
    label: job.name,
    value: job.id,
  }));

  return (
    <ExpandableSection
      headerText="Run Job"
      variant="container"
      defaultExpanded={isOpen}
      onChange={({ detail }) => setIsOpen(detail.expanded)}
    >
      <SpaceBetween size="l">
        {/* Phần tương tác */}
        <Container>
          <Header variant="h3">Chạy Job</Header>

          <SpaceBetween size="m" direction="vertical">
            {/* Job Selection */}
            <FormField label="Tên Job">
              <Select
                selectedOption={
                  selectOptions.find((option) => option.value === jobName) ||
                  null
                }
                onChange={({ detail }) =>
                  detail.selectedOption &&
                  setJobName(detail.selectedOption.value as string)
                }
                options={selectOptions}
                disabled={isRunning}
                placeholder="Chọn job"
              />
            </FormField>

            {/* Run Button */}
            <Button
              onClick={handleRunJob}
              disabled={isRunning || !jobName}
              variant="primary"
              loading={isRunning}
            >
              {isRunning ? "Đang chạy..." : "Chạy Job"}
            </Button>
          </SpaceBetween>
        </Container>

        {/* Phần kết quả */}
        {/* Loading state */}
        {isRunning && (
          <StatusIndicator type="loading">Đang chạy job...</StatusIndicator>
        )}

        {/* Error state */}
        {error && <StatusIndicator type="error">{error}</StatusIndicator>}

        {/* Success state */}
        {jobResult && (
          <Container>
            <StatusIndicator
              type={jobResult.status === "success" ? "success" : "warning"}
            >
              {jobResult.message}
            </StatusIndicator>

            {/* Job Run ID */}
            <Box margin={{ top: "l" }} padding="m">
              <Header variant="h3">Job Run ID</Header>
              <Box padding="s" variant="code">
                {jobResult.id}
              </Box>
            </Box>

            {/* Chi tiết kết quả */}
            {jobResult.details && (
              <Box margin={{ top: "l" }} padding="m">
                <Header variant="h3">Chi tiết kết quả</Header>
                <SpaceBetween size="m" direction="vertical">
                  {Object.entries(jobResult.details).map(([key, value]) => (
                    <FormField
                      key={key}
                      label={key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    >
                      {String(value)}
                    </FormField>
                  ))}
                  {jobResult.timestamp && (
                    <FormField label="Thời gian">
                      {new Date(jobResult.timestamp).toLocaleString()}
                    </FormField>
                  )}
                </SpaceBetween>
              </Box>
            )}
          </Container>
        )}

        {/* No result yet */}
        {!isRunning && !error && !jobResult && (
          <Box textAlign="center" color="text-body-secondary">
            Chọn job và nhấn "Chạy Job" để xem kết quả
          </Box>
        )}
      </SpaceBetween>
    </ExpandableSection>
  );
}
