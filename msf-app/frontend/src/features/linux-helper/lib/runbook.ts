import type { LinuxParam, RunbookStep, Distro } from "./schema";

const PLACEHOLDER = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

/** Nilai default tiap var (dari field `default`, atau string kosong). */
export function defaultParamValues(params: LinuxParam[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of params) out[p.key] = p.default ?? "";
  return out;
}

/** Ambil nama placeholder {{...}} yang muncul di sebuah teks. */
export function placeholdersIn(text: string): string[] {
  const found = new Set<string>();
  let m: RegExpExecArray | null;
  const re = new RegExp(PLACEHOLDER);
  while ((m = re.exec(text)) !== null) found.add(m[1]);
  return Array.from(found);
}

/**
 * Ganti {{key}} dengan nilai. Nilai HARUS sudah lolos validateParamValue sebelum dipakai.
 * Placeholder yang tak punya nilai dibiarkan apa adanya supaya kelihatan belum diisi.
 */
export function interpolate(text: string, values: Record<string, string>): string {
  return text.replace(PLACEHOLDER, (whole, key) => {
    const v = values[key];
    return v && v.length > 0 ? v : whole;
  });
}

/** Pilih daftar command untuk distro tertentu (variants bila ada, selain itu default). */
export function resolveStepCommands(step: RunbookStep, distro: Distro): string[] {
  return step.variants?.[distro] ?? step.commands;
}

/** Command satu step, sudah distro-aware dan ter-interpolasi. */
export function resolvedStepText(
  step: RunbookStep,
  distro: Distro,
  values: Record<string, string>
): string {
  return resolveStepCommands(step, distro)
    .map((cmd) => interpolate(cmd, values))
    .join("\n");
}
