"use client";

import React, { useState, useEffect, useRef } from "react";
import { TableMetadata, ForeignKeyMetadata } from "@/lib/types";
import { Key, Link as LinkIcon, ZoomIn, ZoomOut, Maximize } from "lucide-react";

interface DiagramCanvasProps {
  tables: TableMetadata[];
}

export default function DiagramCanvas({ tables }: DiagramCanvasProps) {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [activeDragTable, setActiveDragTable] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const CARD_WIDTH = 220;
  const COLUMN_HEIGHT = 28;
  const HEADER_HEIGHT = 42;

  // Initialize table positions in a grid layout
  useEffect(() => {
    const newPositions: Record<string, { x: number; y: number }> = {};
    const cols = Math.ceil(Math.sqrt(tables.length));
    const spacingX = 300;
    const spacingY = 250;

    tables.forEach((table, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      newPositions[table.name] = {
        x: 50 + col * spacingX,
        y: 50 + row * spacingY,
      };
    });

    setPositions(newPositions);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [tables]);

  // Handle container panning
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).classList.contains("svg-overlay")) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  // Handle table card drag initiation
  const handleTableMouseDown = (e: React.MouseEvent, tableName: string) => {
    e.stopPropagation();
    setActiveDragTable(tableName);
    const pos = positions[tableName] || { x: 0, y: 0 };
    dragStartRef.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

  // Mouse move handler for drag & pan
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
    } else if (activeDragTable) {
      const x = e.clientX - dragStartRef.current.x;
      const y = e.clientY - dragStartRef.current.y;
      setPositions((prev) => ({
        ...prev,
        [activeDragTable]: { x, y },
      }));
    }
  };

  // Mouse up handler
  const handleMouseUp = () => {
    setIsPanning(false);
    setActiveDragTable(null);
  };

  // Auto zoom fit layout
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getTableHeight = (table: TableMetadata) => {
    return HEADER_HEIGHT + table.columns.length * COLUMN_HEIGHT + 10;
  };

  // Calculate connection lines between PK & FK
  const renderRelations = () => {
    const paths: React.JSX.Element[] = [];

    tables.forEach((sourceTable) => {
      sourceTable.foreign_keys?.forEach((fk, fkIdx) => {
        const sourcePos = positions[sourceTable.name];
        const targetPos = positions[fk.references_table];

        if (sourcePos && targetPos) {
          const sourceTableMeta = tables.find((t) => t.name === sourceTable.name);
          const targetTableMeta = tables.find((t) => t.name === fk.references_table);

          if (!sourceTableMeta || !targetTableMeta) return;

          // Find column index for vertical alignment of the line
          const sourceColIdx = sourceTableMeta.columns.findIndex((c) => c.name === fk.column);
          const targetColIdx = targetTableMeta.columns.findIndex((c) => c.name === fk.references_column);

          const sourceY = sourcePos.y + HEADER_HEIGHT + (sourceColIdx >= 0 ? sourceColIdx : 0) * COLUMN_HEIGHT + COLUMN_HEIGHT / 2;
          const targetY = targetPos.y + HEADER_HEIGHT + (targetColIdx >= 0 ? targetColIdx : 0) * COLUMN_HEIGHT + COLUMN_HEIGHT / 2;

          let startX = 0;
          let endX = 0;

          // Align connection sides (left vs right) depending on relative coordinates
          if (sourcePos.x + CARD_WIDTH < targetPos.x) {
            startX = sourcePos.x + CARD_WIDTH;
            endX = targetPos.x;
          } else if (targetPos.x + CARD_WIDTH < sourcePos.x) {
            startX = sourcePos.x;
            endX = targetPos.x + CARD_WIDTH;
          } else {
            startX = sourcePos.x + CARD_WIDTH / 2;
            endX = targetPos.x + CARD_WIDTH / 2;
          }

          // Calculate bezier curve points
          const controlOffset = Math.min(100, Math.abs(endX - startX) * 0.5);
          const cp1x = startX + (startX < endX ? controlOffset : -controlOffset);
          const cp2x = endX + (startX < endX ? -controlOffset : controlOffset);

          const pathD = `M ${startX} ${sourceY} C ${cp1x} ${sourceY}, ${cp2x} ${targetY}, ${endX} ${targetY}`;

          paths.push(
            <g key={`${sourceTable.name}-${fk.column}-${fkIdx}`}>
              <path
                d={pathD}
                fill="none"
                stroke="rgba(16, 185, 129, 0.25)"
                strokeWidth={3}
                className="transition-all duration-150 hover:stroke-accent/70"
              />
              <path
                d={pathD}
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth={1.5}
              />
              {/* Dot decoration on connections */}
              <circle cx={startX} cy={sourceY} r={3.5} fill="hsl(var(--accent))" />
              <circle cx={endX} cy={targetY} r={3.5} fill="hsl(var(--accent))" />
            </g>
          );
        }
      });
    });

    return paths;
  };

  return (
    <div className="relative w-full h-[600px] border border-border bg-gray-50 rounded-2xl overflow-hidden shadow-inner select-none">
      {/* Zoom / Pan Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-1.5 bg-white border border-border p-1.5 rounded-xl shadow-sm">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
          className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
          className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleResetZoom}
          className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
          title="Reset Fit"
        >
          <Maximize className="h-4 w-4" />
        </button>
      </div>

      {/* Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleContainerMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
          className="relative w-[5000px] h-[5000px] transition-transform duration-75 ease-out"
        >
          {/* SVG Connection Lines Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none svg-overlay z-0">
            {renderRelations()}
          </svg>

          {/* Table Cards */}
          {tables.map((table) => {
            const pos = positions[table.name] || { x: 0, y: 0 };
            return (
              <div
                key={table.name}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  width: `${CARD_WIDTH}px`,
                }}
                className="absolute bg-white border border-border rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-150 z-10 overflow-hidden font-mono"
              >
                {/* Drag Handle Table Header */}
                <div
                  onMouseDown={(e) => handleTableMouseDown(e, table.name)}
                  className="px-3.5 py-2.5 bg-accent/5 border-b border-border flex items-center justify-between cursor-move hover:bg-accent/10 transition-colors"
                >
                  <span className="text-xs font-bold text-gray-900 truncate" title={table.name}>
                    {table.name}
                  </span>
                  <span className="text-[9px] font-bold text-accent bg-accent/10 border border-accent/20 px-1.5 py-0.5 rounded uppercase">
                    {table.schema}
                  </span>
                </div>

                {/* Columns List */}
                <div className="py-1">
                  {table.columns.map((col) => {
                    const isPK = col.is_primary_key;
                    const isFK = col.is_foreign_key;

                    return (
                      <div
                        key={col.name}
                        className="px-3.5 py-1.5 flex items-center justify-between hover:bg-gray-50/70 text-[10px]"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {isPK && <Key className="h-3 w-3 text-amber-500 shrink-0" />}
                          {isFK && <LinkIcon className="h-3 w-3 text-accent shrink-0" />}
                          <span className={cn("text-gray-900 truncate", (isPK || isFK) && "font-bold")}>
                            {col.name}
                          </span>
                        </div>
                        <span className="text-muted-foreground shrink-0 pl-2">
                          {col.data_type.toLowerCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Simple CN utility replacement for file independence
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
