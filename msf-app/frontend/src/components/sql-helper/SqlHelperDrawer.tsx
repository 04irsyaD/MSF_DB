"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ShortcutItem } from "@/lib/types";
import { X, Copy, Check, Terminal, Tag, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/clipboard";

interface SqlHelperDrawerProps {
  shortcut: ShortcutItem | null;
  onClose: () => void;
}

export default function SqlHelperDrawer({
  shortcut,
  onClose,
}: SqlHelperDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Smooth close with slide-out animation
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 220);
  }, [isClosing, onClose]);

  // Handle ESC key to close drawer and lock body scroll safely
  useEffect(() => {
    if (!shortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [shortcut, handleClose]);

  if (!mounted || !shortcut) return null;

  const handleCopy = async () => {
    const ok = await copyToClipboard(shortcut.sql);
    if (ok) {
      setCopied(true);
      toast.success("Query copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy query to clipboard");
    }
  };

  const getRiskColor = (level: string) => {
    const l = level.toLowerCase();
    if (l === "safe" || l === "read-only" || l === "low") {
      return {
        label: "LOW RISK (SAFE)",
        color: "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        icon: ShieldCheck,
      };
    }
    if (l === "caution" || l === "medium") {
      return {
        label: "MEDIUM RISK (CAUTION)",
        color: "text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
        icon: AlertTriangle,
      };
    }
    return {
      label: "HIGH RISK (DANGEROUS)",
      color: "text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
      icon: AlertTriangle,
    };
  };

  const risk = getRiskColor(shortcut.risk_level);
  const RiskIcon = risk.icon;

  const drawerContent = (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/50 backdrop-blur-xs cursor-pointer ${
          isClosing ? "animate-backdrop-out" : "animate-backdrop-in"
        }`}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pointer-events-none">
        <div
          className={`w-screen max-w-full sm:max-w-xl bg-card border-l border-border shadow-2xl flex flex-col h-full z-[101] pointer-events-auto ${
            isClosing ? "animate-drawer-out" : "animate-drawer-in"
          }`}
        >
          {/* Header Drawer (Sticky) */}
          <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-muted/40 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="p-1.5 rounded-lg bg-accent/10 text-accent shrink-0">
                <Terminal className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h3 id="drawer-title" className="text-sm font-bold text-foreground leading-snug truncate">
                  {shortcut.title}
                </h3>
                <span className="text-[10px] font-mono text-muted-foreground uppercase block truncate">
                  Engine: {shortcut.engine} • Category: {shortcut.category}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
              title="Close (Esc)"
              aria-label="Close detail drawer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                Description
              </h4>
              <p className="text-xs text-foreground/90 leading-relaxed bg-muted/30 p-3 rounded-lg border border-border">
                {shortcut.description}
              </p>
            </div>

            {/* Risk Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-[11px] font-mono font-bold ${risk.color}`}
              >
                <RiskIcon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{risk.label}</span>
              </span>
            </div>

            {/* SQL Script Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                  SQL Query Script
                </h4>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-accent hover:text-accent/80 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Query</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-border bg-[#1e1e1e] p-4 text-gray-100 font-mono text-xs leading-relaxed shadow-inner">
                <pre className="overflow-x-auto whitespace-pre-wrap selection:bg-accent/30">
                  <code>{shortcut.sql}</code>
                </pre>
              </div>
            </div>

            {/* Tags */}
            {shortcut.tags && shortcut.tags.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border">
                <h4 className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  <span>Related Tags</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {shortcut.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[10px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Drawer (Sticky at Bottom) */}
          <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="py-2 px-4 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 py-2 px-4 bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-bold font-mono uppercase tracking-wider rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Query Copied!" : "Copy SQL Script"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}

