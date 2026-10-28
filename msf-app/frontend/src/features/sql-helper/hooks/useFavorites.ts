"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const FAVORITES_STORAGE_KEY = "msfdb:sqlhelper:v1:favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    FAVORITES_STORAGE_KEY,
    []
  );

  const isFavorite = useCallback(
    (scriptId: string) => {
      return favorites.includes(scriptId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (scriptId: string) => {
      setFavorites((prev) => {
        if (prev.includes(scriptId)) {
          return prev.filter((id) => id !== scriptId);
        } else {
          return [...prev, scriptId];
        }
      });
    },
    [setFavorites]
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
}
