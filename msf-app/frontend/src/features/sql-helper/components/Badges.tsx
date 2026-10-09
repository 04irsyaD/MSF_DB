import React from "react";
import { RISK_META, getCategoryBadgeClass, getEngineBadgeClass } from "../lib/riskMeta";
import { RiskLevelType } from "../lib/schema";

interface RiskBadgeProps {
  risk: RiskLevelType;
  showIcon?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function RiskBadge({
  risk,
  showIcon = true,
  size = "md",
  className = "",
}: RiskBadgeProps) {
  const meta = RISK_META[risk] || RISK_META.low;
  const Icon = meta.icon;
  const sizeClass = size === "sm" ? "px-1.5 py-0.2 text-[9px]" : "px-2 py-0.5 text-[10px]";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border font-mono font-bold uppercase tracking-wider ${sizeClass} ${meta.classes} ${className}`}
    >
      {showIcon && <Icon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />}
      <span>{meta.badgeLabel}</span>
    </span>
  );
}

interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "md";
  className?: string;
}

export function CategoryBadge({
  category,
  size = "md",
  className = "",
}: CategoryBadgeProps) {
  const cls = getCategoryBadgeClass(category);
  const sizeClass = size === "sm" ? "px-1.5 py-0.2 text-[9px]" : "px-2 py-0.5 text-[10px]";

  return (
    <span
      className={`inline-block rounded-md border font-mono font-medium uppercase tracking-wider ${sizeClass} ${cls} ${className}`}
    >
      {category}
    </span>
  );
}

interface EngineBadgeProps {
  engine: string;
  minVersion?: string;
  size?: "sm" | "md";
  className?: string;
}

export function EngineBadge({
  engine,
  minVersion,
  size = "md",
  className = "",
}: EngineBadgeProps) {
  const cls = getEngineBadgeClass(engine);
  const sizeClass = size === "sm" ? "px-1.5 py-0.2 text-[9px]" : "px-2 py-0.5 text-[10px]";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border font-mono font-semibold uppercase tracking-wider ${sizeClass} ${cls} ${className}`}
    >
      <span>{engine}</span>
      {minVersion && (
        <span className="opacity-75 font-normal text-[9px] lowercase">({minVersion})</span>
      )}
    </span>
  );
}
