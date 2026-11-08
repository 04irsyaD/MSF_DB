"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HotspotProps {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  selected: boolean;
  onPick: () => void;
  children: ReactNode;
}

/**
 * Area SVG yang bisa diklik dan difokus keyboard (Tab, lalu Enter/Spasi).
 * Garis putus-putus saat hover/fokus, garis penuh saat terpilih.
 */
export function Hotspot({
  label,
  x,
  y,
  w,
  h,
  selected,
  onPick,
  children,
}: HotspotProps) {
  function onKeyDown(e: KeyboardEvent<SVGGElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPick();
    }
  }
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={selected}
      onClick={onPick}
      onKeyDown={onKeyDown}
      className="group cursor-pointer outline-none"
    >
      {children}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        fill="transparent"
        strokeWidth={3}
        className={cn(
          selected
            ? "stroke-emerald-400"
            : "stroke-transparent [stroke-dasharray:5_4] group-hover:stroke-emerald-300/80 group-focus-visible:stroke-emerald-300",
        )}
      />
    </g>
  );
}

/** Label teks kecil di atas chassis gelap. */
export function SvgLabel({
  x,
  y,
  children,
  anchor,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className="pointer-events-none fill-[#b8c0c9] text-[11px] font-semibold"
    >
      {children}
    </text>
  );
}

/** Warna perangkat bersama (selalu gelap di kedua tema). */
export const DEVICE = {
  chassis: "#2b3036",
  chassis2: "#3a4048",
  bay: "#1c2025",
  port: "#111",
  portStroke: "#8a939c",
  edge: "#4a5159",
  ledGreen: "#3ad06b",
  ledAmber: "#ffae1a",
  ledOff: "#30363d",
  ledBlue: "#4c9cf0",
} as const;
