import { ShieldCheck, AlertTriangle, LucideIcon } from "lucide-react";
import { RiskLevelType } from "./schema";

export interface RiskMetaItem {
  label: string;
  badgeLabel: string;
  classes: string;
  bgLight: string;
  icon: LucideIcon;
  hint: string;
}

export const RISK_META: Record<RiskLevelType, RiskMetaItem> = {
  low: {
    label: "LOW RISK (SAFE)",
    badgeLabel: "LOW",
    classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    bgLight: "bg-emerald-50 text-emerald-700",
    icon: ShieldCheck,
    hint: "Read-only operations, safe to execute on production",
  },
  medium: {
    label: "MEDIUM RISK (CAUTION)",
    badgeLabel: "MEDIUM",
    classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    bgLight: "bg-amber-50 text-amber-700",
    icon: AlertTriangle,
    hint: "Modifies database state or objects, test in staging first",
  },
  high: {
    label: "HIGH RISK (DANGEROUS)",
    badgeLabel: "HIGH",
    classes: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    bgLight: "bg-rose-50 text-rose-700",
    icon: AlertTriangle,
    hint: "Destructive operation, backup data before running",
  },
};

export function getCategoryBadgeClass(category: string): string {
  switch (category.toLowerCase()) {
    case "diagnostic":
    case "monitoring":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    case "maintenance":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "performance":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    case "security":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function getEngineBadgeClass(engine: string): string {
  switch (engine.toLowerCase()) {
    case "postgresql":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    case "mysql":
      return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20";
    case "oracle":
      return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
    case "mssql":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
    case "sqlite":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}
