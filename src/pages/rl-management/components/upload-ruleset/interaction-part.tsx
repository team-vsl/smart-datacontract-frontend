import {
  Button,
  Container,
  Header,
  Input,
  SpaceBetween,
  FormField,
  Box,
} from "@cloudscape-design/components";

// Import components
import AppCodeEditor from "@/components/app-code-editor";

// Import types
import type { FormEvent } from "react";
import type { TRuleset } from "@/objects/ruleset/types";
import type { TRulesetUploadForm } from "./state";
import type { UseMutationResult } from "@tanstack/react-query";

export type TUploadRulesetInteractionProps = {
  errors: any;
  rulesetName: string;
  rulesetContent: string;
  uploadMutation: UseMutationResult<TRuleset, any, TRuleset, unknown>;
  handleSubmit(e: FormEvent): void;
  setUploadRulesetFormState(data: TRulesetUploadForm): void;
};

/**
 * Components hiển thị các thành phần thao tác với upload ruleset form
 * để tải lên các ruleset mới.
 * @param props
 * @returns
 */
export default function InteractionPart(props: TUploadRulesetInteractionProps) {
  return (
    <Container>
      <Header variant="h3">Upload Ruleset Mới</Header>

      <form onSubmit={props.handleSubmit}>
        <SpaceBetween size="m" direction="vertical">
          {/* Ruleset Name Input */}
          <FormField label="Tên Ruleset" errorText={props.errors.name}>
            <Input
              value={props.rulesetName}
              onChange={({ detail }) => {
                props.setUploadRulesetFormState({ name: detail.value });
                // Xóa lỗi khi người dùng nhập
                if (props.errors.name) {
                  props.setUploadRulesetFormState({
                    errors: {
                      ...props.errors,
                      name: null,
                    },
                  });
                }
              }}
              placeholder="Nhập tên ruleset"
            />
          </FormField>

          {/* Ruleset Content Textarea */}
          <FormField
            label="Nội dung Ruleset"
            errorText={props.errors.content}
            description={
              <SpaceBetween size="xs">
                <Box variant="p">
                  Ví dụ JSON hợp lệ:
                  <code className="inline-code ms-3">
                    {
                      '{"rules": [{"id": "rule1", "name": "Check null", "condition": "value != null"}]}'
                    }
                  </code>
                </Box>
                <Box variant="p">
                  Ví dụ YAML hợp lệ: rules:
                  <br />- id: rule1
                  <br /> name: Check null
                  <br /> condition: value != null
                </Box>
                <Box variant="p" fontWeight="bold">
                  Lưu ý: Nội dung ruleset phải có trường "rules" là một mảng, và
                  mỗi rule phải có các trường: id, name, condition.
                </Box>
              </SpaceBetween>
            }
          >
            <AppCodeEditor
              isEditable={true}
              code=""
              onCodeChange={(value) => {
                props.setUploadRulesetFormState({ content: value });
              }}
            />
          </FormField>

          {/* Submit Button */}
          <Button
            formAction="submit"
            variant="primary"
            disabled={props.uploadMutation.isPending}
            loading={props.uploadMutation.isPending}
          >
            {props.uploadMutation.isPending
              ? "Đang upload..."
              : "Upload Ruleset"}
          </Button>
        </SpaceBetween>
      </form>
    </Container>
  );
}
