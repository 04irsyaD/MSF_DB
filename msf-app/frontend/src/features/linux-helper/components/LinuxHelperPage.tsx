"use client";

import { useEffect, useState } from "react";
import { Search, SquareTerminal, X } from "lucide-react";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";
import { useLinuxFilters } from "../hooks/useLinuxFilters";
import LevelStepper from "./LevelStepper";
import EnvDistroFilter from "./EnvDistroFilter";
import Level0View from "./Level0View";
import CommandLevelView from "./CommandLevelView";
import Level3View from "./Level3View";
import CommandPalette from "./CommandPalette";
import type { Level } from "../lib/schema";

export default function LinuxHelperPage() {
  const {
    level,
    setLevel,
    envs,
    toggleEnv,
    distro,
    setDistro,
    search,
    setSearch,
    debouncedSearch,
  } = useLinuxFilters();
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Ctrl/Cmd+K membuka command palette.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function navigateTo(targetLevel: Level, query: string) {
    setLevel(targetLevel);
    setSearch(query);
  }

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <header className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <SquareTerminal className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">{L.header.title}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{L.header.subtitle}</p>
        </div>
      </header>

      <div className="mb-6 flex flex-col gap-4">
        <LevelStepper level={level} onSelect={setLevel} />

        <div className="flex items-center gap-2">
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">{L.search.label}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={L.search.placeholder}
              className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label={L.search.clear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            aria-label={L.palette.open}
            className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:inline-flex"
          >
            <Search className="h-3.5 w-3.5" />
            <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
              {L.palette.hintKey}
            </kbd>
          </button>
        </div>

        <EnvDistroFilter
          envs={envs}
          onToggleEnv={toggleEnv}
          distro={distro}
          onSetDistro={setDistro}
          showDistro={level !== "0"}
        />
      </div>

      {level === "0" && <Level0View envs={envs} distro={distro} search={debouncedSearch} />}

      {(level === "1" || level === "2") && (
        <CommandLevelView level={level} distro={distro} search={debouncedSearch} />
      )}

      {level === "3" && <Level3View distro={distro} search={debouncedSearch} />}

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={navigateTo}
      />
    </div>
  );
}
