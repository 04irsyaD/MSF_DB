// Disalin dari db-schema-compare/src/core (sumber utama beserta test-nya).
// Satu-satunya perbedaan: import tanpa akhiran .ts. Ubah di sumbernya, lalu salin ulang.

// Validasi snapshot JSON dari sumber tidak tepercaya (upload user).

import { DEFAULT_KINDS, ENGINES, OBJECT_TYPES, SNAPSHOT_VERSION } from './types';
import type { Snapshot } from './types';

export const MAX_TABLES = 5000;
export const MAX_COLUMNS_PER_TABLE = 2000;
const MAX_ERRORS = 20;

// Nama ini berbahaya jika dipakai sebagai kunci objek biasa.
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

export type ValidationResult = { ok: true; snapshot: Snapshot } | { ok: false; errors: string[] };

type Json = Record<string, unknown>;

function isObject(value: unknown): value is Json {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isIntOrNull(value: unknown): boolean {
  return value === null || (typeof value === 'number' && Number.isInteger(value));
}

class Collector {
  readonly errors: string[] = [];

  add(path: string, message: string): void {
    if (this.errors.length < MAX_ERRORS) {
      this.errors.push(`${path}: ${message}`);
    }
  }

  get full(): boolean {
    return this.errors.length >= MAX_ERRORS;
  }

  string(obj: Json, key: string, path: string): void {
    if (typeof obj[key] !== 'string' || obj[key] === '') {
      this.add(`${path}.${key}`, 'harus string tidak kosong');
    }
  }

  boolean(obj: Json, key: string, path: string): void {
    if (typeof obj[key] !== 'boolean') {
      this.add(`${path}.${key}`, 'harus boolean');
    }
  }

  stringArray(obj: Json, key: string, path: string): void {
    if (!isStringArray(obj[key])) {
      this.add(`${path}.${key}`, 'harus array string');
    }
  }
}

function validateColumn(column: unknown, path: string, out: Collector): void {
  if (!isObject(column)) {
    out.add(path, 'harus objek');
    return;
  }
  out.string(column, 'name', path);
  out.string(column, 'data_type', path);
  out.boolean(column, 'is_nullable', path);
  out.boolean(column, 'is_primary_key', path);
  if (typeof column.ordinal_position !== 'number') {
    out.add(`${path}.ordinal_position`, 'harus angka');
  }
  if (column.default !== null && typeof column.default !== 'string') {
    out.add(`${path}.default`, 'harus string atau null');
  }
  if (!(DEFAULT_KINDS as readonly unknown[]).includes(column.default_kind)) {
    out.add(`${path}.default_kind`, `harus salah satu dari ${DEFAULT_KINDS.join(', ')}`);
  }
  if (column.identity !== null && column.identity !== 'always' && column.identity !== 'by_default') {
    out.add(`${path}.identity`, 'harus null, "always", atau "by_default"');
  }
  for (const key of ['character_maximum_length', 'numeric_precision', 'numeric_scale']) {
    if (!isIntOrNull(column[key])) {
      out.add(`${path}.${key}`, 'harus bilangan bulat atau null');
    }
  }
}

function validateTable(table: unknown, path: string, out: Collector): void {
  if (!isObject(table)) {
    out.add(path, 'harus objek');
    return;
  }

  const pk = table.primary_key;
  if (pk !== null) {
    if (!isObject(pk)) {
      out.add(`${path}.primary_key`, 'harus objek atau null');
    } else {
      out.string(pk, 'name', `${path}.primary_key`);
      out.stringArray(pk, 'columns', `${path}.primary_key`);
    }
  }

  if (!Array.isArray(table.columns)) {
    out.add(`${path}.columns`, 'harus array');
  } else if (table.columns.length > MAX_COLUMNS_PER_TABLE) {
    out.add(`${path}.columns`, `maksimal ${MAX_COLUMNS_PER_TABLE} kolom`);
  } else {
    table.columns.forEach((column, i) => validateColumn(column, `${path}.columns[${i}]`, out));
  }

  if (!Array.isArray(table.indexes)) {
    out.add(`${path}.indexes`, 'harus array');
  } else {
    table.indexes.forEach((index, i) => {
      const indexPath = `${path}.indexes[${i}]`;
      if (!isObject(index)) {
        out.add(indexPath, 'harus objek');
        return;
      }
      out.string(index, 'name', indexPath);
      out.string(index, 'method', indexPath);
      out.stringArray(index, 'columns', indexPath);
      out.boolean(index, 'is_unique', indexPath);
      out.boolean(index, 'is_primary', indexPath);
      if (index.predicate !== undefined && index.predicate !== null && typeof index.predicate !== 'string') {
        out.add(`${indexPath}.predicate`, 'harus string atau null');
      }
      index.predicate ??= null;
    });
  }

  if (!Array.isArray(table.foreign_keys)) {
    out.add(`${path}.foreign_keys`, 'harus array');
  } else {
    table.foreign_keys.forEach((fk, i) => {
      const fkPath = `${path}.foreign_keys[${i}]`;
      if (!isObject(fk)) {
        out.add(fkPath, 'harus objek');
        return;
      }
      for (const key of ['name', 'ref_table', 'on_delete', 'on_update']) {
        out.string(fk, key, fkPath);
      }
      out.stringArray(fk, 'columns', fkPath);
      out.stringArray(fk, 'ref_columns', fkPath);
    });
  }
}

/**
 * Memeriksa bahwa `input` adalah snapshot yang sah.
 * Field tambahan yang tidak dikenal dibiarkan.
 */
export function validateSnapshot(input: unknown): ValidationResult {
  const out = new Collector();

  if (!isObject(input)) {
    return { ok: false, errors: ['snapshot: harus objek JSON'] };
  }

  if (input.snapshot_version !== SNAPSHOT_VERSION) {
    out.add('snapshot_version', `harus ${SNAPSHOT_VERSION}`);
  }
  out.string(input, 'snapshot_id', 'snapshot');
  if (typeof input.captured_at !== 'string' || Number.isNaN(Date.parse(input.captured_at))) {
    out.add('captured_at', 'harus tanggal ISO 8601');
  }
  if (input.captured_by !== null && input.captured_by !== undefined && typeof input.captured_by !== 'string') {
    out.add('captured_by', 'harus string atau null');
  }

  const source = input.source;
  if (!isObject(source)) {
    out.add('source', 'harus objek');
  } else {
    for (const key of ['label', 'server_version', 'database', 'schema']) {
      out.string(source, key, 'source');
    }
    if (!(ENGINES as readonly unknown[]).includes(source.engine)) {
      out.add('source.engine', `harus salah satu dari ${ENGINES.join(', ')}`);
    }
    if (typeof source.server_version_num !== 'number' || !Number.isInteger(source.server_version_num)) {
      out.add('source.server_version_num', 'harus bilangan bulat');
    }
  }

  const migration = input.app_migration;
  if (migration !== null && migration !== undefined) {
    if (!isObject(migration)) {
      out.add('app_migration', 'harus objek atau null');
    } else {
      out.string(migration, 'table', 'app_migration');
      if (migration.latest !== null && typeof migration.latest !== 'string') {
        out.add('app_migration.latest', 'harus string atau null');
      }
      if (typeof migration.count !== 'number' || !Number.isInteger(migration.count) || migration.count < 0) {
        out.add('app_migration.count', 'harus bilangan bulat tidak negatif');
      }
    }
  }

  const supported = input.supported_objects;
  if (!Array.isArray(supported) || !supported.every((item) => (OBJECT_TYPES as readonly unknown[]).includes(item))) {
    out.add('supported_objects', `harus array berisi ${OBJECT_TYPES.join(', ')}`);
  }

  const excluded = input.excluded_tables;
  if (!isObject(excluded)) {
    out.add('excluded_tables', 'harus objek');
  } else {
    out.stringArray(excluded, 'patterns', 'excluded_tables');
    out.stringArray(excluded, 'matched', 'excluded_tables');
  }

  if (!isStringArray(input.notes)) {
    out.add('notes', 'harus array string');
  }

  const objects = input.objects;
  if (!isObject(objects) || !isObject(objects.tables)) {
    out.add('objects.tables', 'harus objek');
  } else {
    const names = Object.keys(objects.tables);
    if (names.length > MAX_TABLES) {
      out.add('objects.tables', `maksimal ${MAX_TABLES} tabel`);
    } else {
      for (const name of names) {
        if (out.full) break;
        if (name === '' || FORBIDDEN_KEYS.has(name)) {
          out.add('objects.tables', `nama tabel tidak diizinkan: ${JSON.stringify(name)}`);
          continue;
        }
        validateTable(objects.tables[name], `objects.tables[${JSON.stringify(name)}]`, out);
      }
    }
  }

  if (out.errors.length > 0) {
    return { ok: false, errors: out.errors };
  }

  // Snapshot lama boleh tidak punya captured_by dan app_migration.
  const snapshot = input as unknown as Snapshot;
  snapshot.captured_by ??= null;
  snapshot.app_migration ??= null;
  return { ok: true, snapshot };
}
