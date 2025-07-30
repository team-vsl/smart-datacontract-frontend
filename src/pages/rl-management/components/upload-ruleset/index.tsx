import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SpaceBetween, ExpandableSection } from "@cloudscape-design/components";

// Import constants
import { STATE_DICT } from "@/utils/constants/dc";

// Import components
import ResultPart from "./result-part";
import InteractionPart from "./interaction-part";

// Import hooks
import { useStateManager } from "@/hooks/use-state-manager";

// Import objects
import * as RulesetAPI from "@/objects/ruleset/api";

// Import states
import { UploadRLStateManager } from "./state";
import { rulesetStActions } from "@/states/ruleset";

// Import types
import type { TRuleset } from "@/objects/ruleset/types";

type UploadRulesetProps = {
  rulesets: TRuleset[];
};

type FormErrors = {
  name?: string | null;
  content?: string | null;
  [key: string]: string | null | undefined;
};

// Hàm tìm ID của ruleset có cùng tên trong trạng thái pending
function findExistingRulesetId(
  rulesets: TRuleset[],
  name: string,
  defaultId: string
): string {
  if (!name || !name.trim()) return defaultId;

  const existingRuleset = rulesets.find(
    (r) =>
      r.name.toLowerCase().trim() === name.toLowerCase().trim() &&
      r.state === STATE_DICT.PENDING
  );

  if (existingRuleset)
    console.log(
      "Tìm thấy ruleset có cùng tên trong trạng thái pending:",
      existingRuleset
    );

  return existingRuleset ? existingRuleset.id : defaultId;
}

export function UploadRuleset({ rulesets }: UploadRulesetProps) {
  // Lấy queryClient để invalidate queries
  const queryClient = useQueryClient();

  // State
  const [state, stateFns] = useStateManager(
    UploadRLStateManager.getInitialState(),
    UploadRLStateManager.buildStateModifiers
  );

  // Sử dụng useMutation để upload ruleset
  const uploadMutation = useMutation({
    mutationFn: async function (newRuleset: TRuleset) {
      // Sử dụng RulesetAPI để thêm ruleset mới
      const uploadedRuleset = await RulesetAPI.reqUploadRuleset({
        data: newRuleset,
        isMock: true,
      });

      rulesetStActions.addRuleset(uploadedRuleset);

      return uploadedRuleset;
    },
    onSuccess: function (data) {
      // Invalidate queries để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: ["rulesets"] });
      queryClient.invalidateQueries({ queryKey: ["allRulesets"] });

      // Hiển thị kết quả
      stateFns.setResult({
        message: "Ruleset đã được upload thành công!",
        data,
      });

      // Clear form sau khi upload thành công
      if (data.state === STATE_DICT.PENDING) {
        stateFns.setForm({
          name: "",
          content: "",
        });
      }
    },
    onError: function (error: any) {
      stateFns.setResult({
        error,
        message: "Upload ruleset thất bại.",
        data: undefined,
      });
    },
  });

  const handleSubmit = async function (e: React.FormEvent) {
    e.preventDefault();

    // Validate form before submission
    const newErrors: FormErrors = {};

    if (!state.uploadRulesetForm.name!.trim()) {
      newErrors.name = "Tên ruleset không được để trống";
    }

    if (!state.uploadRulesetForm.content!.trim()) {
      newErrors.content = "Nội dung ruleset không được để trống";
    } else {
      // Kiểm tra định dạng JSON
      let isValidFormat = false;
      let isValidStructure = false;

      // Thử kiểm tra JSON
      try {
        const parsedContent = JSON.parse(state.uploadRulesetForm.content!);
        isValidFormat = true; // Nếu parse thành công, đây là JSON hợp lệ

        // Kiểm tra cấu trúc của ruleset
        if (parsedContent.rules && Array.isArray(parsedContent.rules)) {
          // Kiểm tra xem mỗi rule có đủ các trường cần thiết không
          const allRulesValid = parsedContent.rules.every(
            (rule: any) => rule.id && rule.name && rule.condition
          );

          if (allRulesValid) {
            isValidStructure = true;
          } else {
            newErrors.content =
              "Mỗi rule phải có các trường: id, name, condition";
          }
        } else {
          newErrors.content = "Ruleset phải có trường 'rules' là một mảng";
        }
      } catch (jsonError) {
        // Không phải JSON, kiểm tra YAML đơn giản
        // Đây chỉ là kiểm tra cơ bản, không chính xác 100%

        // Một số đặc điểm cơ bản của YAML:
        // - Có dòng với định dạng key: value
        // - Hoặc có dòng bắt đầu bằng dấu gạch ngang (-)
        const hasKeyValuePair = /^\s*[\w\-]+\s*:\s*.+/m.test(
          state.uploadRulesetForm.content!
        );
        const hasListItem = /^\s*-\s+.+/m.test(
          state.uploadRulesetForm.content!
        );
        const hasRulesSection = /^\s*rules\s*:/m.test(
          state.uploadRulesetForm.content!
        );

        if ((hasKeyValuePair || hasListItem) && hasRulesSection) {
          isValidFormat = true;
          isValidStructure = true; // Giả định YAML có cấu trúc đúng
        } else {
          newErrors.content =
            "Nội dung phải là định dạng JSON hoặc YAML hợp lệ và có trường 'rules'";
        }
      }

      if (!isValidFormat) {
        newErrors.content = "Nội dung phải là định dạng JSON hoặc YAML hợp lệ";
      } else if (!isValidStructure) {
        // Nếu đã có lỗi cụ thể về cấu trúc, giữ nguyên lỗi đó
        if (!newErrors.content) {
          newErrors.content = "Cấu trúc ruleset không hợp lệ";
        }
      }
    }

    if (newErrors && Object.keys(newErrors).length > 0) {
      stateFns.setForm({ errors: newErrors });
      return;
    }

    const randomId = `rs-${Math.floor(Math.random() * 1000)}`;

    // Tìm ID của ruleset có cùng tên trong trạng thái pending
    const rulesetId = findExistingRulesetId(
      rulesets,
      state.uploadRulesetForm.name!,
      randomId
    );

    // Nếu ruleset hợp lệ, trạng thái là STATE_DICT.PENDING
    const newRuleset: TRuleset = {
      id: rulesetId,
      name: state.uploadRulesetForm.name!,
      state: STATE_DICT.PENDING,
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Sử dụng mutation để upload ruleset
    uploadMutation.mutate(newRuleset);
  };

  return (
    <ExpandableSection
      headerText="Upload Ruleset"
      variant="container"
      defaultExpanded={state.isOpen}
      onChange={({ detail }) => stateFns.setIsOpen(detail.expanded)}
    >
      <SpaceBetween size="l">
        {/* Phần tương tác - Form */}
        <InteractionPart
          errors={state.uploadRulesetForm.errors}
          rulesetName={state.uploadRulesetForm.name!}
          rulesetContent={state.uploadRulesetForm.content!}
          uploadMutation={uploadMutation}
          handleSubmit={handleSubmit}
          setUploadRulesetFormState={stateFns.setForm}
        />

        {/* Phần kết quả */}
        <ResultPart result={state.result} />
      </SpaceBetween>
    </ExpandableSection>
  );
}
