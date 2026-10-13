// Disalin dari db-schema-compare/src/core (sumber utama beserta test-nya).
// Satu-satunya perbedaan: import tanpa akhiran .ts. Ubah di sumbernya, lalu salin ulang.

// Semua type dan interface bersama. Lihat SPEC.md untuk arti tiap field.

export const SNAPSHOT_VERSION = 1;

export const ENGINES = ['postgresql', 'mysql', 'mssql'] as const;
export type Engine = (typeof ENGINES)[number];

// Urutan ini juga urutan item "unsupported" di hasil diff.
export const OBJECT_TYPES = ['table', 'column', 'primary_key', 'index', 'foreign_key'] as const;
export type ObjectType = (typeof OBJECT_TYPES)[number];

export const DEFAULT_KINDS = ['none', 'literal', 'expression', 'sequence', 'identity'] as const;
export type DefaultKind = (typeof DEFAULT_KINDS)[number];

export type IdentityKind = 'always' | 'by_default';

export interface Column {
  name: string;
  ordinal_position: number;
  data_type: string;
  is_nullable: boolean;
  default: string | null;
  default_kind: DefaultKind;
  identity: IdentityKind | null;
  is_primary_key: boolean;
  character_maximum_length: number | null;
  numeric_precision: number | null;
  numeric_scale: number | null;
}

export interface PrimaryKey {
  name: string;
  columns: string[];
}

export interface Index {
  name: string;
  columns: string[];
  is_unique: boolean;
  is_primary: boolean;
  method: string;
  // Syarat WHERE pada partial index; null untuk index biasa.
  predicate: string | null;
}

export interface ForeignKey {
  name: string;
  columns: string[];
  ref_table: string;
  ref_columns: string[];
  on_delete: string;
  on_update: string;
}

export interface Table {
  primary_key: PrimaryKey | null;
  columns: Column[];
  indexes: Index[];
  foreign_keys: ForeignKey[];
}

export interface SnapshotSource {
  label: string;
  engine: Engine;
  server_version: string;
  server_version_num: number;
  database: string;
  schema: string;
}

export interface AppMigration {
  table: string;
  latest: string | null;
  count: number;
}

export interface ExcludedTables {
  patterns: string[];
  matched: string[];
}

export interface Snapshot {
  snapshot_version: number;
  snapshot_id: string;
  captured_at: string;
  captured_by: string | null;
  source: SnapshotSource;
  app_migration: AppMigration | null;
  supported_objects: ObjectType[];
  excluded_tables: ExcludedTables;
  notes: string[];
  objects: {
    tables: Record<string, Table>;
  };
}

export type Severity = 'critical' | 'warning' | 'info';

export type DiffStatus = 'only_reference' | 'only_target' | 'modified' | 'identical' | 'unsupported';

export interface Change {
  field: string;
  severity: Severity;
  reference: unknown;
  target: unknown;
}

export interface DiffItem {
  object_type: ObjectType;
  object_name: string;
  parent_name?: string;
  status: DiffStatus;
  severity?: Severity;
  changes?: Change[];
  reference?: Record<string, unknown>;
  target?: Record<string, unknown>;
}

export const DEFAULT_EXCLUDED_TABLES: readonly string[] = [
  'migrations',
  'schema_migrations',
  'flyway_schema_history',
  'jobs',
  'failed_jobs',
  'queue_*',
];

export type SslMode = 'disable' | 'require' | 'verify-full';

export interface AdapterConfig {
  host: string;
  port: number;
  database: string;
  schema: string;
  username: string;
  password: string;
  label: string;
  captured_by?: string;
  excluded_tables?: string[];
  migration_table?: string;
  ssl?: SslMode;
}

export interface Adapter {
  introspect(config: AdapterConfig): Promise<Snapshot>;
}

export class AdapterConnectionError extends Error {
  override name = 'AdapterConnectionError';
}

export class AdapterQueryError extends Error {
  override name = 'AdapterQueryError';
}
