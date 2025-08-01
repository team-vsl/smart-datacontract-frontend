import {
  Container,
  Header,
  SpaceBetween,
  StatusIndicator,
  FormField,
  Box,
  ColumnLayout,
} from "@cloudscape-design/components";

// Import constants
import { STATE_DICT } from "@/utils/constants/dc";

// Import objects
import * as DataContractHelpers from "@/objects/data-contract/helpers";

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
          <em>
            Chưa có kết quả. Vui lòng nhập ID và chọn Approve hoặc Reject.
          </em>
        </Box>
      </Container>
    );

  return (
    <SpaceBetween size="m">
      <StatusIndicator
        type={
          DataContractHelpers.getStatusIndicatorType(
            props.result.data.state
          ) as any
        }
      >
        {props.result.message}
      </StatusIndicator>

      <Box>
        <ColumnLayout columns={2} variant="text-grid">
          <FormField label="ID">{props.result.data.id}</FormField>
          <FormField label="Tên">{props.result.data.name}</FormField>
          <FormField label="Version">{props.result.data.version}</FormField>
          <FormField label="Trạng thái">
            <StatusIndicator
              type={
                props.result.data.state === STATE_DICT.APPROVED
                  ? "success"
                  : "error"
              }
            >
              {props.result.data.state}
            </StatusIndicator>
          </FormField>

          {props.result.data.state === STATE_DICT.APPROVED && (
            <>
              <FormField label="Thời gian chấp thuận">
                {props.result.data.updatedAt &&
                  new Date(props.result.data.updatedAt).toLocaleString()}
              </FormField>
              <FormField label="Người chấp thuận">
                {props.result.data.approvedBy}
              </FormField>
            </>
          )}

          {props.result.data.state === STATE_DICT.REJECTED && (
            <>
              <FormField label="Thời gian từ chối">
                {props.result.data.updatedAt &&
                  new Date(props.result.data.updatedAt).toLocaleString()}
              </FormField>
              <FormField label="Người từ chối">
                {props.result.data.rejectedBy}
              </FormField>
            </>
          )}
        </ColumnLayout>

        {props.result && props.result.data && props.result.data.reason && (
          <Box margin={{ top: "m" }}>
            <FormField label="Lý do từ chối">
              <Box color="text-status-error">{props.result.data.reason}</Box>
            </FormField>
          </Box>
        )}
      </Box>
    </SpaceBetween>
  );
}
