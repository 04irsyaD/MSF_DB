import type { RunResult, TermLine } from "./types";

/**
 * Pencocok perintah CLI dengan singkatan gaya Cisco/ONTAP.
 * Pola "sh|ow ip int|erface br|ief": tiap kata boleh disingkat minimal sampai tanda "|",
 * jadi "sh ip int br" dan "show ip interface brief" sama-sama cocok.
 * Token "<arg>" menangkap satu kata apa adanya.
 */
export function cliMatch(input: string, pattern: string): string[] | null {
  const words = input.trim().split(/\s+/).filter(Boolean);
  const pats = pattern.split(" ");
  if (words.length !== pats.length) return null;
  const args: string[] = [];
  for (let i = 0; i < pats.length; i++) {
    const p = pats[i];
    const w = words[i];
    if (p.startsWith("<")) {
      args.push(w);
      continue;
    }
    const [min, rest = ""] = p.split("|");
    const full = (min + rest).toLowerCase();
    const lw = w.toLowerCase();
    if (lw.length < min.length || !full.startsWith(lw)) return null;
  }
  return args;
}

export function textBlock(tone: TermLine["tone"], text: string): TermLine[] {
  return text.split("\n").map((line) => ({ tone, text: line }));
}

export interface CliDef {
  /** id LabCommand untuk menampilkan penjelasan di CommandConsole. */
  id?: string;
  patterns: string[];
  out: (args: string[]) => TermLine[] | "clear";
}

/** Jalankan input terhadap daftar definisi; pertama yang cocok menang. */
export function runCli(
  raw: string,
  defs: CliDef[],
  unknown: TermLine[],
): RunResult | null {
  const input = raw.trim().replace(/\s+/g, " ");
  if (!input) return null;
  for (const def of defs) {
    for (const p of def.patterns) {
      const args = cliMatch(input, p);
      if (args) {
        const out = def.out(args);
        return out === "clear"
          ? { lines: [], clear: true }
          : { lines: out, commandId: def.id };
      }
    }
  }
  return { lines: unknown };
}
