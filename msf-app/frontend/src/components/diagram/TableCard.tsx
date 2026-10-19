"use client";

import { memo } from "react";
import { Key, Link as LinkIcon } from "lucide-react";
import { TableMetadata } from "@/lib/types";
import { CARD_WIDTH, HEADER_HEIGHT, LIST_PADDING, ROW_HEIGHT } from "@/lib/diagram/constants";
import { cn } from "@/lib/utils";

export type CardEmphasis = "normal" | "active" | "related" | "dim";

interface TableCardProps {
  table: TableMetadata;
  tableId: string;
  x: number;
  y: number;
  emphasis: CardEmphasis;
  onHover: (tableId: string | null) => void;
}

/**
 * Kartu tabel. Tinggi header & baris dikunci ke konstanta di `lib/diagram/constants`
 * agar titik garis relasi selalu tepat di tengah baris kolom.
 */
function TableCard({ table, tableId, x, y, emphasis, onHover }: TableCardProps) {
  return (
    <div
      data-table-card={tableId}
      onPointerEnter={() => onHover(tableId)}
      onPointerLeave={() => onHover(null)}
      style={{ left: x, top: y, width: CARD_WIDTH }}
      className={cn(
        "absolute bg-white border rounded-xl shadow-card font-mono overflow-hidden",
        "transition-[opacity,box-shadow,border-color] duration-200",
        emphasis === "active" ? "border-accent ring-2 ring-accent/15 z-[25] shadow-card-hover" : "border-border z-10",
        emphasis === "dim" && "opacity-35"
      )}
    >
      <div
        data-drag-handle={tableId}
        style={{ height: HEADER_HEIGHT }}
        className="px-3.5 bg-accent/5 border-b border-border flex items-center justify-between gap-2 cursor-move touch-none hover:bg-accent/10 transition-colors"
      >
        <span className="text-xs font-bold text-gray-900 truncate" title={table.name}>
          {table.name}
        </span>
        {table.schema && (
          <span className="text-[10px] font-bold text-accent bg-accent/10 border border-accent/20 px-1.5 py-0.5 rounded uppercase shrink-0">
            {table.schema}
          </span>
        )}
      </div>

      <div style={{ paddingTop: LIST_PADDING, paddingBottom: LIST_PADDING }}>
        {table.columns.map((col, idx) => (
          <div
            key={`${col.name}-${idx}`}
            style={{ height: ROW_HEIGHT }}
            className="px-3.5 flex items-center justify-between gap-2 hover:bg-gray-50/70 text-[11px]"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {col.is_primary_key && <Key className="h-3 w-3 text-amber-500 shrink-0" aria-label="Primary key" />}
              {col.is_foreign_key && <LinkIcon className="h-3 w-3 text-accent shrink-0" aria-label="Foreign key" />}
              <span
                className={cn("text-gray-900 truncate", (col.is_primary_key || col.is_foreign_key) && "font-bold")}
                title={col.name}
              >
                {col.name}
              </span>
            </div>
            <span className="text-muted-foreground shrink-0 truncate max-w-[45%]" title={col.data_type}>
              {col.data_type.toLowerCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(TableCard);
