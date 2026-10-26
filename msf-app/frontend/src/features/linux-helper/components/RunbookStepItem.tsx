"use client";

import { Check, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { RiskBadge } from "@/features/sql-helper/components/Badges";
import ShellHighlight from "./ShellHighlight";
import RiskBanner from "./RiskBanner";
import { resolvedStepText, interpolate } from "../lib/runbook";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";
import type { RunbookStep, Distro } from "../lib/schema";

interface RunbookStepItemProps {
  step: RunbookStep;
  index: number;
  distro: Distro;
  values: Record<string, string>;
  done: boolean;
  onToggleDone: () => void;
}

export default function RunbookStepItem({
  step,
  index,
  distro,
  values,
  done,
  onToggleDone,
}: RunbookStepItemProps) {
  const commandText = resolvedStepText(step, distro, values);

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        done ? "border-emerald-500/40 bg-emerald-500/5" : "border-border bg-card"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[11px] font-semibold text-muted-foreground">
            {index + 1}
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">{step.title}</p>
            {step.risk !== "low" && (
              <span className="mt-1 inline-block">
                <RiskBadge risk={step.risk} size="sm" />
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleDone}
          aria-pressed={done}
          aria-label={L.runbook.stepDone}
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            done
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          )}
        >
          {done ? <CircleCheck className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
        </button>
      </div>

      {step.risk === "high" && <RiskBanner risk="high" className="mb-3" />}

      <ShellHighlight command={commandText} />

      {step.note && (
        <p className="mt-2 text-xs leading-relaxed text-amber-600 dark:text-amber-400">
          {step.note}
        </p>
      )}

      {step.verify && (
        <div className="mt-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {L.runbook.verifyLabel}
          </p>
          <ShellHighlight command={interpolate(step.verify, values)} />
        </div>
      )}

      {step.commonErrors.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {L.runbook.errorsTitle}
          </p>
          {step.commonErrors.map((ce, i) => (
            <div key={i} className="rounded-lg border border-border bg-muted/40 p-2.5 text-xs">
              <p className="font-mono text-rose-600 dark:text-rose-400">{ce.error}</p>
              <p className="mt-1 text-muted-foreground">
                <span className="font-semibold text-foreground">{L.runbook.fixLabel}:</span>{" "}
                {ce.fix}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
