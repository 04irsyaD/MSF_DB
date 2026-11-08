"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CARD, FOCUS_RING, LABEL } from "../lib/ui";

export interface Concept {
  id: string;
  title: string;
  summary: string;
  detail: string;
  points?: string[];
  /** Contoh perintah/prompt, ditampilkan monospace. */
  example?: string;
}

/** Daftar konsep di kiri, penjelasan konsep terpilih di kanan (bertumpuk di HP). */
export default function ConceptExplorer({
  items,
  label,
}: {
  items: Concept[];
  label: string;
}) {
  const [selectedId, setSelectedId] = useState(items[0].id);
  const c = items.find((i) => i.id === selectedId) ?? items[0];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
      <div role="group" aria-label={label} className="flex flex-col gap-2">
        {items.map((it, i) => {
          const on = it.id === selectedId;
          return (
            <button
              key={it.id}
              type="button"
              aria-pressed={on}
              onClick={() => setSelectedId(it.id)}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                FOCUS_RING,
                on
                  ? "border-accent bg-accent/10"
                  : "border-border bg-card hover:border-accent/50",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold",
                  on
                    ? "bg-accent text-white"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">
                  {it.title}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                  {it.summary}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <article
        aria-live="polite"
        className={cn(
          CARD,
          "flex flex-col gap-3 md:sticky md:top-20 md:self-start",
        )}
      >
        <h3 className="text-base font-semibold text-foreground">{c.title}</h3>
        <p className="text-sm leading-relaxed text-foreground">{c.detail}</p>
        {c.points && c.points.length > 0 && (
          <div>
            <p className={cn(LABEL, "mb-1.5")}>Yang perlu diingat</p>
            <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground">
              {c.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        )}
        {c.example && (
          <div>
            <p className={cn(LABEL, "mb-1.5")}>Contoh</p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-slate-950 px-3 py-2.5 font-mono text-xs text-slate-100">
              {c.example}
            </pre>
          </div>
        )}
      </article>
    </div>
  );
}
