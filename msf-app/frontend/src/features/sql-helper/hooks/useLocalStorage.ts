"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (val: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch {
      // In private mode or SSR, keep initialValue
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((current) => {
        const nextValue =
          typeof value === "function"
            ? (value as (prev: T) => T)(current)
            : value;
        try {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(nextValue));
          }
        } catch {
          // Fallback silently
        }
        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
