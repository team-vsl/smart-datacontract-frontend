import { SpaceBetween } from "@cloudscape-design/components";

// Import constants
import { CONV_ROLES } from "@/objects/message/constants";

// Import components
import AIMessage from "./ai-message";
import UserMessage from "./user-message";

// Import types
import type { TMessage } from "@/objects/message/types";

export type MessagesProps = {
  messages: Array<TMessage>;
};

export default function Messages(props: MessagesProps) {
  return (
    <div className="h-full">
      {props.messages.map((message, index) => (
        <SpaceBetween size="xs">
          {message.role === CONV_ROLES.AI ? (
            <AIMessage key={`genai#${index}`} message={message} />
          ) : (
            <UserMessage key={`user#${index}`} message={message} user={{}} />
          )}
        </SpaceBetween>
      ))}
    </div>
  );
}
