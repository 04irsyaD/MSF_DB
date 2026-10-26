"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Link2, ArrowRight, ArrowLeftRight, TriangleAlert, Trash2 } from "lucide-react";
import { ColumnMetadata } from "@/lib/types";
import { VirtualRelation, getRelationWarnings } from "@/components/diagram/useVirtualRelations";

interface VirtualRelationModalProps {
  mode: "create" | "delete";
  relation: VirtualRelation;
  fromColumn?: ColumnMetadata;
  toColumn?: ColumnMetadata;
  onConfirm: () => void;
  onCancel: () => void;
  /** Hanya mode create: balik arah relasi (A→B jadi B→A) */
  onSwap?: () => void;
}

export default function VirtualRelationModal({
  mode,
  relation,
  fromColumn,
  toColumn,
  onConfirm,
  onCancel,
  onSwap,
}: VirtualRelationModalProps) {
  const [mounted, setMounted] = useState(false);
  const isCreate = mode === "create";
  const warnings = isCreate ? getRelationWarnings(fromColumn, toColumn) : [];

  useEffect(() => {
    setMounted(true);
    // Enter sudah ditangani tombol konfirmasi yang autoFocus
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  if (!mounted) return null;

  const endpoint = (table: string, column: string, meta?: ColumnMetadata) => (
    <div className="flex-1 min-w-0 bg-muted/40 border border-border rounded-xl px-3 py-2.5">
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Tabel</p>
      <p className="text-xs font-bold text-foreground truncate" title={table}>{table}</p>
      <p className="mt-1.5 text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Kolom</p>
      <p className="text-xs font-bold text-amber-500 truncate" title={column}>
        {column}
        {meta && <span className="ml-1.5 font-normal text-muted-foreground">{meta.data_type.toLowerCase()}</span>}
      </p>
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="virtual-relation-title"
        className="relative z-[201] w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className={isCreate ? "p-1.5 rounded-lg bg-amber-500/10" : "p-1.5 rounded-lg bg-red-500/10"}>
              {isCreate ? <Link2 className="h-4 w-4 text-amber-500" /> : <Trash2 className="h-4 w-4 text-red-500" />}
            </div>
            <h2 id="virtual-relation-title" className="text-sm font-bold text-foreground">
              {isCreate ? "Hubungkan tabel?" : "Hapus relasi virtual?"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {isCreate ? "Apakah benar tabel " : "Garis dari tabel "}
            <strong className="text-foreground">{relation.fromTable}</strong>
            {isCreate ? " terhubung ke tabel " : " ke tabel "}
            <strong className="text-foreground">{relation.toTable}</strong>
            {isCreate ? " melalui kolom ini?" : " akan dihapus dari diagram."}
          </p>

          <div className="flex items-center gap-2">
            {endpoint(relation.fromTable, relation.fromColumn, fromColumn)}
            <ArrowRight className="h-4 w-4 text-amber-500 shrink-0" />
            {endpoint(relation.toTable, relation.toColumn, toColumn)}
          </div>

          {warnings.map((w) => (
            <div
              key={w}
              className="flex items-start gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl"
            >
              <TriangleAlert className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-[10px] text-foreground leading-relaxed">{w}</p>
            </div>
          ))}

          {isCreate && (
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Relasi ini hanya ada di diagram (SQL tidak diubah) dan tersimpan di browser ini. Klik garisnya untuk
              menghapus.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 px-5 pb-5">
          {isCreate && onSwap ? (
            <button
              type="button"
              onClick={onSwap}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-[11px] font-bold text-muted-foreground hover:text-foreground hover:border-amber-500/40 transition-colors"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              Tukar arah
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-border text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              autoFocus
              onClick={onConfirm}
              className={
                isCreate
                  ? "px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-500/90 text-white text-[11px] font-bold transition-colors"
                  : "px-4 py-2 rounded-xl bg-red-500 hover:bg-red-500/90 text-white text-[11px] font-bold transition-colors"
              }
            >
              {isCreate ? "Ya, hubungkan" : "Hapus"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
