import {
  ShortcutSchema,
  CommandSchema,
  RunbookSchema,
  type Shortcut,
  type Command,
  type Runbook,
  type Level,
} from "../lib/schema";

import level0 from "./level-0.json";
import level1 from "./level-1.json";
import level2 from "./level-2.json";
import runbooksRaw from "./runbooks/index.json";

interface LevelFile {
  shortcuts: unknown[];
  commands: unknown[];
}

const LEVEL_FILES: Record<Exclude<Level, "3">, LevelFile> = {
  "0": level0 as LevelFile,
  "1": level1 as LevelFile,
  "2": level2 as LevelFile,
};

/**
 * Validasi di titik load, sama seperti SQL Helper. Data dibundel saat build,
 * jadi error schema memunculkan exception yang gampang ketahuan di CI/dev.
 * Skrip `validate:linux-helper` memberi pesan error per-item yang lebih jelas.
 */
export const allShortcuts: Shortcut[] = Object.values(LEVEL_FILES).flatMap(
  (f) => f.shortcuts.map((s) => ShortcutSchema.parse(s))
);

export const allCommands: Command[] = Object.values(LEVEL_FILES).flatMap(
  (f) => f.commands.map((c) => CommandSchema.parse(c))
);

export const allRunbooks: Runbook[] = (runbooksRaw as unknown[]).map((r) =>
  RunbookSchema.parse(r)
);

export function shortcutsByLevel(level: Level): Shortcut[] {
  return allShortcuts.filter((s) => s.level === level);
}

export function commandsByLevel(level: Level): Command[] {
  return allCommands.filter((c) => c.level === level);
}

export function commandCategories(level?: Level): string[] {
  const src = level ? commandsByLevel(level) : allCommands;
  return Array.from(new Set(src.map((c) => c.category)));
}
