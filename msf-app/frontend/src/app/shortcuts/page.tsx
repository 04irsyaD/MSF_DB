"use client";

import { useState } from "react";
import useSWR from "swr";
import { api, swrFetcher } from "@/lib/api";
import { ShortcutsResponse } from "@/lib/types";
import ShortcutFilter from "@/components/shortcuts/ShortcutFilter";
import ShortcutCard from "@/components/shortcuts/ShortcutCard";
import { Terminal, AlertCircle, RefreshCw, Loader2 } from "lucide-react";

export default function ShortcutsPage() {
  const [filters, setFilters] = useState({
    q: "",
    engine: "",
    category: "",
    risk_level: "",
  });

  // Fetch engine and categories list
  const { data: enginesData } = useSWR("/api/shortcuts/engines", swrFetcher);
  const { data: categoriesData } = useSWR("/api/shortcuts/categories", swrFetcher);

  // Fetch shortcuts with filter query parameters
  const queryParams = new URLSearchParams();
  if (filters.q) queryParams.set("q", filters.q);
  if (filters.engine) queryParams.set("engine", filters.engine);
  if (filters.category) queryParams.set("category", filters.category);
  if (filters.risk_level) queryParams.set("risk_level", filters.risk_level);

  const { data: shortcutsData, error, isLoading, mutate } = useSWR<ShortcutsResponse>(
    `/api/shortcuts?${queryParams.toString()}`,
    () =>
      api.listShortcuts({
        q: filters.q,
        engine: filters.engine,
        category: filters.category,
        risk_level: filters.risk_level,
        limit: 100,
      }),
    { revalidateOnFocus: false }
  );

  const engines = enginesData?.engines || [];
  const categories = categoriesData?.categories || [];
  const shortcuts = shortcutsData?.items || [];
  const total = shortcutsData?.total || 0;

  return (
    <div className="space-y-6">
      {/* Intro info bar */}
      <div className="p-4 bg-card border border-border rounded-[4px] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Terminal className="h-5 w-5 text-accent mt-0.5 shrink-0 animate-pulse" />
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
              DIAGNOSTIC & ADMINISTRATION SCRIPTS
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
              Use these pre-written queries to inspect tables size, detect index bloat, view active locks, and optimize database settings directly.
            </p>
          </div>
        </div>

        <div className="text-[11px] font-bold text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-[4px] border border-border shrink-0 self-start md:self-auto font-mono">
          TOTAL: {total} SCRIPTS
        </div>
      </div>

      {/* Filter Component */}
      <ShortcutFilter
        engines={engines}
        categories={categories}
        onFilterChange={setFilters}
      />

      {/* List (Table/List Hybrid) */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 border border-border bg-[#0d1117]/30 rounded-[4px] animate-pulse flex items-center justify-between p-4"
            >
              <div className="space-y-2 flex-1">
                <div className="h-3.5 w-16 bg-secondary/50 rounded-[2px]" />
                <div className="h-4 w-1/3 bg-secondary/40 rounded-[2px]" />
              </div>
              <div className="h-6 w-20 bg-secondary/30 rounded-[2px]" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-10 border border-red-500/30 bg-red-500/5 rounded-[4px] flex flex-col items-center text-center gap-3">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">GAGAL MEMUAT SCRIPT</h4>
          <p className="text-xs text-muted-foreground max-w-sm">
            Terjadi masalah saat mengambil data SQL shortcuts dari server backend.
          </p>
          <button
            onClick={() => mutate()}
            className="px-4 py-2 bg-secondary rounded-[4px] text-xs font-mono font-bold hover:bg-secondary/80 border border-border hover:border-accent/40 flex items-center gap-2 text-white transition-colors duration-150"
          >
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            COBA LAGI
          </button>
        </div>
      ) : shortcuts.length === 0 ? (
        <div className="p-16 border border-border bg-[#0d1117] rounded-[4px] flex flex-col items-center text-center gap-3">
          <Terminal className="h-10 w-10 text-muted-foreground/50" />
          <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">TIDAK ADA SCRIPT DITEMUKAN</h4>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed font-mono">
            Tidak ada script yang cocok dengan filter atau kata kunci pencarian Anda. Coba reset filter.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {shortcuts.map((shortcut) => (
            <ShortcutCard key={shortcut.id} shortcut={shortcut} />
          ))}
        </div>
      )}
    </div>
  );
}
