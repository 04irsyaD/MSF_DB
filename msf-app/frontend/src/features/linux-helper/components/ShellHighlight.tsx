"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getShellHighlighter } from "../lib/shiki";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";

interface ShellHighlightProps {
  command: string;
  /** Sembunyikan tombol salin (mis. command high-risk yang belum dikonfirmasi). */
  allowCopy?: boolean;
  className?: string;
}

const COPY_RESET_MS = 1500;

/**
 * Blok command shell dengan highlight Shiki (lazy). Sebelum highlighter siap,
 * atau bila gagal, menampilkan teks mentah sehingga tetap terbaca.
 */
export default function ShellHighlight({
  command,
  allowCopy = true,
  className,
}: ShellHighlightProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    getShellHighlighter()
      .then((hl) => {
        if (!active) return;
        setHtml(hl.codeToHtml(command, { lang: "bash", theme: "github-dark" }));
      })
      .catch(() => {
        if (active) setHtml(null);
      });
    return () => {
      active = false;
    };
  }, [command]);

  async function handleCopy() {
    const ok = await copyToClipboard(command);
    if (!ok) {
      toast.error(L.toast.copyFailed);
      return;
    }
    toast.success(L.toast.copySuccess);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_RESET_MS);
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-[#24292e] font-mono text-xs",
        "[&_pre]:overflow-x-auto [&_pre]:px-3 [&_pre]:py-2.5 [&_pre]:!bg-transparent",
        className
      )}
    >
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="overflow-x-auto px-3 py-2.5 text-slate-100">
          <code>{command}</code>
        </pre>
      )}
      {allowCopy && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? L.terminal.copied : L.terminal.copy}
          className="absolute right-1.5 top-1.5 rounded-md bg-slate-800/80 p-1.5 text-slate-300 opacity-0 transition-opacity hover:text-white focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent group-hover:opacity-100"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </div>
  );
}
