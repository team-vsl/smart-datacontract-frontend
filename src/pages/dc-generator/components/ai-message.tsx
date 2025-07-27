import {
  ButtonGroup,
  StatusIndicator,
  Box,
} from "@cloudscape-design/components";
import { Avatar, ChatBubble } from "@cloudscape-design/chat-components";

// Import types
import type { TMessage } from "@/objects/message/types";

export type TAIMessageProps = {
  message: TMessage;
};

export function AILoadingMessage() {
  return (
    <ChatBubble
      ariaLabel="Generative AI assistant at time"
      showLoadingBar
      type="incoming"
      avatar={
        <Avatar
          loading={true}
          color="gen-ai"
          iconName="gen-ai"
          ariaLabel="Generative AI assistant"
          tooltipText="Generative AI assistant"
        />
      }
    >
      <Box color="text-status-inactive">Đang xử lý, vui lòng đợi</Box>
    </ChatBubble>
  );
}

/**
 * Component hiển thị giao diện cho hộp nội dung message của AI, chính là
 * phản hồi của AI.
 * @param props
 * @returns
 */
export function AIMessage(props: TAIMessageProps) {
  return (
    <ChatBubble
      ariaLabel="Generative AI assistant at time"
      type="incoming"
      actions={
        <ButtonGroup
          ariaLabel="Chat bubble actions"
          variant="icon"
          items={[
            {
              type: "group",
              text: "Feedback",
              items: [
                {
                  type: "icon-button",
                  id: "helpful",
                  iconName: "thumbs-up-filled",
                  text: "Helpful.",
                  disabled: true,
                  disabledReason: "“Helpful” feedback has been submitted.",
                },
                {
                  type: "icon-button",
                  id: "not-helpful",
                  iconName: "thumbs-down",
                  text: "Not helpful",
                  disabled: true,
                  disabledReason:
                    "“Not helpful” option is unavailable after “helpful” feedback submitted.",
                },
              ],
            },
            {
              type: "icon-button",
              id: "copy",
              iconName: "copy",
              text: "Copy",
              popoverFeedback: (
                <StatusIndicator type="success">Message copied</StatusIndicator>
              ),
            },
          ]}
        />
      }
      avatar={
        <Avatar
          color="gen-ai"
          iconName="gen-ai"
          ariaLabel="Generative AI assistant"
          tooltipText="Generative AI assistant"
        />
      }
    >
      {props.message.content}
    </ChatBubble>
  );
}
