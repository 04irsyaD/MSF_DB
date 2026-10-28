import postgresShortcuts from "@/data/shortcuts/postgresql.json";
import mysqlShortcuts from "@/data/shortcuts/mysql.json";
import { ScriptItem, normalizeRiskLevel } from "../lib/schema";

const rawData = [
  ...postgresShortcuts,
  ...mysqlShortcuts,
];

export const allScripts: ScriptItem[] = rawData.map((item: any) => {
  const normalizedRisk = normalizeRiskLevel(item.risk_level || "low");
  return {
    ...item,
    tags: Array.isArray(item.tags) ? item.tags : [],
    params: Array.isArray(item.params) ? item.params : [],
    relatedIds: Array.isArray(item.relatedIds) ? item.relatedIds : [],
    risk: normalizedRisk,
  };
});

export function getAvailableEngines(): string[] {
  return Array.from(new Set(allScripts.map((s) => s.engine)));
}

export function getAvailableCategories(): string[] {
  return Array.from(new Set(allScripts.map((s) => s.category)));
}
