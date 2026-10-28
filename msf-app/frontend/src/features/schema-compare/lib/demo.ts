// Dua snapshot contoh agar halaman bisa dicoba tanpa file.

import type { Column, ForeignKey, Index, Snapshot, Table } from "../core/types";

function col(name: string, dataType: string, extra: Partial<Column> = {}): Column {
  return {
    name,
    ordinal_position: 1,
    data_type: dataType,
    is_nullable: true,
    default: null,
    default_kind: "none",
    identity: null,
    is_primary_key: false,
    character_maximum_length: null,
    numeric_precision: null,
    numeric_scale: null,
    ...extra,
  };
}

function id(sequence: string): Column {
  return col("id", "bigint", {
    is_nullable: false,
    is_primary_key: true,
    default: `nextval('${sequence}')`,
    default_kind: "sequence",
  });
}

function varchar(name: string, length: number, extra: Partial<Column> = {}): Column {
  return col(name, "varchar", { character_maximum_length: length, ...extra });
}

function index(name: string, columns: string[], isUnique = false): Index {
  return { name, columns, is_unique: isUnique, is_primary: false, method: "btree", predicate: null };
}

function fk(name: string, column: string, refTable: string, onDelete = "NO ACTION"): ForeignKey {
  return { name, columns: [column], ref_table: refTable, ref_columns: ["id"], on_delete: onDelete, on_update: "NO ACTION" };
}

function table(columns: Column[], extra: Partial<Table> = {}): Table {
  return { primary_key: { name: "pkey", columns: ["id"] }, columns, indexes: [], foreign_keys: [], ...extra };
}

function snapshot(label: string, database: string, migration: [string, number], tables: Record<string, Table>): Snapshot {
  return {
    snapshot_version: 1,
    snapshot_id: `${label}-contoh`,
    captured_at: "2026-08-18T09:14:22Z",
    captured_by: null,
    source: {
      label,
      engine: "postgresql",
      server_version: "17.2",
      server_version_num: 170002,
      database,
      schema: "public",
    },
    app_migration: { table: "migrations", latest: migration[0], count: migration[1] },
    supported_objects: ["table", "column", "primary_key", "index", "foreign_key"],
    excluded_tables: { patterns: ["migrations", "jobs", "failed_jobs"], matched: ["jobs", "migrations"] },
    notes: [],
    objects: { tables },
  };
}

const createdAt = col("created_at", "timestamp with time zone", {
  is_nullable: false,
  default: "now()",
  default_kind: "expression",
});

const roles = table([id("roles_id_seq"), varchar("name", 50, { is_nullable: false })]);
const products = table([
  id("products_id_seq"),
  varchar("sku", 40, { is_nullable: false }),
  col("price", "numeric", { is_nullable: false, numeric_precision: 12, numeric_scale: 2 }),
]);

export const DEMO_REFERENCE: Snapshot = snapshot("staging", "app_staging", ["2026_08_01_tambah_phone", 217], {
  users: table(
    [
      id("users_id_seq"),
      varchar("email", 255, { is_nullable: false }),
      varchar("phone", 20),
      varchar("status", 20, { is_nullable: false, default: "'aktif'", default_kind: "literal" }),
      col("role_id", "integer"),
      createdAt,
    ],
    {
      indexes: [index("idx_users_email", ["email"], true), index("idx_users_role", ["role_id"])],
      foreign_keys: [fk("fk_users_role", "role_id", "roles", "RESTRICT")],
    },
  ),
  invoices: table([
    id("invoices_id_seq"),
    col("user_id", "bigint", { is_nullable: false }),
    col("total", "numeric", { is_nullable: false, numeric_precision: 14, numeric_scale: 2 }),
    col("note", "text"),
    createdAt,
  ]),
  payment_logs: table([id("payment_logs_id_seq"), col("invoice_id", "bigint"), col("payload", "jsonb"), createdAt]),
  roles,
  products,
});

export const DEMO_TARGET: Snapshot = snapshot("production", "app_prod", ["2026_07_19_tambah_index_user", 214], {
  users: table(
    [
      id("users_id_seq"),
      varchar("email", 100, { is_nullable: false }),
      varchar("status", 20, { is_nullable: false, default: "'aktif'", default_kind: "literal" }),
      col("role_id", "integer"),
      createdAt,
    ],
    {
      indexes: [index("users_email_unique", ["email"], true)],
      foreign_keys: [fk("fk_users_role", "role_id", "roles", "CASCADE")],
    },
  ),
  invoices: table([
    id("invoices_id_seq"),
    col("user_id", "integer", { is_nullable: false }),
    col("total", "numeric", { is_nullable: false, numeric_precision: 14, numeric_scale: 2 }),
    col("note", "text", { is_nullable: false }),
    createdAt,
  ]),
  roles,
  products,
  temp_import: table([id("temp_import_id_seq"), col("raw", "text")]),
});
