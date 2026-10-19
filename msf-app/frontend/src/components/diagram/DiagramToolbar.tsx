"use client";

import { Download, GitBranch, Loader2, Maximize, Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react";
import { LAYOUT_OPTIONS, type LayoutStyle } from "@/lib/diagram/constants";

interface DiagramToolbarProps {
  layout: LayoutStyle;
  onLayoutChange: (layout: LayoutStyle) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onExportMermaid: () => void;
  onDownloadPng: () => void;
  downloading: boolean;
}

const BUTTON =
  "h-8 w-8 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors flex items-center justify-center " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50";

export default function DiagramToolbar(props: DiagramToolbarProps) {
  const { layout, onLayoutChange, zoom, isFullscreen, downloading } = props;

  return (
    <div
      data-diagram-toolbar
      className="absolute top-3 inset-x-3 z-20 flex flex-wrap items-start justify-between gap-2 pointer-events-none"
    >
      <label className="pointer-events-auto flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-xl shadow-sm">
        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider font-mono">Layout:</span>
        <select
          value={layout}
          onChange={(e) => onLayoutChange(e.target.value as LayoutStyle)}
          className="bg-gray-50 border border-border rounded-lg px-2 py-1 text-[11px] font-mono text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
        >
          {LAYOUT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <div className="pointer-events-auto flex items-center gap-1 bg-white border border-border p-1 rounded-xl shadow-sm">
        <button type="button" onClick={props.onExportMermaid} className={BUTTON} aria-label="Ekspor kode Mermaid.js" title="Ekspor kode Mermaid.js">
          <GitBranch className="h-4 w-4 text-purple-500" />
        </button>
        <button
          type="button"
          disabled={downloading}
          onClick={props.onDownloadPng}
          className={BUTTON}
          aria-label="Unduh diagram (PNG)"
          title="Unduh diagram (PNG)"
        >
          {downloading ? <Loader2 className="h-4 w-4 animate-spin text-accent" /> : <Download className="h-4 w-4 text-accent" />}
        </button>
        <div className="w-px h-5 bg-border mx-0.5" />
        <button type="button" onClick={props.onZoomOut} className={BUTTON} aria-label="Perkecil" title="Perkecil (Ctrl + scroll)">
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="min-w-[3rem] text-center text-[11px] font-mono font-bold text-gray-700 tabular-nums" aria-live="polite">
          {Math.round(zoom * 100)}%
        </span>
        <button type="button" onClick={props.onZoomIn} className={BUTTON} aria-label="Perbesar" title="Perbesar (Ctrl + scroll)">
          <ZoomIn className="h-4 w-4" />
        </button>
        <button type="button" onClick={props.onFit} className={BUTTON} aria-label="Pusatkan layar (Fit)" title="Pusatkan layar (Fit)">
          <Maximize className="h-4 w-4" />
        </button>
        <div className="w-px h-5 bg-border mx-0.5" />
        <button
          type="button"
          onClick={props.onToggleFullscreen}
          className={BUTTON}
          aria-label={isFullscreen ? "Keluar layar penuh" : "Layar penuh"}
          aria-pressed={isFullscreen}
          title={isFullscreen ? "Keluar layar penuh (Esc)" : "Layar penuh"}
          data-fullscreen-toggle
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
