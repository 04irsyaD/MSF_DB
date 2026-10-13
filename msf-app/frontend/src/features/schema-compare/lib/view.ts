import type {
  Column,
  DiffItem,
  ForeignKey,
  Index,
  ObjectType,
  PrimaryKey,
  Severity,
  Snapshot,
} from "../core/types";

export interface TableGroup {
  table: DiffItem;
  children: DiffItem[];
}

export const OBJECT_LABELS: Record<ObjectType, string> = {
  table: "Tabel",
  column: "Kolom",
  primary_key: "Primary key",
  index: "Index",
  foreign_key: "Foreign key",
};

const SEVERITY_RANK: Record<Severity, number> = { info: 1, warning: 2, critical: 3 };

export function bySeverity(a: Severity, b: Severity): number {
  return SEVERITY_RANK[b] - SEVERITY_RANK[a];
}

/** Mengelompokkan hasil diff per tabel; item `unsupported` tidak ikut. */
export function groupByTable(items: readonly DiffItem[]): TableGroup[] {
  const groups = new Map<string, TableGroup>();
  for (const item of items) {
    if (item.status === "unsupported") continue;
    if (item.object_type === "table") {
      groups.set(item.object_name, { table: item, children: [] });
    } else if (item.parent_name !== undefined) {
      groups.get(item.parent_name)?.children.push(item);
    }
  }
  return Array.from(groups.values());
}

export function unsupportedTypes(items: readonly DiffItem[]): ObjectType[] {
  return items.filter((item) => item.status === "unsupported").map((item) => item.object_type);
}

export interface Summary {
  onlyReference: number;
  onlyTarget: number;
  modified: number;
  identical: number;
}

export function summarizeTables(groups: readonly TableGroup[]): Summary {
  // Sengaja pakai loop: minifier SWC di Next 14.2.18 salah meng-inline closure
  // yang dipanggil berulang dengan argumen konstan ("groups is not defined" di build produksi).
  const summary: Summary = { onlyReference: 0, onlyTarget: 0, modified: 0, identical: 0 };
  for (const group of groups) {
    if (group.table.status === "only_reference") summary.onlyReference += 1;
    else if (group.table.status === "only_target") summary.onlyTarget += 1;
    else if (group.table.status === "modified") summary.modified += 1;
    else if (group.table.status === "identical") summary.identical += 1;
  }
  return summary;
}

export function formatColumnType(column: Column): string {
  const array = /(\[\])+$/.exec(column.data_type)?.[0] ?? "";
  const base = array ? column.data_type.slice(0, -array.length) : column.data_type;
  if (column.character_maximum_length !== null) return `${base}(${column.character_maximum_length})${array}`;
  if (column.numeric_precision !== null) return `${base}(${column.numeric_precision},${column.numeric_scale ?? 0})${array}`;
  return column.data_type;
}

/** Atribut selain tipe, ditampilkan lebih redup di samping tipe. */
export function formatColumnAttributes(column: Column): string {
  const parts = [column.is_nullable ? "" : "not null"];
  if (column.default_kind === "identity") {
    parts.push(`identity ${column.identity === "always" ? "always" : "by default"}`);
  } else if (column.default_kind !== "none") {
    parts.push(`default ${column.default ?? ""}`);
  }
  return parts.filter(Boolean).join(" · ");
}

export function describeObject(type: ObjectType, value: Record<string, unknown>): string {
  if (type === "primary_key") {
    return `(${(value as unknown as PrimaryKey).columns.join(", ")})`;
  }
  if (type === "index") {
    const index = value as unknown as Index;
    return [
      index.is_unique ? "unique" : "",
      index.method,
      `(${index.columns.join(", ")})`,
      index.predicate ? `where ${index.predicate}` : "",
    ]
      .filter(Boolean)
      .join(" ");
  }
  const fk = value as unknown as ForeignKey;
  return `(${fk.columns.join(", ")}) → ${fk.ref_table}(${fk.ref_columns.join(", ")}) on delete ${fk.on_delete.toLowerCase()}`;
}

export interface Notice {
  tone: "warning" | "info";
  text: string;
}

/** Banner di atas hasil: migrasi tertinggal, beda versi, tabel dilewati, catatan adapter. */
export function buildNotices(reference: Snapshot, target: Snapshot, unsupported: readonly ObjectType[]): Notice[] {
  const notices: Notice[] = [];
  const refLabel = reference.source.label;
  const targetLabel = target.source.label;

  const refMigration = reference.app_migration;
  const targetMigration = target.app_migration;
  if (refMigration && targetMigration && refMigration.latest !== targetMigration.latest) {
    if (refMigration.count !== targetMigration.count) {
      const targetBehind = targetMigration.count < refMigration.count;
      const gap = Math.abs(refMigration.count - targetMigration.count);
      notices.push({
        tone: "warning",
        text: `${targetBehind ? targetLabel : refLabel} tertinggal ${gap} migrasi dari ${targetBehind ? refLabel : targetLabel}`,
      });
    } else {
      notices.push({
        tone: "warning",
        text: `Migrasi terakhir berbeda: ${refMigration.latest ?? "-"} (${refLabel}) vs ${targetMigration.latest ?? "-"} (${targetLabel})`,
      });
    }
  }

  if (reference.source.engine !== target.source.engine) {
    notices.push({
      tone: "warning",
      text: `Dua snapshot berasal dari engine berbeda (${reference.source.engine} vs ${target.source.engine}). Perbandingan mungkin tidak bermakna.`,
    });
  } else if (
    Math.floor(reference.source.server_version_num / 10000) !== Math.floor(target.source.server_version_num / 10000)
  ) {
    notices.push({
      tone: "warning",
      text: "Dua snapshot menggunakan major version PostgreSQL berbeda. Beberapa perbedaan mungkin disebabkan perubahan dialek, bukan perubahan schema sesungguhnya.",
    });
  }

  if (reference.source.schema !== target.source.schema) {
    notices.push({
      tone: "warning",
      text: `Nama schema berbeda (${reference.source.schema} vs ${target.source.schema}). Perbandingan mungkin tidak bermakna.`,
    });
  }

  if (unsupported.length > 0) {
    const names = unsupported.map((type) => OBJECT_LABELS[type].toLowerCase()).join(", ");
    notices.push({ tone: "info", text: `Tidak dibandingkan: ${names}. Salah satu snapshot tidak memuatnya.` });
  }

  for (const snapshot of [reference, target]) {
    const matched = snapshot.excluded_tables.matched;
    if (matched.length > 0) {
      notices.push({
        tone: "info",
        text: `${snapshot.source.label}: ${matched.length} tabel dilewati (${matched.join(", ")})`,
      });
    }
    for (const note of snapshot.notes) {
      notices.push({ tone: "info", text: `${snapshot.source.label}: ${note}` });
    }
  }

  return notices;
}
