import { useState, useEffect } from "react";
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
  ColumnLayout
} from "@cloudscape-design/components";

interface JobRunInfo {
  id: string;
  jobName: string;
  status: string;
  startTime: string;
  endTime: string;
  duration: string;
  result: {
    status: string;
    message: string;
    details?: any;
  };
}

interface JobInfoProps {
  lastJobRunId: string | null;
}

export function JobInfo({ lastJobRunId }: JobInfoProps) {
  // State cho accordion
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // State cho job ID input
  const [jobRunId, setJobRunId] = useState<string>("");

  // State cho loading và kết quả
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [jobInfo, setJobInfo] = useState<JobRunInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cập nhật jobRunId khi lastJobRunId thay đổi
  useEffect(() => {
    if (lastJobRunId) {
      setJobRunId(lastJobRunId);
    }
  }, [lastJobRunId]);

  // Hàm xử lý khi lấy thông tin job
  const handleGetJobInfo = async () => {
    if (!jobRunId) return;

    setIsLoading(true);
    setJobInfo(null);
    setError(null);

    try {
      // Giả lập API call với delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Giả lập kết quả từ FastAPI
      // Trong thực tế, bạn sẽ gọi API thực tế ở đây
      const mockJobInfo: JobRunInfo = {
        id: jobRunId,
        jobName: jobRunId.startsWith("dq") ? "Data Quality Check" :
          jobRunId.startsWith("dt") ? "Data Transformation" : "Data Validation",
        status: "completed",
        startTime: new Date(Date.now() - 120000).toISOString(), // 2 phút trước
        endTime: new Date().toISOString(),
        duration: "120s",
        result: {
          status: "success",
          message: "Job hoàn thành thành công",
          details: {
            processed_records: 1250,
            valid_records: 1200,
            invalid_records: 50,
            execution_time: "2.5s"
          }
        }
      };

      setJobInfo(mockJobInfo);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin job:", err);
      setError("Có lỗi xảy ra khi lấy thông tin job. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ExpandableSection
      headerText="Get Job Run Information"
      variant="container"
      defaultExpanded={isOpen}
      onChange={({ detail }) => setIsOpen(detail.expanded)}
    >
      <SpaceBetween size="l">
        {/* Phần tương tác */}
        <Container>
          <Header variant="h3">Xem thông tin Job Run</Header>

          <SpaceBetween size="m" direction="vertical">
            {/* Job Run ID Input */}
            <FormField
              label="Job Run ID"
              description={lastJobRunId ? `Job Run ID gần nhất: ${lastJobRunId}` : undefined}
            >
              <SpaceBetween size="xs" direction="horizontal">
                <Input
                  value={jobRunId}
                  onChange={({ detail }) => setJobRunId(detail.value)}
                  placeholder="Nhập Job Run ID"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleGetJobInfo}
                  disabled={isLoading || !jobRunId}
                  variant="primary"
                  loading={isLoading}
                >
                  {isLoading ? "Đang tải..." : "Xem thông tin"}
                </Button>
              </SpaceBetween>
            </FormField>
          </SpaceBetween>
        </Container>

        {/* Phần kết quả */}
        {/* Loading state */}
        {isLoading && (
          <StatusIndicator type="loading">Đang tải thông tin job...</StatusIndicator>
        )}

        {/* Error state */}
        {error && (
          <Box padding="m" variant="error">
            <StatusIndicator type="error">{error}</StatusIndicator>
          </Box>
        )}

        {/* Job Info */}
        {jobInfo && (
          <Container>
            <Header variant="h3">Thông tin Job Run</Header>

            <ColumnLayout columns={2} variant="text-grid">
              <FormField label="Job Run ID">{jobInfo.id}</FormField>
              <FormField label="Tên Job">{jobInfo.jobName}</FormField>
              <FormField label="Trạng thái">
                <StatusIndicator type={
                  jobInfo.status === 'completed' ? "success" :
                    jobInfo.status === 'running' ? "in-progress" :
                      jobInfo.status === 'failed' ? "error" : "stopped"
                }>
                  {jobInfo.status}
                </StatusIndicator>
              </FormField>
              <FormField label="Thời gian chạy">{jobInfo.duration}</FormField>
              <FormField label="Thời gian bắt đầu">{new Date(jobInfo.startTime).toLocaleString()}</FormField>
              <FormField label="Thời gian kết thúc">{new Date(jobInfo.endTime).toLocaleString()}</FormField>
            </ColumnLayout>

            {/* Kết quả job */}
            {jobInfo.result && (
              <Box margin={{ top: "l" }} padding="m">
                <Header variant="h4">Kết quả</Header>

                <Box padding="s" margin={{ bottom: "m" }}>
                  <StatusIndicator type={
                    jobInfo.result.status === 'success' ? "success" :
                      jobInfo.result.status === 'warning' ? "warning" : "error"
                  }>
                    {jobInfo.result.message}
                  </StatusIndicator>
                </Box>

                {jobInfo.result.details && (
                  <ColumnLayout columns={2} variant="text-grid">
                    {Object.entries(jobInfo.result.details).map(([key, value]) => (
                      <FormField
                        key={key}
                        label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      >
                        {value}
                      </FormField>
                    ))}
                  </ColumnLayout>
                )}
              </Box>
            )}
          </Container>
        )}

        {/* No result yet */}
        {!isLoading && !error && !jobInfo && (
          <Box textAlign="center" color="text-body-secondary">
            Nhập Job Run ID và nhấn "Xem thông tin" để xem chi tiết
          </Box>
        )}
      </SpaceBetween>
    </ExpandableSection>
  );
}