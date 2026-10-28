import { z } from "zod";

/** 4 jalur belajar bertingkat (Level 0 → 3). */
export const LevelSchema = z.enum(["0", "1", "2", "3"]);
export type Level = z.infer<typeof LevelSchema>;

/** Lingkungan tempat command/shortcut dipakai. */
export const EnvSchema = z.enum(["desktop", "ssh"]);
export type Env = z.infer<typeof EnvSchema>;

/** Distro yang didukung di fase awal. Mapping: apt → ubuntu, dnf → rhel. */
export const DistroSchema = z.enum(["ubuntu", "rhel"]);
export type Distro = z.infer<typeof DistroSchema>;

export const RiskSchema = z.enum(["low", "medium", "high"]);
export type Risk = z.infer<typeof RiskSchema>;

/**
 * Tipe variabel runbook (Level 3).
 *
 * Diperluas dari ParamSchema SQL Helper (identifier/string/number) dengan tipe
 * khusus server — `port`, `ip`, `cidr`, `path` — supaya validasi di Fase 4 bisa
 * menolak input berbahaya saat command di-interpolasi lalu di-paste ke shell.
 * SQL Helper tidak diubah; schema ini milik Linux Helper sendiri.
 */
export const ParamTypeSchema = z.enum([
  "identifier",
  "string",
  "number",
  "port",
  "ip",
  "cidr",
  "path",
]);
export type ParamType = z.infer<typeof ParamTypeSchema>;

export const LinuxParamSchema = z.object({
  key: z.string().regex(/^[a-z][a-z0-9_]*$/),
  label: z.string(),
  type: ParamTypeSchema.default("identifier"),
  default: z.string().optional(),
  required: z.boolean().default(false),
  hint: z.string().optional(),
});
export type LinuxParam = z.infer<typeof LinuxParamSchema>;

/** Shortcut keyboard (Level 0). `keys` berisi kombinasi alternatif. */
export const ShortcutSchema = z.object({
  id: z.string(),
  level: LevelSchema,
  title: z.string(), // "Bersihkan layar"
  keys: z.array(z.array(z.string())).min(1), // [["Ctrl","L"]]
  altCommand: z.string().optional(), // "clear"
  env: z.array(EnvSchema).min(1),
  note: z.string().optional(), // "Hanya Ubuntu/GNOME"
  warning: z.string().optional(), // "Ctrl+C biasa = stop"
});
export type Shortcut = z.infer<typeof ShortcutSchema>;

/** Command satuan (Level 0–2). `command` boleh berisi {{placeholder}}. */
export const CommandSchema = z.object({
  id: z.string(),
  level: LevelSchema,
  category: z.string(), // "navigasi", "service", "network", ...
  title: z.string(),
  description: z.string().default(""), // ringkasan singkat untuk kartu
  command: z.string(),
  variants: z.partialRecord(DistroSchema, z.string()).optional(),
  explain: z.array(z.object({ part: z.string(), meaning: z.string() })).default([]),
  note: z.string().optional(), // catatan tambahan di drawer
  risk: RiskSchema.default("low"),
  tags: z.array(z.string()).default([]),
});
export type Command = z.infer<typeof CommandSchema>;

/** Satu langkah dalam runbook (Level 3). */
export const RunbookStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  commands: z.array(z.string()).min(1), // boleh {{var}}
  variants: z.partialRecord(DistroSchema, z.array(z.string())).optional(),
  verify: z.string().optional(), // command cek hasil
  note: z.string().optional(), // catatan penting (mis. peringatan password/subnet)
  commonErrors: z
    .array(z.object({ error: z.string(), fix: z.string() }))
    .default([]),
  risk: RiskSchema.default("low"),
});
export type RunbookStep = z.infer<typeof RunbookStepSchema>;

/** Runbook server DB (Level 3). */
export const RunbookSchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string().optional(),
  description: z.string(),
  vars: z.array(LinuxParamSchema).default([]),
  steps: z.array(RunbookStepSchema).min(1),
});
export type Runbook = z.infer<typeof RunbookSchema>;
