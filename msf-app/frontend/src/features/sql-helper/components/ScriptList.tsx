"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScriptItem } from "../lib/schema";
import { ViewMode } from "./ViewToggle";
import { ScriptCard } from "./ScriptCard";
import { ScriptRow } from "./ScriptRow";
import { EmptyState } from "./EmptyState";
import { SQL_HELPER_LABELS } from "../lib/labels";

interface ScriptListProps {
  scripts: ScriptItem[];
  viewMode: ViewMode;
  onSelectScript: (script: ScriptItem) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;

  page: number;
  onPageChange: (p: number) => void;
  pageSize: 10 | 20 | 50;
  onPageSizeChange: (s: 10 | 20 | 50) => void;

  // Empty state props
  hasQuery: boolean;
  hasEngineFilter: boolean;
  hasCategoryFilter: boolean;
  hasRiskFilter: boolean;
  onResetFilters: () => void;
}

export function ScriptList({
  scripts,
  viewMode,
  onSelectScript,
  isFavorite,
  onToggleFavorite,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
  hasQuery,
  hasEngineFilter,
  hasCategoryFilter,
  hasRiskFilter,
  onResetFilters,
}: ScriptListProps) {
  const totalCount = scripts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const currentScripts = scripts.slice(startIndex, endIndex);

  if (totalCount === 0) {
    return (
      <EmptyState
        hasQuery={hasQuery}
        hasEngineFilter={hasEngineFilter}
        hasCategoryFilter={hasCategoryFilter}
        hasRiskFilter={hasRiskFilter}
        onReset={onResetFilters}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Cards View (Default or forced on mobile < md) */}
      <div className={viewMode === "table" ? "hidden md:block" : "block"}>
        {viewMode === "table" ? (
          <div className="overflow-x-auto rounded-xl border border-border/80 bg-card shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-10 text-center font-semibold">
                    {SQL_HELPER_LABELS.table.colFavorite}
                  </th>
                  <th className="py-2.5 px-3 font-semibold">
                    {SQL_HELPER_LABELS.table.colName}
                  </th>
                  <th className="py-2.5 px-3 font-semibold">
                    {SQL_HELPER_LABELS.table.colCategory}
                  </th>
                  <th className="py-2.5 px-3 font-semibold">
                    {SQL_HELPER_LABELS.table.colEngine}
                  </th>
                  <th className="py-2.5 px-3 font-semibold">
                    {SQL_HELPER_LABELS.table.colRisk}
                  </th>
                  <th className="py-2.5 px-3 text-right font-semibold">
                    {SQL_HELPER_LABELS.table.colActions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentScripts.map((script) => (
                  <ScriptRow
                    key={script.id}
                    script={script}
                    onSelect={() => onSelectScript(script)}
                    isFavorite={isFavorite(script.id)}
                    onToggleFavorite={() => onToggleFavorite(script.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentScripts.map((script) => (
              <ScriptCard
                key={script.id}
                script={script}
                onSelect={() => onSelectScript(script)}
                isFavorite={isFavorite(script.id)}
                onToggleFavorite={() => onToggleFavorite(script.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fallback to Card Grid on Mobile when table mode is selected */}
      {viewMode === "table" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {currentScripts.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              onSelect={() => onSelectScript(script)}
              isFavorite={isFavorite(script.id)}
              onToggleFavorite={() => onToggleFavorite(script.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/60 text-xs">
        <span className="text-muted-foreground order-2 sm:order-1">
          {SQL_HELPER_LABELS.pagination.showingSummary(
            totalCount > 0 ? startIndex + 1 : 0,
            endIndex,
            totalCount
          )}
        </span>

        <div className="flex items-center gap-3 order-1 sm:order-2">
          {/* Page size dropdown */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span>{SQL_HELPER_LABELS.pagination.rowsPerPage}</span>
            <select
              value={pageSize}
              onChange={(e) =>
                onPageSizeChange(parseInt(e.target.value, 10) as 10 | 20 | 50)
              }
              aria-label={SQL_HELPER_LABELS.pagination.rowsPerPage}
              className="px-2 py-1 bg-background border border-border/80 rounded-lg text-xs font-mono font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Page navigation buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              aria-label={SQL_HELPER_LABELS.pagination.prevPage}
              className="p-1.5 rounded-lg border border-border/70 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 font-mono text-xs font-medium">
              {SQL_HELPER_LABELS.pagination.pageIndicator(currentPage, totalPages)}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              aria-label={SQL_HELPER_LABELS.pagination.nextPage}
              className="p-1.5 rounded-lg border border-border/70 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
