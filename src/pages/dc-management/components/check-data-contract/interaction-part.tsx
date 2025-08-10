import { Button, Container, Header, Input, SpaceBetween } from "@cloudscape-design/components";

export type CheckDataInteractionPartProps = {
  isApprovePending: boolean;
  isRejectPending: boolean;
  currentContractName: string;
  onCurrentIdInputChange(detail: any): void;
  onApproveBtnClick(detail: any): void;
  onRejectBtnClick(detail: any): void;
};

/**
 * Component hiển thị ra phần giao diện tương tác với chức năng quản lý
 * data contract
 * @param props
 * @returns
 */
export default function InteractionPart(props: CheckDataInteractionPartProps) {
  return (
    <Container header={<Header variant="h3">Tương tác</Header>}>
      <SpaceBetween size="xs" direction="horizontal" alignItems="end">
        <Input
          placeholder="Nhập Data Contract Name"
          value={props.currentContractName}
          onChange={({ detail }) => props.onCurrentIdInputChange(detail)}
          disabled={props.isApprovePending || props.isRejectPending}
        />
        <Button
          variant="primary"
          onClick={({ detail }) => props.onApproveBtnClick(detail)}
          disabled={!props.currentContractName || props.isApprovePending || props.isRejectPending}
          loading={props.isApprovePending}
        >
          Approve
        </Button>
        <Button
          variant="normal"
          onClick={({ detail }) => props.onRejectBtnClick(detail)}
          disabled={!props.currentContractName || props.isApprovePending || props.isRejectPending}
          loading={props.isRejectPending}
        >
          Reject
        </Button>
      </SpaceBetween>
    </Container>
  );
}
