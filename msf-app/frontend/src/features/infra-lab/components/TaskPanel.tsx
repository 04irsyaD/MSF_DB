"use client";

import type { ReactNode } from "react";
import { Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tone } from "../lib/types";
import { BTN, CARD } from "../lib/ui";
import Note from "./Note";

export interface TaskMessage {
  tone: Tone;
  body: ReactNode;
}

interface TaskPanelProps {
  steps: string[];
  done: boolean[];
  onReset: () => void;
  msg: TaskMessage | null;
  /** Teks status sebelum ada pesan. */
  idle: ReactNode;
  /** Isi tambahan di kartu status (mis. progres rebuild). */
  extra?: ReactNode;
}

/** Dua kartu simulasi: daftar langkah dengan progres + status/pesan terakhir. */
export default function TaskPanel({
  steps,
  done,
  onReset,
  msg,
  idle,
  extra,
}: TaskPanelProps) {
  const doneCount = done.filter(Boolean).length;

  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
      <div className={cn(CARD, "flex flex-col gap-3")}>
        <div className="flex items-baseline justify-between">
          <h3 className="text-[15px] font-semibold text-foreground">
            Langkah tugas
          </h3>
          <span className="font-mono text-[11px] text-muted-foreground">
            {doneCount} / {steps.length}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Progres langkah tugas"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={doneCount}
          className="h-1.5 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full bg-emerald-500 transition-[width]"
            style={{ width: `${(doneCount / steps.length) * 100}%` }}
          />
        </div>
        <ol className="flex flex-col gap-2">
          {steps.map((t, i) => (
            <li key={t} className="flex items-center gap-2.5 text-sm">
              {done[i] ? (
                <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
                  <span className="sr-only">Selesai:</span>
                </span>
              ) : (
                <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-border font-mono text-[11px] font-semibold text-muted-foreground">
                  {i + 1}
                </span>
              )}
              <span
                className={
                  done[i] ? "text-muted-foreground" : "text-foreground"
                }
              >
                {t}
              </span>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={onReset}
          className={cn(BTN, "self-start")}
        >
          <RotateCcw aria-hidden className="h-4 w-4" />
          Ulangi simulasi
        </button>
      </div>

      <div aria-live="polite" className={cn(CARD, "flex flex-col gap-3")}>
        <h3 className="text-[15px] font-semibold text-foreground">Status</h3>
        {msg ? (
          <Note tone={msg.tone}>{msg.body}</Note>
        ) : (
          <p className="text-sm text-muted-foreground">{idle}</p>
        )}
        {extra}
      </div>
    </div>
  );
}
