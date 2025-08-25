import {
  Button,
  Container,
  Header,
  FormField,
  Input,
  SpaceBetween,
} from "@cloudscape-design/components";

export type CheckRLInteractionPartProps = {
  isActivatePending: boolean;
  isInactivatePending: boolean;
  currentRulesetName: string;
  currentRulesetVersion: string;
  onCurrentNameInputChange(detail: any): void;
  onCurrentVersionInputChange(detail: any): void;
  onActivateBtnClick(detail: any): void;
  onInactivateBtnClick(detail: any): void;
};

/**
 * Component hiển thị ra phần giao diện tương tác với chức năng quản lý
 * ruleset
 * @param props
 * @returns
 */
export default function InteractionPart(props: CheckRLInteractionPartProps) {
  return (
    <Container header={<Header variant="h3">Interact</Header>}>
      <SpaceBetween size="xs" direction="horizontal" alignItems="end">
        <FormField label="Name">
          <Input
            placeholder="Enter Ruleset name"
            value={props.currentRulesetName}
            onChange={({ detail }) => props.onCurrentNameInputChange(detail)}
            disabled={props.isActivatePending || props.isInactivatePending}
          />
        </FormField>
        <FormField label="Version">
          <Input
            placeholder="Enter Ruleset version"
            value={props.currentRulesetVersion}
            onChange={({ detail }) => props.onCurrentVersionInputChange(detail)}
            disabled={props.isActivatePending || props.isInactivatePending}
          />
        </FormField>
        <FormField label="Apply to job">
          <Input
            placeholder="Enter Job name"
            value={props.currentRulesetVersion}
            onChange={({ detail }) => props.onCurrentVersionInputChange(detail)}
            disabled={props.isActivatePending || props.isInactivatePending}
          />
        </FormField>

        <Button
          variant="primary"
          onClick={({ detail }) => props.onActivateBtnClick(detail)}
          disabled={
            !props.currentRulesetName ||
            props.isActivatePending ||
            props.isInactivatePending
          }
          loading={props.isActivatePending}
        >
          Activate
        </Button>
        <Button
          variant="normal"
          onClick={({ detail }) => props.onInactivateBtnClick(detail)}
          disabled={
            !props.currentRulesetName ||
            props.isActivatePending ||
            props.isInactivatePending
          }
          loading={props.isInactivatePending}
        >
          Inactivate
        </Button>
      </SpaceBetween>
    </Container>
  );
}
