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
    <div className="bg-white border border-border rounded-xl p-4 shadow-xs space-y-3.5">
      {/* Top Search Input */}
      <div className="flex items-center gap-2.5 px-1 sm:px-2">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Cari skrip database (judul, deskripsi, SQL)..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-transparent border-none text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-mono"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="text-[10px] font-mono text-muted-foreground hover:text-foreground px-2 py-0.5 rounded hover:bg-gray-100 inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <X className="h-3 w-3" />
            <span>HAPUS</span>
          </button>
        )}
      </div>

      {/* Dropdown Filters Row */}
      <div className="border-t border-border pt-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
          {/* DB Engine */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">
              DB Engine
            </label>
            <select
              value={engine}
              onChange={(e) => onEngineChange(e.target.value)}
              className="w-full py-2 px-3 bg-gray-50 border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-[#00bfa5] transition-colors cursor-pointer"
            >
              {engines.map((eng) => (
                <option key={eng} value={eng}>
                  {eng === "ALL ENGINES" ? "SEMUA ENGINE" : eng.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full py-2 px-3 bg-gray-50 border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:border-[#00bfa5] transition-colors cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "ALL CATEGORIES" ? "SEMUA KATEGORI" : cat.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block">
              Tingkat Risiko
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
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-transparent select-none hidden sm:block">
              Aksi
            </label>
            <button
              type="button"
              onClick={onReset}
              className="w-full py-2 px-4 bg-white hover:bg-teal-50/50 border border-border hover:border-[#00bfa5]/50 text-[#00bfa5] text-xs font-bold font-mono uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer h-[38px]"
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
