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
import { STATE_DICT } from "@/utils/constants/rl";

// Import objects
import * as RulesetHelpers from "@/objects/ruleset/helpers";

type CheckRLResultPartProps = {
  isActivatePending: boolean;
  isInactivatePending: boolean;
  result?: any;
};

/**
 * Component hiển thị kết quả tương tác với ruleset
 * @param props
 * @returns
 */
export default function ResultPart(props: CheckRLResultPartProps) {
  if (props.isActivatePending || props.isInactivatePending)
    return (
      <Container header={<Header variant="h3">Kết quả</Header>}>
        <StatusIndicator type="loading">Processing...</StatusIndicator>
      </Container>
    );

  if (!props.result || (props.result && !props.result.data))
    return (
      <Container header={<Header variant="h3">Result</Header>}>
        <Box textAlign="center" color="text-body-secondary">
          <em>No result.</em>
        </Box>
      </Container>
    );

  return (
    <SpaceBetween size="m">
      <StatusIndicator
        type={
          RulesetHelpers.getStatusIndicatorType(props.result.data.state) as any
        }
      >
        {props.result.message}
      </StatusIndicator>

      {props.result.data && (
        <Box>
          <ColumnLayout columns={2} variant="text-grid">
            <FormField label="Name">{props.result.data.name}</FormField>
            <FormField label="Version">{props.result.data.version}</FormField>
            <FormField label="State">
              <StatusIndicator
                type={
                  RulesetHelpers.getStatusIndicatorType(
                    props.result.data.state,
                  ) as any
                }
              >
                {props.result.data.state}
              </StatusIndicator>
            </FormField>

            {props.result.data.status === STATE_DICT.ACTIVE && (
              <>
                <FormField label="Activated at">
                  {props.result.data.activatedAt &&
                    new Date(props.result.data.activatedAt).toLocaleString()}
                </FormField>
                <FormField label="Activated by">
                  {props.result.data.activatedBy}
                </FormField>
              </>
            )}

            {props.result.data.status === STATE_DICT.INACTIVE && (
              <>
                <FormField label="Inactivated At">
                  {props.result.data.inactivatedAt &&
                    new Date(props.result.data.inactivatedAt).toLocaleString()}
                </FormField>
                <FormField label="Inactivated by">
                  {props.result.data.inactivatedBy}
                </FormField>
              </>
            )}
          </ColumnLayout>
        </Box>
      )}
    </SpaceBetween>
  );
}
