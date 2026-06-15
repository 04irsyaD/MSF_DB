"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Download, Copy, Check, FileText, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface DocPreviewProps {
  markdown: string;
  projectName: string;
  downloadUrl?: string; // Dari job status response
  onReset: () => void;
}

export default function DocPreview({ markdown, projectName, downloadUrl, onReset }: DocPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [exportingWord, setExportingWord] = useState(false);

  const handleCopyMarkdown = () => {
    if (!markdown) return;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    toast.success("Markdown disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWord = async () => {
    // Jika ada downloadUrl dari job, langsung pakai
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
      toast.success("Mengunduh document Word...");
      return;
    }

    // Fallback: Export langsung menggunakan content markdown di screen
    setExportingWord(true);
    try {
      const blob = await api.exportMarkdown(markdown, projectName || "Database Documentation");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName ? projectName.toLowerCase().replace(/\s+/g, "_") : "db"}_docs.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Dokumen Word (.docx) berhasil dibuat!");
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal mengunduh dokumen Word.");
    } finally {
      setExportingWord(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Actions bar */}
      <div className="flex items-center justify-between bg-card/60 backdrop-blur-md border border-border px-5 py-3.5 rounded-2xl shrink-0">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Dokumentasi Selesai Dibuat
          </h3>
          <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">
            Format: Markdown / Ekspor ke Word (.docx)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="p-2 rounded-xl bg-secondary/30 hover:bg-secondary/60 border border-border hover:border-indigo-500/20 text-muted-foreground hover:text-white transition-all text-xs flex items-center gap-2"
            title="Salin Markdown"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Salin Markdown</span>
          </button>

          <button
            onClick={handleDownloadWord}
            disabled={exportingWord}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 border border-indigo-500 text-white transition-all text-xs flex items-center gap-2 font-bold shadow-md shadow-indigo-500/10 active:scale-95 disabled:opacity-50"
          >
            <FileText className="h-4 w-4 text-white" />
            <span>Unduh Word</span>
          </button>

          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-secondary/30 hover:bg-secondary/60 border border-border hover:border-amber-500/20 text-muted-foreground hover:text-white transition-all text-xs flex items-center gap-2"
            title="Generate Ulang"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Markdown Document Content Sheet */}
      <div className="bg-card/30 border border-border rounded-2xl p-6 md:p-8 max-h-[750px] overflow-y-auto relative glass-panel">
        <div className="prose prose-invert max-w-none prose-xs prose-headings:text-white prose-a:text-indigo-400 prose-code:text-indigo-300 prose-pre:bg-secondary/20 prose-pre:border prose-pre:border-border prose-table:border-collapse">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
