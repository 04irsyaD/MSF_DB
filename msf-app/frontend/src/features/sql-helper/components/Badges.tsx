import React from "react";
import { RISK_META, getCategoryBadgeClass, getEngineBadgeClass } from "../lib/riskMeta";
import { RiskLevelType } from "../lib/schema";

interface RiskBadgeProps {
  risk: RiskLevelType;
  showIcon?: boolean;
  className?: string;
}

export function RiskBadge({ risk, showIcon = true, className = "" }: RiskBadgeProps) {
  const meta = RISK_META[risk] || RISK_META.low;
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider ${meta.classes} ${className}`}
    >
      {showIcon && <Icon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />}
      <span>{meta.badgeLabel}</span>
    </span>
  );
}

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className = "" }: CategoryBadgeProps) {
  const cls = getCategoryBadgeClass(category);
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-mono font-medium uppercase tracking-wider ${cls} ${className}`}
    >
      {category}
    </span>
  );
}

interface EngineBadgeProps {
  engine: string;
  minVersion?: string;
  className?: string;
}

export function EngineBadge({ engine, minVersion, className = "" }: EngineBadgeProps) {
  const cls = getEngineBadgeClass(engine);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-mono font-semibold uppercase tracking-wider ${cls} ${className}`}
    >
      <span>{engine}</span>
      {minVersion && (
        <span className="opacity-75 font-normal text-[9px] lowercase">({minVersion})</span>
      )}
    </span>
  );
}
