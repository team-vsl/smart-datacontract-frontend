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
      <Container header={<Header variant="h3">Result</Header>}>
        <Box textAlign="center" color="text-body-secondary">
          <em>No result.</em>
        </Box>
      </Container>
    );
  }

  return (
    <Container header={<Header variant="h3">Result</Header>}>
      <StatusIndicator type={props.result.data ? "success" : "error"}>
        {props.result.message}
      </StatusIndicator>

      {props.result.data && (
        <Box margin={{ top: "m" }}>
          <Header variant="h3">Ruleset information</Header>
          <ColumnLayout columns={2} variant="text-grid">
            <FormField label="Name">{props.result.data.name}</FormField>
            <FormField label="State">
              <StatusIndicator type="success">
                {props.result.data.state}
              </StatusIndicator>
            </FormField>
            <FormField label="Created Date">
              {props.result.data.createdAt}
            </FormField>
          </ColumnLayout>
        </Box>
      )}
    </Container>
  );
}
