"use client";

import React from "react";
import { AlertTriangle, AlertOctagon } from "lucide-react";
import { RiskLevelType } from "../lib/schema";
import { SQL_HELPER_LABELS } from "../lib/labels";

interface RiskBannerProps {
  risk: RiskLevelType;
  isConfirmed?: boolean;
  onConfirmChange?: (confirmed: boolean) => void;
  showConfirmation?: boolean;
  className?: string;
}

export function RiskBanner({
  risk,
  isConfirmed = false,
  onConfirmChange,
  showConfirmation = false,
  className = "",
}: RiskBannerProps) {
  if (risk === "low") return null;

  if (risk === "medium") {
    return (
      <div
        className={`flex items-start gap-3 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs leading-relaxed ${className}`}
        role="alert"
      >
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-700 dark:text-amber-300">
            {SQL_HELPER_LABELS.risk.medium}
          </p>
          <p className="text-muted-foreground dark:text-amber-300/80">
            {SQL_HELPER_LABELS.risk.bannerMedium}
          </p>
        </div>
      </div>
    );
  }

  // High Risk Banner
  return (
    <div
      className={`space-y-3 p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-900 dark:text-rose-200 text-xs leading-relaxed ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-rose-700 dark:text-rose-300 tracking-wide uppercase">
            {SQL_HELPER_LABELS.risk.high}
          </p>
          <p className="text-muted-foreground dark:text-rose-200/90">
            {SQL_HELPER_LABELS.risk.bannerHigh}
          </p>
        </div>
      </div>

      {showConfirmation && onConfirmChange && (
        <label className="flex items-center gap-2.5 pt-2 border-t border-rose-500/20 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isConfirmed}
            onChange={(e) => onConfirmChange(e.target.checked)}
            className="w-4 h-4 rounded border-rose-400 text-rose-600 focus:ring-rose-500 focus:ring-offset-0 transition-colors"
          />
          <span className="font-medium text-rose-800 dark:text-rose-200 text-xs">
            {SQL_HELPER_LABELS.risk.highConfirmPrompt}
          </span>
        </label>
      )}
    </div>
  );
}
