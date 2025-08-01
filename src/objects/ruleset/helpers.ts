import { STATE_DICT } from "@/utils/constants/dc";

/**
 * Lấy type của StatusIndicator từ Ruleset State tương ứng
 * @param state
 * @returns
 */
export function getStatusIndicatorType(state: string) {
  let type = "";

  switch (state) {
    case STATE_DICT.APPROVED: {
      type = "success";
      break;
    }
    case STATE_DICT.PENDING: {
      type = "in-progress";
      break;
    }
    case STATE_DICT.REJECTED: {
      type = "error";
      break;
    }
    default: {
      type = "stopped";
      break;
    }
  }

  return type;
}
