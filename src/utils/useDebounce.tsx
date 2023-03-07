import { useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(fn: T, timeout: number): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return function (...args: Parameters<T>) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      fn(...args);
      // timeoutRef.current = null;
    }, timeout);
  } as T;
}
