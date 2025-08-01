import { SpaceBetween } from "@cloudscape-design/components";

// Import constants
import { CONV_ROLES, CONV_MSG_PLACEHOLDERS } from "@/objects/message/constants";

// Import components
import { AIMessage, AILoadingMessage } from "./ai-message";
import UserMessage from "./user-message";

// Import types
import type { TMessage } from "@/objects/message/types";

type RenderMessageProps = {
  message: TMessage;
};

export type MessagesProps = {
  messages: Array<TMessage>;
};

/**
 * Component dùng để hiển thị các giao diện khác nhau của một message
 * có thể là một message bình thường của người dùng hoặc từ ai, hoăc cũng
 * có thể là dữ liệu được đi kèm hoặc đơn giản là placeholder (loading).
 * @param props
 * @returns
 */
function RenderMessage(props: RenderMessageProps) {
  if (
    CONV_MSG_PLACEHOLDERS.LOADING === props.message.content &&
    props.message.isPlaceHolder
  )
    return <AILoadingMessage />;

  if (CONV_ROLES.AI === props.message.role)
    return <AIMessage message={props.message} />;

  return <UserMessage message={props.message} user={{}} />;
}

export default function Messages(props: MessagesProps) {
  // Render normal message
  return (
    <div className="h-full">
      {props.messages.map((message, index) => (
        <SpaceBetween size="xs">
          <RenderMessage key={message.id || `msg#${index}`} message={message} />
        </SpaceBetween>
      ))}
    </div>
  );
}
