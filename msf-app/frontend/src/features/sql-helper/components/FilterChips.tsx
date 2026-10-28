"use client";

import React from "react";
import { SQL_HELPER_LABELS } from "../lib/labels";
import { FacetedCounts } from "../lib/filter";

interface FilterChipsProps {
  availableEngines: string[];
  selectedEngines: string[];
  onToggleEngine: (engine: string) => void;
  onClearEngines: () => void;

  availableCategories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  onClearCategories: () => void;

  facetedCounts: FacetedCounts;
}

export function FilterChips({
  availableEngines,
  selectedEngines,
  onToggleEngine,
  onClearEngines,
  availableCategories,
  selectedCategories,
  onToggleCategory,
  onClearCategories,
  facetedCounts,
}: FilterChipsProps) {
  const isAllEnginesSelected = selectedEngines.length === 0;
  const isAllCategoriesSelected = selectedCategories.length === 0;

  return (
    <div className="space-y-2.5">
      {/* Engines Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap pl-0.5 min-w-[70px]">
          {SQL_HELPER_LABELS.filter.enginesLabel}:
        </span>
        <div
          role="group"
          aria-label={SQL_HELPER_LABELS.filter.enginesLabel}
          className="flex items-center gap-1.5 flex-nowrap"
        >
          <button
            id="filter-engine-all-btn"
            type="button"
            onClick={onClearEngines}
            aria-pressed={isAllEnginesSelected}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all border whitespace-nowrap ${
              isAllEnginesSelected
                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                : "bg-muted/40 hover:bg-muted text-muted-foreground border-border/60 hover:text-foreground"
            }`}
          >
            {SQL_HELPER_LABELS.filter.allEngines}
          </button>

          {availableEngines.map((engine) => {
            const key = engine.toLowerCase();
            const isSelected = selectedEngines.includes(key);
            const count = facetedCounts.engines[key] || 0;

            return (
              <button
                id={`filter-engine-${key}-btn`}
                key={engine}
                type="button"
                onClick={() => onToggleEngine(engine)}
                aria-pressed={isSelected}
                disabled={count === 0 && !isSelected}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all border flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : count === 0
                    ? "opacity-40 cursor-not-allowed bg-muted/20 border-border/40 text-muted-foreground"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground border-border/60 hover:text-foreground"
                }`}
              >
                <span>{engine}</span>
                <span
                  className={`text-[10px] px-1 rounded ${
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap pl-0.5 min-w-[70px]">
          {SQL_HELPER_LABELS.filter.categoriesLabel}:
        </span>
        <div
          role="group"
          aria-label={SQL_HELPER_LABELS.filter.categoriesLabel}
          className="flex items-center gap-1.5 flex-nowrap"
        >
          <button
            id="filter-cat-all-btn"
            type="button"
            onClick={onClearCategories}
            aria-pressed={isAllCategoriesSelected}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all border whitespace-nowrap ${
              isAllCategoriesSelected
                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                : "bg-muted/40 hover:bg-muted text-muted-foreground border-border/60 hover:text-foreground"
            }`}
          >
            {SQL_HELPER_LABELS.filter.allCategories}
          </button>

          {availableCategories.map((category) => {
            const key = category.toLowerCase();
            const isSelected = selectedCategories.includes(key);
            const count = facetedCounts.categories[key] || 0;

            return (
              <button
                id={`filter-cat-${key}-btn`}
                key={category}
                type="button"
                onClick={() => onToggleCategory(category)}
                aria-pressed={isSelected}
                disabled={count === 0 && !isSelected}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all border flex items-center gap-1.5 capitalize whitespace-nowrap ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : count === 0
                    ? "opacity-40 cursor-not-allowed bg-muted/20 border-border/40 text-muted-foreground"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground border-border/60 hover:text-foreground"
                }`}
              >
                <span>{category}</span>
                <span
                  className={`text-[10px] px-1 rounded font-mono ${
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
