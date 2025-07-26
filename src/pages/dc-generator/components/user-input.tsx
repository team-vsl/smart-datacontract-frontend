import { useState } from "react";
import PromptInput from "@cloudscape-design/components/prompt-input";
import Box from "@cloudscape-design/components/box";
import ButtonGroup from "@cloudscape-design/components/button-group";

export type TUserInputProps = {
  onAction(value: string): void;
};

export default function UserInput(props: TUserInputProps) {
  const [value, setValue] = useState("");

  return (
    <PromptInput
      onChange={({ detail }) => setValue(detail.value)}
      onAction={({ detail }) => props.onAction(detail.value)}
      value={value}
      actionButtonAriaLabel="Send message"
      actionButtonIconName="send"
      ariaLabel="Prompt input with action button"
      disableSecondaryActionsPaddings
      placeholder="Mô tả dữ liệu của bạn"
      secondaryActions={
        <Box padding={{ left: "xxs", top: "xs" }}>
          <ButtonGroup
            ariaLabel="Chat actions"
            items={[
              {
                type: "icon-button",
                id: "copy",
                iconName: "upload",
                text: "Upload files",
              },
              {
                type: "icon-button",
                id: "expand",
                iconName: "expand",
                text: "Go full page",
              },
            ]}
            variant="icon"
          />
        </Box>
      }
    />
  );
}
