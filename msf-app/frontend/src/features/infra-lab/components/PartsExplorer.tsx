"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CARD, FOCUS_RING, LABEL, chipClass } from "../lib/ui";
import Note from "./Note";

export interface DevicePart {
  view: string;
  name: string;
  /** Fungsinya */
  what: string;
  /** Cara pakai */
  how: string[];
  /** Perhatikan */
  caution: string;
}

export interface PartView<Id extends string> {
  id: string;
  label: string;
  defaultPart: Id;
}

interface PartsExplorerProps<Id extends string> {
  parts: Record<Id, DevicePart>;
  /** NoInfer: tipe Id diambil dari `parts`, bukan dari defaultPart. */
  views: PartView<NoInfer<Id>>[];
  /** Nama grup toggle tampak, mis. "Sisi server". */
  viewGroupLabel: string;
  listLabel: string;
  renderSvg: (
    view: string,
    selected: NoInfer<Id>,
    pick: (id: NoInfer<Id>) => void,
  ) => ReactNode;
}

/**
 * Gambar perangkat yang bisa diklik + daftar chip + panel info (fungsi, cara pakai, perhatikan).
 * Dipakai bagian "Bagian perangkat" di semua modul.
 */
export default function PartsExplorer<Id extends string>({
  parts,
  views,
  viewGroupLabel,
  listLabel,
  renderSvg,
}: PartsExplorerProps<Id>) {
  const [view, setView] = useState(views[0].id);
  const [selected, setSelected] = useState<Id>(views[0].defaultPart);
  const part = parts[selected];
  const ids = Object.keys(parts) as Id[];

  function pick(id: Id) {
    setSelected(id);
    setView(parts[id].view);
  }

  function switchView(v: PartView<Id>) {
    setView(v.id);
    setSelected(v.defaultPart);
  }

  return (
    <>
      <div className={cn(CARD, "flex flex-col gap-3.5")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {views.length > 1 ? (
            <div
              role="group"
              aria-label={viewGroupLabel}
              className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5"
            >
              {views.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={view === v.id}
                  onClick={() => switchView(v)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                    FOCUS_RING,
                    view === v.id
                      ? "bg-background font-semibold text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">
            Bisa juga pakai Tab lalu Enter
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-2 sm:p-3">
          {renderSvg(view, selected, pick)}
        </div>

        <div
          role="group"
          aria-label={listLabel}
          className="flex flex-wrap gap-2"
        >
          {ids
            .filter((id) => parts[id].view === view)
            .map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={id === selected}
                onClick={() => pick(id)}
                className={chipClass(id === selected)}
              >
                {parts[id].name}
              </button>
            ))}
        </div>
      </div>

      <article aria-live="polite" className={cn(CARD, "flex flex-col gap-4")}>
        <h3 className="text-base font-semibold text-foreground">{part.name}</h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <p className={cn(LABEL, "mb-1.5")}>Fungsinya</p>
            <p className="text-sm leading-relaxed text-foreground">
              {part.what}
            </p>
          </div>
          <div>
            <p className={cn(LABEL, "mb-1.5")}>Cara pakai</p>
            <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground">
              {part.how.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
        <Note tone="warn" title="Perhatikan:">
          {part.caution}
        </Note>
      </article>
    </>
  );
}
