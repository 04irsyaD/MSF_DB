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
  format?: "docx" | "pdf";
  onReset: () => void;
}

export default function DocPreview({ markdown, projectName, downloadUrl, format = "docx", onReset }: DocPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleCopyMarkdown = () => {
    if (!markdown) return;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    toast.success("Markdown disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    const isPdf = format === "pdf";
    const label = isPdf ? "PDF" : "Word";

    // Jika ada downloadUrl dari job, langsung pakai
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
      toast.success(`Mengunduh dokumen ${label}...`);
      return;
    }

    // Fallback: Export langsung menggunakan content markdown di screen
    setExporting(true);
    try {
      const blob = isPdf 
        ? await api.exportPdf(markdown, projectName || "Database Documentation")
        : await api.exportMarkdown(markdown, projectName || "Database Documentation");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = isPdf ? "pdf" : "docx";
      a.download = `${projectName ? projectName.toLowerCase().replace(/\s+/g, "_") : "db"}_docs.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Dokumen ${label} (.${ext}) berhasil dibuat!`);
    } catch (err: any) {
      console.error(err);
      toast.error(`Gagal mengunduh dokumen ${label}.`);
    } finally {
      setExporting(false);
    }
  };

  const isPdf = format === "pdf";

  return (
    <div className="space-y-4">
      {/* Control Actions bar */}
      <div className="flex items-center justify-between bg-white border border-border px-5 py-3.5 rounded-2xl shadow-sm shrink-0">
        <div>
          <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest">
            DOKUMENTASI SELESAI DIBUAT
          </h3>
          <p className="text-[10px] text-muted-foreground font-mono font-semibold mt-0.5 uppercase tracking-wide">
            Format: Markdown / Ekspor ke {isPdf ? "PDF (.pdf)" : "Word (.docx)"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-border hover:border-accent/40 text-muted-foreground hover:text-gray-900 transition-colors duration-150 text-xs font-mono flex items-center gap-2 uppercase font-semibold"
            title="Salin Markdown"
          >
            {copied ? (
              <Check className="h-4 w-4 text-accent" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">COPY MARKDOWN</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={exporting}
            className="p-2 rounded-xl bg-accent hover:bg-accent/90 border border-transparent text-white transition-colors duration-150 text-xs font-mono flex items-center gap-2 font-bold disabled:opacity-50 uppercase active:scale-95 shadow-sm"
          >
            <FileText className="h-4 w-4 text-white" />
            <span>DOWNLOAD {isPdf ? "PDF" : "WORD"}</span>
          </button>

          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-border hover:border-accent/40 text-muted-foreground hover:text-gray-900 transition-colors duration-150 text-xs font-mono flex items-center gap-2 uppercase font-semibold"
            title="Generate Ulang"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </div>

      {/* Markdown Document Content Sheet */}
      <div className="bg-white border border-border rounded-2xl p-6 md:p-8 max-h-[750px] overflow-y-auto relative shadow-sm">
        <div className="prose max-w-none prose-emerald prose-headings:text-gray-900 prose-a:text-accent prose-code:text-emerald-700 prose-pre:bg-gray-50 prose-pre:border prose-pre:border-border prose-table:border-collapse font-sans prose-code:font-mono">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
