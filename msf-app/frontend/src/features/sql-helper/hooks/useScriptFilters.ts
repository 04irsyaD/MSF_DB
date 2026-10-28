"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useDebouncedValue } from "./useDebouncedValue";
import { useLocalStorage } from "./useLocalStorage";
import { RiskLevelType } from "../lib/schema";
import { SortKey } from "../lib/filter";

const PAGE_SIZE_KEY = "msfdb:sqlhelper:v1:pageSize";

export interface ScriptFiltersState {
  search: string;
  setSearch: (val: string) => void;
  debouncedSearch: string;
  selectedEngines: string[];
  toggleEngine: (engine: string) => void;
  clearEngines: () => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  clearCategories: () => void;
  selectedRisks: RiskLevelType[];
  toggleRisk: (risk: RiskLevelType) => void;
  clearRisks: () => void;
  sort: SortKey;
  setSort: (sort: SortKey) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: 10 | 20 | 50;
  setPageSize: (size: 10 | 20 | 50) => void;
  selectedScriptId: string | null;
  setSelectedScriptId: (id: string | null) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export function useScriptFilters(): ScriptFiltersState {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse initial state from URL query
  const initialQ = searchParams.get("q") || "";
  const initialEngines = useMemo(() => {
    const raw = searchParams.get("engine");
    return raw ? raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) : [];
  }, [searchParams]);

  const initialCategories = useMemo(() => {
    const raw = searchParams.get("cat");
    return raw ? raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) : [];
  }, [searchParams]);

  const initialRisks = useMemo(() => {
    const raw = searchParams.get("risk");
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s): s is RiskLevelType => ["low", "medium", "high"].includes(s));
  }, [searchParams]);

  const initialSort = (searchParams.get("sort") as SortKey) || "relevance";
  const initialPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const initialScript = searchParams.get("script") || null;

  const [search, setSearchState] = useState(initialQ);
  const debouncedSearch = useDebouncedValue(search, 200);

  const [selectedEngines, setSelectedEngines] = useState<string[]>(initialEngines);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [selectedRisks, setSelectedRisks] = useState<RiskLevelType[]>(initialRisks);
  const [sort, setSortState] = useState<SortKey>(initialSort);
  const [page, setPageState] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useLocalStorage<10 | 20 | 50>(PAGE_SIZE_KEY, 10);
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(initialScript);

  const prevScriptRef = useRef<string | null>(initialScript);

  // Sync state to URL search parameters
  const syncToUrl = useCallback(
    (params: {
      q: string;
      engines: string[];
      cats: string[];
      risks: RiskLevelType[];
      sort: SortKey;
      page: number;
      script: string | null;
    }) => {
      const sp = new URLSearchParams();

      if (params.q.trim()) sp.set("q", params.q.trim());
      if (params.engines.length > 0) sp.set("engine", params.engines.join(","));
      if (params.cats.length > 0) sp.set("cat", params.cats.join(","));
      if (params.risks.length > 0) sp.set("risk", params.risks.join(","));
      if (params.sort !== "relevance") sp.set("sort", params.sort);
      if (params.page > 1) sp.set("page", params.page.toString());
      if (params.script) sp.set("script", params.script);

      const qs = sp.toString();
      const target = qs ? `${pathname}?${qs}` : pathname;

      // SPEC §4.2: router.push for opening drawer; router.replace for filters
      const isOpeningDrawer = !prevScriptRef.current && Boolean(params.script);
      prevScriptRef.current = params.script;

      if (isOpeningDrawer) {
        router.push(target, { scroll: false });
      } else {
        router.replace(target, { scroll: false });
      }
    },
    [pathname, router]
  );

  useEffect(() => {
    syncToUrl({
      q: debouncedSearch,
      engines: selectedEngines,
      cats: selectedCategories,
      risks: selectedRisks,
      sort,
      page,
      script: selectedScriptId,
    });
  }, [
    debouncedSearch,
    selectedEngines,
    selectedCategories,
    selectedRisks,
    sort,
    page,
    selectedScriptId,
    syncToUrl,
  ]);

  // Sync state when browser Back / Forward updates query params
  const scriptFromUrl = searchParams.get("script") || null;
  useEffect(() => {
    setSelectedScriptId((curr) => {
      if (curr !== scriptFromUrl) {
        prevScriptRef.current = scriptFromUrl;
        return scriptFromUrl;
      }
      return curr;
    });
  }, [scriptFromUrl]);

  // Handler helpers that reset page to 1 on filter changes
  const setSearch = useCallback((val: string) => {
    setSearchState(val);
    setPageState(1);
  }, []);

  const toggleEngine = useCallback((eng: string) => {
    const key = eng.toLowerCase().trim();
    setSelectedEngines((prev) =>
      prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key]
    );
    setPageState(1);
  }, []);

  const clearEngines = useCallback(() => {
    setSelectedEngines([]);
    setPageState(1);
  }, []);

  const toggleCategory = useCallback((cat: string) => {
    const key = cat.toLowerCase().trim();
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
    setPageState(1);
  }, []);

  const clearCategories = useCallback(() => {
    setSelectedCategories([]);
    setPageState(1);
  }, []);

  const toggleRisk = useCallback((risk: RiskLevelType) => {
    setSelectedRisks((prev) =>
      prev.includes(risk) ? prev.filter((r) => r !== risk) : [...prev, risk]
    );
    setPageState(1);
  }, []);

  const clearRisks = useCallback(() => {
    setSelectedRisks([]);
    setPageState(1);
  }, []);

  const setSort = useCallback((newSort: SortKey) => {
    setSortState(newSort);
    setPageState(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchState("");
    setSelectedEngines([]);
    setSelectedCategories([]);
    setSelectedRisks([]);
    setSortState("relevance");
    setPageState(1);
    setSelectedScriptId(null);
  }, []);

  const hasActiveFilters = Boolean(
    search.trim() ||
      selectedEngines.length > 0 ||
      selectedCategories.length > 0 ||
      selectedRisks.length > 0 ||
      sort !== "relevance"
  );

  const safePageSize: 10 | 20 | 50 =
    pageSize === 20 || pageSize === 50 ? pageSize : 10;

  return {
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
    setPage: setPageState,
    pageSize: safePageSize,
    setPageSize: (size: 10 | 20 | 50) => {
      setPageSize(size);
      setPageState(1);
    },
    selectedScriptId,
    setSelectedScriptId,
    resetFilters,
    hasActiveFilters,
  };
}
