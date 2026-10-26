"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BookText } from "lucide-react";
import { allRunbooks } from "../data";
import RunbookView from "./RunbookView";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";
import type { Distro } from "../lib/schema";

interface Level3ViewProps {
  distro: Distro;
  search: string;
}

export default function Level3View({ distro, search }: Level3ViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const q = search.trim().toLowerCase();

  const runbooks = useMemo(
    () =>
      allRunbooks.filter((r) =>
        !q ? true : `${r.title} ${r.description}`.toLowerCase().includes(q)
      ),
    [q]
  );

  const selected = useMemo(
    () => allRunbooks.find((r) => r.id === selectedId) ?? null,
    [selectedId]
  );

  if (selected) {
    return (
      <RunbookView
        key={selected.id}
        runbook={selected}
        distro={distro}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  if (runbooks.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">{L.empty.filtered}</p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {runbooks.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => setSelectedId(r.id)}
          className="group flex flex-col items-start rounded-xl border border-border/80 bg-card p-4 text-left shadow-xs transition-all hover:border-accent/50 hover:shadow-md motion-safe:hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <BookText className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-foreground group-hover:text-accent">
            {r.title}
          </p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {r.description}
          </p>
          <div className="mt-3 flex w-full items-center justify-between border-t border-border/60 pt-3">
            <span className="text-xs text-muted-foreground">
              {r.steps.length} {L.runbook.stepCount}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-accent">
              {L.runbook.open}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
