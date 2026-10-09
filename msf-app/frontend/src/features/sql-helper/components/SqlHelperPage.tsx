"use client";

import { useState, useMemo, useCallback } from "react";
import { useScriptFilters } from "../hooks/useScriptFilters";
import { useFavorites } from "../hooks/useFavorites";
import { useRecent } from "../hooks/useRecent";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  allScripts,
  getAvailableEngines,
  getAvailableCategories,
} from "../data";
import {
  filterScripts,
  calculateFacetedCounts,
  SortKey,
  AccessScope,
} from "../lib/filter";
import { SQL_HELPER_LABELS } from "../lib/labels";
import { InfoBanner } from "./InfoBanner";
import { SearchBar } from "./SearchBar";
import { FilterChips } from "./FilterChips";
import { RiskToggle } from "./RiskToggle";
import { ViewToggle, ViewMode } from "./ViewToggle";
import { ActiveFilters } from "./ActiveFilters";
import { QuickAccessBar } from "./QuickAccessBar";
import { ScriptList } from "./ScriptList";
import { ScriptDrawer } from "./ScriptDrawer";
import { ScriptItem } from "../lib/schema";

const VIEW_STORAGE_KEY = "msfdb:sqlhelper:v1:view";

export default function SqlHelperPage() {
  const {
    search,
    setSearch,
    debouncedSearch,
    selectedEngines,
    toggleEngine,
    clearEngines,
    selectedCategories,
    toggleCategory,
    clearCategories,
    selectedRisks,
    toggleRisk,
    clearRisks,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    selectedScriptId,
    setSelectedScriptId,
    resetFilters,
    hasActiveFilters,
  } = useScriptFilters();

  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { recentIds, addToRecent, clearRecent } = useRecent();
  const [scope, setScope] = useState<AccessScope>("all");

  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    VIEW_STORAGE_KEY,
    "card"
  );

  const availableEngines = useMemo(() => getAvailableEngines(), []);
  const availableCategories = useMemo(() => getAvailableCategories(), []);

  // Filter scripts based on active criteria, scope, and sorting
  const filteredScripts = useMemo(() => {
    return filterScripts(allScripts, {
      q: debouncedSearch,
      engines: selectedEngines,
      categories: selectedCategories,
      risks: selectedRisks,
      sort,
      scope,
      favoriteIds: favorites,
      recentIds,
    });
  }, [
    debouncedSearch,
    selectedEngines,
    selectedCategories,
    selectedRisks,
    sort,
    scope,
    favorites,
    recentIds,
  ]);

  // Compute dynamic faceted counts for filter chips
  const facetedCounts = useMemo(() => {
    return calculateFacetedCounts(allScripts, {
      q: debouncedSearch,
      engines: selectedEngines,
      categories: selectedCategories,
      risks: selectedRisks,
    });
  }, [debouncedSearch, selectedEngines, selectedCategories, selectedRisks]);

  // Current script selected for drawer
  const selectedScript = useMemo(() => {
    if (!selectedScriptId) return null;
    return allScripts.find((s) => s.id === selectedScriptId) || null;
  }, [selectedScriptId]);

  // Derived lists for QuickAccessBar
  const favoriteScripts = useMemo(() => {
    return allScripts.filter((s) => favorites.includes(s.id));
  }, [favorites]);

  const recentScripts = useMemo(() => {
    return recentIds
      .map((id) => allScripts.find((s) => s.id === id))
      .filter(Boolean) as ScriptItem[];
  }, [recentIds]);

  // Drawer Prev/Next navigation based on filtered results
  const currentIndex = useMemo(() => {
    if (!selectedScriptId) return -1;
    return filteredScripts.findIndex((s) => s.id === selectedScriptId);
  }, [filteredScripts, selectedScriptId]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < filteredScripts.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      setSelectedScriptId(filteredScripts[currentIndex - 1].id);
    }
  }, [hasPrev, currentIndex, filteredScripts, setSelectedScriptId]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      setSelectedScriptId(filteredScripts[currentIndex + 1].id);
    }
  }, [hasNext, currentIndex, filteredScripts, setSelectedScriptId]);

  const handleSelectTag = useCallback(
    (tag: string) => {
      setSearch(tag);
      setSelectedScriptId(null);
    },
    [setSearch, setSelectedScriptId]
  );

  const handleScopeChange = useCallback(
    (newScope: AccessScope) => {
      setScope(newScope);
      setPage(1);
    },
    [setPage]
  );

  return (
    <div className="space-y-4 pb-16 animate-fade-in-up max-w-7xl mx-auto px-2 sm:px-4">
      {/* Dismissible Info Box Guide Banner */}
      <InfoBanner />

      {/* Main Search Bar */}
      <SearchBar value={search} onChange={setSearch} />

      {/* Engine & Category Multi-Select Filter Chips with Faceted Counts */}
      <FilterChips
        availableEngines={availableEngines}
        selectedEngines={selectedEngines}
        onToggleEngine={toggleEngine}
        onClearEngines={clearEngines}
        availableCategories={availableCategories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        onClearCategories={clearCategories}
        facetedCounts={facetedCounts}
      />

      {/* Controls Bar: Risk Toggles, Sorting, and View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
        <RiskToggle
          selectedRisks={selectedRisks}
          onToggleRisk={toggleRisk}
          facetedCounts={facetedCounts}
        />

        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <label htmlFor="sql-sort-select" className="sr-only">
              {SQL_HELPER_LABELS.sort.label}
            </label>
            <span className="hidden sm:inline font-medium">
              {SQL_HELPER_LABELS.sort.label}:
            </span>
            <select
              id="sql-sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="px-2.5 py-1 bg-background border border-border/80 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
            >
              <option value="relevance">{SQL_HELPER_LABELS.sort.relevance}</option>
              <option value="title">{SQL_HELPER_LABELS.sort.title}</option>
              <option value="risk">{SQL_HELPER_LABELS.sort.risk}</option>
              <option value="category">{SQL_HELPER_LABELS.sort.category}</option>
            </select>
          </div>

          {/* View Mode Toggle (Cards vs Table) */}
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </div>

      {/* Quick Access Bar: All / Favorites / Recent Tabs & Mini Carousel */}
      <QuickAccessBar
        activeScope={scope}
        onScopeChange={handleScopeChange}
        favoriteCount={favorites.length}
        recentCount={recentIds.length}
        favoriteScripts={favoriteScripts}
        recentScripts={recentScripts}
        onSelectScript={(script) => setSelectedScriptId(script.id)}
        onClearRecent={clearRecent}
      />

      {/* Active Filters Tag Bar & Result Counter */}
      <ActiveFilters
        totalResults={filteredScripts.length}
        search={debouncedSearch}
        onClearSearch={() => setSearch("")}
        selectedEngines={selectedEngines}
        onRemoveEngine={toggleEngine}
        selectedCategories={selectedCategories}
        onRemoveCategory={toggleCategory}
        selectedRisks={selectedRisks}
        onRemoveRisk={toggleRisk}
        onResetAll={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Scripts Grid / Table with Pagination */}
      <ScriptList
        scripts={filteredScripts}
        viewMode={viewMode}
        onSelectScript={(script: ScriptItem) => setSelectedScriptId(script.id)}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        onAccessScript={addToRecent}
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        hasQuery={Boolean(debouncedSearch.trim())}
        hasEngineFilter={selectedEngines.length > 0}
        hasCategoryFilter={selectedCategories.length > 0}
        hasRiskFilter={selectedRisks.length > 0}
        onResetFilters={resetFilters}
      />

      {/* Accessible Radix Slide-Over Drawer */}
      <ScriptDrawer
        script={selectedScript}
        isOpen={Boolean(selectedScript)}
        onClose={() => setSelectedScriptId(null)}
        isFavorite={selectedScript ? isFavorite(selectedScript.id) : false}
        onToggleFavorite={() =>
          selectedScript && toggleFavorite(selectedScript.id)
        }
        onSelectTag={handleSelectTag}
        onAccessScript={addToRecent}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
