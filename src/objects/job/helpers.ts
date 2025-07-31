import { JOBRUN_STATE_DICT } from "@/utils/constants/job";

/**
 * Lấy type của StatusIndicator từ Job Run State tương ứng
 * @param state
 * @returns
 */
export function getStatusIndicatorType(state: string) {
  let type = "";

  switch (state) {
    case JOBRUN_STATE_DICT.SUCCEEDED: {
      type = "success";
      break;
    }
    case JOBRUN_STATE_DICT.STARTING: {
      type = "loading";
      break;
    }
    case JOBRUN_STATE_DICT.RUNNING:
    case JOBRUN_STATE_DICT.STOPPING: {
      type = "in-progress";
      break;
    }
    case JOBRUN_STATE_DICT.STOPPED: {
      type = "stopped";
      break;
    }
    case JOBRUN_STATE_DICT.WAITING: {
      type = "pending";
      break;
    }
    case JOBRUN_STATE_DICT.FAILED:
    case JOBRUN_STATE_DICT.TIMEOUT:
    case JOBRUN_STATE_DICT.ERROR:
    case JOBRUN_STATE_DICT.EXPIRED: {
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
