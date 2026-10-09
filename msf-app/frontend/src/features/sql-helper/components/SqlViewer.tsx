"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Copy, Check, Download, WrapText, FileCode } from "lucide-react";
import { useTheme } from "next-themes";
import { getSqlHighlighter } from "../lib/shiki";
import { copyScriptWithToast } from "../lib/clipboard";
import { SQL_HELPER_LABELS } from "../lib/labels";

interface SqlViewerProps {
  sql: string;
  scriptId?: string;
  className?: string;
}

export function SqlViewer({ sql, scriptId = "query", className = "" }: SqlViewerProps) {
  const { resolvedTheme } = useTheme();
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);
  const [wrapLines, setWrapLines] = useState(false);
  const [copied, setCopied] = useState(false);

  const themeName = resolvedTheme === "dark" ? "github-dark" : "github-light";

  // Split lines for line numbers
  const lines = useMemo(() => sql.split("\n"), [sql]);

  // Load syntax highlight asynchronously
  useEffect(() => {
    let isCancelled = false;

    getSqlHighlighter()
      .then((highlighter) => {
        if (!isCancelled) {
          const html = highlighter.codeToHtml(sql, {
            lang: "sql",
            theme: themeName,
          });
          setHighlightedHtml(html);
        }
      })
      .catch(() => {
        // Fallback to plain pre
        if (!isCancelled) setHighlightedHtml(null);
      });

    return () => {
      isCancelled = true;
    };
  }, [sql, themeName]);

  const handleCopy = async () => {
    const success = await copyScriptWithToast(sql);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([sql], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${scriptId}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`relative rounded-xl border border-border/80 bg-zinc-950 text-zinc-100 overflow-hidden shadow-sm ${className}`}
    >
      {/* Top Action Toolbar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900/90 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono font-semibold text-[11px] uppercase tracking-wider text-zinc-300">
            SQL
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            {lines.length} {lines.length === 1 ? "line" : "lines"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Wrap Toggle */}
          <button
            type="button"
            onClick={() => setWrapLines(!wrapLines)}
            className={`p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors ${
              wrapLines ? "bg-zinc-800 text-primary" : "hover:bg-zinc-800/60"
            }`}
            title={wrapLines ? SQL_HELPER_LABELS.viewer.unwrapLines : SQL_HELPER_LABELS.viewer.wrapLines}
            aria-label="Toggle text wrap"
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          {/* Download SQL */}
          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
            title={SQL_HELPER_LABELS.viewer.download}
            aria-label="Download SQL file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Copy SQL */}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all ${
              copied
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>{SQL_HELPER_LABELS.card.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>{SQL_HELPER_LABELS.card.copy}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area with Line Numbers */}
      <div className="relative flex text-xs font-mono max-h-[460px] overflow-auto select-text">
        {/* Line Numbers Gutter */}
        <div
          aria-hidden="true"
          className="py-3 px-3 select-none text-right text-zinc-600 bg-zinc-950/60 border-r border-zinc-900/80 font-mono text-[11px] leading-relaxed"
        >
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Highlighted or Fallback Code */}
        <div className="flex-1 py-3 px-4 overflow-x-auto leading-relaxed">
          {highlightedHtml ? (
            <div
              className={`[&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent text-xs ${
                wrapLines ? "[&_pre]:whitespace-pre-wrap [&_pre]:break-all" : "[&_pre]:whitespace-pre"
              }`}
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          ) : (
            <pre
              className={`font-mono text-zinc-200 text-xs ${
                wrapLines ? "whitespace-pre-wrap break-all" : "whitespace-pre"
              }`}
            >
              <code>{sql}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
