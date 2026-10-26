"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/features/sql-helper/hooks/useLocalStorage";
import RunbookVars from "./RunbookVars";
import RunbookStepItem from "./RunbookStepItem";
import { defaultParamValues } from "../lib/runbook";
import { validateAllParams } from "../lib/validateParam";
import { buildShellScript, downloadShellScript } from "../lib/exportScript";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";
import type { Runbook, Distro } from "../lib/schema";

interface RunbookViewProps {
  runbook: Runbook;
  distro: Distro;
  onBack: () => void;
}

export default function RunbookView({ runbook, distro, onBack }: RunbookViewProps) {
  const [values, setValues] = useLocalStorage<Record<string, string>>(
    `msfdb:linuxhelper:v1:runbook:${runbook.id}`,
    defaultParamValues(runbook.vars)
  );
  const [doneSteps, setDoneSteps] = useState<string[]>([]);

  const errors = useMemo(() => validateAllParams(runbook.vars, values), [runbook.vars, values]);
  const exportDisabled = Object.keys(errors).length > 0;

  // Hanya nilai yang lolos validasi yang boleh di-interpolasi ke command yang
  // ditampilkan/disalin/diekspor. Nilai invalid dibiarkan sebagai {{placeholder}}
  // supaya tidak pernah menghasilkan command berbahaya.
  const safeValues = useMemo(() => {
    const out: Record<string, string> = {};
    for (const [key, val] of Object.entries(values)) {
      if (!errors[key]) out[key] = val;
    }
    return out;
  }, [values, errors]);

  const doneCount = runbook.steps.reduce((n, s) => (doneSteps.includes(s.id) ? n + 1 : n), 0);
  const progressPct = Math.round((doneCount / runbook.steps.length) * 100);

  function toggleStep(id: string) {
    setDoneSteps((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleExport() {
    if (exportDisabled) {
      toast.error(L.runbook.exportBlocked);
      return;
    }
    const script = buildShellScript(runbook, distro, safeValues);
    downloadShellScript(`${runbook.id}-${distro}.sh`, script);
    toast.success(`${runbook.id}-${distro}.sh`);
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground focus:outline-none focus-visible:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {L.runbook.back}
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">{runbook.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{runbook.description}</p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={exportDisabled}
          title={exportDisabled ? L.runbook.exportBlocked : undefined}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            exportDisabled
              ? "cursor-not-allowed border-border bg-card text-muted-foreground/50"
              : "border-accent/20 bg-accent/10 text-accent hover:bg-accent hover:text-white"
          )}
        >
          <Download className="h-3.5 w-3.5" />
          {L.runbook.export}
        </button>
      </div>

      <RunbookVars
        params={runbook.vars}
        values={values}
        errors={errors}
        onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
      />

      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold uppercase tracking-wide">{L.runbook.stepsTitle}</span>
          <span>
            {doneCount}/{runbook.steps.length} {L.runbook.progressSuffix}
          </span>
        </div>
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="space-y-3">
          {runbook.steps.map((step, i) => (
            <RunbookStepItem
              key={step.id}
              step={step}
              index={i}
              distro={distro}
              values={safeValues}
              done={doneSteps.includes(step.id)}
              onToggleDone={() => toggleStep(step.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
