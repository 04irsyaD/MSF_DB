"use client";

import { cn } from "@/lib/utils";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";
import type { Level } from "../lib/schema";

const LEVELS: Level[] = ["0", "1", "2", "3"];

interface LevelStepperProps {
  level: Level;
  onSelect: (level: Level) => void;
}

/** Stepper 4 level sebagai navigasi utama konten. */
export default function LevelStepper({ level, onSelect }: LevelStepperProps) {
  return (
    <nav aria-label="Pilih level" className="flex flex-wrap gap-2">
      {LEVELS.map((lv) => {
        const active = lv === level;
        return (
          <button
            key={lv}
            type="button"
            onClick={() => onSelect(lv)}
            aria-current={active ? "step" : undefined}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              active
                ? "border-accent bg-accent text-white"
                : "border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-foreground"
            )}
          >
            <span className="mr-1.5 font-mono opacity-70">L{lv}</span>
            {L.levels[lv].name}
          </button>
        );
      })}
    </nav>
  );
}
