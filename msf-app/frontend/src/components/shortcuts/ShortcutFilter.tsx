"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShortcutFilterProps {
  onFilterChange: (filters: {
    q: string;
    engine: string;
    category: string;
    risk_level: string;
  }) => void;
  engines: string[];
  categories: string[];
}

export default function ShortcutFilter({ onFilterChange, engines, categories }: ShortcutFilterProps) {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [engine, setEngine] = useState("");
  const [category, setCategory] = useState("");
  const [riskLevel, setRiskLevel] = useState("");

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQ(q);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [q]);

  // Trigger filter change on state modification
  useEffect(() => {
    onFilterChange({
      q: debouncedQ,
      engine,
      category,
      risk_level: riskLevel,
    });
  }, [debouncedQ, engine, category, riskLevel]);

  const handleReset = () => {
    setQ("");
    setDebouncedQ("");
    setEngine("");
    setCategory("");
    setRiskLevel("");
  };

  const riskLevels = [
    { label: "Semua Tingkatan", value: "" },
    { label: "Safe", value: "safe" },
    { label: "Read Only", value: "read-only" },
    { label: "Caution", value: "caution" },
    { label: "Dangerous / High Risk", value: "dangerous" },
  ];

  return (
    <div className="bg-card/40 backdrop-blur-md border border-border p-5 rounded-2xl space-y-4">
      {/* Search & Reset */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-muted-foreground/60" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari berdasarkan judul, deskripsi, atau tags..."
            className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-2.5 pl-11 pr-4 text-xs text-white placeholder-muted-foreground/60 focus:outline-none transition-all"
          />
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl bg-secondary/30 hover:bg-secondary border border-border hover:border-indigo-500/20 text-muted-foreground hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset Filter</span>
        </button>
      </div>

      {/* Grid of selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Engine Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            DB Engine
          </label>
          <select
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
            className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-all cursor-pointer font-medium"
          >
            <option value="" className="bg-card text-white">Semua Engine</option>
            {engines.map((eng) => (
              <option key={eng} value={eng} className="bg-card text-white">
                {eng}
              </option>
            ))}
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Kategori
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-all cursor-pointer font-medium"
          >
            <option value="" className="bg-card text-white">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-card text-white">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Risk Level Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Tingkat Risiko
          </label>
          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-all cursor-pointer font-medium"
          >
            {riskLevels.map((lvl) => (
              <option key={lvl.value} value={lvl.value} className="bg-card text-white">
                {lvl.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
