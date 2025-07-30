import {
  Container,
  Header,
  StatusIndicator,
  FormField,
  Box,
  ColumnLayout,
} from "@cloudscape-design/components";

export type TUploadRulesetResultProps = {
  result?: any;
};

/**
 * Component hiển thị kết quả của upload ruleset ra ngoài màn hình.
 * @param props
 * @returns
 */
export default function ResultPart(props: TUploadRulesetResultProps) {
  if (!props.result) {
    return (
      <Container header={<Header variant="h3">Kết quả Upload</Header>}>
        <Box textAlign="center" color="text-body-secondary">
          <em>Chưa có kết quả.</em>
        </Box>
      </Container>
    );
  }

  return (
    <Container header={<Header variant="h3">Kết quả Upload</Header>}>
      <StatusIndicator type={props.result.data ? "success" : "error"}>
        {props.result.message}
      </StatusIndicator>

      {props.result.data && (
        <Box margin={{ top: "m" }}>
          <Header variant="h3">Thông tin Ruleset</Header>
          <ColumnLayout columns={2} variant="text-grid">
            <FormField label="ID">{props.result.data.id}</FormField>
            <FormField label="Tên">{props.result.data.name}</FormField>
            <FormField label="Trạng thái">
              <StatusIndicator type="success">
                {props.result.data.state}
              </StatusIndicator>
            </FormField>
            <FormField label="Ngày tạo">
              {props.result.data.createdAt}
            </FormField>
            {props.result.error && (
              <Box margin={{ top: "m" }}>
                <FormField label="Lý do từ chối">
                  <Box color="text-status-error">
                    {props.result.error.message}
                  </Box>
                </FormField>
              </Box>
            )}
          </ColumnLayout>
        </Box>
      )}
    </Container>
  );
}
