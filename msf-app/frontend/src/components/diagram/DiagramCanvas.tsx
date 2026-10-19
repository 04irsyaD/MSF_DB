"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { TableMetadata } from "@/lib/types";
import { type LayoutStyle } from "@/lib/diagram/constants";
import {
  boundingBox,
  buildRelations,
  contentBox,
  tableKey,
  type Point,
  type Positions,
} from "@/lib/diagram/geometry";
import { computeLayout } from "@/lib/diagram/layouts";
import MermaidExportModal from "@/components/diagram/MermaidExportModal";
import DiagramToolbar from "@/components/diagram/DiagramToolbar";
import RelationLines from "@/components/diagram/RelationLines";
import TableCard, { type CardEmphasis } from "@/components/diagram/TableCard";
import { useCanvasViewport } from "@/components/diagram/useCanvasViewport";
import { cn } from "@/lib/utils";

interface DiagramCanvasProps {
  tables: TableMetadata[];
}

interface Gesture {
  mode: "pan" | "drag" | "pinch" | null;
  tableId: string | null;
  last: Point;
  pointers: Map<number, Point>;
  startDistance: number;
  startZoom: number;
}

/**
 * Warna latar solid yang terlihat di belakang `el`: komposit latar elemen dan para induknya
 * (latar kanvas di tema dark semi-transparan), agar PNG ekspor tidak tembus pandang.
 */
