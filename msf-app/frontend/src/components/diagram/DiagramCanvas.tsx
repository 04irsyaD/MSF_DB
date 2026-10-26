"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { TableMetadata } from "@/lib/types";
import { Key, Link as LinkIcon,ZoomIn, ZoomOut, Scan, Maximize2, Minimize2, Download, Loader2, GitBranch, EyeOff } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import MermaidExportModal from "@/components/diagram/MermaidExportModal";
import VirtualRelationModal from "@/components/diagram/VirtualRelationModal";
import {
  VirtualRelation,
  relationId,
  useHiddenRelations,
  useVirtualRelations,
} from "@/components/diagram/useVirtualRelations";

type ColumnRef = { table: string; column: string };

// FK asli & relasi virtual tampil sama persis (warna, garis, ikon kolom)
const RELATION_COLOR = "hsl(var(--accent))";

// Satu garis di diagram: FK asli dari SQL atau relasi virtual buatan user
interface DiagramEdge {
  key: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  relation: VirtualRelation;
  virtual: boolean;
}

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
  const [downloading, setDownloading] = useState<boolean>(false);
  const [showMermaid, setShowMermaid] = useState<boolean>(false);
  // Mode layar penuh: diagram menutupi seluruh jendela (+ fullscreen browser kalau diizinkan)
  const [expanded, setExpanded] = useState<boolean>(false);

  // Relasi virtual: tarik titik di kolom tabel A ke kolom tabel B → konfirmasi → garis relasi
  const { relations: virtualRelations, addRelation, removeRelation } = useVirtualRelations();
  // FK asli dari SQL yang garisnya dihapus user dari diagram (hanya disembunyikan, SQL tidak berubah)
  const { relations: hiddenRelations, addRelation: hideRelation, removeRelations: unhideRelations } =
    useHiddenRelations();
  const [linkFrom, setLinkFrom] = useState<ColumnRef | null>(null);
  const [linkPointer, setLinkPointer] = useState<{ x: number; y: number } | null>(null);
  const [linkTarget, setLinkTarget] = useState<ColumnRef | null>(null);
  const [pendingRelation, setPendingRelation] = useState<VirtualRelation | null>(null);
  const [relationToDelete, setRelationToDelete] = useState<{ relation: VirtualRelation; virtual: boolean } | null>(null);
  // Saat menarik garis, efek redup hover dimatikan supaya tabel tujuan tetap terlihat jelas
  const highlightTable = linkFrom ? null : hoveredTable;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; posX: number; posY: number }>({
    mouseX: 0,
    mouseY: 0,
    posX: 0,
    posY: 0,
  });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // Nilai zoom/pan terbaru untuk handler wheel (event bisa datang beberapa kali sebelum re-render)
  const viewRef = useRef({ zoom, pan });
  viewRef.current = { zoom, pan };

  const CARD_WIDTH = 220;
  // Tinggi ini dikunci di elemen kartu (style height) supaya titik garis relasi pas di barisnya.
  // HEADER_HEIGHT = jarak atas kartu ke baris pertama: border 1 + header 41 + padding list 4
  const COLUMN_HEIGHT = 28;
  const HEADER_HEIGHT = 46;
  const MIN_ZOOM = 0.15;
  const MAX_ZOOM = 2;

  const getTableHeight = (table: TableMetadata) => {
    return HEADER_HEIGHT + table.columns.length * COLUMN_HEIGHT + 10;
  };

  // Titik tengah vertikal baris kolom (koordinat kanvas), tempat garis relasi menempel
  const rowCenterY = (tableName: string, columnName: string) => {
    const table = tables.find((t) => t.name === tableName);
    const idx = table ? table.columns.findIndex((c) => c.name === columnName) : -1;
    return (positions[tableName]?.y ?? 0) + HEADER_HEIGHT + Math.max(idx, 0) * COLUMN_HEIGHT + COLUMN_HEIGHT / 2;
  };

  const findColumn = (table: string, column: string) =>
    tables.find((t) => t.name === table)?.columns.find((c) => c.name === column);

  // Relasi virtual yang tabel & kolomnya ada di diagram saat ini
  const activeVirtualRelations = useMemo(
    () => virtualRelations.filter((r) => findColumn(r.fromTable, r.fromColumn) && findColumn(r.toTable, r.toColumn)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [virtualRelations, tables]
  );

  // Semua FK dari SQL, ber-id sama formatnya dengan relasi virtual (untuk disembunyikan per garis)
  const fkRelations = useMemo<VirtualRelation[]>(
    () =>
      tables.flatMap((t) =>
        (t.foreign_keys ?? []).map((fk) => {
          const r = {
            fromTable: t.name,
            fromColumn: fk.column,
            toTable: fk.references_table,
            toColumn: fk.references_column,
          };
          return { ...r, id: relationId(r) };
        })
      ),
    [tables]
  );

  // FK tersembunyi yang memang ada di diagram saat ini
  const activeHiddenRelations = useMemo(
    () => hiddenRelations.filter((h) => fkRelations.some((r) => r.id === h.id)),
    [hiddenRelations, fkRelations]
  );

  const edges = useMemo<DiagramEdge[]>(
    () => [
      ...fkRelations
        .filter((r) => !activeHiddenRelations.some((h) => h.id === r.id))
        .map((r, i) => ({ key: `fk:${r.id}:${i}`, ...r, relation: r, virtual: false })),
      ...activeVirtualRelations.map((r) => ({ key: `v:${r.id}`, ...r, relation: r, virtual: true })),
    ],
    [fkRelations, activeHiddenRelations, activeVirtualRelations]
  );

  // Garis yang tampil sebagai foreign_keys, dipakai algoritma layout supaya tabel terkait tetap berdekatan
  const graphTables = useMemo(
    () =>
      tables.map((t) => ({
        ...t,
        foreign_keys: edges
          .filter((e) => e.fromTable === t.name)
          .map((e) => ({ column: e.fromColumn, references_table: e.toTable, references_column: e.toColumn })),
      })),
    [tables, edges]
  );

  // Untuk ekspor Mermaid: FK yang disembunyikan ikut tidak diekspor sebagai garis
  const visibleFkTables = useMemo(
    () =>
      tables.map((t) => ({
        ...t,
        foreign_keys: (t.foreign_keys ?? []).filter(
          (fk) =>
            !activeHiddenRelations.some(
              (h) =>
                h.fromTable === t.name &&
                h.fromColumn === fk.column &&
                h.toTable === fk.references_table &&
                h.toColumn === fk.references_column
            )
        ),
      })),
    [tables, activeHiddenRelations]
  );

  // Hanya sisi asal (seperti kolom FK), supaya ikon kolom sama persis dengan FK asli
  const virtualRelationsOf = (table: string, column: string) =>
    activeVirtualRelations.filter((r) => r.fromTable === table && r.fromColumn === column);

  const isTableConnectedToHovered = (tableName: string) => {
    if (!highlightTable) return false;
    if (tableName === highlightTable) return true;
    return edges.some(
      (e) =>
        (e.fromTable === highlightTable && e.toTable === tableName) ||
        (e.toTable === highlightTable && e.fromTable === tableName)
    );
  };

  const applyLayout = (style: string, currentTables = graphTables) => {
    if (currentTables.length === 0) return;

    const newPositions: Record<string, { x: number; y: number }> = {};
    // Dynamic spacing: use actual table height as basis
    const maxTableHeight = Math.max(...currentTables.map((t) => HEADER_HEIGHT + t.columns.length * COLUMN_HEIGHT + 10));
    const widthSpacing = CARD_WIDTH + 100;
    const heightSpacing = maxTableHeight + 50;
    const heightOf = (name: string) => {
      const table = currentTables.find((t) => t.name === name);
      return table ? getTableHeight(table) : maxTableHeight;
    };

    if (style === "grid") {
      // Masonry: tabel masuk ke kolom yang paling pendek, jadi tabel panjang tidak menyisakan ruang kosong besar
      const cols = Math.ceil(Math.sqrt(currentTables.length));
      const colHeights: number[] = Array(cols).fill(100);
      currentTables.forEach((table) => {
        const col = colHeights.indexOf(Math.min(...colHeights));
        newPositions[table.name] = {
          x: 100 + col * widthSpacing,
          y: colHeights[col],
        };
        colHeights[col] += getTableHeight(table) + 50;
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
            // Bounding box collision booster to prevent card overlapping
            const isOverlap = Math.abs(dx) < (CARD_WIDTH + 40) && Math.abs(dy) < (heightSpacing - 40);
            const force = isOverlap ? (repScale * 3) / (dist * dist) : repScale / (dist * dist);
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

      const innerRadius = Math.max(260, directNeighbors.length * 60);
      directNeighbors.forEach((name, index) => {
        const angle = (index / directNeighbors.length) * 2 * Math.PI;
        newPositions[name] = {
          x: Math.max(50, center.x + innerRadius * Math.cos(angle) - CARD_WIDTH / 2),
          y: Math.max(50, center.y + innerRadius * Math.sin(angle) - 100),
        };
      });

      const outerRadius = Math.max(innerRadius + 220, independent.length * 65);
      independent.forEach((name, index) => {
        const angle = (index / Math.max(1, independent.length)) * 2 * Math.PI + Math.PI / 4;
        newPositions[name] = {
          x: Math.max(50, center.x + outerRadius * Math.cos(angle) - CARD_WIDTH / 2),
          y: Math.max(50, center.y + outerRadius * Math.sin(angle) - 100),
        };
      });
    } else if (style === "smart-grid") {
      // Grid + Pusat Relasi (Smart Grid)
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

      // Assign columns (0 = Left, 1 = Center, 2 = Right)
      const colAssignments: Record<string, number> = {};
      currentTables.forEach((t) => {
        if (t.name === hubTable) {
          colAssignments[t.name] = 1;
        } else {
          const pointsToHub = t.foreign_keys?.some((fk) => fk.references_table === hubTable);
          const hubPointsToIt = currentTables.find((ct) => ct.name === hubTable)?.foreign_keys?.some((fk) => fk.references_table === t.name);

          if (pointsToHub && !hubPointsToIt) {
            colAssignments[t.name] = 0;
          } else if (hubPointsToIt && !pointsToHub) {
            colAssignments[t.name] = 2;
          } else {
            // Distribute remaining tables
            colAssignments[t.name] = (degrees[t.name] % 2 === 0) ? 0 : 2;
          }
        }
      });

      const colRows: Record<number, string[]> = { 0: [], 1: [], 2: [] };
      currentTables.forEach((t) => {
        const col = colAssignments[t.name];
        colRows[col].push(t.name);
      });

      // Keep Hub table centered in Column 1 list
      const col1List = colRows[1];
      if (col1List.includes(hubTable)) {
        const filtered = col1List.filter((n) => n !== hubTable);
        const midIdx = Math.floor(filtered.length / 2);
        filtered.splice(midIdx, 0, hubTable);
        colRows[1] = filtered;
      }

      [0, 1, 2].forEach((col) => {
        const list = colRows[col] || [];
        let y = 80;
        list.forEach((name) => {
          newPositions[name] = {
            x: 80 + col * widthSpacing,
            y,
          };
          y += heightOf(name) + 50;
        });
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
        let rowY = 80;
        for (let lvl = 0; lvl <= maxLevel; lvl++) {
          const group = levelGroups[lvl] || [];
          const totalWidth = group.length * widthSpacing;
          const startX = Math.max(50, 500 - totalWidth / 2);

          group.forEach((name, idx) => {
            newPositions[name] = {
              x: startX + idx * widthSpacing,
              y: rowY,
            };
          });
          // Tinggi baris = tabel tertinggi di level ini saja
          rowY += (group.length ? Math.max(...group.map(heightOf)) : 0) + 50;
        }
      } else {
        // Horizontal (Left-to-Right)
        for (let lvl = 0; lvl <= maxLevel; lvl++) {
          const group = levelGroups[lvl] || [];
          const colX = 80 + lvl * widthSpacing;
          const groupHeight = group.reduce((sum, name) => sum + heightOf(name) + 50, -50);
          let y = Math.max(50, 350 - groupHeight / 2);

          group.forEach((name) => {
            newPositions[name] = {
              x: colX,
              y,
            };
            y += heightOf(name) + 50;
          });
        }
      }
    }

    setPositions(newPositions);
    // Fit ke layar setiap kali layout dihitung ulang (data baru atau ganti layout)
    requestAnimationFrame(() => fitToView(newPositions, currentTables));
  };

  // Initialize table positions
  useEffect(() => {
    applyLayout(layoutStyle);
  }, [tables]);

  // Zoom ke titik (cx, cy) relatif container; titik di bawah kursor tetap diam di layar
  const zoomAt = (nextZoom: number, cx: number, cy: number) => {
    const { zoom: z, pan: p } = viewRef.current;
    const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom));
    const nextPan = {
      x: cx - ((cx - p.x) / z) * clamped,
      y: cy - ((cy - p.y) / z) * clamped,
    };
    viewRef.current = { zoom: clamped, pan: nextPan };
    setZoom(clamped);
    setPan(nextPan);
  };

  const zoomFromCenter = (factor: number) => {
    const el = containerRef.current;
    if (!el) return;
    zoomAt(viewRef.current.zoom * factor, el.clientWidth / 2, el.clientHeight / 2);
  };

  // Scroll = geser kanvas, Ctrl/⌘ + scroll (atau pinch trackpad) = zoom ke arah kursor.
  // Listener manual karena onWheel React bersifat passive (tidak bisa preventDefault).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : 1;
      if (e.ctrlKey || e.metaKey) {
        const rect = el.getBoundingClientRect();
        zoomAt(
          viewRef.current.zoom * Math.exp(-e.deltaY * unit * 0.0015),
          e.clientX - rect.left,
          e.clientY - rect.top
        );
        return;
      }
      // Shift + scroll = geser horizontal (untuk mouse tanpa scroll samping)
      const horizontalFromShift = e.shiftKey && e.deltaX === 0;
      const dx = (horizontalFromShift ? e.deltaY : e.deltaX) * unit;
      const dy = (horizontalFromShift ? 0 : e.deltaY) * unit;
      const { pan: p } = viewRef.current;
      const nextPan = { x: p.x - dx, y: p.y - dy };
      viewRef.current = { ...viewRef.current, pan: nextPan };
      setPan(nextPan);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
    // Pasang ulang saat ganti mode layar penuh (elemen kanvas dibuat ulang lewat portal)
  }, [expanded]);

  const toggleExpanded = () => {
    if (expanded) {
      setExpanded(false);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    } else {
      setExpanded(true);
      // Fullscreen seluruh halaman (bukan elemen diagram) supaya modal & toast tetap terlihat
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
  };

  // Ukuran kanvas berubah saat masuk/keluar layar penuh → fit ulang + kunci scroll halaman
  useEffect(() => {
    requestAnimationFrame(() => fitToView());
    if (!expanded) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  // Esc menutup layar penuh (kalau browser tidak masuk fullscreen); modal yang terbuka didahulukan
  const hasOpenModal = !!(pendingRelation || relationToDelete || showMermaid);
  const hasOpenModalRef = useRef(hasOpenModal);
  hasOpenModalRef.current = hasOpenModal;

  // Keluar fullscreen browser (Esc / F11) = keluar mode layar penuh juga, kecuali Esc tadi
  // dipakai menutup modal → diagram tetap besar (overlay), Esc berikutnya baru menutupnya
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && !hasOpenModalRef.current) setExpanded(false);
      requestAnimationFrame(() => fitToView());
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions, tables]);

  useEffect(() => {
    if (!expanded || hasOpenModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [expanded, hasOpenModal]);

  // Seret di area mana pun selain kartu tabel = geser kanvas
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest("[data-table-card]")) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  // Handle table card drag initiation
  const handleTableMouseDown = (e: React.MouseEvent, tableName: string) => {
    e.stopPropagation();
    setActiveDragTable(tableName);
    const pos = positions[tableName] || { x: 0, y: 0 };
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: pos.x,
      posY: pos.y,
    };
  };

  // Koordinat kursor di ruang kanvas (sebelum pan/zoom)
  const toCanvasPoint = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    return {
      x: (e.clientX - (rect?.left ?? 0) - pan.x) / zoom,
      y: (e.clientY - (rect?.top ?? 0) - pan.y) / zoom,
    };
  };

  const columnRefAt = (target: EventTarget): ColumnRef | null => {
    const row = (target as HTMLElement).closest<HTMLElement>("[data-column-row]");
    const { table, column } = row?.dataset ?? {};
    return table && column ? { table, column } : null;
  };

  // Mulai tarik garis relasi dari titik di kolom
  const handleLinkStart = (e: React.MouseEvent, from: ColumnRef) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    setLinkFrom(from);
    setLinkPointer(toCanvasPoint(e));
    setLinkTarget(null);
  };

  const finishLink = () => {
    if (linkFrom && linkTarget) {
      const draft = {
        fromTable: linkFrom.table,
        fromColumn: linkFrom.column,
        toTable: linkTarget.table,
        toColumn: linkTarget.column,
      };
      const alreadyLinked = edges.some(
        (edge) =>
          (edge.fromTable === draft.fromTable && edge.fromColumn === draft.fromColumn &&
            edge.toTable === draft.toTable && edge.toColumn === draft.toColumn) ||
          (edge.fromTable === draft.toTable && edge.fromColumn === draft.toColumn &&
            edge.toTable === draft.fromTable && edge.toColumn === draft.fromColumn)
      );
      // Menarik ulang FK yang tadi disembunyikan = tampilkan lagi FK aslinya
      const hiddenFk = activeHiddenRelations.find(
        (h) =>
          (h.fromTable === draft.fromTable && h.fromColumn === draft.fromColumn &&
            h.toTable === draft.toTable && h.toColumn === draft.toColumn) ||
          (h.fromTable === draft.toTable && h.fromColumn === draft.toColumn &&
            h.toTable === draft.fromTable && h.toColumn === draft.fromColumn)
      );
      if (alreadyLinked) {
        toast.info("Kedua kolom ini sudah terhubung.");
      } else if (hiddenFk) {
        unhideRelations([hiddenFk.id]);
        toast.success("Relasi FK dari SQL ditampilkan lagi.");
      } else {
        setPendingRelation({ ...draft, id: relationId(draft) });
      }
    }
    setLinkFrom(null);
    setLinkPointer(null);
    setLinkTarget(null);
  };

  // Mouse move handler for drag & pan
  const handleMouseMove = (e: React.MouseEvent) => {
    if (linkFrom) {
      setLinkPointer(toCanvasPoint(e));
      const target = columnRefAt(e.target);
      const isSameColumn = target && target.table === linkFrom.table && target.column === linkFrom.column;
      setLinkTarget(target && !isSameColumn ? target : null);
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
    } else if (activeDragTable) {
      // Selisih mouse (px layar) dibagi zoom supaya tabel bergerak sejalan dengan kursor
      const start = dragStartRef.current;
      const x = start.posX + (e.clientX - start.mouseX) / zoom;
      const y = start.posY + (e.clientY - start.mouseY) / zoom;
      setPositions((prev) => ({
        ...prev,
        [activeDragTable]: { x, y },
      }));
    }
  };

  // Mouse up handler
  const handleMouseUp = () => {
    if (linkFrom) finishLink();
    setIsPanning(false);
    setActiveDragTable(null);
  };

  // Kursor keluar kanvas saat menarik garis = batal
  const handleMouseLeave = () => {
    setLinkFrom(null);
    setLinkPointer(null);
    setLinkTarget(null);
    setIsPanning(false);
    setActiveDragTable(null);
  };

  // Auto zoom fit layout (Dynamic Bounding Box calculation)
  const fitToView = (pos = positions, list = tables) => {
    if (list.length === 0 || !containerRef.current) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      return;
    }

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    list.forEach((table) => {
      const p = pos[table.name];
      if (p) {
        const tableHeight = getTableHeight(table);
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x + CARD_WIDTH > maxX) maxX = p.x + CARD_WIDTH;
        if (p.y + tableHeight > maxY) maxY = p.y + tableHeight;
      }
    });

    if (minX === Infinity || minY === Infinity) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      return;
    }

    // Area aman (px layar): atas dipakai toolbar layout/zoom, bawah dipakai petunjuk navigasi
    const SAFE_TOP = 68;
    const SAFE_BOTTOM = 44;
    const SAFE_SIDE = 24;
    const availWidth = containerWidth - SAFE_SIDE * 2;
    const availHeight = containerHeight - SAFE_TOP - SAFE_BOTTOM;

    let nextZoom = Math.min(availWidth / (maxX - minX), availHeight / (maxY - minY));
    // Semua tabel harus muat; zoom maksimal 1.3 supaya diagram kecil tidak terlalu besar
    nextZoom = Math.max(MIN_ZOOM, Math.min(1.3, nextZoom));

    const boxCenterX = minX + (maxX - minX) / 2;
    const boxCenterY = minY + (maxY - minY) / 2;

    const nextPanX = SAFE_SIDE + availWidth / 2 - boxCenterX * nextZoom;
    const nextPanY = SAFE_TOP + availHeight / 2 - boxCenterY * nextZoom;

    setZoom(nextZoom);
    setPan({ x: nextPanX, y: nextPanY });
  };

  // Export diagram to PNG
  const handleDownloadDiagram = async () => {
    if (!canvasRef.current || tables.length === 0) return;
    setDownloading(true);

    try {
      // Find bounding box to fit the output image size perfectly
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      tables.forEach((table) => {
        const pos = positions[table.name];
        if (pos) {
          const tableHeight = getTableHeight(table);
          if (pos.x < minX) minX = pos.x;
          if (pos.y < minY) minY = pos.y;
          if (pos.x + CARD_WIDTH > maxX) maxX = pos.x + CARD_WIDTH;
          if (pos.y + tableHeight > maxY) maxY = pos.y + tableHeight;
        }
      });

      const padding = 40;
      const width = maxX - minX + padding * 2;
      const height = maxY - minY + padding * 2;

      // Capture canvas
      const dataUrl = await toPng(canvasRef.current, {
        width: width,
        height: height,
        style: {
          transform: `translate(${-minX + padding}px, ${-minY + padding}px) scale(1)`,
          transformOrigin: "top left",
          width: `${width}px`,
          height: `${height}px`,
        },
        backgroundColor: "#f9fafb", // clean background color matching user theme
        quality: 0.95,
      });

      // Trigger download link
      const link = document.createElement("a");
      link.download = `msf-database-diagram-${new Date().toISOString().slice(0,10)}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Diagram database berhasil diunduh!");
    } catch (error: any) {
      console.error("Gagal mendownload diagram:", error);
      toast.error("Gagal mendownload diagram database.");
    } finally {
      setDownloading(false);
    }
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

    edges.forEach((edge) => {
        const sourcePos = positions[edge.fromTable];
        const targetPos = positions[edge.toTable];

        if (!sourcePos || !targetPos) return;

        const sourceTableMeta = tables.find((t) => t.name === edge.fromTable);
        const targetTableMeta = tables.find((t) => t.name === edge.toTable);

        if (!sourceTableMeta || !targetTableMeta) return;

        relationIndex++;

        // FK row-level exit/entry Y positions
        const sourceY = rowCenterY(edge.fromTable, edge.fromColumn);
        const targetY = rowCenterY(edge.toTable, edge.toColumn);

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
        const sideCount = exitCounts[edge.fromTable][side];
        exitCounts[edge.fromTable][side]++;
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
          pathD = `M ${adjustedStartX} ${sourceY} H ${stubX} V ${targetY} H ${endX}`;
        }

        const isConnectedToHovered =
          highlightTable && (edge.fromTable === highlightTable || edge.toTable === highlightTable);
        const opacity = highlightTable ? (isConnectedToHovered ? 1 : 0.15) : 1;

        // Arah datang garis ke tabel tujuan (jalur memutar datang dari luar kartu)
        const arrowPointsRight = isOverlapping ? side === "left" : side === "right";
        const arrowBaseX = arrowPointsRight ? endX - 6 : endX + 6;
        const virtual = edge.virtual;
        const color = RELATION_COLOR;

        paths.push(
          <g
            key={edge.key}
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
              stroke={color}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            {/* Arrowhead at target end */}
            <polygon
              points={`${arrowBaseX},${targetY - 4} ${arrowBaseX},${targetY + 4} ${endX},${targetY}`}
              fill={color}
            />
            {/* Dot at source exit */}
            <circle cx={adjustedStartX} cy={sourceY} r={3} fill={color} />
            {/* Area klik lebar (tak terlihat) untuk menghapus garis relasi */}
            <path
              d={pathD}
              fill="none"
              stroke="transparent"
              strokeWidth={12}
              data-relation={edge.relation.id}
              data-virtual={virtual || undefined}
              style={{ pointerEvents: "stroke", cursor: "pointer" }}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setRelationToDelete({ relation: edge.relation, virtual })}
            >
              <title>{`${virtual ? "Relasi virtual" : "Relasi FK"}: ${edge.fromTable}.${edge.fromColumn} → ${edge.toTable}.${edge.toColumn} (klik untuk hapus)`}</title>
            </path>
          </g>
        );
    });

    return paths;
  };

  // Garis sementara saat user menarik dari titik kolom ke kursor
  const renderLinkPreview = () => {
    if (!linkFrom || !linkPointer) return null;
    const pos = positions[linkFrom.table];
    if (!pos) return null;
    const startY = rowCenterY(linkFrom.table, linkFrom.column);
    const startX = linkPointer.x >= pos.x + CARD_WIDTH / 2 ? pos.x + CARD_WIDTH : pos.x;
    return (
      <g>
        <path
          d={`M ${startX} ${startY} L ${linkPointer.x} ${linkPointer.y}`}
          stroke={RELATION_COLOR}
          strokeWidth={2}
          strokeDasharray="6 4"
          fill="none"
        />
        <circle cx={startX} cy={startY} r={4} fill={RELATION_COLOR} />
        <circle cx={linkPointer.x} cy={linkPointer.y} r={5} fill="none" stroke={RELATION_COLOR} strokeWidth={2} />
      </g>
    );
  };

  const content = (
    <div
      className={cn(
        "border-border overflow-hidden select-none",
        // bg-gray-50 di dark mode semi-transparan, jadi layar penuh pakai warna dasar halaman yang solid
        expanded ? "fixed inset-0 z-[100] bg-background" : "relative w-full h-[600px] border rounded-2xl shadow-inner bg-gray-50"
      )}
    >
      {/* Layout Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-xl shadow-sm">
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
          <option value="smart-grid">🧱 Grid + Pusat Relasi</option>
          <option value="radial">⬤ Lingkaran</option>
          <option value="centric">🎯 Pusat Relasi</option>
          <option value="organic">🌀 Organik (Force)</option>
        </select>
      </div>

      {/* Zoom / Pan / Download Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-1.5 bg-white border border-border p-1.5 rounded-xl shadow-sm">
        <button
          type="button"
          onClick={() => setShowMermaid(true)}
          className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-1"
          title="Ekspor Kode Mermaid.js"
        >
          <GitBranch className="h-4 w-4 text-purple-500" />
        </button>
        <div className="w-[1px] bg-border my-0.5" />
        <button
          type="button"
          disabled={downloading}
          onClick={handleDownloadDiagram}
          className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors flex items-center justify-center disabled:opacity-50"
          title="Unduh Diagram (PNG)"
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
          ) : (
            <Download className="h-4 w-4 text-accent" />
          )}
        </button>
        <div className="w-[1px] bg-border my-0.5" />
        <button
          type="button"
          onClick={() => zoomFromCenter(1.2)}
          className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => zoomFromCenter(1 / 1.2)}
          className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => fitToView()}
          className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
          title="Pusatkan Layar (Fit)"
        >
          <Scan className="h-4 w-4" />
        </button>
        <div className="w-[1px] bg-border my-0.5" />
        <button
          type="button"
          onClick={toggleExpanded}
          className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
          title={expanded ? "Keluar Layar Penuh (Esc)" : "Layar Penuh"}
          aria-pressed={expanded}
        >
          {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleContainerMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={cn("w-full h-full", linkFrom ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing")}
      >
        <div
          ref={canvasRef}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
          className="relative w-[5000px] h-[5000px] transition-transform duration-75 ease-out"
        >
          {/* SVG Connection Lines Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
            {renderRelations()}
          </svg>

          {/* Table Cards */}
          {tables.map((table) => {
            const pos = positions[table.name] || { x: 0, y: 0 };
            return (
              <div
                key={table.name}
                data-table-card
                onMouseEnter={() => setHoveredTable(table.name)}
                onMouseLeave={() => setHoveredTable(null)}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  width: `${CARD_WIDTH}px`,
                  opacity: highlightTable && highlightTable !== table.name && !isTableConnectedToHovered(table.name) ? 0.35 : 1,
                  transform: highlightTable === table.name ? "scale(1.02)" : "scale(1)",
                  transition: "opacity 0.2s ease-in-out, transform 0.2s ease-in-out, border-color 0.2s, box-shadow 0.2s",
                }}
                className={cn(
                  "absolute bg-white border rounded-xl shadow-card font-mono overflow-hidden",
                  highlightTable === table.name ? "border-accent ring-2 ring-accent/15 z-25 shadow-card-hover" : "border-border z-10"
                )}
              >
                {/* Drag Handle Table Header */}
                <div
                  onMouseDown={(e) => handleTableMouseDown(e, table.name)}
                  style={{ height: HEADER_HEIGHT - 5 }}
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
                    const colVirtual = virtualRelationsOf(table.name, col.name);
                    const isVirtual = colVirtual.length > 0;
                    const isLinkSource = linkFrom?.table === table.name && linkFrom.column === col.name;
                    const isLinkTarget = linkTarget?.table === table.name && linkTarget.column === col.name;

                    return (
                      <div
                        key={col.name}
                        data-column-row
                        data-table={table.name}
                        data-column={col.name}
                        style={{ height: COLUMN_HEIGHT }}
                        className={cn(
                          "group relative px-3.5 py-1.5 flex items-center justify-between text-[10px]",
                          isLinkTarget || isLinkSource
                            ? "bg-accent/15 ring-1 ring-inset ring-accent"
                            : linkFrom
                              ? "hover:bg-accent/10"
                              : "hover:bg-gray-50/70"
                        )}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {isPK && <Key className="h-3 w-3 text-amber-500 shrink-0" />}
                          {/* FK asli & relasi virtual tampil sama: satu ikon link (detail relasi virtual di tooltip) */}
                          {(isFK || isVirtual) && (
                            <span
                              className="shrink-0"
                              title={
                                isVirtual
                                  ? colVirtual
                                      .map((r) => `Relasi virtual: ${r.fromTable}.${r.fromColumn} → ${r.toTable}.${r.toColumn}`)
                                      .join("\n")
                                  : undefined
                              }
                            >
                              <LinkIcon className="h-3 w-3 text-accent" />
                            </span>
                          )}
                          <span
                            className={cn(
                              "truncate",
                              "text-gray-900",
                              (isPK || isFK || isVirtual) && "font-bold"
                            )}
                          >
                            {col.name}
                          </span>
                        </div>
                        <span className="text-muted-foreground shrink-0 pl-2">
                          {col.data_type.toLowerCase()}
                        </span>
                        {/* Titik tarik: drag ke kolom tabel lain untuk membuat relasi virtual */}
                        <span
                          data-link-handle
                          onMouseDown={(e) => handleLinkStart(e, { table: table.name, column: col.name })}
                          title="Tarik ke kolom tabel lain untuk membuat relasi"
                          className={cn(
                            "absolute right-0.5 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full border-2 border-accent bg-white cursor-crosshair transition-opacity",
                            isLinkSource ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          )}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Garis preview saat menarik relasi — di atas kartu supaya terlihat sampai kolom tujuan */}
          {linkFrom && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-30">
              {renderLinkPreview()}
            </svg>
          )}
        </div>
      </div>

      {/* Petunjuk navigasi + level zoom */}
      <div className="absolute bottom-3 left-4 z-20 bg-white border border-border px-2.5 py-1 rounded-lg shadow-sm text-[10px] font-mono text-muted-foreground pointer-events-none">
        {linkFrom
          ? `Lepas di kolom tabel tujuan · dari ${linkFrom.table}.${linkFrom.column}`
          : `Seret / scroll: geser · Ctrl + scroll: zoom · tarik titik ● di kolom: buat relasi · ${Math.round(zoom * 100)}%`}
      </div>

      {/* Konfirmasi buat relasi virtual */}
      {pendingRelation && (
        <VirtualRelationModal
          mode="create"
          relation={pendingRelation}
          fromColumn={findColumn(pendingRelation.fromTable, pendingRelation.fromColumn)}
          toColumn={findColumn(pendingRelation.toTable, pendingRelation.toColumn)}
          onCancel={() => setPendingRelation(null)}
          onSwap={() => {
            const swapped = {
              fromTable: pendingRelation.toTable,
              fromColumn: pendingRelation.toColumn,
              toTable: pendingRelation.fromTable,
              toColumn: pendingRelation.fromColumn,
            };
            setPendingRelation({ ...swapped, id: relationId(swapped) });
          }}
          onConfirm={() => {
            addRelation(pendingRelation);
            toast.success(`Relasi ${pendingRelation.fromTable} → ${pendingRelation.toTable} ditambahkan.`);
            setPendingRelation(null);
          }}
        />
      )}

      {/* FK yang disembunyikan bisa ditampilkan lagi semuanya */}
      {activeHiddenRelations.length > 0 && !linkFrom && (
        <button
          type="button"
          onClick={() => {
            unhideRelations(activeHiddenRelations.map((r) => r.id));
            toast.success("Semua relasi FK ditampilkan lagi.");
          }}
          title={activeHiddenRelations.map((r) => `${r.fromTable}.${r.fromColumn} → ${r.toTable}.${r.toColumn}`).join("\n")}
          className="absolute bottom-11 left-4 z-20 flex items-center gap-1.5 bg-white border border-border px-2.5 py-1 rounded-lg shadow-sm text-[10px] font-mono text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors"
        >
          <EyeOff className="h-3 w-3" />
          {activeHiddenRelations.length} relasi FK disembunyikan · <span className="font-bold text-accent">Tampilkan</span>
        </button>
      )}

      {/* Konfirmasi hapus garis relasi (klik garisnya): virtual dihapus, FK asli disembunyikan */}
      {relationToDelete && (
        <VirtualRelationModal
          mode="delete"
          source={relationToDelete.virtual ? "virtual" : "fk"}
          relation={relationToDelete.relation}
          onCancel={() => setRelationToDelete(null)}
          onConfirm={() => {
            if (relationToDelete.virtual) {
              removeRelation(relationToDelete.relation.id);
              toast.success("Relasi virtual dihapus.");
            } else {
              hideRelation(relationToDelete.relation);
              toast.success("Relasi FK dihapus dari diagram (SQL tidak berubah).");
            }
            setRelationToDelete(null);
          }}
        />
      )}

      {/* Mermaid ERD Export Modal */}
      {showMermaid && (
        <MermaidExportModal
          tables={visibleFkTables}
          virtualRelations={activeVirtualRelations}
          onClose={() => setShowMermaid(false)}
        />
      )}
    </div>
  );

  // Portal ke body: induk halaman punya animasi transform yang membuat `fixed` tidak menutupi layar
  return expanded ? createPortal(content, document.body) : content;
}

// Simple CN utility replacement for file independence
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
