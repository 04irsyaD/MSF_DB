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
    <div className="space-y-5 bg-card border border-border p-6 rounded-[4px] max-w-2xl mx-auto">
      {/* Header Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {status === "queued" && (
            <div className="h-9 w-9 rounded-[4px] bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <RefreshCw className="h-5 w-5 animate-spin" />
            </div>
          )}
          {status === "processing" && (
            <div className="h-9 w-9 rounded-[4px] bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}
          {status === "error" && (
            <div className="h-9 w-9 rounded-[4px] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
          {status === "done" && (
            <div className="h-9 w-9 rounded-[4px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              {status === "queued" && "MENUNGGU ANTREAN..."}
              {status === "processing" && "SEDANG MENGHASILKAN DOKUMENTASI..."}
              {status === "error" && "TERJADI KESALAHAN!"}
              {status === "done" && "DOKUMENTASI SELESAI!"}
              {status === "cancelled" && "PROSES DIBATALKAN!"}
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono font-semibold mt-0.5 uppercase tracking-wide">
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
            className="p-2 rounded-[4px] bg-red-500/5 hover:bg-red-500/10 border border-red-500/25 hover:border-red-500/40 text-red-400 font-mono font-bold text-[10px] flex items-center gap-1.5 transition-colors duration-150 uppercase"
          >
            <StopCircle className="h-4 w-4" />
            <span>CANCEL</span>
          </button>
        )}
      </div>

      {/* Progress Section */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono font-bold">
          <span className="text-muted-foreground uppercase tracking-wider">PROGRESS KESELURUHAN</span>
          <span className="text-white">{progress}%</span>
        </div>
        <div className="w-full bg-secondary/30 h-2 rounded-none overflow-hidden border border-border">
          <div
            className="bg-accent h-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Table count badge */}
        {tablesTotal > 0 && (
          <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono font-semibold pt-1 uppercase tracking-wider">
            <span>TABEL DIPROSES:</span>
            <span className="px-2 py-0.5 rounded-[2px] bg-secondary/80 text-white font-mono border border-border">
              {tablesProcessed} / {tablesTotal} TABEL
            </span>
          </div>
        )}
      </div>

      {/* Error View */}
      {status === "error" && errorMessage && (
        <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-400/90 rounded-[4px] text-xs font-mono leading-relaxed">
          <div className="font-bold mb-1 flex items-center gap-1.5 uppercase">
            <AlertCircle className="h-4 w-4" /> ERROR LOG:
          </div>
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Realtime Stream Preview */}
      {isProcessing && previewMarkdown && (
        <div className="space-y-2 border-t border-border pt-4">
          <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
            REALTIME PREVIEW STREAM
          </label>
          <div className="bg-black/40 border border-border rounded-[4px] p-4 max-h-40 overflow-y-auto font-mono text-[10px] text-accent/80 leading-relaxed whitespace-pre-wrap select-none scrollbar-thin scrollbar-thumb-accent/20">
            {previewMarkdown}
            <span className="inline-block h-3.5 w-1.5 bg-accent animate-pulse ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );
}
