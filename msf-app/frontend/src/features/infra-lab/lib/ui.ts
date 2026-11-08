import { cn } from "@/lib/utils";
import type { CommandRisk, TermLine, Tone } from "./types";

/**
 * Kelas Tailwind bersama Infra Lab. Mengikuti pola halaman Linux Helper / SQL Helper
 * (token border, card, muted, accent) supaya tidak ada warna baru.
 */

export const FOCUS_RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const CARD =
  "rounded-xl border border-border bg-card p-4 shadow-card sm:p-5";

export const LABEL =
  "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

export const BTN = cn(
  "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:border-accent/50 disabled:cursor-not-allowed disabled:opacity-50",
  FOCUS_RING,
);

export const BTN_PRIMARY = cn(
  "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-accent bg-accent px-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50",
  FOCUS_RING,
);

export const INPUT = cn(
  "rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground",
  FOCUS_RING,
);

export function chipClass(selected: boolean) {
  return cn(
    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
    FOCUS_RING,
    selected
      ? "border-accent bg-accent/10 text-accent"
      : "border-border bg-card text-muted-foreground hover:text-foreground",
  );
}

/** Kotak lembut berwarna (badge, banner, pill). */
export const TONE_SOFT: Record<Tone, string> = {
  ok: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  warn: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  bad: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  info: "border-border bg-muted text-foreground",
};

export const TONE_DOT: Record<Tone, string> = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  bad: "bg-rose-500",
  info: "bg-muted-foreground",
};

export const RISK_TONE: Record<CommandRisk, Tone> = {
  safe: "ok",
  caution: "warn",
  danger: "bad",
};

export const RISK_LABEL: Record<CommandRisk, string> = {
  safe: "Aman",
  caution: "Butuh MOP",
  danger: "Berbahaya",
};

export const RISK_BADGE: Record<CommandRisk, string> = {
  safe: "Aman · read-only",
  caution: "Butuh MOP",
  danger: "Berbahaya",
};

/** Warna teks di layar perangkat (selalu gelap, jadi sama di light dan dark). */
export const TERM_LINE: Record<TermLine["tone"], string> = {
  plain: "text-slate-300",
  dim: "text-slate-500",
  ok: "text-emerald-300",
  warn: "text-amber-300",
  err: "text-rose-300",
};
