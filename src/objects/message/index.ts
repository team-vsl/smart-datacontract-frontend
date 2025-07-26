// Import constants
import { CONV_ROLES } from "./constants";

// Import types
import type { TMessage } from "./types";

export function createMessage(
  content: string = "",
  role: string = CONV_ROLES.USER
): TMessage {
  return {
    role,
    content,
  };
}

export function createAIPlaceHolderMessage(content: string = ""): TMessage {
  return {
    role: CONV_ROLES.USER,
    content,
    isPlaceHolder: true,
  };
}
