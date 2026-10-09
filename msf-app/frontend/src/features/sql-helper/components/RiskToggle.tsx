"use client";

import React from "react";
import { RiskLevelType } from "../lib/schema";
import { RISK_META } from "../lib/riskMeta";
import { SQL_HELPER_LABELS } from "../lib/labels";
import { FacetedCounts } from "../lib/filter";

interface RiskToggleProps {
  selectedRisks: RiskLevelType[];
  onToggleRisk: (risk: RiskLevelType) => void;
  facetedCounts: FacetedCounts;
  className?: string;
}

const RISKS: RiskLevelType[] = ["low", "medium", "high"];

export function RiskToggle({
  selectedRisks,
  onToggleRisk,
  facetedCounts,
  className = "",
}: RiskToggleProps) {
  return (
    <div
      role="group"
      aria-label={SQL_HELPER_LABELS.filter.risksLabel}
      className={`inline-flex items-center p-0.5 rounded-lg border border-border/70 bg-muted/30 ${className}`}
    >
      {RISKS.map((risk) => {
        const meta = RISK_META[risk];
        const Icon = meta.icon;
        const isSelected = selectedRisks.includes(risk);
        const count = facetedCounts.risks[risk] || 0;

        return (
          <button
            id={`risk-toggle-${risk}-btn`}
            key={risk}
            type="button"
            onClick={() => onToggleRisk(risk)}
            aria-pressed={isSelected}
            disabled={count === 0 && !isSelected}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-all ${
              isSelected
                ? `${meta.classes} shadow-xs font-bold`
                : count === 0
                ? "opacity-40 cursor-not-allowed text-muted-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-background/60"
            }`}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span className="capitalize">{risk}</span>
            <span className="text-[10px] opacity-75 font-normal">({count})</span>
          </button>
        );
      })}
    </div>
  );
}
