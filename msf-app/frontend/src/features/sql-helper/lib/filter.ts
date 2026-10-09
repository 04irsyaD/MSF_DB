import { ScriptItem, RiskLevelType } from "./schema";
import { searchScriptsWithFuse } from "./search";

export type SortKey = "relevance" | "title" | "risk" | "category";

export interface ScriptFilterOptions {
  q?: string;
  engines?: string[];
  categories?: string[];
  risks?: RiskLevelType[];
  sort?: SortKey;
}

const RISK_WEIGHTS: Record<RiskLevelType, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Filter scripts by engine, category, risk, and query with multi-select support.
 */
export function filterScripts(
  scripts: ScriptItem[],
  options: ScriptFilterOptions = {}
): ScriptItem[] {
  let result = scripts;

  // 1. Search Query (via Fuse.js for fuzzy scoring)
  if (options.q && options.q.trim()) {
    result = searchScriptsWithFuse(result, options.q.trim());
  }

  // 2. Filter by engines (if array is non-empty)
  if (options.engines && options.engines.length > 0) {
    const selectedEngines = new Set(options.engines.map((e) => e.toLowerCase().trim()));
    result = result.filter((item) => selectedEngines.has(item.engine.toLowerCase()));
  }

  // 3. Filter by categories (if array is non-empty)
  if (options.categories && options.categories.length > 0) {
    const selectedCats = new Set(options.categories.map((c) => c.toLowerCase().trim()));
    result = result.filter((item) => selectedCats.has(item.category.toLowerCase()));
  }

  // 4. Filter by risk levels (if array is non-empty)
  if (options.risks && options.risks.length > 0) {
    const selectedRisks = new Set(options.risks);
    result = result.filter((item) => selectedRisks.has(item.risk));
  }

  // 5. Sorting
  const sortKey = options.sort || "relevance";
  result = [...result].sort((a, b) => {
    switch (sortKey) {
      case "title":
        return a.title.localeCompare(b.title);
      case "risk": {
        const weightDiff = RISK_WEIGHTS[b.risk] - RISK_WEIGHTS[a.risk];
        return weightDiff !== 0 ? weightDiff : a.title.localeCompare(b.title);
      }
      case "category": {
        const catDiff = a.category.localeCompare(b.category);
        return catDiff !== 0 ? catDiff : a.title.localeCompare(b.title);
      }
      case "relevance":
      default:
        // When there is no search query, sort by category then title
        if (!options.q || !options.q.trim()) {
          const catDiff = a.category.localeCompare(b.category);
          return catDiff !== 0 ? catDiff : a.title.localeCompare(b.title);
        }
        return 0; // Maintain Fuse search ranking
    }
  });

  return result;
}

export interface FacetedCounts {
  engines: Record<string, number>;
  categories: Record<string, number>;
  risks: Record<RiskLevelType, number>;
}

/**
 * Calculates faceted counts for engines, categories, and risks.
 * Faceted counts for an attribute are computed against other active filters.
 */
export function calculateFacetedCounts(
  allScripts: ScriptItem[],
  currentOptions: ScriptFilterOptions = {}
): FacetedCounts {
  // Engine facets: ignore current engine filter, apply query, categories, and risks
  const forEngines = filterScripts(allScripts, {
    q: currentOptions.q,
    categories: currentOptions.categories,
    risks: currentOptions.risks,
  });
  const enginesCount: Record<string, number> = {};
  for (const s of forEngines) {
    const key = s.engine.toLowerCase();
    enginesCount[key] = (enginesCount[key] || 0) + 1;
  }

  // Category facets: ignore current category filter, apply query, engines, and risks
  const forCategories = filterScripts(allScripts, {
    q: currentOptions.q,
    engines: currentOptions.engines,
    risks: currentOptions.risks,
  });
  const categoriesCount: Record<string, number> = {};
  for (const s of forCategories) {
    const key = s.category.toLowerCase();
    categoriesCount[key] = (categoriesCount[key] || 0) + 1;
  }

  // Risk facets: ignore current risk filter, apply query, engines, and categories
  const forRisks = filterScripts(allScripts, {
    q: currentOptions.q,
    engines: currentOptions.engines,
    categories: currentOptions.categories,
  });
  const risksCount: Record<RiskLevelType, number> = {
    low: 0,
    medium: 0,
    high: 0,
  };
  for (const s of forRisks) {
    if (s.risk in risksCount) {
      risksCount[s.risk]++;
    }
  }

  return {
    engines: enginesCount,
    categories: categoriesCount,
    risks: risksCount,
  };
}
