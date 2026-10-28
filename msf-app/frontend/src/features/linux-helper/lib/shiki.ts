import type { Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

/**
 * Singleton Shiki highlighter yang di-load lazy, hanya grammar bash + tema GitHub.
 * Dipakai untuk menyorot blok command shell di drawer.
 */
export function getShellHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const { createHighlighter } = await import("shiki");
      return createHighlighter({
        langs: ["bash"],
        themes: ["github-dark", "github-light"],
      });
    })();
  }
  return highlighterPromise;
}
