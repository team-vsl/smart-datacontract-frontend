import ChatBubble from "@cloudscape-design/chat-components/chat-bubble";
import ButtonGroup from "@cloudscape-design/components/button-group";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import Avatar from "@cloudscape-design/chat-components/avatar";

// Import types
import type { TMessage } from "@/objects/message/types";

export type TAIMessageProps = {
  message: TMessage;
};

export default function AIMessage(props: TAIMessageProps) {
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
