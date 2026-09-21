"use client";

import { useState, useMemo } from "react";
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
    <div className="space-y-5 pb-12 animate-fade-in-up max-w-7xl mx-auto">
      {/* Info Box Guide Banner */}
      <SqlHelperInfoBox />

      {/* Search & Filters Bar */}
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

      {/* Scripts Data Grid Table with Pagination */}
      <SqlHelperTable
        shortcuts={filteredShortcuts}
        onSelect={(shortcut) => setSelectedShortcut(shortcut)}
      />

      {/* Footer Metrics Stats */}
      <SqlHelperStats
        total={filteredShortcuts.length}
        engine={engine}
        lastUpdated="100% Client Ready"
      />

      {/* Slide-Over Drawer for Script Details (Rendered via React Portal) */}
      <SqlHelperDrawer
        shortcut={selectedShortcut}
        onClose={() => setSelectedShortcut(null)}
      />
    </div>
  );
}
