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
  const [engine, setEngine] = useState("postgresql");
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
    <div className="bg-white border border-border p-5 rounded-2xl shadow-sm space-y-4">
      {/* Search & Reset */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-2.5 text-accent font-mono font-bold text-xs select-none">$</span>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="CARI SHORTCUT SCRIPTS..."
            className="w-full bg-gray-50/50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2 pl-7 pr-4 text-xs text-gray-900 placeholder-muted-foreground/60 focus:outline-none transition-colors duration-150 font-mono"
          />
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-border hover:border-accent/40 text-muted-foreground hover:text-gray-900 transition-colors duration-150 text-xs font-mono font-bold flex items-center justify-center gap-2 uppercase"
        >
          <RefreshCw className="h-4 w-4" />
          <span>RESET FILTER</span>
        </button>
      </div>

      {/* Grid of selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Engine Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
            DB ENGINE
          </label>
          <select
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
            className="w-full bg-white border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2 px-3 text-xs text-gray-900 focus:outline-none transition-colors duration-150 font-mono cursor-pointer font-bold"
          >
            <option value="" className="bg-white text-gray-900">ALL ENGINES</option>
            {engines.map((eng) => (
              <option key={eng} value={eng} className="bg-white text-gray-900">
                {eng.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
            CATEGORY
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2 px-3 text-xs text-gray-900 focus:outline-none transition-colors duration-150 font-mono cursor-pointer font-bold"
          >
            <option value="" className="bg-white text-gray-900">ALL CATEGORIES</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-white text-gray-900">
                {cat.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Risk Level Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
            RISK LEVEL
          </label>
          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="w-full bg-white border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2 px-3 text-xs text-gray-900 focus:outline-none transition-colors duration-150 font-mono cursor-pointer font-bold"
          >
            {riskLevels.map((lvl) => (
              <option key={lvl.value} value={lvl.value} className="bg-white text-gray-900">
                {lvl.label.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
