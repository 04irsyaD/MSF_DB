"use client";

import { useState, useMemo } from "react";
import { Database } from "lucide-react";
import { ShortcutItem } from "@/lib/types";
import {
  filterShortcuts,
  getAvailableEngines,
  getAvailableCategories,
} from "@/data/shortcuts/shortcutsData";
import SqlHelperInfoBox from "@/components/sql-helper/SqlHelperInfoBox";
import SqlHelperFilter from "@/components/sql-helper/SqlHelperFilter";
import SqlHelperTable from "@/components/sql-helper/SqlHelperTable";
import SqlHelperDrawer from "@/components/sql-helper/SqlHelperDrawer";
import SqlHelperStats from "@/components/sql-helper/SqlHelperStats";

export default function SqlHelperPage() {
  const [search, setSearch] = useState("");
  const [engine, setEngine] = useState("ALL ENGINES");
  const [category, setCategory] = useState("ALL CATEGORIES");
  const [riskLevel, setRiskLevel] = useState("SEMUA TINGKATAN");
  const [selectedShortcut, setSelectedShortcut] = useState<ShortcutItem | null>(null);

  const engines = useMemo(() => getAvailableEngines(), []);
  const categories = useMemo(() => getAvailableCategories(), []);

  const filteredShortcuts = useMemo(() => {
    return filterShortcuts({
      q: search,
      engine,
      category,
      risk_level: riskLevel,
    });
  }, [search, engine, category, riskLevel]);

  const handleReset = () => {
    setSearch("");
    setEngine("ALL ENGINES");
    setCategory("ALL CATEGORIES");
    setRiskLevel("SEMUA TINGKATAN");
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00bfa5]/10 text-[#00bfa5]">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                SQL Helper
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Skrip database siap pakai untuk DBA dan optimasi (Client Standalone)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box Banner */}
      <SqlHelperInfoBox />

      {/* Search & Filters */}
      <SqlHelperFilter
        search={search}
        onSearchChange={setSearch}
        engine={engine}
        onEngineChange={setEngine}
        category={category}
        onCategoryChange={setCategory}
        riskLevel={riskLevel}
        onRiskLevelChange={setRiskLevel}
        onReset={handleReset}
        engines={engines}
        categories={categories}
      />

      {/* Scripts Table */}
      <SqlHelperTable
        shortcuts={filteredShortcuts}
        onSelect={(shortcut) => setSelectedShortcut(shortcut)}
      />

      {/* Footer Stats */}
      <SqlHelperStats
        total={filteredShortcuts.length}
        engine={engine}
        lastUpdated="100% Client Ready"
      />

      {/* Slide-Over Drawer for Script Details */}
      <SqlHelperDrawer
        shortcut={selectedShortcut}
        onClose={() => setSelectedShortcut(null)}
      />
    </div>
  );
}
