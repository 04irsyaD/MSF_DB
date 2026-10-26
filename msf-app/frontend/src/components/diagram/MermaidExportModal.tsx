"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Copy, Check, GitBranch, ExternalLink } from "lucide-react";
import { TableMetadata } from "@/lib/types";
import { toMermaidERD, MermaidVirtualRelation } from "@/lib/mermaidGenerator";
import { toast } from "sonner";

interface MermaidExportModalProps {
  tables: TableMetadata[];
  /** Relasi virtual dari diagram, diekspor sebagai garis putus-putus */
  virtualRelations?: MermaidVirtualRelation[];
  onClose: () => void;
}

export default function MermaidExportModal({ tables, virtualRelations = [], onClose }: MermaidExportModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied]   = useState(false);

  const mermaidCode = toMermaidERD(tables, virtualRelations);

  useEffect(() => {
    setMounted(true);
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(mermaidCode).then(() => {
      setCopied(true);
      toast.success("Kode Mermaid berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyWithFence = () => {
    const withFence = "```mermaid\n" + mermaidCode + "\n```";
    navigator.clipboard.writeText(withFence).then(() => {
      toast.success("Disalin dengan blok kode Markdown!");
    });
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Panel */}
      <div
        className="relative z-[201] w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-accent/10">
              <GitBranch className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Ekspor Kode Mermaid.js</h2>
              <p className="text-[10px] text-muted-foreground">
                {tables.length} tabel — salin dan tempel ke GitHub, Notion, GitLab, atau dbdiagram.io
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="mx-5 mt-4 px-3 py-2.5 bg-accent/5 border border-accent/20 rounded-xl flex items-start gap-2 shrink-0">
          <ExternalLink className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Salin kode di bawah lalu tempel ke file <code className="text-accent">.md</code> di GitHub/GitLab
            (dalam blok <code className="text-accent">```mermaid</code>), atau langsung ke
            <strong className="text-foreground"> Notion / dbdiagram.io</strong>.
          </p>
        </div>

        {/* Code Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
          <textarea
            readOnly
            value={mermaidCode}
            className="w-full h-full min-h-[260px] bg-muted/40 border border-border rounded-xl p-3.5 text-[10px] font-mono text-foreground resize-none focus:outline-none focus:border-accent/50 transition-colors leading-relaxed"
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between gap-3 px-5 pb-5 pt-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyWithFence}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-accent/40 text-muted-foreground hover:text-foreground text-[10px] font-mono font-bold transition-colors"
          >
            Salin dengan ```mermaid
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accent/90 text-white text-[11px] font-bold transition-all shadow-sm"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Tersalin!" : "Salin Kode"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
