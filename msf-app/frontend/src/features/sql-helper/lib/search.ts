import Fuse, { type IFuseOptions } from "fuse.js";
import { ScriptItem } from "./schema";

const FUSE_OPTIONS: IFuseOptions<ScriptItem> = {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "tags", weight: 0.25 },
    { name: "description", weight: 0.2 },
    { name: "sql", weight: 0.1 },
    { name: "whenToUse", weight: 0.05 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

let cachedFuseInstance: Fuse<ScriptItem> | null = null;
let lastScriptsRef: ScriptItem[] | null = null;

function getFuseInstance(scripts: ScriptItem[]): Fuse<ScriptItem> {
  if (!cachedFuseInstance || lastScriptsRef !== scripts) {
    cachedFuseInstance = new Fuse(scripts, FUSE_OPTIONS);
    lastScriptsRef = scripts;
  }
  return cachedFuseInstance;
}

/**
 * Searches scripts using Fuse.js weighted fuzzy search.
 * Returns scripts in relevance order when query is provided.
 */
export function searchScriptsWithFuse(
  scripts: ScriptItem[],
  query: string
): ScriptItem[] {
  const q = query.trim();
  if (!q) return scripts;

  const fuse = getFuseInstance(scripts);
  const results = fuse.search(q);
  return results.map((r) => r.item);
}
