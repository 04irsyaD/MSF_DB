import type { Change, DiffItem, Severity } from "../core/types";
import { OBJECT_LABELS, bySeverity } from "./view";

export interface Explanation {
  severity: Severity;
  text: string;
}

function show(value: unknown): string {
  if (value === null || value === undefined) return "tanpa batas";
  return Array.isArray(value) ? `(${value.join(", ")})` : String(value);
}

function explainColumnChange(name: string, change: Change, target: string): string {
  const from = show(change.reference);
  const to = show(change.target);
  switch (change.field) {
    case "data_type":
      return change.severity === "info"
        ? `Tipe ${name} lebih lebar di ${target} (${from} → ${to})`
        : `Tipe ${name} berbeda (${from} → ${to}) — tidak kompatibel`;
    case "character_maximum_length":
      return change.severity === "critical"
        ? `Panjang ${name} lebih pendek di ${target} (${from} → ${to}) — data bisa terpotong`
        : `Panjang ${name} lebih besar di ${target} (${from} → ${to})`;
    case "numeric_precision":
    case "numeric_scale": {
      const what = change.field === "numeric_precision" ? "Presisi" : "Skala";
      return change.severity === "critical"
        ? `${what} ${name} lebih kecil di ${target} (${from} → ${to}) — nilai bisa ditolak atau dibulatkan`
        : `${what} ${name} lebih besar di ${target} (${from} → ${to})`;
    }
    case "is_nullable":
      if (change.severity === "critical") {
        return `${name} wajib isi di ${target} tanpa default — insert dari aplikasi bisa gagal`;
      }
      return change.target === false
        ? `${name} wajib isi di ${target} (ada default)`
        : `${name} boleh kosong di ${target}`;
    case "default_kind":
      return `Jenis default ${name} berbeda (${from} vs ${to})`;
    case "default":
      return `Nilai default ${name} berbeda (${from} vs ${to})`;
    case "identity":
      return `Jenis identity ${name} berbeda (${from} vs ${to})`;
    default:
      return `${change.field} ${name} berbeda (${from} vs ${to})`;
  }
}

function explainObjectChange(kind: string, name: string, change: Change): string {
  const from = show(change.reference);
  const to = show(change.target);
  switch (change.field) {
    case "name":
      return `Nama ${kind} berbeda (${from} vs ${to}), definisinya sama`;
    case "columns":
      return `Kolom ${kind} ${name} berbeda: ${from} vs ${to}`;
    case "is_unique":
      return `${kind} ${name} unik hanya di satu sisi`;
    case "method":
      return `Metode ${kind} ${name} berbeda (${from} vs ${to})`;
    case "predicate":
      return `Syarat WHERE ${kind} ${name} berbeda`;
    case "on_delete":
      return `Aksi ON DELETE ${name} berbeda (${from} vs ${to})`;
    case "on_update":
      return `Aksi ON UPDATE ${name} berbeda (${from} vs ${to})`;
    default:
      return `${change.field} ${kind} ${name} berbeda (${from} vs ${to})`;
  }
}

/** Kalimat penjelasan untuk satu item diff yang tidak identik. */
export function explainItem(item: DiffItem, referenceLabel: string, targetLabel: string): Explanation[] {
  const name = item.object_name;
  const kind = OBJECT_LABELS[item.object_type];
  const severity = item.severity ?? "info";

  if (item.status === "only_reference") {
    return [{ severity, text: `${kind} ${name} tidak ada di ${targetLabel}` }];
  }
  if (item.status === "only_target") {
    const required = item.object_type === "column" && severity === "critical";
    return [
      {
        severity,
        text: required
          ? `Kolom ${name} hanya ada di ${targetLabel}, wajib isi tanpa default — insert dari aplikasi bisa gagal`
          : `${kind} ${name} hanya ada di ${targetLabel}`,
      },
    ];
  }
  if (item.status !== "modified") return [];

  return (item.changes ?? []).map((change) => ({
    severity: change.severity,
    text:
      item.object_type === "column"
        ? explainColumnChange(name, change, targetLabel)
        : explainObjectChange(kind.toLowerCase(), name, change),
  }));
}

/** Semua penjelasan untuk isi satu tabel, yang paling berdampak di atas. */
export function explainAll(items: readonly DiffItem[], referenceLabel: string, targetLabel: string): Explanation[] {
  return items
    .flatMap((item) => explainItem(item, referenceLabel, targetLabel))
    .sort((a, b) => bySeverity(a.severity, b.severity));
}
