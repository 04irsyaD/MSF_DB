"use client";

import React, { useState } from "react";
import { Star, Copy, Check, ChevronRight, SlidersHorizontal } from "lucide-react";
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

interface ScriptRowProps {
  script: ScriptItem;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAccessScript?: (id: string) => void;
}

export function ScriptRow({
  script,
  onSelect,
  isFavorite,
  onToggleFavorite,
  onAccessScript,
}: ScriptRowProps) {
  const [copied, setCopied] = useState(false);

  const hasParams = Boolean(script.params && script.params.length > 0);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (hasParams && script.params) {
      const defaults = getDefaultParamValues(script.params);
      let values = defaults;
      try {
        const stored = window.localStorage.getItem(getParamStorageKey(script.id));
        if (stored) values = { ...defaults, ...JSON.parse(stored) };
      } catch {
        // Fallback
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
    <tr
      onClick={onSelect}
      className="group border-b border-border/60 hover:bg-muted/40 transition-colors cursor-pointer text-xs"
    >
      {/* Favorite column */}
      <td className="py-3 px-3 w-10 text-center">
        <button
          type="button"
          onClick={handleStar}
          aria-label={SQL_HELPER_LABELS.card.favorite}
          className={`p-1 rounded-md transition-colors ${
            isFavorite
              ? "text-amber-500 hover:text-amber-600"
              : "text-muted-foreground/40 hover:text-amber-500"
          }`}
        >
          <Star
            className={`w-3.5 h-3.5 ${isFavorite ? "fill-amber-500" : ""}`}
            aria-hidden="true"
          />
        </button>
      </td>

      {/* Title & Description */}
      <td className="py-3 px-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSelect}
              className="text-left font-semibold text-foreground group-hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
            >
              {script.title}
            </button>
            {hasParams && (
              <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-mono bg-primary/10 text-primary border border-primary/20">
                <SlidersHorizontal className="w-2.5 h-2.5" />
                <span>Param</span>
              </span>
            )}
          </div>
          <p className="text-muted-foreground line-clamp-1 text-[11px]">
            {script.description}
          </p>
        </div>
      </td>

      {/* Engine */}
      <td className="py-3 px-3 whitespace-nowrap">
        <EngineBadge engine={script.engine} minVersion={script.minVersion} size="sm" />
      </td>

      {/* Category */}
      <td className="py-3 px-3 whitespace-nowrap">
        <CategoryBadge category={script.category} size="sm" />
      </td>

      {/* Risk */}
      <td className="py-3 px-3 whitespace-nowrap">
        <RiskBadge risk={script.risk} size="sm" />
      </td>

      {/* Action Buttons */}
      <td className="py-3 px-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleCopy}
            className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-colors ${
              copied
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                : "bg-muted/80 hover:bg-primary hover:text-primary-foreground text-foreground border border-border/80"
            }`}
          >
            {copied ? SQL_HELPER_LABELS.table.copied : SQL_HELPER_LABELS.table.copy}
          </button>

          <button
            type="button"
            onClick={onSelect}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title={SQL_HELPER_LABELS.card.details}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
