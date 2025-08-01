/**
 * Tạo ra một hàm mởi và chỉ cho phép hàm mới đó được gọi sau một khoảng
 * thời gian `wait`, nên không gọi hàm này liên tục được.
 * @param func
 * @param wait
 * @returns
 */
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Tạo ra một hàm mới và chỉ cho phép hàm mới đó chỉ được gọi sau một thời
 * gian `delay` nhất định.
 * @param func
 * @param limit
 * @returns
 */
function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timerFlag: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timerFlag === null) {
      func(...args);
      timerFlag = setTimeout(() => {
        timerFlag = null;
      }, delay);
    }
  };
}

export { debounce, throttle };
