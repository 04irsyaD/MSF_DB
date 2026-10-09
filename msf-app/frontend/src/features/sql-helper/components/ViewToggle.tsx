"use client";

import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { SQL_HELPER_LABELS } from "../lib/labels";

export type ViewMode = "card" | "table";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewToggle({
  viewMode,
  onViewModeChange,
  className = "",
}: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Toggle View Mode"
      className={`inline-flex items-center p-0.5 rounded-lg border border-border/70 bg-muted/30 ${className}`}
    >
      <button
        id="sql-view-card-btn"
        type="button"
        onClick={() => onViewModeChange("card")}
        aria-pressed={viewMode === "card"}
        aria-label={SQL_HELPER_LABELS.view.cards}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
          viewMode === "card"
            ? "bg-background text-foreground shadow-xs font-semibold"
            : "text-muted-foreground hover:text-foreground hover:bg-background/40"
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">{SQL_HELPER_LABELS.view.cards}</span>
      </button>

      <button
        id="sql-view-table-btn"
        type="button"
        onClick={() => onViewModeChange("table")}
        aria-pressed={viewMode === "table"}
        aria-label={SQL_HELPER_LABELS.view.table}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
          viewMode === "table"
            ? "bg-background text-foreground shadow-xs font-semibold"
            : "text-muted-foreground hover:text-foreground hover:bg-background/40"
        }`}
      >
        <List className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">{SQL_HELPER_LABELS.view.table}</span>
      </button>
    </div>
  );
}
