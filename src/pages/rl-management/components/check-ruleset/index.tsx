import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SpaceBetween, ExpandableSection } from "@cloudscape-design/components";

// Import constants
import { CONFIGS } from "@/utils/constants/configs";

// Import components
import InteractionPart from "./interaction-part";
import ResultPart from "./result-part";

// Import objects
import * as RulesetAPI from "@/objects/ruleset/api";

// Import hooks
import { useStateManager } from "@/hooks/use-state-manager";

// Import states
import { rulesetStActions } from "@/states/ruleset";
import { CheckRLStateManager } from "./state";

// Import types
import type { TRuleset } from "@/objects/ruleset/types";

export type TCheckRulesetProps = {};

export function CheckRuleset(props: TCheckRulesetProps) {
  // Lấy queryClient để invalidate queries
  const queryClient = useQueryClient();

  // State
  const [state, stateFns] = useStateManager(
    CheckRLStateManager.getInitialState(),
    CheckRLStateManager.buildStateModifiers
  );

  // Sử dụng useMutation để approve ruleset
  const approveMutation = useMutation({
    mutationFn: async function (name: string) {
      let isMock = CONFIGS.IS_MOCK_API;

      // Kiểm tra ruleset có tồn tại không
      const ruleset = await RulesetAPI.reqGetRuleset({ name, isMock });

      if (!ruleset) {
        throw new Error(`Không tìm thấy Ruleset với tên ${name}`);
      }

      // Approve ruleset và cập nhật state
      const updatedRuleset = await RulesetAPI.reqApproveRuleset({
        name,
        isMock,
      });

      rulesetStActions.updateRuleset(updatedRuleset as TRuleset);

      return updatedRuleset;
    },
    onSuccess: function (updatedRuleset: TRuleset | undefined) {
      // Invalidate queries để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: ["rulesets"] });

      stateFns.setResult({
        message: `Ruleset ${state.currentRulesetId} đã được chấp thuận`,
        data: updatedRuleset,
      });
    },
    onError: function (error: any) {
      stateFns.setResult({
        error,
        data: undefined,
      });
    },
  });

  // Sử dụng useMutation để reject ruleset
  const rejectMutation = useMutation({
    mutationFn: async (name: string) => {
      // Kiểm tra ruleset có tồn tại không
      const ruleset = await RulesetAPI.reqGetRuleset({ name });

      if (!ruleset) {
        throw new Error(`Không tìm thấy Ruleset với tên: ${name}`);
      }

      // Reject ruleset và cập nhật state
      const updatedRuleset = await RulesetAPI.reqRejectRuleset({ name });
      rulesetStActions.updateRuleset(updatedRuleset as TRuleset);

      // Lấy ruleset đã cập nhật
      return updatedRuleset;
    },
    onSuccess: (updatedRuleset: TRuleset | undefined) => {
      // Invalidate queries để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: ["rulesets"] });

      stateFns.setResult({
        message: `Ruleset ${state.currentRulesetId} không được chấp thuận`,
        data: updatedRuleset,
      });
    },
    onError: (error: any) => {
      stateFns.setResult({
        error,
        data: undefined,
      });
    },
  });

  // Hàm xử lý khi approve ruleset
  const handleApprove = () => {
    if (!state.currentRulesetId) return;
    approveMutation.mutate(state.currentRulesetId);
  };

  // Hàm xử lý khi reject ruleset
  const handleReject = () => {
    if (!state.currentRulesetId) return;
    rejectMutation.mutate(state.currentRulesetId);
  };

  return (
    <ExpandableSection
      headerText="Check Ruleset"
      variant="container"
      defaultExpanded={state.isOpen}
      onChange={({ detail }) => stateFns.setIsOpen(detail.expanded)}
    >
      <SpaceBetween size="l">
        {/* Phần tương tác */}
        <InteractionPart
          isApprovePending={approveMutation.isPending}
          isRejectPending={rejectMutation.isPending}
          currentRulesetId={state.currentRulesetId || ""}
          onCurrentIdInputChange={(detail) => {
            stateFns.setCurrentRulesetId(detail.value);
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
