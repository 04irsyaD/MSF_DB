"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeftRight, Info, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { diff } from "../core/differ";
import type { Severity, Snapshot } from "../core/types";
import { useT } from "../lib/i18n";
import { buildNotices, groupByTable, summarizeTables, unsupportedTypes } from "../lib/view";
import { ObjectDetail } from "./ObjectDetail";

const DOT: Record<Severity | "none", string> = {
  critical: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-slate-400",
  none: "bg-transparent",
};

interface CompareResultProps {
  reference: Snapshot;
  target: Snapshot;
}

function SideHeader({ snapshot, position, role, alignRight }: { snapshot: Snapshot; position: string; role: string; alignRight?: boolean }) {
  const { source } = snapshot;
  return (
    <div className={cn("min-w-0", alignRight && "text-right")}>
      <div className="text-xs text-muted-foreground">
        {position} · {role}
      </div>
      <div className="text-xl font-semibold text-foreground truncate">{source.label}</div>
      <div className="text-sm text-muted-foreground truncate">
        {source.engine === "postgresql" ? "PostgreSQL" : source.engine} {source.server_version} · {source.schema}
      </div>
    </div>
  );
}

export function CompareResult({ reference, target }: CompareResultProps) {
  const t = useT();
  const [swapped, setSwapped] = useState(false);
  const [showIdentical, setShowIdentical] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const items = useMemo(() => diff(reference, target), [reference, target]);
  const groups = useMemo(() => groupByTable(items), [items]);
  const unsupported = useMemo(() => unsupportedTypes(items), [items]);
  const summary = useMemo(() => summarizeTables(groups), [groups]);
  const notices = useMemo(() => buildNotices(reference, target, unsupported, t), [reference, target, unsupported, t]);

  const refLabel = reference.source.label;
  const targetLabel = target.source.label;

  const visible = groups.filter((group) => showIdentical || group.table.status !== "identical");
  const active = visible.find((group) => group.table.object_name === selected) ?? visible[0] ?? null;

  const left = swapped ? target : reference;
  const right = swapped ? reference : target;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
      {/* Kepala: dua sisi dan tombol tukar posisi */}
      <div className="flex items-center gap-4 px-6 py-5">
        <div className="flex-1 min-w-0">
          <SideHeader
            snapshot={left}
            position={t.result.left}
            role={swapped ? t.result.roleTarget : t.result.roleReference}
          />
        </div>
        <button
          type="button"
          onClick={() => setSwapped((value) => !value)}
          aria-pressed={swapped}
          aria-label={t.result.swap}
          title={t.result.swapTitle}
          className="shrink-0 p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <SideHeader
            snapshot={right}
            position={t.result.right}
            role={swapped ? t.result.roleReference : t.result.roleTarget}
            alignRight
          />
        </div>
      </div>

      {notices.map((notice, i) => (
        <div
          key={i}
          className={cn(
            "flex items-start gap-3 px-6 py-3 border-t text-sm",
            notice.tone === "warning"
              ? "bg-amber-100 border-amber-200 text-amber-900 dark:bg-amber-500/15 dark:border-amber-500/20 dark:text-amber-200"
              : "bg-muted border-border text-muted-foreground",
          )}
        >
          {notice.tone === "warning" ? (
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
          ) : (
            <Info className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
          )}
          <span className="break-words min-w-0">{notice.text}</span>
        </div>
      ))}

      {/* Ringkasan */}
      <div className="flex flex-wrap gap-2.5 px-6 py-4 border-t border-border">
        <span className="px-3 py-1 rounded-lg text-sm bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-300">
          {t.result.onlyIn(summary.onlyReference, refLabel)}
        </span>
        <span className="px-3 py-1 rounded-lg text-sm bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300">
          {t.result.onlyIn(summary.onlyTarget, targetLabel)}
        </span>
        <span className="px-3 py-1 rounded-lg text-sm bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
          {t.result.modified(summary.modified)}
        </span>
        <button
          type="button"
          onClick={() => setShowIdentical((value) => !value)}
          aria-pressed={showIdentical}
          className="px-3 py-1 rounded-lg text-sm bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          {t.result.identical(summary.identical, showIdentical)}
        </button>
      </div>

      {/* Daftar objek dan detail */}
      <div className="grid md:grid-cols-[260px_minmax(0,1fr)] border-t border-border">
        <nav aria-label={t.result.navLabel} className="md:border-r border-border py-4">
          <div className="px-6 mb-2 text-xs text-muted-foreground">
            {showIdentical ? t.result.allObjects : t.result.changedObjects}
          </div>
          {visible.length === 0 && (
            <p className="px-6 py-2 text-sm text-muted-foreground">{t.result.noDifferences}</p>
          )}
          <ul className="max-h-[480px] overflow-y-auto">
            {visible.map((group) => {
              const { table } = group;
              const isActive = active?.table.object_name === table.object_name;
              return (
                <li key={table.object_name}>
                  <button
                    type="button"
                    onClick={() => setSelected(table.object_name)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "w-full flex items-center gap-3 pl-5 pr-6 py-2.5 text-left text-sm border-l-[3px] transition-colors",
                      isActive
                        ? "border-blue-500 bg-muted font-semibold text-foreground"
                        : "border-transparent text-foreground hover:bg-muted/60",
                    )}
                  >
                    <Table2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="flex-1 min-w-0 truncate">{table.object_name}</span>
                    <span
                      className={cn("h-2.5 w-2.5 rounded-full shrink-0", DOT[table.severity ?? "none"])}
                      role="img"
                      aria-label={table.severity ? t.severity[table.severity] : t.result.identicalLabel}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-6 py-5 min-w-0 border-t md:border-t-0 border-border">
          {active ? (
            <ObjectDetail
              group={active}
              referenceLabel={refLabel}
              targetLabel={targetLabel}
              swapped={swapped}
              unsupported={unsupported}
            />
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t.result.allIdentical}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
