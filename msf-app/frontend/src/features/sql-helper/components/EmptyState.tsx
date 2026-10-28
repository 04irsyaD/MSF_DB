"use client";

import React from "react";
import { Database, RotateCcw, SearchX } from "lucide-react";
import { SQL_HELPER_LABELS } from "../lib/labels";

interface EmptyStateProps {
  hasQuery: boolean;
  hasEngineFilter: boolean;
  hasCategoryFilter: boolean;
  hasRiskFilter: boolean;
  onReset: () => void;
  className?: string;
}

export function EmptyState({
  hasQuery,
  hasEngineFilter,
  hasCategoryFilter,
  hasRiskFilter,
  onReset,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-border/80 bg-muted/10 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-4">
        {hasQuery ? <SearchX className="w-6 h-6" /> : <Database className="w-6 h-6" />}
      </div>

      <h3 className="font-semibold text-base text-foreground mb-1">
        {SQL_HELPER_LABELS.empty.title}
      </h3>
      <p className="text-xs text-muted-foreground max-w-md mb-6 leading-relaxed">
        {SQL_HELPER_LABELS.empty.description}
      </p>

      {/* Dynamic Suggestions */}
      <div className="bg-background/80 border border-border/60 rounded-xl p-3.5 max-w-sm w-full text-left text-xs space-y-1.5 mb-6 text-muted-foreground">
        <span className="font-medium text-foreground block text-[11px] uppercase tracking-wider">
          Suggestions:
        </span>
        {hasQuery && (
          <p className="flex items-start gap-1.5">
            <span className="text-primary">•</span>
            <span>{SQL_HELPER_LABELS.empty.suggestionQuery}</span>
          </p>
        )}
        {hasEngineFilter && (
          <p className="flex items-start gap-1.5">
            <span className="text-primary">•</span>
            <span>{SQL_HELPER_LABELS.empty.suggestionEngine}</span>
          </p>
        )}
        {hasCategoryFilter && (
          <p className="flex items-start gap-1.5">
            <span className="text-primary">•</span>
            <span>{SQL_HELPER_LABELS.empty.suggestionCategory}</span>
          </p>
        )}
        {hasRiskFilter && (
          <p className="flex items-start gap-1.5">
            <span className="text-primary">•</span>
            <span>{SQL_HELPER_LABELS.empty.suggestionRisk}</span>
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>{SQL_HELPER_LABELS.empty.resetButton}</span>
      </button>
    </div>
  );
}
