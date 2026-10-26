"use client";

import { cn } from "@/lib/utils";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";
import type { LinuxParam } from "../lib/schema";

interface RunbookVarsProps {
  params: LinuxParam[];
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

export default function RunbookVars({ params, values, errors, onChange }: RunbookVarsProps) {
  if (params.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">{L.runbook.varsTitle}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{L.runbook.varsHint}</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {params.map((p) => {
          const error = errors[p.key];
          const inputId = `rbvar-${p.key}`;
          return (
            <div key={p.key} className="flex flex-col gap-1">
              <label htmlFor={inputId} className="text-xs font-medium text-foreground">
                {p.label}
                {p.required && <span className="ml-0.5 text-rose-500">*</span>}
                <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
                  {p.type}
                </span>
              </label>
              <input
                id={inputId}
                type={p.type === "number" || p.type === "port" ? "number" : "text"}
                value={values[p.key] ?? ""}
                onChange={(e) => onChange(p.key, e.target.value)}
                placeholder={p.default || `{{${p.key}}}`}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${inputId}-err` : undefined}
                className={cn(
                  "rounded-lg border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground focus:outline-none focus-visible:ring-2",
                  error
                    ? "border-rose-500/60 focus-visible:ring-rose-500"
                    : "border-border focus-visible:ring-accent"
                )}
              />
              {error ? (
                <p id={`${inputId}-err`} className="text-[11px] text-rose-600 dark:text-rose-400">
                  {error}
                </p>
              ) : (
                p.hint && <p className="text-[11px] text-muted-foreground">{p.hint}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
