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
  rulesetVersion: string;
  rulesetContent: string;
  uploadMutation: UseMutationResult;
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
      <Header variant="h3">Upload new Ruleset</Header>

      <form onSubmit={props.handleSubmit}>
        <SpaceBetween size="m" direction="vertical">
          {/* Ruleset Name Input */}
          <FormField label="Name" errorText={props.errors.name}>
            <Input
              value={props.rulesetName}
              onChange={({ detail }) => {
                props.setUploadRulesetFormState({
                  name: detail.value,
                  errors: {},
                });
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
              placeholder="Enter Ruleset name"
            />
          </FormField>

          <FormField label="Version" errorText={props.errors.version}>
            <Input
              value={props.rulesetVersion}
              onChange={({ detail }) => {
                props.setUploadRulesetFormState({
                  version: detail.value,
                  errors: {},
                });
                // Xóa lỗi khi người dùng nhập
                if (props.errors.name) {
                  props.setUploadRulesetFormState({
                    errors: {
                      ...props.errors,
                      version: null,
                    },
                  });
                }
              }}
              placeholder="Enter Ruleset version"
            />
          </FormField>

          {/* Ruleset Content */}
          <FormField
            label="Content"
            errorText={props.errors.content}
            description={
              <SpaceBetween size="xs">
                <Box variant="p">
                  Example of valid DQDL (you can view more in AWS Document)
                  <code className="inline-code ms-3">
                    {'Rules = [ columnExists "id" ]'}
                  </code>
                </Box>
                <Box variant="p" fontWeight="bold">
                  Note: Content of ruleset must have "Rules", it is an array.
                </Box>
              </SpaceBetween>
            }
          >
            <AppCodeEditor
              isEditable={true}
              code={props.rulesetContent}
              onCodeChange={(value) => {
                props.setUploadRulesetFormState({ content: value, errors: {} });
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
            {props.uploadMutation.isPending ? "Uploading..." : "Upload Ruleset"}
          </Button>
        </SpaceBetween>
      </form>
    </Container>
  );
}
