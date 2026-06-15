"use client";

import { useState } from "react";
import { ShortcutItem } from "@/lib/types";
import { Terminal, Copy, Check, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShortcutCardProps {
  shortcut: ShortcutItem;
}

export default function ShortcutCard({ shortcut }: ShortcutCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card toggle
    navigator.clipboard.writeText(shortcut.sql);
    setCopied(true);
    toast.success("Query disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskDetails = (level: string) => {
    switch (level) {
      case "safe":
      case "read-only":
        return {
          label: "Read Only",
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          icon: ShieldCheck,
        };
      case "caution":
        return {
          label: "Caution",
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          icon: AlertTriangle,
        };
      case "dangerous":
        return {
          label: "High Risk",
          bg: "bg-red-500/10 text-red-400 border-red-500/20",
          icon: AlertTriangle,
        };
      default:
        return {
          label: level,
          bg: "bg-secondary text-muted-foreground border-border",
          icon: Terminal,
        };
    }
  };

  const risk = getRiskDetails(shortcut.risk_level);
  const RiskIcon = risk.icon;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="glass-card hover:cursor-pointer border border-border bg-card/40 hover:bg-card/75 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Details */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span
              className={cn(
                "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border font-mono inline-block mb-1",
                shortcut.engine === "postgresql"
                  ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                  : shortcut.engine === "mysql"
                  ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                  : "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"
              )}
            >
              {shortcut.engine}
            </span>
            <h4 className="text-sm font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">
              {shortcut.title}
            </h4>
          </div>

          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border flex items-center gap-1.5 shrink-0",
              risk.bg
            )}
          >
            <RiskIcon className="h-3 w-3" />
            <span>{risk.label}</span>
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-normal line-clamp-2">
          {shortcut.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {shortcut.tags.map((t) => (
            <span
              key={t}
              className="text-[9px] font-bold text-muted-foreground/60 bg-secondary/30 border border-border px-1.5 py-0.5 rounded"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded Code block */}
      {expanded && (
        <div
          onClick={(e) => e.stopPropagation()} // Prevent collapse when clicking code box
          className="border-t border-border bg-black/40 p-4 space-y-3.5"
        >
          <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <span>SQL Script Preview</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/80 hover:bg-secondary border border-border hover:border-indigo-500/30 text-white transition-all cursor-pointer font-bold text-[10px]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Salin Query</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3 bg-black/55 border border-border rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto leading-relaxed max-h-48 scrollbar-thin">
            <code>{shortcut.sql}</code>
          </pre>
          {shortcut.notes && (
            <p className="text-[10px] text-muted-foreground/80 leading-normal italic">
              * Note: {shortcut.notes}
            </p>
          )}
        </div>
      )}

      {/* Card Toggle Bar */}
      <div className="px-5 py-2.5 bg-secondary/10 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-bold shrink-0 uppercase tracking-wider">
        <span>Kategori: {shortcut.category}</span>
        <span className="flex items-center gap-1 group-hover:text-white transition-colors">
          {expanded ? (
            <>
              <span>Tutup Script</span>
              <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              <span>Lihat Script</span>
              <ChevronDown className="h-3 w-3" />
            </>
          )}
        </span>
      </div>
    </div>
  );
}
