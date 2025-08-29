import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SpaceBetween, ExpandableSection } from "@cloudscape-design/components";

// Import constants
import { CONFIGS } from "@/utils/constants/configs";
import { TEAMS } from "@/utils/constants/teams";

// Import components
import InteractionPart from "./interaction-part";
import ResultPart from "./result-part";
import Protector from "@/components/protector";

// Import hooks
import { useStateManager } from "@/hooks/use-state-manager";

// Import objects
import * as DataContractAPI from "@/objects/data-contract/api";

// Import states
import { dataContractStActions } from "@/states/data-contract";
import { CheckDCStateManager } from "./state";

// Import types
import type { TDataContract } from "@/objects/data-contract/types";

type CheckDataContractProps = {};

export function CheckDataContract(props: CheckDataContractProps) {
  // Lấy queryClient để invalidate queries
  const queryClient = useQueryClient();

  // State cho check data contract
  const [state, stateFns] = useStateManager(
    CheckDCStateManager.getInitialState(),
    CheckDCStateManager.buildStateModifiers,
  );

  // Sử dụng useMutation để approve data contract
  const approveMutation = useMutation({
    mutationFn: async (name: string) => {
      let isMock = CONFIGS.IS_MOCK_API;

      // Kiểm tra data contract có tồn tại không
      const contract = await DataContractAPI.reqGetDataContractInfo({
        name: name.trim(),
        isMock,
      });

      if (!contract) {
        throw new Error(`Cannot find Data Contract: ${name}`);
      }

      // Approve data contract và cập nhật state
      const result = await DataContractAPI.reqApproveDataContract({
        name: name.trim(),
        version: contract.version,
        isMock,
      });

      dataContractStActions.updateDataContract(result.dataContractInfo);

      // Lấy contract đã cập nhật
      return result;
    },
    onSuccess(result: any | undefined) {
      // Invalidate queries để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: ["dataContracts"] });

      stateFns.setResult({
        message: `Data Contract ${state.currentContractName} is approved and Ruleset ${result.rulesetName} is created`,
        data: result.dataContractInfo,
      });
    },
    onError(error: any) {
      stateFns.setResult({
        error,
        data: undefined,
      });
    },
  });

  // Sử dụng useMutation để reject data contract
  const rejectMutation = useMutation({
    mutationFn: async (name: string) => {
      let isMock = CONFIGS.IS_MOCK_API;

      // Kiểm tra data contract có tồn tại không
      const contract = await DataContractAPI.reqGetDataContractInfo({
        name: name.trim(),
        isMock,
      });

      if (!contract) {
        throw new Error(`Cannot find Data Contract: ${name}`);
      }

      // Reject data contract và cập nhật state
      const updatedContract = await DataContractAPI.reqRejectDataContract({
        name,
        version: contract.version,
        isMock,
      });

      dataContractStActions.updateDataContract(updatedContract);

      // Lấy contract đã cập nhật
      return updatedContract;
    },
    onSuccess: (updatedContract: TDataContract | undefined) => {
      // Invalidate queries để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: ["dataContracts"] });

      stateFns.setResult({
        message: `Data Contract ${state.currentContractName} đã bị từ chối`,
        data: updatedContract,
      });
    },
    onError: (error: Error) => {
      stateFns.setResult({
        message: error.message,
        data: undefined,
      });
    },
  });

  // Hàm xử lý khi approve data contract
  const handleApprove = function () {
    if (!state.currentContractName) return;
    approveMutation.mutate(state.currentContractName);
  };

  // Hàm xử lý khi reject data contract
  const handleReject = function () {
    if (!state.currentContractName) return;
    rejectMutation.mutate(state.currentContractName);
  };

  return (
    <ExpandableSection
      headerText="Check Data Contract"
      variant="container"
      defaultExpanded={state.isOpen}
      onChange={({ detail }) => stateFns.setIsOpen(detail.expanded)}
    >
      <Protector allowedTeams={[TEAMS.DATA_ENGINEER.NAME]}>
        <SpaceBetween size="l">
          {/* Phần tương tác */}
          <InteractionPart
            isApprovePending={approveMutation.isPending}
            isRejectPending={rejectMutation.isPending}
            currentContractName={state.currentContractName || ""}
            onCurrentIdInputChange={(detail) => {
              stateFns.setCurrentContractName(detail.value);
            }}
            onApproveBtnClick={() => {
              handleApprove();
            }}
            onRejectBtnClick={() => {
              handleReject();
            }}
          />

          {/* Phần kết quả */}
          <ResultPart
            isApprovePending={approveMutation.isPending}
            isRejectPending={rejectMutation.isPending}
            result={state.result}
          />
        </SpaceBetween>
      </Protector>
    </ExpandableSection>
  );
}
