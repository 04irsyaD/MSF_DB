"use client";

import React from "react";
import { Star, Clock, Trash2, Sparkles, Layers } from "lucide-react";
import { ScriptItem } from "../lib/schema";
import { SQL_HELPER_LABELS } from "../lib/labels";
import { RiskBadge } from "./Badges";

export type AccessScope = "all" | "favorites" | "recent";

interface QuickAccessBarProps {
  activeScope: AccessScope;
  onScopeChange: (scope: AccessScope) => void;
  favoriteCount: number;
  recentCount: number;
  recentScripts: ScriptItem[];
  favoriteScripts: ScriptItem[];
  onSelectScript: (script: ScriptItem) => void;
  onClearRecent: () => void;
}

export function QuickAccessBar({
  activeScope,
  onScopeChange,
  favoriteCount,
  recentCount,
  recentScripts,
  favoriteScripts,
  onSelectScript,
  onClearRecent,
}: QuickAccessBarProps) {
  const quickList =
    activeScope === "favorites"
      ? favoriteScripts
      : activeScope === "recent"
      ? recentScripts
      : [];

  return (
    <div className="space-y-2 pt-1">
      {/* Top Segmented Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div
          role="tablist"
          aria-label="Filter script view scope"
          className="inline-flex items-center p-1 rounded-xl bg-muted/50 border border-border/80 shadow-2xs"
        >
          {/* All Scripts Tab */}
          <button
            type="button"
            role="tab"
            aria-selected={activeScope === "all"}
            onClick={() => onScopeChange("all")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeScope === "all"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{SQL_HELPER_LABELS.quickAccess.all}</span>
          </button>

          {/* Favorites Tab */}
          <button
            type="button"
            role="tab"
            aria-selected={activeScope === "favorites"}
            onClick={() => onScopeChange("favorites")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeScope === "favorites"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                favoriteCount > 0 ? "fill-amber-400 text-amber-500" : ""
              }`}
            />
            <span>{SQL_HELPER_LABELS.quickAccess.favorites}</span>
            {favoriteCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Recently Used Tab */}
          <button
            type="button"
            role="tab"
            aria-selected={activeScope === "recent"}
            onClick={() => onScopeChange("recent")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeScope === "recent"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{SQL_HELPER_LABELS.quickAccess.recent}</span>
            {recentCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-primary/15 text-primary font-semibold">
                {recentCount}
              </span>
            )}
          </button>
        </div>

        {/* Clear recent action when in recent tab */}
        {activeScope === "recent" && recentCount > 0 && (
          <button
            type="button"
            onClick={onClearRecent}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>{SQL_HELPER_LABELS.quickAccess.clearRecent}</span>
          </button>
        )}
      </div>

      {/* Quick Access Carousel / Mini-Cards Bar (for Favorites or Recent) */}
      {activeScope !== "all" && (
        <div className="p-2.5 rounded-xl border border-border/80 bg-muted/20">
          {quickList.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-2">
              {activeScope === "favorites"
                ? SQL_HELPER_LABELS.quickAccess.noFavorites
                : SQL_HELPER_LABELS.quickAccess.noRecent}
            </p>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {quickList.slice(0, 8).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectScript(s)}
                  className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background hover:bg-muted/80 border border-border/70 hover:border-primary/50 text-left transition-all shadow-2xs group"
                >
                  <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors max-w-[160px] truncate">
                    {s.title}
                  </span>
                  <RiskBadge risk={s.risk} size="sm" showIcon={false} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
