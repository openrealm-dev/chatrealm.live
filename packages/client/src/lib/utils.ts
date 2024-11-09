export function debounce<T extends (...arguments_: unknown[]) => void>(
  function_: T,
  wait: number,
): (...arguments_: Parameters<T>) => void {
  let timeout: null | number;

  return function executedFunction(...arguments_: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      function_(...arguments_);
    }, wait);
  };
}

export function throttle<T extends (...arguments_: unknown[]) => void>(
  function_: T,
  limit: number,
): (...arguments_: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (...arguments_: Parameters<T>): void {
    if (!inThrottle) {
      function_(...arguments_);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

export const getCurrentScreenSize = () => {
  if (globalThis.matchMedia("(min-width: 1536px)").matches) {
    return "2xl"; // extra large screens
  } else if (globalThis.matchMedia("(min-width: 1280px)").matches) {
    return "xl"; // extra large screens
  } else if (globalThis.matchMedia("(min-width: 1024px)").matches) {
    return "lg"; // large screens
  } else if (globalThis.matchMedia("(min-width: 768px)").matches) {
    return "md"; // medium screens
  } else if (globalThis.matchMedia("(min-width: 640px)").matches) {
    return "sm"; // small screens
  } else {
    return "xs"; // extra small screens (default)
  }
};
