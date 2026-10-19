"use client";

import { memo } from "react";
import type { Box, Relation } from "@/lib/diagram/geometry";

interface RelationLinesProps {
  relations: Relation[];
  box: Box;
  hoveredId: string | null;
}

/**
 * SVG garis relasi. Posisi & viewBox mengikuti bounding box konten,
 * sehingga garis di koordinat negatif atau jauh tidak terpotong.
 */
function RelationLines({ relations, box, hoveredId }: RelationLinesProps) {
  const width = box.maxX - box.minX;
  const height = box.maxY - box.minY;

  return (
    <svg
      aria-hidden="true"
      data-relations
      className="absolute pointer-events-none z-0 overflow-visible"
      style={{ left: box.minX, top: box.minY, width, height }}
      viewBox={`${box.minX} ${box.minY} ${width} ${height}`}
    >
      {relations.map((rel) => {
        const related = hoveredId && (rel.sourceKey === hoveredId || rel.targetKey === hoveredId);
        const opacity = hoveredId ? (related ? 1 : 0.15) : 1;
        return (
          <g key={rel.key} style={{ opacity, transition: "opacity 0.25s ease-in-out" }}>
            <path d={rel.d} fill="none" stroke="rgba(16, 185, 129, 0.18)" strokeWidth={5} strokeLinejoin="round" />
            <path d={rel.d} fill="none" stroke="hsl(var(--accent))" strokeWidth={1.5} strokeLinejoin="round" />
            <polygon points={rel.arrow} fill="hsl(var(--accent))" />
            <circle cx={rel.start.x} cy={rel.start.y} r={3} fill="hsl(var(--accent))" />
          </g>
        );
      })}
    </svg>
  );
}

export default memo(RelationLines);
