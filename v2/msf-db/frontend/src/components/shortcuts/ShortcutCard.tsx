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
          label: "SAFE",
          border: "border-l-4 border-l-emerald-500",
          text: "text-emerald-600",
          bg: "bg-emerald-50 border-emerald-100",
          icon: ShieldCheck,
        };
      case "caution":
        return {
          label: "CAUTION",
          border: "border-l-4 border-l-amber-500",
          text: "text-amber-600",
          bg: "bg-amber-50 border-amber-100",
          icon: AlertTriangle,
        };
      case "dangerous":
        return {
          label: "HIGH RISK",
          border: "border-l-4 border-l-red-500",
          text: "text-red-600",
          bg: "bg-red-50 border-red-100",
          icon: AlertTriangle,
        };
      default:
        return {
          label: level.toUpperCase(),
          border: "border-l-4 border-l-border",
          text: "text-muted-foreground",
          bg: "bg-gray-50 border-gray-100",
          icon: Terminal,
        };
    }
  };

  const risk = getRiskDetails(shortcut.risk_level);
  const RiskIcon = risk.icon;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={cn(
        "hover:cursor-pointer border border-border bg-card hover:border-accent/40 rounded-lg overflow-hidden transition-all duration-150 flex flex-col justify-between w-full shadow-sm hover:shadow",
        risk.border
      )}
    >
      {/* Top Details - List hybrid representation */}
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Info Column */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-[2px] text-[8px] font-mono font-bold uppercase tracking-wider border",
                shortcut.engine === "postgresql"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : shortcut.engine === "mysql"
                  ? "bg-sky-50 text-sky-700 border-sky-200"
                  : "bg-gray-50 text-gray-600 border-gray-200"
              )}
            >
              {shortcut.engine}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">/</span>
            <span className="text-[9px] font-mono font-bold uppercase text-accent tracking-wider">
              {shortcut.category}
            </span>
          </div>

          <h4 className="text-sm font-bold text-gray-900 leading-tight">
            {shortcut.title}
          </h4>
          
          <p className="text-xs text-muted-foreground leading-normal line-clamp-1">
            {shortcut.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 pt-1.5">
            {shortcut.tags.map((t) => (
              <span
                key={t}
                className="text-[9px] font-mono font-bold text-muted-foreground/60 bg-gray-50 border border-border/60 px-1.5 py-0.5 rounded-[2px]"
              >
                #{t.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* SQL Inline Preview (Dense, Mono snippet) */}
        <div className="hidden lg:block w-80 shrink-0 font-mono text-[10px] text-gray-400 bg-gray-50 border border-border/60 rounded-[2px] px-2.5 py-2 truncate select-none">
          {shortcut.sql.replace(/\s+/g, " ")}
        </div>

        {/* Status Badge + Actions */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          <span
            className={cn(
              "px-2 py-0.5 rounded-[2px] text-[8px] font-mono font-bold uppercase tracking-wider border flex items-center gap-1.5 shrink-0",
              risk.bg, risk.text
            )}
          >
            <RiskIcon className="h-3 w-3" />
            <span>{risk.label}</span>
          </span>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-[4px] bg-gray-50 hover:bg-gray-100 border border-border hover:border-accent/40 text-muted-foreground hover:text-gray-900 transition-colors duration-150"
            title="Copy SQL Query"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-accent" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>

          <div className="text-muted-foreground pr-1">
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Code block */}
      {expanded && (
        <div
          onClick={(e) => e.stopPropagation()} // Prevent collapse when clicking code box
          className="border-t border-border bg-gray-50/50 p-4 space-y-3"
        >
          <div className="flex justify-between items-center text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
            <span>SQL SCRIPT PREVIEW</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] bg-white hover:bg-gray-50 border border-border hover:border-accent/40 text-gray-700 transition-colors duration-150 font-mono font-bold text-[9px]"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3.5 text-accent" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3.5 text-accent" />
                  <span>COPY QUERY</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3 bg-gray-900 border border-border rounded-[4px] text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-60 scrollbar-thin scrollbar-thumb-accent/20">
            <code>{shortcut.sql}</code>
          </pre>
          {shortcut.notes && (
            <p className="text-[10px] text-muted-foreground/80 leading-normal font-mono uppercase tracking-wide">
              * NOTE: {shortcut.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
