"use client";

import React, { useState } from "react";
import { ArrowRight, Check, Copy, GitBranch } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";
import { RiskBadge, CategoryBadge } from "@/features/sql-helper/components/Badges";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";
import { resolveCommand, hasDistroVariants } from "../lib/resolve";
import type { Command, Distro } from "../lib/schema";

interface CommandCardProps {
  command: Command;
  distro: Distro;
  onSelect: () => void;
  className?: string;
}

const COPY_RESET_MS = 2000;
const PREVIEW_LINES = 3;

/** Badge level kecil, bergaya sama dengan badge SQL Helper. */
function LevelBadge({ level }: { level: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      L{level}
    </span>
  );
}

export default function CommandCard({ command, distro, onSelect, className }: CommandCardProps) {
  const [copied, setCopied] = useState(false);

  const resolved = resolveCommand(command, distro);
  const preview = resolved.trim().split("\n").slice(0, PREVIEW_LINES).join("\n");
  const hasVariants = hasDistroVariants(command);

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    // Command berisiko tinggi: paksa buka drawer untuk konfirmasi, jangan copy diam-diam.
    if (command.risk === "high") {
      toast.info(L.risk.confirmFirst);
      onSelect();
      return;
    }
    const ok = await copyToClipboard(resolved);
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
      onClick={onSelect}
      className={cn(
        "group relative flex cursor-pointer flex-col justify-between rounded-xl border border-border/80 bg-card p-4 shadow-xs transition-all duration-200 hover:border-accent/50 hover:bg-card/95 hover:shadow-md motion-safe:hover:-translate-y-0.5",
        className
      )}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <LevelBadge level={command.level} />
          <CategoryBadge category={command.category} />
          <RiskBadge risk={command.risk} />
          {hasVariants && (
            <span
              title={L.variant.hint}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              <GitBranch className="h-2.5 w-2.5" />
              {L.variant.label}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <button
            type="button"
            onClick={onSelect}
            className="line-clamp-1 text-left text-sm font-semibold text-foreground transition-colors group-hover:text-accent focus-visible:underline focus-visible:outline-none"
          >
            {command.title}
          </button>
          {command.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {command.description}
            </p>
          )}
        </div>

        <div className="relative overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-950 p-2.5 font-mono text-[11px] text-zinc-300">
          <pre className="overflow-hidden whitespace-pre leading-snug">
            <code>
              <span aria-hidden className="select-none text-emerald-400">
                ${" "}
              </span>
              {preview}
            </code>
          </pre>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-zinc-950 to-transparent" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-medium transition-all",
            copied
              ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "border-accent/20 bg-accent/10 text-accent hover:bg-accent hover:text-white"
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? L.card.copied : L.card.copy}</span>
        </button>

        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-accent">
          <span>{L.card.details}</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
}
