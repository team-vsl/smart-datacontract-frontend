import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SpaceBetween, ExpandableSection } from "@cloudscape-design/components";

// Import constants
import { CONFIGS } from "@/utils/constants/configs";
import { TEAMS } from "@/utils/constants/teams";

// Import components
import InteractionPart from "./interaction-part";
import ResultPart from "./result-part";
import Protector from "@/components/protector";

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
    CheckRLStateManager.buildStateModifiers,
  );

  // Sử dụng useMutation để approve ruleset
  const activateMutation = useMutation({
    mutationFn: async function (name: string) {
      let isMock = CONFIGS.IS_MOCK_API;

      // Kiểm tra ruleset có tồn tại không
      const ruleset = await RulesetAPI.reqGetRuleset({ name, isMock });

      if (!ruleset) {
        throw new Error(`Cannot find Ruleset with name: ${name}`);
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
        message: `Ruleset ${state.currentRulesetName} is activated`,
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
  const inactivateMutation = useMutation({
    mutationFn: async (name: string) => {
      // Kiểm tra ruleset có tồn tại không
      const ruleset = await RulesetAPI.reqGetRuleset({ name });

      if (!ruleset) {
        throw new Error(`Cannot find Ruleset with name: ${name}`);
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
        message: `Ruleset ${state.currentRulesetName} is inactivated`,
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
  const handleActivate = () => {
    if (!state.currentRulesetName) return;
    activateMutation.mutate(state.currentRulesetName);
  };

  // Hàm xử lý khi reject ruleset
  const handleInactivate = () => {
    if (!state.currentRulesetName) return;
    inactivateMutation.mutate(state.currentRulesetName);
  };

  return (
    <ExpandableSection
      headerText="Check Ruleset"
      variant="container"
      defaultExpanded={state.isOpen}
      onChange={({ detail }) => stateFns.setIsOpen(detail.expanded)}
    >
      <Protector allowedTeams={[TEAMS.DATA_ENGINEER.NAME]}>
        <SpaceBetween size="l">
          {/* Phần tương tác */}
          <InteractionPart
            isActivatePending={activateMutation.isPending}
            isInactivatePending={inactivateMutation.isPending}
            currentRulesetName={state.currentRulesetName || ""}
            currentRulesetVersion={state.currentRulesetVersion || ""}
            onCurrentNameInputChange={(detail) => {
              stateFns.setCurrentRulesetName(detail.value);
            }}
            onCurrentVersionInputChange={(detail) => {
              stateFns.setCurrentRulesetVersion(detail.value);
            }}
            onActivateBtnClick={() => {
              handleActivate();
            }}
            onInactivateBtnClick={() => {
              handleInactivate();
            }}
          />

          {/* Phần kết quả */}
          <ResultPart
            isActivatePending={activateMutation.isPending}
            isInactivatePending={inactivateMutation.isPending}
            result={state.result}
          />
        </SpaceBetween>
      </Protector>
    </ExpandableSection>
  );
}
