import type { Change, DiffItem, Severity } from "../core/types";
import type { Strings } from "./i18n";
import { bySeverity } from "./view";

export interface Explanation {
  severity: Severity;
  text: string;
}

type Explain = Strings["explain"];

function show(value: unknown, t: Explain): string {
  if (value === null || value === undefined) return t.unlimited;
  return Array.isArray(value) ? `(${value.join(", ")})` : String(value);
}

function explainColumnChange(name: string, change: Change, target: string, t: Explain): string {
  const from = show(change.reference, t);
  const to = show(change.target, t);
  switch (change.field) {
    case "data_type":
      return change.severity === "info" ? t.typeWider(name, target, from, to) : t.typeDiffers(name, from, to);
    case "character_maximum_length":
      return change.severity === "critical"
        ? t.lengthShorter(name, target, from, to)
        : t.lengthLonger(name, target, from, to);
    case "numeric_precision":
    case "numeric_scale": {
      const what = change.field === "numeric_precision" ? t.precision : t.scale;
      return change.severity === "critical"
        ? t.numericSmaller(what, name, target, from, to)
        : t.numericLarger(what, name, target, from, to);
    }
    case "is_nullable":
      if (change.severity === "critical") return t.requiredNoDefault(name, target);
      return change.target === false ? t.requiredWithDefault(name, target) : t.nullable(name, target);
    case "default_kind":
      return t.defaultKind(name, from, to);
    case "default":
      return t.defaultValue(name, from, to);
    case "identity":
      return t.identity(name, from, to);
    default:
      return t.genericColumn(change.field, name, from, to);
  }
}

function explainObjectChange(kind: string, name: string, change: Change, t: Explain): string {
  const from = show(change.reference, t);
  const to = show(change.target, t);
  switch (change.field) {
    case "name":
      return t.rename(kind, from, to);
    case "columns":
      return t.columns(kind, name, from, to);
    case "is_unique":
      return t.unique(kind, name);
    case "method":
      return t.method(kind, name, from, to);
    case "predicate":
      return t.predicate(kind, name);
    case "on_delete":
      return t.onDelete(name, from, to);
    case "on_update":
      return t.onUpdate(name, from, to);
    default:
      return t.genericObject(change.field, kind, name, from, to);
  }
}

/** Kalimat penjelasan untuk satu item diff yang tidak identik. */
export function explainItem(item: DiffItem, referenceLabel: string, targetLabel: string, t: Strings): Explanation[] {
  const name = item.object_name;
  const kind = t.objects[item.object_type];
  const severity = item.severity ?? "info";

  if (item.status === "only_reference") {
    return [{ severity, text: t.explain.missingIn(kind, name, targetLabel) }];
  }
  if (item.status === "only_target") {
    const required = item.object_type === "column" && severity === "critical";
    return [
      {
        severity,
        text: required ? t.explain.onlyInRequired(name, targetLabel) : t.explain.onlyIn(kind, name, targetLabel),
      },
    ];
  }
  if (item.status !== "modified") return [];

  return (item.changes ?? []).map((change) => ({
    severity: change.severity,
    text:
      item.object_type === "column"
        ? explainColumnChange(name, change, targetLabel, t.explain)
        : explainObjectChange(kind.toLowerCase(), name, change, t.explain),
  }));
}

/** Semua penjelasan untuk isi satu tabel, yang paling berdampak di atas. */
export function explainAll(
  items: readonly DiffItem[],
  referenceLabel: string,
  targetLabel: string,
  t: Strings,
): Explanation[] {
  return items
    .flatMap((item) => explainItem(item, referenceLabel, targetLabel, t))
    .sort((a, b) => bySeverity(a.severity, b.severity));
}
