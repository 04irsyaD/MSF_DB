"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";

interface TerminalBlockProps {
  /** Satu atau beberapa baris command. Baris diawali "#" dirender sebagai komentar. */
  command: string;
  className?: string;
}

const COPY_RESET_MS = 1500;

/**
 * Blok terminal: prompt "$" untuk command, warna redup untuk komentar "#",
 * tombol salin yang muncul saat hover atau fokus keyboard.
 */
export default function TerminalBlock({ command, className }: TerminalBlockProps) {
  const [copied, setCopied] = useState(false);

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

  const lines = command.split("\n");

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-slate-950 font-mono text-xs text-slate-100",
        className
      )}
    >
      <pre className="overflow-x-auto px-3 py-2.5">
        <code>
          {lines.map((line, i) => {
            const isComment = line.trim().startsWith("#");
            if (isComment) {
              return (
                <div key={i} className="whitespace-pre text-slate-500">
                  {line}
                </div>
              );
            }
            return (
              <div key={i} className="whitespace-pre">
                <span aria-hidden className="select-none text-emerald-400">
                  ${" "}
                </span>
                {line}
              </div>
            );
          })}
        </code>
      </pre>
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
    </div>
  );
}
