"use client";

import React from "react";
import { X, RotateCcw } from "lucide-react";
import { SQL_HELPER_LABELS } from "../lib/labels";
import { RiskLevelType } from "../lib/schema";

interface ActiveFiltersProps {
  totalResults: number;
  search: string;
  onClearSearch: () => void;
  selectedEngines: string[];
  onRemoveEngine: (engine: string) => void;
  selectedCategories: string[];
  onRemoveCategory: (category: string) => void;
  selectedRisks: RiskLevelType[];
  onRemoveRisk: (risk: RiskLevelType) => void;
  onResetAll: () => void;
  hasActiveFilters: boolean;
}

export function ActiveFilters({
  totalResults,
  search,
  onClearSearch,
  selectedEngines,
  onRemoveEngine,
  selectedCategories,
  onRemoveCategory,
  selectedRisks,
  onRemoveRisk,
  onResetAll,
  hasActiveFilters,
}: ActiveFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
      {/* Result counter with aria-live */}
      <div className="flex items-center gap-2">
        <span
          id="sql-results-count"
          aria-live="polite"
          className="text-xs font-semibold text-foreground/90 flex items-center gap-1.5"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {SQL_HELPER_LABELS.pagination.totalSummary(totalResults)}
        </span>
      </div>

      {/* Active filters chips list */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground text-[11px] mr-1">
            {SQL_HELPER_LABELS.filter.activeFiltersLabel}
          </span>

          {search && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px]">
              <span>&ldquo;{search}&rdquo;</span>
              <button
                type="button"
                onClick={onClearSearch}
                className="hover:opacity-75 focus:outline-none"
                aria-label="Remove search filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedEngines.map((engine) => (
            <span
              key={engine}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[11px] font-mono uppercase"
            >
              <span>{engine}</span>
              <button
                type="button"
                onClick={() => onRemoveEngine(engine)}
                className="hover:opacity-75 focus:outline-none"
                aria-label={`Remove engine filter ${engine}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {selectedCategories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[11px] capitalize"
            >
              <span>{category}</span>
              <button
                type="button"
                onClick={() => onRemoveCategory(category)}
                className="hover:opacity-75 focus:outline-none"
                aria-label={`Remove category filter ${category}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {selectedRisks.map((risk) => (
            <span
              key={risk}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-foreground border border-border text-[11px] font-mono uppercase"
            >
              <span>{risk} risk</span>
              <button
                type="button"
                onClick={() => onRemoveRisk(risk)}
                className="hover:opacity-75 focus:outline-none"
                aria-label={`Remove risk filter ${risk}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            id="reset-all-filters-btn"
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] transition-colors border border-border/60 ml-1"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>{SQL_HELPER_LABELS.filter.resetAll}</span>
          </button>
        </div>
      )}
    </div>
  );
}
