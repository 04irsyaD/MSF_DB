import postgresShortcuts from "./postgresql.json";
import mysqlShortcuts from "./mysql.json";
import { ShortcutItem } from "@/lib/types";

export const allShortcuts: ShortcutItem[] = [
  ...(postgresShortcuts as unknown as ShortcutItem[]),
  ...(mysqlShortcuts as unknown as ShortcutItem[]),
];

export interface ShortcutFilters {
  q?: string;
  engine?: string;
  category?: string;
  risk_level?: string;
}

export function filterShortcuts(filters: ShortcutFilters = {}): ShortcutItem[] {
  let result = [...allShortcuts];

  if (filters.engine && filters.engine !== "ALL ENGINES") {
    result = result.filter(
      (item) => item.engine.toLowerCase() === filters.engine?.toLowerCase()
    );
  }

  if (filters.category && filters.category !== "ALL CATEGORIES") {
    result = result.filter(
      (item) => item.category.toLowerCase() === filters.category?.toLowerCase()
    );
  }

  if (filters.risk_level && filters.risk_level !== "SEMUA TINGKATAN") {
    result = result.filter((item) => {
      const risk = item.risk_level.toLowerCase();
      const target = filters.risk_level?.toLowerCase();
      if (target === "low") return risk === "safe" || risk === "read-only";
      if (target === "medium") return risk === "caution";
      if (target === "high") return risk === "dangerous";
      return risk === target;
    });
  }

  if (filters.q && filters.q.trim()) {
    const query = filters.q.toLowerCase().trim();
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.sql.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  return result;
}

export function getAvailableEngines(): string[] {
  const engines = Array.from(new Set(allShortcuts.map((s) => s.engine)));
  return ["ALL ENGINES", ...engines];
}

export function getAvailableCategories(): string[] {
  const categories = Array.from(new Set(allShortcuts.map((s) => s.category)));
  return ["ALL CATEGORIES", ...categories];
}