function opaqueBackground(el: HTMLElement | null): string {
  const layers: number[][] = [];
  for (let node = el; node; node = node.parentElement) {
    const m = getComputedStyle(node).backgroundColor.match(/[\d.]+/g);
    if (!m) continue;
    const [r, g, b, a = 1] = m.map(Number);
    if (a === 0) continue;
    layers.push([r, g, b, a]);
    if (a >= 1) break;
  }
  let [r, g, b] = [255, 255, 255];
  for (const [lr, lg, lb, la] of layers.reverse()) {
    r = lr * la + r * (1 - la);
    g = lg * la + g * (1 - la);
    b = lb * la + b * (1 - la);
  }
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

const FOCUSABLE ='button:not([disabled]), select, [href], input, textarea, [tabindex]:not([tabindex="-1"])';

export default function DiagramCanvas({ tables }: DiagramCanvasProps) {
  const [layout, setLayout] = useState<LayoutStyle>("horizontal");
  const [positions, setPositions] = useState<Positions>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMermaid, setShowMermaid] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<Gesture>({
    mode: null,
    tableId: null,
    last: { x: 0, y: 0 },
    pointers: new Map(),
    startDistance: 1,
    startZoom: 1,
  });

  const box = useMemo(() => contentBox(tables, positions), [tables, positions]);
  const relations = useMemo(() => buildRelations(tables, positions), [tables, positions]);
  const { view, fit, requestFit, zoomIn, zoomOut, zoomTo, panBy, pendingFitRef } = useCanvasViewport(
    container,
    () => boundingBox(tables, positions)
  );

  // Data baru atau layout baru: hitung ulang posisi lalu Fit (C-03: tidak bergantung jumlah tabel)
  useEffect(() => {
    setPositions(computeLayout(layout, tables));
    requestFit();
  }, [tables, layout, requestFit]);

  useEffect(() => {
    if (pendingFitRef.current) fit();
  }, [positions, fit, pendingFitRef]);

  // Fullscreen: Esc untuk keluar, kunci scroll body, fokus ke tombol toggle (bukan saat mount pertama)
  const prevFullscreenRef = useRef(isFullscreen);
  useEffect(() => {
    if (prevFullscreenRef.current !== isFullscreen) {
      prevFullscreenRef.current = isFullscreen;
      frameRef.current?.querySelector<HTMLElement>("[data-fullscreen-toggle]")?.focus({ preventScroll: true });
    }
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen || showMermaid) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isFullscreen, showMermaid]);

  const toggleFullscreen = () => {
    requestFit();
    setIsFullscreen((v) => !v);
  };

  const trapFocus = (e: React.KeyboardEvent) => {
    if (!isFullscreen || e.key !== "Tab" || !frameRef.current) return;
    const items = Array.from(frameRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // ---- Pointer: pan kanvas, drag tabel, pinch zoom (mouse + touch) ----
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const g = gestureRef.current;
    g.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);

    if (g.pointers.size === 2) {
      const [a, b] = Array.from(g.pointers.values());
      g.mode = "pinch";
      g.startDistance = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      g.startZoom = view.zoom;
      return;
    }
    const handle = (e.target as HTMLElement).closest<HTMLElement>("[data-drag-handle]");
    g.mode = handle ? "drag" : "pan";
    g.tableId = handle?.dataset.dragHandle ?? null;
    g.last = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gestureRef.current;
    if (!g.pointers.has(e.pointerId)) return;
    g.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (g.mode === "pinch" && g.pointers.size >= 2) {
      const [a, b] = Array.from(g.pointers.values());
      const rect = e.currentTarget.getBoundingClientRect();
      const distance = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      zoomTo(g.startZoom * (distance / g.startDistance), {
        x: (a.x + b.x) / 2 - rect.left,
        y: (a.y + b.y) / 2 - rect.top,
      });
      return;
    }

    const dx = e.clientX - g.last.x;
    const dy = e.clientY - g.last.y;
    g.last = { x: e.clientX, y: e.clientY };
    if (g.mode === "pan") {
      panBy(dx, dy);
    } else if (g.mode === "drag" && g.tableId) {
      const id = g.tableId;
      // C-06: delta layar dibagi zoom agar tabel menempel ke kursor
      setPositions((prev) =>
        prev[id] ? { ...prev, [id]: { x: prev[id].x + dx / view.zoom, y: prev[id].y + dy / view.zoom } } : prev
      );
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gestureRef.current;
    g.pointers.delete(e.pointerId);
    if (g.pointers.size === 0) {
      g.mode = null;
      g.tableId = null;
    } else if (g.mode === "pinch") {
      g.mode = null; // tunggu semua jari diangkat sebelum gesture baru
    }
  };

  // ---- Hover: tabel aktif, tabel terkait, sisanya diredupkan ----
  const relatedIds = useMemo(() => {
    const ids = new Set<string>();
    if (!hoveredId) return ids;
    relations.forEach((r) => {
      if (r.sourceKey === hoveredId) ids.add(r.targetKey);
      if (r.targetKey === hoveredId) ids.add(r.sourceKey);
    });
    return ids;
  }, [hoveredId, relations]);

  const emphasisOf = (id: string): CardEmphasis => {
    if (!hoveredId) return "normal";
    if (id === hoveredId) return "active";
    return relatedIds.has(id) ? "related" : "dim";
  };

  const handleHover = useCallback((id: string | null) => {
    if (!gestureRef.current.mode) setHoveredId(id);
  }, []);

  // ---- Ekspor PNG (C-15: latar mengikuti tema, guard bounding box kosong) ----
  const handleDownloadDiagram = async () => {
    if (!canvasRef.current || !box || tables.length === 0) {
      toast.error("Diagram belum siap untuk diunduh.");
      return;
    }
    setDownloading(true);
    // Hapus efek hover secara sinkron agar tidak ada kartu redup di gambar
    flushSync(() => setHoveredId(null));
    try {
      const width = Math.ceil(box.maxX - box.minX);
      const height = Math.ceil(box.maxY - box.minY);
      const node = canvasRef.current;
      const options = {
        width,
        height,
        backgroundColor: opaqueBackground(container),
        style: {
          transform: `translate(${-box.minX}px, ${-box.minY}px)`,
          transformOrigin: "top left",
          width: `${width}px`,
          height: `${height}px`,
        },
      };
      // Embed font html-to-image gagal di Firefox ("t is undefined"); ulangi tanpa embed font
      const dataUrl = await toPng(node, options).catch(() => toPng(node, { ...options, skipFonts: true }));
      const link = document.createElement("a");
      link.download = `msf-database-diagram-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Diagram database berhasil diunduh!");
    } catch (error) {
      console.error("Gagal mendownload diagram:", error);
      toast.error("Gagal mendownload diagram database.");
    } finally {
      setDownloading(false);
    }
  };

  const frame = (
    <div
      ref={frameRef}
      onKeyDown={trapFocus}
      role={isFullscreen ? "dialog" : undefined}
      aria-modal={isFullscreen || undefined}
      aria-label={isFullscreen ? "Diagram layar penuh" : undefined}
      className={cn(
        "flex",
        isFullscreen ? "fixed inset-0 z-[100] bg-background p-3 sm:p-4" : "relative flex-1 min-h-0 w-full"
      )}
    >
      <div className="relative flex-1 min-h-0 w-full border border-border bg-gray-50 rounded-2xl overflow-hidden shadow-inner select-none">
        <DiagramToolbar
          layout={layout}
          onLayoutChange={setLayout}
          zoom={view.zoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onFit={fit}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onExportMermaid={() => setShowMermaid(true)}
          onDownloadPng={handleDownloadDiagram}
          downloading={downloading}
        />

        <div
          ref={setContainer}
          data-diagram-viewport
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        >
          <div
            ref={canvasRef}
            className="absolute left-0 top-0 origin-top-left"
            style={{
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
              width: box ? Math.max(0, box.maxX) : 0,
              height: box ? Math.max(0, box.maxY) : 0,
            }}
          >
            {box && <RelationLines relations={relations} box={box} hoveredId={hoveredId} />}
            {tables.map((table) => {
              const id = tableKey(table);
              const pos = positions[id];
              if (!pos) return null;
              return (
                <TableCard
                  key={id}
                  table={table}
                  tableId={id}
                  x={pos.x}
                  y={pos.y}
                  emphasis={emphasisOf(id)}
                  onHover={handleHover}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isFullscreen ? createPortal(frame, document.body) : frame}
      {showMermaid && <MermaidExportModal tables={tables} onClose={() => setShowMermaid(false)} />}
    </>
  );
}
