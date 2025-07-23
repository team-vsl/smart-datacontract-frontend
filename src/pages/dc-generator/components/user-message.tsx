import ChatBubble from "@cloudscape-design/chat-components/chat-bubble";
import ButtonGroup from "@cloudscape-design/components/button-group";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import Avatar from "@cloudscape-design/chat-components/avatar";

// Import types
import type { TMessage } from "@/objects/message/types";

export type TUserMessageProps = {
  user: any;
  message: TMessage;
};

export default function UserMessage(props: TUserMessageProps) {
  return (
    <ChatBubble
      ariaLabel="User at time"
      type="outgoing"
      avatar={
        <Avatar
          ariaLabel={props.user.fullName || "Test User"}
          tooltipText={props.user.fullName || "Test User"}
          initials="U"
        />
      }
    >
      {props.message.content}
    </ChatBubble>
  );
}
