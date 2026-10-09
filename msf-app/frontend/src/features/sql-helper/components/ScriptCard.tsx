"use client";

import React, { useState, useMemo } from "react";
import { Star, Copy, Check, ArrowRight, SlidersHorizontal } from "lucide-react";
import { ScriptItem } from "../lib/schema";
import { RiskBadge, EngineBadge, CategoryBadge } from "./Badges";
import { copyScriptWithToast } from "../lib/clipboard";
import {
  interpolateSql,
  getDefaultParamValues,
  getParamStorageKey,
} from "../lib/interpolate";
import { toast } from "sonner";
import { SQL_HELPER_LABELS } from "../lib/labels";

interface ScriptCardProps {
  script: ScriptItem;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAccessScript?: (id: string) => void;
  className?: string;
}

export function ScriptCard({
  script,
  onSelect,
  isFavorite,
  onToggleFavorite,
  onAccessScript,
  className = "",
}: ScriptCardProps) {
  const [copied, setCopied] = useState(false);

  const hasParams = Boolean(script.params && script.params.length > 0);

  // Take first 3 lines of SQL for the preview
  const sqlPreview = useMemo(() => {
    const lines = script.sql.trim().split("\n");
    return lines.slice(0, 3).join("\n");
  }, [script.sql]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (hasParams && script.params) {
      const defaults = getDefaultParamValues(script.params);
      let values = defaults;
      try {
        const stored = window.localStorage.getItem(getParamStorageKey(script.id));
        if (stored) values = { ...defaults, ...JSON.parse(stored) };
      } catch {
        // Fallback to defaults
      }

      const res = interpolateSql(script.sql, script.params, values);
      if (!res.isValid) {
        toast.info(SQL_HELPER_LABELS.params.fillRequiredWarning);
        onSelect();
        return;
      }

      const success = await copyScriptWithToast(res.interpolatedSql);
      if (success) {
        onAccessScript?.(script.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      return;
    }

    const success = await copyScriptWithToast(script.sql);
    if (success) {
      onAccessScript?.(script.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col justify-between p-4 rounded-xl border border-border/80 bg-card hover:bg-card/95 hover:border-primary/50 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md motion-safe:hover:-translate-y-0.5 ${className}`}
    >
      <div className="space-y-3">
        {/* Top Badges & Favorite Row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <EngineBadge engine={script.engine} minVersion={script.minVersion} />
            <CategoryBadge category={script.category} />
            <RiskBadge risk={script.risk} />
            {hasParams && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                <SlidersHorizontal className="w-2.5 h-2.5" />
                <span>Param</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleStar}
            aria-label={SQL_HELPER_LABELS.card.favorite}
            className={`p-1.5 rounded-md transition-colors ${
              isFavorite
                ? "text-amber-500 hover:text-amber-600 bg-amber-500/10"
                : "text-muted-foreground/60 hover:text-amber-500 hover:bg-muted"
            }`}
          >
            <Star
              className={`w-4 h-4 ${isFavorite ? "fill-amber-500" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={onSelect}
            className="text-left font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1 focus-visible:outline-none focus-visible:underline"
          >
            {script.title}
          </button>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {script.description}
          </p>
        </div>

        {/* SQL Preview (3 lines with bottom fade) */}
        <div className="relative rounded-lg bg-zinc-950 p-2.5 font-mono text-[11px] text-zinc-300 overflow-hidden border border-zinc-800/80">
          <pre className="whitespace-pre overflow-hidden leading-snug">
            <code>{sqlPreview}</code>
          </pre>
          {/* Subtle bottom fade gradient */}
          <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/60">
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all ${
            copied
              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
              : "bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>{SQL_HELPER_LABELS.card.copied}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{SQL_HELPER_LABELS.card.copy}</span>
            </>
          )}
        </button>

        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
          <span>{SQL_HELPER_LABELS.card.details}</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
}
