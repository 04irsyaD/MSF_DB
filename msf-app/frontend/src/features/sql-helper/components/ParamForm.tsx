"use client";

import React from "react";
import { RotateCcw, AlertCircle, Sparkles, SlidersHorizontal } from "lucide-react";
import { ScriptParam } from "../lib/schema";
import { SQL_HELPER_LABELS } from "../lib/labels";

interface ParamFormProps {
  params: ScriptParam[];
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
}

export function ParamForm({
  params,
  values,
  errors,
  onChange,
  onReset,
}: ParamFormProps) {
  if (!params || params.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-primary/10 text-primary">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground font-mono flex items-center gap-1.5">
              <span>{SQL_HELPER_LABELS.params.heading}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-primary/10 text-primary font-medium">
                {params.length}
              </span>
            </h4>
            <p className="text-[11px] text-muted-foreground">
              {SQL_HELPER_LABELS.params.subheading}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60 transition-colors shadow-2xs"
          title={SQL_HELPER_LABELS.params.resetParams}
        >
          <RotateCcw className="w-3 h-3" />
          <span>{SQL_HELPER_LABELS.params.resetParams}</span>
        </button>
      </div>

      {/* Input Fields */}
      <div className="space-y-3.5">
        {params.map((param) => {
          const val = values[param.key] !== undefined ? values[param.key] : param.default || "";
          const error = errors[param.key];
          const inputId = `sql-param-${param.key}`;

          return (
            <div key={param.key} className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor={inputId}
                  className="text-xs font-medium text-foreground/90 flex items-center gap-1"
                >
                  <span className="font-mono text-primary font-semibold">{param.key}</span>
                  {param.label && param.label !== param.key && (
                    <span className="text-muted-foreground text-[11px]">
                      ({param.label})
                    </span>
                  )}
                  {param.required && (
                    <span className="text-rose-500 font-bold" title="Required">
                      *
                    </span>
                  )}
                </label>

                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground border border-border/60">
                    {param.type}
                  </span>
                  {param.required ? (
                    <span className="text-[10px] font-medium text-rose-600 dark:text-rose-400">
                      {SQL_HELPER_LABELS.params.requiredBadge}
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      {SQL_HELPER_LABELS.params.optionalBadge}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative">
                <input
                  id={inputId}
                  type="text"
                  value={val}
                  onChange={(e) => onChange(param.key, e.target.value)}
                  placeholder={param.default || param.hint || `Enter ${param.key}...`}
                  className={`w-full px-3 py-1.5 rounded-lg text-xs font-mono bg-background border transition-colors focus:outline-none focus:ring-1 ${
                    error
                      ? "border-rose-500 text-rose-900 dark:text-rose-100 focus:ring-rose-500"
                      : "border-border/80 focus:border-primary focus:ring-primary/30"
                  }`}
                  spellCheck="false"
                />
              </div>

              {/* Hint text */}
              {param.hint && !error && (
                <p className="text-[11px] text-muted-foreground/80 leading-normal pl-0.5">
                  {param.hint}
                </p>
              )}

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 pl-0.5">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Generator Disclaimer Callout */}
      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-background/60 border border-border/60 text-[11px] text-muted-foreground leading-relaxed">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        <span>{SQL_HELPER_LABELS.params.disclaimer}</span>
      </div>
    </div>
  );
}
