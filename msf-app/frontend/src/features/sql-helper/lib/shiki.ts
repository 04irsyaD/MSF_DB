import type { Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

/**
 * Returns a lazy singleton Shiki highlighter loaded with SQL grammar and GitHub themes.
 */
export function getSqlHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const { createHighlighter } = await import("shiki");
      return createHighlighter({
        langs: ["sql"],
        themes: ["github-dark", "github-light"],
      });
    })();
  }
  return highlighterPromise;
}
