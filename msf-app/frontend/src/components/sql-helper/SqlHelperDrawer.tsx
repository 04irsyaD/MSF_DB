"use client";

import { useState } from "react";
import { ShortcutItem } from "@/lib/types";
import { X, Copy, Check, Terminal, Database, Tag, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface SqlHelperDrawerProps {
  shortcut: ShortcutItem | null;
  onClose: () => void;
}

export default function SqlHelperDrawer({
  shortcut,
  onClose,
}: SqlHelperDrawerProps) {
  const [copied, setCopied] = useState(false);

  if (!shortcut) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortcut.sql);
    setCopied(true);
    toast.success("Kueri SQL berhasil disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskColor = (level: string) => {
    const l = level.toLowerCase();
    if (l === "safe" || l === "read-only" || l === "low") {
      return { label: "LOW RISK (SAFE)", color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: ShieldCheck };
    }
    if (l === "caution" || l === "medium") {
      return { label: "MEDIUM RISK (CAUTION)", color: "text-amber-700 bg-amber-50 border-amber-200", icon: AlertTriangle };
    }
    return { label: "HIGH RISK (DANGEROUS)", color: "text-rose-700 bg-rose-50 border-rose-200", icon: AlertTriangle };
  };

  const risk = getRiskColor(shortcut.risk_level);
  const RiskIcon = risk.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white border-l border-border shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
          {/* Header Drawer */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-gray-50/70 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#00bfa5]/10 text-[#00bfa5]">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">
                  {shortcut.title}
                </h3>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                  Engine: {shortcut.engine} • Category: {shortcut.category}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                Deskripsi
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-border">
                {shortcut.description}
              </p>
            </div>

            {/* Risk Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-[11px] font-mono font-bold ${risk.color}`}
              >
                <RiskIcon className="h-3.5 w-3.5" />
                <span>{risk.label}</span>
              </span>
            </div>

            {/* SQL Script Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                  Skrip Kueri SQL
                </h4>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00bfa5] hover:text-teal-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin Kueri</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-[#1e1e1e] p-4 text-gray-100 font-mono text-xs leading-relaxed shadow-inner">
                <pre className="overflow-x-auto whitespace-pre-wrap selection:bg-[#00bfa5]/30">
                  <code>{shortcut.sql}</code>
                </pre>
              </div>
            </div>

            {/* Tags */}
            {shortcut.tags && shortcut.tags.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border">
                <h4 className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Tags Terkait</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {shortcut.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-mono text-[10px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Drawer */}
          <div className="p-4 border-t border-border bg-gray-50 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-lg border border-border text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 py-2 px-4 bg-[#00bfa5] hover:bg-teal-600 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Kueri Telah Disalin!" : "Salin Kueri SQL"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
