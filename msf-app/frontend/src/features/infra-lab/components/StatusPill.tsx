import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Tone } from "../lib/types";
import { TONE_DOT, TONE_SOFT } from "../lib/ui";

export function StatusDot({
  tone,
  className,
}: {
  tone: Tone;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-2 w-2 shrink-0 rounded-full",
        TONE_DOT[tone],
        className,
      )}
    />
  );
}

/** Pill status bulat dengan titik warna: Online, Degraded, Failed, dst. */
export function StatusPill({
  tone,
  children,
  className,
}: {
  tone: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-semibold",
        TONE_SOFT[tone],
        className,
      )}
    >
      <StatusDot tone={tone} />
      {children}
    </span>
  );
}

/** Badge mono huruf besar, pola sama dengan RiskBadge di SQL Helper. */
export function TagBadge({
  tone,
  children,
  className,
}: {
  tone: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider",
        TONE_SOFT[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
