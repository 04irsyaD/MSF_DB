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
  const [layoutStyle, setLayoutStyle] = useState<string>("horizontal");
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const CARD_WIDTH = 220;
  const COLUMN_HEIGHT = 28;
  const HEADER_HEIGHT = 42;

  const isTableConnectedToHovered = (tableName: string) => {
    if (!hoveredTable) return false;
    if (tableName === hoveredTable) return true;
    
    const hoveredMeta = tables.find((t) => t.name === hoveredTable);
    const tableMeta = tables.find((t) => t.name === tableName);
    
    if (hoveredMeta?.foreign_keys?.some((fk) => fk.references_table === tableName)) return true;
    if (tableMeta?.foreign_keys?.some((fk) => fk.references_table === hoveredTable)) return true;
    
    return false;
  };

  const applyLayout = (style: string, currentTables = tables) => {
    if (currentTables.length === 0) return;

    const newPositions: Record<string, { x: number; y: number }> = {};
    // Dynamic spacing: use actual table height as basis
    const maxTableHeight = Math.max(...currentTables.map((t) => HEADER_HEIGHT + t.columns.length * COLUMN_HEIGHT + 10));
    const widthSpacing = CARD_WIDTH + 100;
    const heightSpacing = maxTableHeight + 50;

    if (style === "grid") {
      const cols = Math.ceil(Math.sqrt(currentTables.length));
      currentTables.forEach((table, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        newPositions[table.name] = {
          x: 100 + col * widthSpacing,
          y: 100 + row * heightSpacing,
        };
      });
    } else if (style === "radial") {
      const center = { x: 500, y: 350 };
      const radius = Math.max(200, currentTables.length * 45);
      currentTables.forEach((table, index) => {
        const angle = (index / currentTables.length) * 2 * Math.PI;
        newPositions[table.name] = {
          x: Math.max(50, center.x + radius * Math.cos(angle) - CARD_WIDTH / 2),
          y: Math.max(50, center.y + radius * Math.sin(angle) - 100),
        };
      });
    } else if (style === "organic") {
      // Force-directed Spring Layout
      const center = { x: 500, y: 350 };
      const radius = 200;
      const nodes = currentTables.map((t, i) => {
        const angle = (i / currentTables.length) * 2 * Math.PI;
        return {
          name: t.name,
          x: center.x + radius * Math.cos(angle) + (Math.random() - 0.5) * 50,
          y: center.y + radius * Math.sin(angle) + (Math.random() - 0.5) * 50,
          fx: 0,
          fy: 0,
        };
      });

      const iterations = 80;
      const repScale = 35000;
      const attScale = 0.05;

      for (let step = 0; step < iterations; step++) {
        // Reset forces
        nodes.forEach((n) => {
          n.fx = 0;
          n.fy = 0;
        });

        // Repulsive forces between ALL nodes
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = repScale / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            nodes[i].fx += fx;
            nodes[i].fy += fy;
            nodes[j].fx -= fx;
            nodes[j].fy -= fy;
          }
        }

        // Attractive forces along foreign key links
        currentTables.forEach((table) => {
          table.foreign_keys?.forEach((fk) => {
            const u = nodes.find((n) => n.name === table.name);
            const v = nodes.find((n) => n.name === fk.references_table);
            if (u && v) {
              const dx = u.x - v.x;
              const dy = u.y - v.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const force = dist * attScale;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              u.fx -= fx;
              u.fy -= fy;
              v.fx += fx;
              v.fy += fy;
            }
          });
        });

        // Update positions with damping
        const temp = 10 * (1 - step / iterations);
        nodes.forEach((n) => {
          const dist = Math.sqrt(n.fx * n.fx + n.fy * n.fy) || 1;
          const deltaX = (n.fx / dist) * Math.min(dist, temp);
          const deltaY = (n.fy / dist) * Math.min(dist, temp);
          n.x += deltaX * 1.5;
          n.y += deltaY * 1.5;
        });
      }

      nodes.forEach((n) => {
        newPositions[n.name] = {
          x: Math.max(50, n.x - CARD_WIDTH / 2),
          y: Math.max(50, n.y - 100),
        };
      });
    } else if (style === "centric") {
      // Hub-Centric Layout
      const degrees: Record<string, number> = {};
      currentTables.forEach((t) => {
        degrees[t.name] = 0;
      });

      currentTables.forEach((t) => {
        t.foreign_keys?.forEach((fk) => {
          degrees[t.name]++;
          if (degrees[fk.references_table] !== undefined) {
            degrees[fk.references_table]++;
          }
        });
      });

      let hubTable = "";
      let maxDegree = -1;
      currentTables.forEach((t) => {
        if (degrees[t.name] > maxDegree) {
          maxDegree = degrees[t.name];
          hubTable = t.name;
        }
      });

      const center = { x: 500, y: 350 };
      const directNeighbors: string[] = [];
      const independent: string[] = [];

      currentTables.forEach((t) => {
        if (t.name === hubTable) return;
        
        const isConnected =
          t.foreign_keys?.some((fk) => fk.references_table === hubTable) ||
          currentTables.find((ct) => ct.name === hubTable)?.foreign_keys?.some((fk) => fk.references_table === t.name);
          
        if (isConnected) {
          directNeighbors.push(t.name);
        } else {
          independent.push(t.name);
        }
      });

      if (hubTable) {
        newPositions[hubTable] = {
          x: center.x - CARD_WIDTH / 2,
          y: center.y - 100,
        };
      }

      const innerRadius = 260;
      directNeighbors.forEach((name, index) => {
        const angle = (index / directNeighbors.length) * 2 * Math.PI;
        newPositions[name] = {
          x: Math.max(50, center.x + innerRadius * Math.cos(angle) - CARD_WIDTH / 2),
          y: Math.max(50, center.y + innerRadius * Math.sin(angle) - 100),
        };
      });

      const outerRadius = 480;
      independent.forEach((name, index) => {
        const angle = (index / Math.max(1, independent.length)) * 2 * Math.PI + Math.PI / 4;
        newPositions[name] = {
          x: Math.max(50, center.x + outerRadius * Math.cos(angle) - CARD_WIDTH / 2),
          y: Math.max(50, center.y + outerRadius * Math.sin(angle) - 100),
        };
      });
    } else {
      // Hierarchical Layout (horizontal / vertical)
      const levels: Record<string, number> = {};
      const adj: Record<string, string[]> = {};
      const inDegree: Record<string, number> = {};

      currentTables.forEach((t) => {
        levels[t.name] = 0;
        adj[t.name] = [];
        inDegree[t.name] = 0;
      });

      currentTables.forEach((t) => {
        t.foreign_keys?.forEach((fk) => {
          const parent = fk.references_table;
          const child = t.name;
          if (adj[parent] && !adj[parent].includes(child)) {
            adj[parent].push(child);
            inDegree[child]++;
          }
        });
      });

      const queue: string[] = [];
      currentTables.forEach((t) => {
        if (inDegree[t.name] === 0) {
          queue.push(t.name);
        }
      });

      if (queue.length === 0 && currentTables.length > 0) {
        queue.push(currentTables[0].name);
      }

      const visited = new Set<string>();
      while (queue.length > 0) {
        const curr = queue.shift()!;
        if (visited.has(curr)) continue;
        visited.add(curr);

        const currLevel = levels[curr];
        adj[curr].forEach((child) => {
          levels[child] = Math.max(levels[child], currLevel + 1);
          queue.push(child);
        });
      }

      currentTables.forEach((t) => {
        if (!visited.has(t.name)) {
          levels[t.name] = 0;
        }
      });

      const levelGroups: Record<number, string[]> = {};
      currentTables.forEach((t) => {
        const lvl = levels[t.name];
        if (!levelGroups[lvl]) levelGroups[lvl] = [];
        levelGroups[lvl].push(t.name);
      });

      const maxLevel = Math.max(...Object.keys(levelGroups).map(Number), 0);

      if (style === "vertical") {
        for (let lvl = 0; lvl <= maxLevel; lvl++) {
          const group = levelGroups[lvl] || [];
          const rowY = 80 + lvl * heightSpacing;
          const totalWidth = group.length * widthSpacing;
          const startX = Math.max(50, 500 - totalWidth / 2);

          group.forEach((name, idx) => {
            newPositions[name] = {
              x: startX + idx * widthSpacing,
              y: rowY,
            };
          });
        }
      } else {
        // Horizontal (Left-to-Right)
        for (let lvl = 0; lvl <= maxLevel; lvl++) {
          const group = levelGroups[lvl] || [];
          const colX = 80 + lvl * widthSpacing;
          const groupHeight = group.length * heightSpacing;
          const startY = Math.max(50, 350 - groupHeight / 2);

          group.forEach((name, idx) => {
            newPositions[name] = {
              x: colX,
              y: startY + idx * heightSpacing,
            };
          });
        }
      }
    }

    setPositions(newPositions);
  };

  // Initialize table positions
  useEffect(() => {
    applyLayout(layoutStyle);
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

  // Step/Elbow connector routing — horizontal → vertical → horizontal
  const renderRelations = () => {
    const paths: React.JSX.Element[] = [];

    // Track how many FKs have been drawn exiting each table side to apply offset
    const exitCounts: Record<string, { left: number; right: number }> = {};
    tables.forEach((t) => {
      exitCounts[t.name] = { left: 0, right: 0 };
    });

    let relationIndex = 0;

    tables.forEach((sourceTable) => {
      sourceTable.foreign_keys?.forEach((fk, fkIdx) => {
        const sourcePos = positions[sourceTable.name];
        const targetPos = positions[fk.references_table];

        if (!sourcePos || !targetPos) return;

        const sourceTableMeta = tables.find((t) => t.name === sourceTable.name);
        const targetTableMeta = tables.find((t) => t.name === fk.references_table);

        if (!sourceTableMeta || !targetTableMeta) return;

        relationIndex++;

        // FK row-level exit/entry Y positions
        const sourceColIdx = sourceTableMeta.columns.findIndex((c) => c.name === fk.column);
        const targetColIdx = targetTableMeta.columns.findIndex((c) => c.name === fk.references_column);

        const sourceY =
          sourcePos.y + HEADER_HEIGHT + (sourceColIdx >= 0 ? sourceColIdx : 0) * COLUMN_HEIGHT + COLUMN_HEIGHT / 2;
        const targetY =
          targetPos.y + HEADER_HEIGHT + (targetColIdx >= 0 ? targetColIdx : 0) * COLUMN_HEIGHT + COLUMN_HEIGHT / 2;

        // Dynamic side selection based on horizontal position
        const sourceIsLeft = sourcePos.x + CARD_WIDTH <= targetPos.x;
        const sourceIsRight = sourcePos.x >= targetPos.x + CARD_WIDTH;
        const isOverlapping = !sourceIsLeft && !sourceIsRight;

        let startX: number;
        let endX: number;
        let side: "left" | "right";

        if (sourceIsLeft) {
          side = "right";
          startX = sourcePos.x + CARD_WIDTH;
          endX = targetPos.x;
        } else if (sourceIsRight) {
          side = "left";
          startX = sourcePos.x;
          endX = targetPos.x + CARD_WIDTH;
        } else {
          // Overlapping horizontally — exit from nearest side
          const distRight = Math.abs(sourcePos.x + CARD_WIDTH - (targetPos.x + CARD_WIDTH / 2));
          const distLeft = Math.abs(sourcePos.x - (targetPos.x + CARD_WIDTH / 2));
          if (distRight < distLeft) {
            side = "right";
            startX = sourcePos.x + CARD_WIDTH;
            endX = targetPos.x + CARD_WIDTH;
          } else {
            side = "left";
            startX = sourcePos.x;
            endX = targetPos.x;
          }
        }

        // Parallel offset — small nudge so lines from same table don't overlap
        const sideCount = exitCounts[sourceTable.name][side];
        exitCounts[sourceTable.name][side]++;
        const parallelOffset = sideCount * 6;
        const adjustedStartX = side === "right" ? startX + parallelOffset : startX - parallelOffset;

        // Deterministic midpoint vertical track offset to prevent overlap
        // using relationIndex so each connection gets a unique vertical lane
        const verticalTrackOffset = ((relationIndex * 17) % 5 - 2) * 12; // deterministic values from -24 to +24

        // Step/Elbow path: H → V → H (3 segments)
        let pathD: string;
        if (!isOverlapping) {
          const midX = (adjustedStartX + endX) / 2 + verticalTrackOffset;
          pathD = `M ${adjustedStartX} ${sourceY} H ${midX} V ${targetY} H ${endX}`;
        } else {
          // Same column overlap: route outward with a 20px stub first
          const stub = side === "right" ? 24 : -24;
          const stubX = adjustedStartX + stub + (verticalTrackOffset * 0.4);
          const targetStubX = endX + (side === "right" ? 24 : -24);
          const midX = (stubX + targetStubX) / 2;
          pathD = `M ${adjustedStartX} ${sourceY} H ${stubX} V ${targetY} H ${endX}`;
        }

        const isConnectedToHovered =
          hoveredTable &&
          (sourceTable.name === hoveredTable || fk.references_table === hoveredTable);
        const opacity = hoveredTable ? (isConnectedToHovered ? 1 : 0.15) : 1;

        paths.push(
          <g
            key={`${sourceTable.name}-${fk.column}-${fkIdx}`}
            style={{
              opacity,
              transition: "opacity 0.25s ease-in-out",
            }}
          >
            {/* Glow / shadow path */}
            <path
              d={pathD}
              fill="none"
              stroke="rgba(16, 185, 129, 0.18)"
              strokeWidth={5}
              strokeLinejoin="round"
            />
            {/* Main connector line */}
            <path
              d={pathD}
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeDasharray="none"
            />
            {/* Arrowhead at target end */}
            <polygon
              points={`
                ${side === "right" || isOverlapping ? endX - 6 : endX + 6},${targetY - 4}
                ${side === "right" || isOverlapping ? endX - 6 : endX + 6},${targetY + 4}
                ${endX},${targetY}
              `}
              fill="hsl(var(--accent))"
            />
            {/* Dot at source exit */}
            <circle cx={adjustedStartX} cy={sourceY} r={3} fill="hsl(var(--accent))" />
          </g>
        );
      });
    });

    return paths;
  };

  return (
    <div className="relative w-full h-[600px] border border-border bg-gray-50 rounded-2xl overflow-hidden shadow-inner select-none">
      {/* Layout Controls */}
      <div className="absolute top-4 right-36 z-20 flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-xl shadow-sm">
        <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider font-mono">Layout:</span>
        <select
          value={layoutStyle}
          onChange={(e) => {
            const style = e.target.value;
            setLayoutStyle(style);
            applyLayout(style);
          }}
          className="bg-gray-50 border border-border rounded-lg px-2 py-0.5 text-[10px] font-mono text-gray-900 focus:outline-none transition-colors cursor-pointer"
        >
          <option value="horizontal">↔ Horizontal</option>
          <option value="vertical">↕ Vertikal</option>
          <option value="grid">⊞ Grid</option>
          <option value="radial">⬤ Lingkaran</option>
          <option value="centric">🎯 Pusat Relasi</option>
          <option value="organic">🌀 Organik (Force)</option>
        </select>
      </div>

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
                onMouseEnter={() => setHoveredTable(table.name)}
                onMouseLeave={() => setHoveredTable(null)}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  width: `${CARD_WIDTH}px`,
                  opacity: hoveredTable && hoveredTable !== table.name && !isTableConnectedToHovered(table.name) ? 0.35 : 1,
                  transform: hoveredTable === table.name ? "scale(1.02)" : "scale(1)",
                  transition: "opacity 0.2s ease-in-out, transform 0.2s ease-in-out, border-color 0.2s, box-shadow 0.2s",
                }}
                className={cn(
                  "absolute bg-white border rounded-xl shadow-card font-mono overflow-hidden",
                  hoveredTable === table.name ? "border-accent ring-2 ring-accent/15 z-25 shadow-card-hover" : "border-border z-10"
                )}
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
