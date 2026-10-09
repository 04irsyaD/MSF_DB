"use client";

import React, { useState } from "react";
import { Star, Copy, Check, ChevronRight } from "lucide-react";
import { ScriptItem } from "../lib/schema";
import { RiskBadge, EngineBadge, CategoryBadge } from "./Badges";
import { copyScriptWithToast } from "../lib/clipboard";
import { SQL_HELPER_LABELS } from "../lib/labels";

interface ScriptRowProps {
  script: ScriptItem;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ScriptRow({
  script,
  onSelect,
  isFavorite,
  onToggleFavorite,
}: ScriptRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyScriptWithToast(script.sql);
    if (success) {
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

      {/* Script Name & Description */}
      <td className="py-3 px-3">
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={onSelect}
            className="text-left font-medium text-foreground group-hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
          >
            {script.title}
          </button>
          <p className="text-[11px] text-muted-foreground line-clamp-1">
            {script.description}
          </p>
        </div>
      </td>

      {/* Category */}
      <td className="py-3 px-3 whitespace-nowrap">
        <CategoryBadge category={script.category} />
      </td>

      {/* Engine */}
      <td className="py-3 px-3 whitespace-nowrap">
        <EngineBadge engine={script.engine} minVersion={script.minVersion} />
      </td>

      {/* Risk */}
      <td className="py-3 px-3 whitespace-nowrap">
        <RiskBadge risk={script.risk} />
      </td>

      {/* Actions */}
      <td className="py-3 px-3 whitespace-nowrap text-right">
        <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono font-medium transition-all ${
              copied
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                : "bg-muted hover:bg-primary hover:text-primary-foreground text-foreground border border-border"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span>{SQL_HELPER_LABELS.table.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>{SQL_HELPER_LABELS.table.copy}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onSelect}
            className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
            aria-label={SQL_HELPER_LABELS.card.details}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
