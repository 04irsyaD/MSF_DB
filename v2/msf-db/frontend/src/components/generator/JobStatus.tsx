import { useState, useEffect } from "react";
import { JobStatus as StatusType } from "@/lib/types";
import { Loader2, AlertCircle, CheckCircle2, StopCircle, RefreshCw, Copy, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface JobStatusProps {
  status: StatusType | null;
  progress: number;
  tablesTotal: number;
  tablesProcessed: number;
  currentTable?: string;
  errorMessage?: string | null;
  previewMarkdown?: string;
  onCancel: () => void;
  accessCode?: string;
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
  accessCode,
}: JobStatusProps) {
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    if (accessCode && (status === "queued" || status === "processing")) {
      const storageKey = `msf_dismissed_code_${accessCode}`;
      const isDismissed = localStorage.getItem(storageKey);
      if (!isDismissed) {
        setShowSaveModal(true);
      }
    }
  }, [accessCode, status]);

  if (!status) return null;

  const isProcessing = status === "queued" || status === "processing";

  const handleCopyAndClose = () => {
    if (accessCode) {
      navigator.clipboard.writeText(accessCode);
      toast.success("Kode pelacakan berhasil disalin ke clipboard!");
      localStorage.setItem(`msf_dismissed_code_${accessCode}`, "true");
    }
    setShowSaveModal(false);
  };

  return (
    <div className="space-y-5 bg-white border border-border p-6 rounded-2xl max-w-2xl mx-auto shadow-sm relative">
      {/* Save Code Modal Overlay */}
      {showSaveModal && accessCode && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in font-mono">
          <div className="bg-white border border-border w-full max-w-sm rounded-2xl shadow-card-lg p-6 space-y-5 text-center animate-fade-in-up">
            <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mx-auto">
              <Key className="h-5 w-5" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                SIMPAN KODE PELACAKAN
              </h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Pekerjaan baru berhasil dibuat. Salin kode di bawah ini agar Anda bisa memantau kembali jika halaman tidak sengaja tertutup atau ter-refresh.
              </p>
            </div>

            <div className="p-3 bg-gray-50 border border-border rounded-xl flex items-center justify-between font-bold">
              <span className="text-gray-900 tracking-wider text-xs select-all">{accessCode}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(accessCode);
                  toast.success("Kode berhasil disalin!");
                }}
                className="text-[10px] text-accent hover:underline flex items-center gap-1 uppercase"
              >
                <Copy className="h-3 w-3" />
                <span>Salin</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyAndClose}
              className="w-full py-2 bg-accent hover:bg-accent/90 text-white text-xs font-bold rounded-xl transition-all shadow-sm uppercase tracking-wider"
            >
              Salin & Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* Header Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {status === "queued" && (
            <div className="h-9 w-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <RefreshCw className="h-5 w-5 animate-spin" />
            </div>
          )}
          {status === "processing" && (
            <div className="h-9 w-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}
          {status === "error" && (
            <div className="h-9 w-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
          {status === "done" && (
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-mono font-bold text-gray-900 uppercase tracking-wider">
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
            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-mono font-bold text-[10px] flex items-center gap-1.5 transition-colors duration-150 uppercase shadow-sm"
          >
            <StopCircle className="h-4 w-4" />
            <span>CANCEL</span>
          </button>
        )}
      </div>

      {/* Access Code Widget */}
      {accessCode && isProcessing && (
        <div className="p-3 bg-accent/5 border border-accent/15 rounded-xl flex items-center justify-between font-mono text-[10px] text-accent">
          <div className="flex items-center gap-1.5">
            <span>🔑 KODE AKSES PELACAKAN:</span>
            <span className="font-bold bg-white px-2 py-0.5 border border-accent/20 rounded text-gray-900 select-all tracking-wider">
              {accessCode}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(accessCode);
              toast.success("Kode pelacakan berhasil disalin!");
            }}
            className="hover:underline font-bold uppercase shrink-0 text-accent/80 hover:text-accent"
          >
            SALIN KODE
          </button>
        </div>
      )}

      {/* Progress Section */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono font-bold">
          <span className="text-muted-foreground uppercase tracking-wider">PROGRESS KESELURUHAN</span>
          <span className="text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-border">
          <div
            className="bg-accent h-full rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Table count badge */}
        {tablesTotal > 0 && (
          <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono font-semibold pt-1 uppercase tracking-wider">
            <span>TABEL DIPROSES:</span>
            <span className="px-2 py-0.5 rounded-lg bg-gray-50 text-gray-800 font-mono border border-border">
              {tablesProcessed} / {tablesTotal} TABEL
            </span>
          </div>
        )}
      </div>

      {/* Error View */}
      {status === "error" && errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-mono leading-relaxed">
          <div className="font-bold mb-1 flex items-center gap-1.5 uppercase">
            <AlertCircle className="h-4 w-4 text-red-600" /> ERROR LOG:
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
          <div className="bg-gray-50 border border-border rounded-xl p-4 max-h-40 overflow-y-auto font-mono text-[10px] text-emerald-800 leading-relaxed whitespace-pre-wrap select-none scrollbar-thin scrollbar-thumb-accent/20">
            {previewMarkdown}
            <span className="inline-block h-3.5 w-1.5 bg-accent animate-pulse ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );
}
