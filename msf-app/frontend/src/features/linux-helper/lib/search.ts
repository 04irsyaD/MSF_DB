import Fuse, { type IFuseOptions } from "fuse.js";
import type { Command } from "./schema";

const FUSE_OPTIONS: IFuseOptions<Command> = {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "tags", weight: 0.2 },
    { name: "description", weight: 0.2 },
    { name: "command", weight: 0.15 },
    { name: "category", weight: 0.05 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

let cachedFuse: Fuse<Command> | null = null;
let lastRef: Command[] | null = null;

function getFuse(commands: Command[]): Fuse<Command> {
  if (!cachedFuse || lastRef !== commands) {
    cachedFuse = new Fuse(commands, FUSE_OPTIONS);
    lastRef = commands;
  }
  return cachedFuse;
}

/** Pencarian fuzzy berbobot untuk daftar command. Query kosong -> kembalikan apa adanya. */
export function searchCommandsWithFuse(commands: Command[], query: string): Command[] {
  const q = query.trim();
  if (!q) return commands;
  return getFuse(commands).search(q).map((r) => r.item);
}
