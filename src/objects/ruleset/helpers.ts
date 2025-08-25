import { STATE_DICT } from "@/utils/constants/rl";

/**
 * Lấy type của StatusIndicator từ Ruleset State tương ứng
 * @param state
 * @returns
 */
export function getStatusIndicatorType(state: string) {
  let type = "";

  switch (state) {
    case STATE_DICT.ACTIVE: {
      type = "success";
      break;
    }
    case STATE_DICT.INACTIVE:
    default: {
      type = "stopped";
      break;
    }
  }

  return type;
}
