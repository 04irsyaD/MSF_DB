"use client";

import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Column, DiffItem, ObjectType, Severity } from "../core/types";
import { explainAll, explainItem } from "../lib/explain";
import { useT } from "../lib/i18n";
import { TableGroup, describeObject, formatColumnAttributes, formatColumnType } from "../lib/view";

// Warna baris mengikuti letak objek, bukan sisi layar, jadi tidak berubah saat posisi ditukar.
const ROW_TONE: Record<string, string> = {
  only_reference: "bg-red-50 text-red-900 dark:bg-red-500/10 dark:text-red-200",
  only_target: "bg-blue-50 text-blue-900 dark:bg-blue-500/10 dark:text-blue-200",
  modified: "bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200",
  identical: "text-muted-foreground",
};

const NOTE_ICON: Record<Severity, { icon: typeof AlertCircle; className: string }> = {
  critical: { icon: AlertCircle, className: "text-red-600 dark:text-red-400" },
  warning: { icon: AlertTriangle, className: "text-amber-600 dark:text-amber-400" },
  info: { icon: Info, className: "text-muted-foreground" },
};

const SECTION_ORDER: ObjectType[] = ["column", "primary_key", "index", "foreign_key"];

interface Side {
  label: string;
  role: "reference" | "target";
}

interface ObjectDetailProps {
  group: TableGroup;
  referenceLabel: string;
  targetLabel: string;
  swapped: boolean;
  unsupported: readonly ObjectType[];
}

function Cell({ item, value }: { item: DiffItem; value: Record<string, unknown> | undefined }) {
  const t = useT();
  const tone = ROW_TONE[item.status];
  if (!value) {
    return (
      <div className="px-3 py-1.5 font-mono text-sm text-muted-foreground" aria-label={t.detail.missing}>
        —
      </div>
    );
  }

  let name = item.object_name;
  let definition: string;
  let attributes = "";
  if (item.object_type === "column") {
    const column = value as unknown as Column;
    definition = formatColumnType(column);
    attributes = formatColumnAttributes(column);
  } else {
    name = String(value.name ?? item.object_name);
    definition = describeObject(item.object_type, value);
  }

  return (
    <div className={cn("px-3 py-1.5 rounded-md font-mono text-sm break-words", tone)}>
      <span className="font-semibold">{name}</span> <span>{definition}</span>
      {attributes && <span className="ml-2 text-xs opacity-70">{attributes}</span>}
    </div>
  );
}

function Notes({ items, referenceLabel, targetLabel }: { items: DiffItem[]; referenceLabel: string; targetLabel: string }) {
  const t = useT();
  const notes = explainAll(items, referenceLabel, targetLabel, t);
  if (notes.length === 0) return null;

  return (
    <ul className="mt-5 pt-4 border-t border-border space-y-2">
      {notes.map((note, i) => {
        const { icon: Icon, className } = NOTE_ICON[note.severity];
        const label = t.severity[note.severity];
        return (
          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
            <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", className)} aria-label={label} />
            <span>{note.text}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function ObjectDetail({ group, referenceLabel, targetLabel, swapped, unsupported }: ObjectDetailProps) {
  const t = useT();
  const { table, children } = group;
  const reference: Side = { label: referenceLabel, role: "reference" };
  const target: Side = { label: targetLabel, role: "target" };
  const sides = swapped ? [target, reference] : [reference, target];

  if (table.status === "only_reference" || table.status === "only_target") {
    const summary = (table.reference ?? table.target ?? {}) as Record<string, unknown>;
    const [before, where, after] = t.detail.onlyTable(
      table.status === "only_reference" ? referenceLabel : targetLabel,
      String(summary.column_count ?? 0),
      String(summary.index_count ?? 0),
      String(summary.foreign_key_count ?? 0),
    );
    return (
      <div>
        <h3 className="text-lg font-semibold text-foreground">{table.object_name}</h3>
        <p className={cn("mt-3 px-3 py-2.5 rounded-md text-sm", ROW_TONE[table.status])}>
          {before}
          <strong>{where}</strong>
          {after}
        </p>
        <Notes items={[table]} referenceLabel={referenceLabel} targetLabel={targetLabel} />
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground">{table.object_name}</h3>

      <div className="mt-3 grid grid-cols-2 gap-x-5 text-xs text-muted-foreground">
        {sides.map((side) => (
          <div key={side.role} className="px-3">
            {side.label}
          </div>
        ))}
      </div>

      {SECTION_ORDER.map((type) => {
        if (unsupported.includes(type)) {
          return (
            <p key={type} className="mt-4 px-3 py-2 rounded-md bg-muted text-xs text-muted-foreground italic">
              {t.detail.notCompared(t.objects[type])}
            </p>
          );
        }
        const rows = children.filter((child) => child.object_type === type);
        if (rows.length === 0) return null;

        return (
          <section key={type} className="mt-3" aria-label={t.objects[type]}>
            {type !== "column" && (
              <h4 className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t.objects[type]}
              </h4>
            )}
            <div className="space-y-1">
              {rows.map((item) => (
                <div
                  key={`${item.object_type}:${item.object_name}`}
                  className="grid grid-cols-2 gap-x-5"
                  title={explainItem(item, referenceLabel, targetLabel, t)
                    .map((note) => note.text)
                    .join("\n")}
                >
                  {sides.map((side) => (
                    <Cell key={side.role} item={item} value={side.role === "reference" ? item.reference : item.target} />
                  ))}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <Notes items={children} referenceLabel={referenceLabel} targetLabel={targetLabel} />
    </div>
  );
}
