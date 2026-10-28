"use client";

import { TriangleAlert, OctagonAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";
import type { Risk } from "../lib/schema";

interface RiskBannerProps {
  risk: Risk;
  confirmed?: boolean;
  onConfirmChange?: (value: boolean) => void;
  showConfirmation?: boolean;
  className?: string;
}

/** Banner risiko: medium hanya info; high bisa minta konfirmasi checkbox. */
export default function RiskBanner({
  risk,
  confirmed = false,
  onConfirmChange,
  showConfirmation = false,
  className,
}: RiskBannerProps) {
  if (risk === "low") return null;

  if (risk === "medium") {
    return (
      <div
        role="alert"
        className={cn(
          "flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed",
          className
        )}
      >
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-700 dark:text-amber-300">{L.risk.medium}</p>
          <p className="text-muted-foreground">{L.risk.bannerMedium}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={cn(
        "space-y-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs leading-relaxed",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <OctagonAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
        <div className="space-y-1">
          <p className="font-bold uppercase tracking-wide text-rose-700 dark:text-rose-300">
            {L.risk.high}
          </p>
          <p className="text-muted-foreground">{L.risk.bannerHigh}</p>
        </div>
      </div>

      {showConfirmation && onConfirmChange && (
        <label className="flex cursor-pointer select-none items-center gap-2.5 border-t border-rose-500/20 pt-2">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => onConfirmChange(e.target.checked)}
            className="h-4 w-4 rounded border-rose-400 text-rose-600 focus:ring-rose-500 focus:ring-offset-0"
          />
          <span className="text-xs font-medium text-rose-800 dark:text-rose-200">
            {L.risk.confirmPrompt}
          </span>
        </label>
      )}
    </div>
  );
}
