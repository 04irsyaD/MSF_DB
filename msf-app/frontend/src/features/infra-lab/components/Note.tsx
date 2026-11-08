import type { ReactNode } from "react";
import { CircleCheck, Info, OctagonAlert, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tone } from "../lib/types";

const STYLES: Record<
  Tone,
  { box: string; icon: string; title: string; Icon: typeof Info }
> = {
  ok: {
    box: "border-emerald-500/30 bg-emerald-500/10",
    icon: "text-emerald-600 dark:text-emerald-400",
    title: "text-emerald-700 dark:text-emerald-300",
    Icon: CircleCheck,
  },
  warn: {
    box: "border-amber-500/30 bg-amber-500/10",
    icon: "text-amber-600 dark:text-amber-400",
    title: "text-amber-700 dark:text-amber-300",
    Icon: TriangleAlert,
  },
  bad: {
    box: "border-rose-500/40 bg-rose-500/10",
    icon: "text-rose-600 dark:text-rose-400",
    title: "text-rose-700 dark:text-rose-300",
    Icon: OctagonAlert,
  },
  info: {
    box: "border-accent/20 bg-accent/5",
    icon: "text-accent",
    title: "text-foreground",
    Icon: Info,
  },
};

interface NoteProps {
  tone?: Tone;
  /** Judul tebal di depan isi, mis. "Perhatikan:". */
  title?: string;
  children: ReactNode;
  className?: string;
}

/** Banner catatan dengan warna status. Pola sama dengan RiskBanner di Linux Helper. */
export default function Note({
  tone = "info",
  title,
  children,
  className,
}: NoteProps) {
  const s = STYLES[tone];
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-3.5 text-sm leading-relaxed text-foreground",
        s.box,
        className,
      )}
    >
      <s.Icon aria-hidden className={cn("mt-0.5 h-4 w-4 shrink-0", s.icon)} />
      <div className="min-w-0 space-y-1">
        {title && <p className={cn("font-semibold", s.title)}>{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}
