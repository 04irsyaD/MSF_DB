import { z } from "zod";

export const EngineSchema = z.enum([
  "postgresql",
  "mysql",
  "oracle",
  "mssql",
  "sqlite",
]);
export type EngineType = z.infer<typeof EngineSchema>;

export const CategorySchema = z.enum([
  "diagnostic",
  "performance",
  "maintenance",
  "security",
  "monitoring",
]);
export type CategoryType = z.infer<typeof CategorySchema>;

export const RiskLevelSchema = z.enum(["low", "medium", "high"]);
export type RiskLevelType = z.infer<typeof RiskLevelSchema>;

/**
 * Normalizes legacy risk level strings to standard "low" | "medium" | "high".
 */
export function normalizeRiskLevel(raw: string): RiskLevelType {
  const l = raw.toLowerCase().trim();
  if (l === "safe" || l === "read-only" || l === "low") return "low";
  if (l === "caution" || l === "medium") return "medium";
  return "high";
}

export const ParamSchema = z.object({
  key: z.string().regex(/^[a-z][a-z0-9_]*$/),
  label: z.string(),
  type: z.enum(["identifier", "string", "number"]).default("identifier"),
  default: z.string().optional(),
  required: z.boolean().default(false),
  hint: z.string().optional(),
});
export type ScriptParam = z.infer<typeof ParamSchema>;

export const ScriptSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  description: z.string(),
  whenToUse: z.string().optional(),
  engine: z.string(), // Allow flexible string for display, validated against known engines
  category: z.string(),
  risk_level: z.string(), // Raw or normalized
  risk: RiskLevelSchema.optional(), // Canonical normalized risk
  sql: z.string().min(1),
  tags: z.array(z.string()).default([]),
  params: z.array(ParamSchema).default([]),
  minVersion: z.string().optional(),
  notes: z.string().optional(),
  relatedIds: z.array(z.string()).default([]),
});

export type ScriptItem = z.infer<typeof ScriptSchema> & {
  risk: RiskLevelType;
};
