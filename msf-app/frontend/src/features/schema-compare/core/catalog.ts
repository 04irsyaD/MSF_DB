// Disalin dari db-schema-compare/src/core (sumber utama beserta test-nya).
// Satu-satunya perbedaan: import tanpa akhiran .ts. Ubah di sumbernya, lalu salin ulang.

// Menyusun snapshot dari baris mentah pg_catalog. Tanpa I/O.
// Dipakai adapter PostgreSQL dan oleh MSF DB, yang mengambil baris yang sama lewat backend-nya,
// supaya keduanya menghasilkan snapshot yang persis sama.

import { isExcluded, makeSnapshotId } from './naming';
import { normalizeDefault, normalizeType } from './normalizer';
import { DEFAULT_EXCLUDED_TABLES, SNAPSHOT_VERSION } from './types';
import type { AppMigration, Column, IdentityKind, Snapshot, Table } from './types';

export interface TableRow {
  oid: string;
  name: string;
}

export interface ColumnRow {
  table_oid: string;
  name: string;
  position: number;
  type: string;
  not_null: boolean;
  identity: string;
  default_expr: string | null;
}

export interface ConstraintRow {
  table_oid: string;
  name: string;
  type: 'p' | 'f';
  columns: string[];
  ref_schema: string | null;
  ref_table: string | null;
  ref_columns: string[] | null;
  on_delete: string;
  on_update: string;
}

export interface IndexRow {
  table_oid: string;
  name: string;
  is_unique: boolean;
  is_primary: boolean;
  method: string;
  columns: string[];
  predicate: string | null;
}

/** Hasil query katalog satu schema. `tables` berisi semua tabel, termasuk yang nanti dikecualikan. */
export interface CatalogRows {
  server_version: string;
  server_version_num: number;
  tables: TableRow[];
  columns: ColumnRow[];
  constraints: ConstraintRow[];
  indexes: IndexRow[];
}

export interface CatalogOptions {
  label: string;
  database: string;
  schema: string;
  captured_at: Date;
  captured_by?: string | null;
  excluded_tables?: readonly string[];
  app_migration?: AppMigration | null;
  notes?: string[];
}

const FK_ACTIONS: Record<string, string> = {
  a: 'NO ACTION',
  r: 'RESTRICT',
  c: 'CASCADE',
  n: 'SET NULL',
  d: 'SET DEFAULT',
};

const IDENTITY_KINDS: Record<string, IdentityKind> = { a: 'always', d: 'by_default' };

export function buildSnapshot(rows: CatalogRows, options: CatalogOptions): Snapshot {
  const patterns = [...(options.excluded_tables ?? DEFAULT_EXCLUDED_TABLES)];
  const included = rows.tables.filter((table) => !isExcluded(table.name, patterns));
  const matched = rows.tables.filter((table) => isExcluded(table.name, patterns)).map((table) => table.name);

  // Baris milik tabel yang tidak disertakan diabaikan karena oid-nya tidak ada di sini.
  const tables = new Map<string, Table>();
  const names = new Map<string, string>();
  for (const row of included) {
    tables.set(row.oid, { primary_key: null, columns: [], indexes: [], foreign_keys: [] });
    names.set(row.oid, row.name);
  }

  for (const row of rows.constraints) {
    const table = tables.get(row.table_oid);
    if (!table) continue;
    if (row.type === 'p') {
      table.primary_key = { name: row.name, columns: row.columns };
    } else {
      const refTable = row.ref_table ?? '';
      table.foreign_keys.push({
        name: row.name,
        columns: row.columns,
        // Rujukan ke schema lain ditulis lengkap agar tidak tertukar dengan tabel bernama sama.
        ref_table: row.ref_schema && row.ref_schema !== options.schema ? `${row.ref_schema}.${refTable}` : refTable,
        ref_columns: row.ref_columns ?? [],
        on_delete: FK_ACTIONS[row.on_delete] ?? row.on_delete,
        on_update: FK_ACTIONS[row.on_update] ?? row.on_update,
      });
    }
  }

  for (const row of rows.columns) {
    const table = tables.get(row.table_oid);
    if (!table) continue;
    const type = normalizeType(row.type);
    const def = normalizeDefault(row.default_expr, IDENTITY_KINDS[row.identity] ?? null);
    const column: Column = {
      name: row.name,
      ordinal_position: row.position,
      data_type: type.data_type,
      is_nullable: !row.not_null,
      default: def.default,
      default_kind: def.default_kind,
      identity: def.identity,
      is_primary_key: table.primary_key?.columns.includes(row.name) ?? false,
      character_maximum_length: type.character_maximum_length,
      numeric_precision: type.numeric_precision,
      numeric_scale: type.numeric_scale,
    };
    table.columns.push(column);
  }

  for (const row of rows.indexes) {
    tables.get(row.table_oid)?.indexes.push({
      name: row.name,
      columns: row.columns,
      is_unique: row.is_unique,
      is_primary: row.is_primary,
      method: row.method,
      predicate: row.predicate,
    });
  }

  const tablesByName: Record<string, Table> = Object.create(null) as Record<string, Table>;
  for (const [oid, table] of tables) {
    const name = names.get(oid);
    if (name !== undefined) tablesByName[name] = table;
  }

  return {
    snapshot_version: SNAPSHOT_VERSION,
    snapshot_id: makeSnapshotId(options.label, options.captured_at),
    captured_at: options.captured_at.toISOString(),
    captured_by: options.captured_by ?? null,
    source: {
      label: options.label,
      engine: 'postgresql',
      server_version: rows.server_version,
      server_version_num: rows.server_version_num,
      database: options.database,
      schema: options.schema,
    },
    app_migration: options.app_migration ?? null,
    supported_objects: ['table', 'column', 'primary_key', 'index', 'foreign_key'],
    excluded_tables: { patterns, matched },
    notes: options.notes ?? [],
    objects: { tables: { ...tablesByName } },
  };
}
