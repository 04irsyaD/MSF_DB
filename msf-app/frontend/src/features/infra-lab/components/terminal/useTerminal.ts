"use client";

import { useCallback, useState } from "react";
import type { RunResult, TermLine } from "../../lib/types";

/** Batas baris supaya buffer tidak tumbuh tanpa batas saat perintah diulang-ulang. */
const MAX_LINES = 400;

/** Buffer layar terminal: baris sambutan, gema perintah, lalu output. */
export function useTerminal(welcome: TermLine[]) {
  const [lines, setLines] = useState<TermLine[]>(welcome);

  const append = useCallback((echo: string, result: RunResult) => {
    setLines((prev) => {
      if (result.clear) return [];
      const next = [
        ...prev,
        { tone: "ok" as const, text: echo },
        ...result.lines,
      ];
      return next.length > MAX_LINES
        ? next.slice(next.length - MAX_LINES)
        : next;
    });
  }, []);

  /** Kosongkan layar lalu tampilkan sambutan + (opsional) satu hasil perintah. */
  const show = useCallback(
    (echo?: string, result?: RunResult) => {
      if (!echo || !result) {
        setLines(welcome);
        return;
      }
      setLines(
        result.clear
          ? []
          : [...welcome, { tone: "ok", text: echo }, ...result.lines],
      );
    },
    [welcome],
  );

  return { lines, append, show };
}

/** Rapikan input: trim dan gabungkan spasi ganda. */
export function normalizeCommand(raw: string) {
  return raw.trim().replace(/\s+/g, " ");
}
