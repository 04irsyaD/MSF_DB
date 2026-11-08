"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LabSection } from "../lib/types";
import { FOCUS_RING } from "../lib/ui";

interface LabStepperProps {
  sections: readonly LabSection[];
  current: number;
  visited: number[];
  onSelect: (index: number) => void;
}

/**
 * Navigasi antar bagian. Desktop: tombol berlabel seperti LevelStepper Linux Helper.
 * HP: kotak nomor sebaris + nama bagian aktif, supaya tidak ada scroll horizontal di 375px.
 */
export default function LabStepper({
  sections,
  current,
  visited,
  onSelect,
}: LabStepperProps) {
  const isDone = (i: number) => i !== current && visited.includes(i);

  return (
    <nav aria-label="Bagian materi">
      <div className="hidden flex-wrap gap-2 sm:flex">
        {sections.map((s, i) => {
          const active = i === current;
          return (
            <button
              key={s.title}
              type="button"
              onClick={() => onSelect(i)}
              aria-current={active ? "step" : undefined}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                FOCUS_RING,
                active
                  ? "border-accent bg-accent text-white"
                  : isDone(i)
                    ? "border-emerald-500/40 bg-card text-foreground hover:border-accent"
                    : "border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-foreground",
              )}
            >
              {isDone(i) ? (
                <Check
                  aria-hidden
                  className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
                  strokeWidth={2.5}
                />
              ) : (
                <span className="font-mono opacity-70">{i + 1}</span>
              )}
              {s.title}
              {isDone(i) && <span className="sr-only">(sudah dibuka)</span>}
            </button>
          );
        })}
      </div>

      <div className="sm:hidden">
        <div
          className="grid gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${sections.length}, minmax(0, 1fr))`,
          }}
        >
          {sections.map((s, i) => {
            const active = i === current;
            return (
              <button
                key={s.title}
                type="button"
                onClick={() => onSelect(i)}
                aria-current={active ? "step" : undefined}
                aria-label={`${i + 1}. ${s.title}${isDone(i) ? " (sudah dibuka)" : ""}`}
                className={cn(
                  "flex h-11 items-center justify-center rounded-lg border font-mono text-sm font-semibold transition-colors",
                  FOCUS_RING,
                  active
                    ? "border-accent bg-accent text-white"
                    : isDone(i)
                      ? "border-emerald-500/40 bg-card"
                      : "border-border bg-card text-muted-foreground",
                )}
              >
                {isDone(i) ? (
                  <Check
                    aria-hidden
                    className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                    strokeWidth={2.5}
                  />
                ) : (
                  i + 1
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-sm">
          <span className="font-mono text-[11px] text-muted-foreground">
            Bagian {current + 1} dari {sections.length} ·{" "}
          </span>
          <span className="font-semibold text-foreground">
            {sections[current]?.title}
          </span>
        </p>
      </div>
    </nav>
  );
}
