import { useState } from "react";
import { PromptInput, Box, ButtonGroup } from "@cloudscape-design/components";

export type TUserInputProps = {
  isDisable?: boolean;
  onAction(value: string): void;
};

export default function UserInput(props: TUserInputProps) {
  const [value, setValue] = useState("");

  return (
    <PromptInput
      onChange={({ detail }) => setValue(detail.value)}
      onAction={({ detail }) => {
        props.onAction(detail.value);
        setValue("");
      }}
      disabled={props.isDisable || false}
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
