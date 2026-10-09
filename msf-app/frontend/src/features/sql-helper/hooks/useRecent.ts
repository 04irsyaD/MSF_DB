"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const RECENT_STORAGE_KEY = "msfdb:sqlhelper:v1:recent";
const MAX_RECENT_ITEMS = 10;

export interface RecentItem {
  id: string;
  timestamp: number;
}

export function useRecent() {
  const [recentList, setRecentList] = useLocalStorage<RecentItem[]>(
    RECENT_STORAGE_KEY,
    []
  );

  const addToRecent = useCallback(
    (scriptId: string) => {
      if (!scriptId) return;
      setRecentList((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const filtered = safePrev.filter((item) => item && item.id !== scriptId);
        return [{ id: scriptId, timestamp: Date.now() }, ...filtered].slice(
          0,
          MAX_RECENT_ITEMS
        );
      });
    },
    [setRecentList]
  );

  const clearRecent = useCallback(() => {
    setRecentList([]);
  }, [setRecentList]);

  const recentIds = (Array.isArray(recentList) ? recentList : []).map(
    (item) => item.id
  );

  return {
    recentList,
    recentIds,
    addToRecent,
    clearRecent,
  };
}
