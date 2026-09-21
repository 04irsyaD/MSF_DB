"use client";

import { Search, RotateCcw } from "lucide-react";

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
    <div className="bg-white border border-border rounded-xl p-4 shadow-sm space-y-4">
      {/* Top Search Input */}
      <div className="flex items-center gap-3 px-2">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="CARI SHORTCUT SCRIPTS (JUDUL, DESKRIPSI, ATAU QUERY)..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-transparent border-none text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none uppercase tracking-wider font-mono"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="text-[10px] font-mono text-muted-foreground hover:text-foreground px-2 py-0.5 rounded hover:bg-muted"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Dropdown Filters Row */}
      <div className="border-t border-border pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* DB Engine */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">
              DB Engine
            </label>
            <select
              value={engine}
              onChange={(e) => onEngineChange(e.target.value)}
              className="w-full py-2 px-3 bg-gray-50 border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-[#00bfa5] transition-colors cursor-pointer capitalize"
            >
              {engines.map((eng) => (
                <option key={eng} value={eng}>
                  {eng === "ALL ENGINES" ? "ALL ENGINES" : eng.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full py-2 px-3 bg-gray-50 border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-[#00bfa5] transition-colors cursor-pointer capitalize"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "ALL CATEGORIES" ? "ALL CATEGORIES" : cat.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">
              Risk Level
            </label>
            <select
              value={riskLevel}
              onChange={(e) => onRiskLevelChange(e.target.value)}
              className="w-full py-2 px-3 bg-gray-50 border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-[#00bfa5] transition-colors cursor-pointer"
            >
              <option value="SEMUA TINGKATAN">SEMUA TINGKATAN</option>
              <option value="Low">Low (Safe / Read-Only)</option>
              <option value="Medium">Medium (Caution)</option>
              <option value="High">High (Dangerous)</option>
            </select>
          </div>

          {/* Reset Button */}
          <div>
            <button
              type="button"
              onClick={onReset}
              className="w-full py-2 px-4 bg-white hover:bg-gray-50 border border-border hover:border-[#00bfa5]/40 text-[#00bfa5] text-xs font-bold font-mono uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
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
