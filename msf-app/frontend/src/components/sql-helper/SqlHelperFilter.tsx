"use client";

import { Search, RotateCcw, X } from "lucide-react";

interface SqlHelperFilterProps {
  search: string;
  onSearchChange: (val: string) => void;
  engine: string;
  onEngineChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  riskLevel: string;
  onRiskLevelChange: (val: string) => void;
  onReset: () => void;
  engines: string[];
  categories: string[];
}

export default function SqlHelperFilter({
  search,
  onSearchChange,
  engine,
  onEngineChange,
  category,
  onCategoryChange,
  riskLevel,
  onRiskLevelChange,
  onReset,
  engines,
  categories,
}: SqlHelperFilterProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-xs space-y-3.5">
      {/* Top Search Input */}
      <div className="flex items-center gap-2.5 px-1 sm:px-2">
        <label htmlFor="sql-helper-search-input" className="sr-only">
          Search Database Scripts
        </label>
        <Search className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
        <input
          id="sql-helper-search-input"
          type="text"
          placeholder="Search database scripts (title, description, SQL keywords)..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-transparent border-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-mono"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="text-[11px] font-mono font-medium text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted inline-flex items-center gap-1 cursor-pointer transition-colors"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
            <span>CLEAR</span>
          </button>
        )}
      </div>

      {/* Dropdown Filters Row */}
      <div className="border-t border-border pt-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
          {/* DB Engine */}
          <div className="space-y-1.5">
            <label
              htmlFor="sql-filter-engine"
              className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider block"
            >
              DB Engine
            </label>
            <select
              id="sql-filter-engine"
              value={engine}
              onChange={(e) => onEngineChange(e.target.value)}
              className="w-full py-2 px-3 bg-muted/40 border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-accent transition-colors cursor-pointer"
            >
              {engines.map((eng) => (
                <option key={eng} value={eng} className="bg-card text-foreground">
                  {eng === "ALL ENGINES" ? "ALL ENGINES" : eng.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label
              htmlFor="sql-filter-category"
              className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider block"
            >
              Category
            </label>
            <select
              id="sql-filter-category"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full py-2 px-3 bg-muted/40 border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-accent transition-colors cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-card text-foreground">
                  {cat === "ALL CATEGORIES" ? "ALL CATEGORIES" : cat.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div className="space-y-1.5">
            <label
              htmlFor="sql-filter-risk"
              className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider block"
            >
              Risk Level
            </label>
            <select
              id="sql-filter-risk"
              value={riskLevel}
              onChange={(e) => onRiskLevelChange(e.target.value)}
              className="w-full py-2 px-3 bg-muted/40 border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-accent transition-colors cursor-pointer"
            >
              <option value="SEMUA TINGKATAN" className="bg-card text-foreground">ALL RISK LEVELS</option>
              <option value="Low" className="bg-card text-foreground">Low (Safe / Read-Only)</option>
              <option value="Medium" className="bg-card text-foreground">Medium (Caution)</option>
              <option value="High" className="bg-card text-foreground">High (Dangerous)</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-transparent select-none hidden sm:block">
              Actions
            </label>
            <button
              type="button"
              onClick={onReset}
              className="w-full py-2 px-4 bg-card hover:bg-muted border border-border hover:border-accent/50 text-accent text-xs font-bold font-mono uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer h-[38px]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>RESET FILTER</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

