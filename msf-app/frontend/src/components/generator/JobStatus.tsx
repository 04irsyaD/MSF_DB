"use client";

import { JobStatus as StatusType } from "@/lib/types";
import { Loader2, AlertCircle, CheckCircle2, StopCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobStatusProps {
  status: StatusType | null;
  progress: number;
  tablesTotal: number;
  tablesProcessed: number;
  currentTable?: string;
  errorMessage?: string | null;
  previewMarkdown?: string;
  onCancel: () => void;
}

export default function JobStatus({
  status,
  progress,
  tablesTotal,
  tablesProcessed,
  currentTable,
  errorMessage,
  previewMarkdown,
  onCancel,
}: JobStatusProps) {
  if (!status) return null;

  const isProcessing = status === "queued" || status === "processing";

  return (
    <div className="space-y-5 bg-card/50 backdrop-blur-md border border-border p-6 rounded-2xl max-w-2xl mx-auto glass-panel">
      {/* Header Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {status === "queued" && (
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <RefreshCw className="h-5 w-5 animate-spin" />
            </div>
          )}
          {status === "processing" && (
            <div className="h-9 w-9 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}
          {status === "error" && (
            <div className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
          {status === "done" && (
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-white capitalize">
              {status === "queued" && "Menunggu Antrean..."}
              {status === "processing" && "Sedang Menghasilkan Dokumentasi..."}
              {status === "error" && "Terjadi Kesalahan!"}
              {status === "done" && "Dokumentasi Selesai!"}
              {status === "cancelled" && "Proses Dibatalkan!"}
            </h3>
            <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">
              {status === "queued" && "Mempersiapkan parser SQL / metadata DB"}
              {status === "processing" && (currentTable ? `Memproses tabel: ${currentTable}` : "Menghubungkan ke LLM...")}
              {status === "error" && "Gagal memproses skema database"}
              {status === "done" && "File dokumen siap diunduh"}
              {status === "cancelled" && "Pembuatan dokumentasi telah dibatalkan"}
            </p>
          </div>
        </div>

        {isProcessing && (
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/25 hover:border-red-500/40 text-red-400 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <StopCircle className="h-4 w-4" />
            <span>Batalkan</span>
          </button>
        )}
      </div>

      {/* Progress Section */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-muted-foreground">Progress Keseluruhan</span>
          <span className="text-white font-mono">{progress}%</span>
        </div>
        <div className="w-full bg-secondary/30 h-3 rounded-full overflow-hidden border border-border/50">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Table count badge */}
        {tablesTotal > 0 && (
          <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold pt-1">
            <span>Tabel Diproses:</span>
            <span className="px-2 py-0.5 rounded-md bg-secondary/80 text-white font-mono border border-border">
              {tablesProcessed} / {tablesTotal} Tabel
            </span>
          </div>
        )}
      </div>

      {/* Error View */}
      {status === "error" && errorMessage && (
        <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-400/90 rounded-2xl text-xs font-mono leading-relaxed">
          <div className="font-bold mb-1 flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" /> Error Log:
          </div>
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Realtime Stream Preview */}
      {isProcessing && previewMarkdown && (
        <div className="space-y-2 border-t border-border/50 pt-4">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Realtime Preview Stream
          </label>
          <div className="bg-black/40 border border-border rounded-xl p-4 max-h-40 overflow-y-auto font-mono text-[10px] text-indigo-200/80 leading-relaxed whitespace-pre-wrap select-none scrollbar-thin">
            {previewMarkdown}
            <span className="inline-block h-3.5 w-1.5 bg-indigo-400 animate-pulse ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );
}
