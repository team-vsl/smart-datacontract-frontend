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
import * as DataContractHelpers from "@/objects/data-contract/helpers";

// Import utils
import * as ErrorUtils from "@/utils/error";

type CheckDataResultPartProps = {
  isApprovePending: boolean;
  isRejectPending: boolean;
  result?: any;
};

/**
 * Component hiển thị kết quả tương tác với data contract
 * @param props
 * @returns
 */
export default function ResultPart(props: CheckDataResultPartProps) {
  if (props.isApprovePending || props.isRejectPending)
    return (
      <Container header={<Header variant="h3">Kết quả</Header>}>
        <StatusIndicator type="loading">Đang xử lý yêu cầu...</StatusIndicator>
      </Container>
    );

  if (!props.result || (props.result && !props.result.data))
    return (
      <Container header={<Header variant="h3">Kết quả</Header>}>
        <Box textAlign="center" color="text-body-secondary">
          <em>Chưa có kết quả. Vui lòng nhập ID và chọn Approve hoặc Reject.</em>
        </Box>
      </Container>
    );

  return (
    <SpaceBetween size="m">
      <StatusIndicator
        type={DataContractHelpers.getStatusIndicatorType(props.result.data.state) as any}
      >
        {props.result.error ? ErrorUtils.getErrorMessage(props.result.error) : props.result.message}
      </StatusIndicator>

      <Box>
        <ColumnLayout columns={2} variant="text-grid">
          <FormField label="ID">{props.result.data.id}</FormField>
          <FormField label="Tên">{props.result.data.name}</FormField>
          <FormField label="Version">{props.result.data.version}</FormField>
          <FormField label="Trạng thái">
            <StatusIndicator
              type={DataContractHelpers.getStatusIndicatorType(props.result.data.state) as any}
            >
              {props.result.data.state}
            </StatusIndicator>
          </FormField>
        </ColumnLayout>
      </Box>
    </SpaceBetween>
  );
}
