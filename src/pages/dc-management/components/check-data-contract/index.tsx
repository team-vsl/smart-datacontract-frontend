import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SpaceBetween, ExpandableSection } from "@cloudscape-design/components";

// Import constants
import { CONFIGS } from "@/utils/constants/configs";

// Import components
import InteractionPart from "./interaction-part";
import ResultPart from "./result-part";

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
    mutationFn: async (id: string) => {
      let isMock = CONFIGS.IS_MOCK_API;

      // Kiểm tra data contract có tồn tại không
      const contract = await DataContractAPI.reqGetDataContract({
        id,
        isMock,
      });

      if (!contract) {
        throw new Error(`Không tìm thấy Data Contract với ID: ${id}`);
      }

      // Approve data contract và cập nhật state
      const updatedContract = await DataContractAPI.reqApproveDataContract({
        id,
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
        message: `Data Contract ${state.currentContractName} đã được chấp thuận`,
        data: updatedContract,
      });
    },
    onError: (error: any) => {
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
      const contract = await DataContractAPI.reqGetDataContractInfo({ name, isMock });

      if (!contract) {
        throw new Error(`Không tìm thấy Data Contract: ${name}`);
      }

      // Reject data contract và cập nhật state
      const updatedContract = await DataContractAPI.reqRejectDataContract({
        name,
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
    </ExpandableSection>
  );
}
