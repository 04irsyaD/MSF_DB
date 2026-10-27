// Disalin dari db-schema-compare/src/core (sumber utama beserta test-nya).
// Satu-satunya perbedaan: import tanpa akhiran .ts. Ubah di sumbernya, lalu salin ulang.

// Differ murni: dua snapshot masuk, DiffItem[] keluar.
// Tidak ada I/O, tidak ada pengetahuan tentang engine. Aturan severity ada di SPEC.md.

import { OBJECT_TYPES } from './types';
import type {
  Change,
  Column,
  DiffItem,
  ForeignKey,
  Index,
  ObjectType,
  Severity,
  Snapshot,
  Table,
} from './types';

const SEVERITY_RANK: Record<Severity, number> = { info: 1, warning: 2, critical: 3 };

// Keluarga tipe, dari sempit ke lebar.
const TYPE_FAMILIES: readonly (readonly string[])[] = [
  ['smallint', 'integer', 'bigint'],
  ['real', 'double precision'],
  ['char', 'varchar', 'text'],
];

function compareNames(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function maxSeverity(severities: readonly (Severity | undefined)[]): Severity | undefined {
  let best: Severity | undefined;
  for (const severity of severities) {
    if (severity && (!best || SEVERITY_RANK[severity] > SEVERITY_RANK[best])) {
      best = severity;
    }
  }
  return best;
}

function sameList(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((value, i) => value === b[i]);
}

function asRecord(value: object): Record<string, unknown> {
  return { ...value };
}

/** Item `modified` jika ada perubahan, `identical` jika tidak. */
function compared(
  base: Pick<DiffItem, 'object_type' | 'object_name' | 'parent_name'>,
  changes: Change[],
  reference: object,
  target: object,
): DiffItem {
  if (changes.length === 0) {
    return { ...base, status: 'identical', reference: asRecord(reference), target: asRecord(target) };
  }
  return {
    ...base,
    status: 'modified',
    severity: maxSeverity(changes.map((change) => change.severity)),
    changes,
    reference: asRecord(reference),
    target: asRecord(target),
  };
}

// ---------------------------------------------------------------------------
// Kolom
// ---------------------------------------------------------------------------

function typeChange(reference: string, target: string): Change | null {
  if (reference === target) return null;
  const family = TYPE_FAMILIES.find((members) => members.includes(reference) && members.includes(target));
  // Sekeluarga dan target lebih lebar aman; selain itu aplikasi bisa error.
  const widened = family !== undefined && family.indexOf(target) > family.indexOf(reference);
  return { field: 'data_type', severity: widened ? 'info' : 'critical', reference, target };
}

/** Batas ukuran: `null` berarti tanpa batas. Target lebih kecil itu critical. */
function limitChange(field: string, reference: number | null, target: number | null): Change | null {
  if (reference === target) return null;
  const targetSmaller = target !== null && (reference === null || target < reference);
  return { field, severity: targetSmaller ? 'critical' : 'warning', reference, target };
}

function hasDefault(column: Column): boolean {
  return column.default_kind !== 'none';
}

function defaultChanges(reference: Column, target: Column): Change[] {
  if (reference.default_kind !== target.default_kind) {
    const kinds = new Set([reference.default_kind, target.default_kind]);
    const sequenceVsIdentity = kinds.has('sequence') && kinds.has('identity');
    return [
      {
        field: 'default_kind',
        severity: sequenceVsIdentity ? 'info' : 'warning',
        reference: reference.default_kind,
        target: target.default_kind,
      },
    ];
  }

  switch (reference.default_kind) {
    case 'literal':
    case 'expression':
      return reference.default === target.default
        ? []
        : [{ field: 'default', severity: 'warning', reference: reference.default, target: target.default }];
    case 'identity':
      return reference.identity === target.identity
        ? []
        : [{ field: 'identity', severity: 'info', reference: reference.identity, target: target.identity }];
    default:
      // 'none' sama-sama kosong; 'sequence' tidak membandingkan nama sequence.
      return [];
  }
}

function columnChanges(reference: Column, target: Column): Change[] {
  const changes: Change[] = [];

  const type = typeChange(reference.data_type, target.data_type);
  if (type) changes.push(type);
  // Tipe sama: semua beda ukuran dilaporkan. Tipe sekeluarga yang melebar (char(50) → varchar(10)):
  // hanya ukuran yang mengecil, karena tipe lebih lebar belum tentu muat datanya.
  if (!type || type.severity === 'info') {
    for (const field of ['character_maximum_length', 'numeric_precision', 'numeric_scale'] as const) {
      const limit = limitChange(field, reference[field], target[field]);
      if (limit && (!type || limit.severity === 'critical')) changes.push(limit);
    }
  }

  if (reference.is_nullable !== target.is_nullable) {
    const breaksInsert = reference.is_nullable && !target.is_nullable && !hasDefault(target);
    changes.push({
      field: 'is_nullable',
      severity: breaksInsert ? 'critical' : 'warning',
      reference: reference.is_nullable,
      target: target.is_nullable,
    });
  }

  changes.push(...defaultChanges(reference, target));
  return changes;
}

function diffColumns(tableName: string, reference: Table, target: Table): DiffItem[] {
  const refByName = new Map(reference.columns.map((column) => [column.name, column]));
  const targetByName = new Map(target.columns.map((column) => [column.name, column]));
  const names = [...new Set([...refByName.keys(), ...targetByName.keys()])].sort(compareNames);

  return names.map((name): DiffItem => {
    const base = { object_type: 'column' as const, object_name: name, parent_name: tableName };
    const ref = refByName.get(name);
    const tgt = targetByName.get(name);

    if (ref && tgt) {
      return compared(base, columnChanges(ref, tgt), ref, tgt);
    }
    if (ref) {
      return { ...base, status: 'only_reference', severity: 'critical', reference: asRecord(ref) };
    }
    const column = tgt as Column;
    // Kolom wajib isi tanpa default: insert dari aplikasi yang tidak mengenalnya akan gagal.
    const breaksInsert = !column.is_nullable && !hasDefault(column);
    return {
      ...base,
      status: 'only_target',
      severity: breaksInsert ? 'critical' : 'warning',
      target: asRecord(column),
    };
  });
}

// ---------------------------------------------------------------------------
// Primary key
// ---------------------------------------------------------------------------

function diffPrimaryKey(tableName: string, reference: Table, target: Table): DiffItem[] {
  const ref = reference.primary_key;
  const tgt = target.primary_key;
  if (!ref && !tgt) return [];

  const base = {
    object_type: 'primary_key' as const,
    object_name: (ref ?? tgt)?.name ?? '',
    parent_name: tableName,
  };

  if (ref && tgt) {
    const changes: Change[] = [];
    if (!sameList(ref.columns, tgt.columns)) {
      changes.push({ field: 'columns', severity: 'critical', reference: ref.columns, target: tgt.columns });
    }
    if (ref.name !== tgt.name) {
      changes.push({ field: 'name', severity: 'info', reference: ref.name, target: tgt.name });
    }
    return [compared(base, changes, ref, tgt)];
  }
  if (ref) {
    return [{ ...base, status: 'only_reference', severity: 'critical', reference: asRecord(ref) }];
  }
  return [{ ...base, status: 'only_target', severity: 'critical', target: asRecord(tgt as object) }];
}

// ---------------------------------------------------------------------------
// Pencocokan berdasarkan definisi (dipakai index dan foreign key)
// ---------------------------------------------------------------------------

interface Named {
  name: string;
}

interface Pairing<T> {
  pairs: [T, T][];
  onlyReference: T[];
  onlyTarget: T[];
}

/** Memasangkan objek dengan definisi yang sama, berurutan menurut nama agar deterministik. */
function pairBySignature<T extends Named>(
  reference: readonly T[],
  target: readonly T[],
  signature: (item: T) => string,
): Pairing<T> {
  const byName = (a: T, b: T): number => compareNames(a.name, b.name);
  const pool = new Map<string, T[]>();
  for (const item of [...target].sort(byName)) {
    const key = signature(item);
    const group = pool.get(key);
    if (group) group.push(item);
    else pool.set(key, [item]);
  }

  const pairs: [T, T][] = [];
  const onlyReference: T[] = [];
  for (const item of [...reference].sort(byName)) {
    const match = pool.get(signature(item))?.shift();
    if (match) pairs.push([item, match]);
    else onlyReference.push(item);
  }

  const onlyTarget = [...pool.values()].flat().sort(byName);
  return { pairs, onlyReference, onlyTarget };
}

// ---------------------------------------------------------------------------
// Index
// ---------------------------------------------------------------------------

function indexSignature(index: Index): string {
  return JSON.stringify([index.columns, index.is_unique, index.method, index.predicate]);
}

function diffIndexes(tableName: string, reference: Table, target: Table): DiffItem[] {
  // Index primary key sudah diwakili item primary_key.
  const refIndexes = reference.indexes.filter((index) => !index.is_primary);
  const targetIndexes = target.indexes.filter((index) => !index.is_primary);
  const base = (name: string) => ({ object_type: 'index' as const, object_name: name, parent_name: tableName });
  const items: DiffItem[] = [];

  // Langkah 1: cocokkan berdasarkan nama.
  const targetByName = new Map(targetIndexes.map((index) => [index.name, index]));
  const unmatchedRef: Index[] = [];
  for (const ref of refIndexes) {
    const tgt = targetByName.get(ref.name);
    if (!tgt) {
      unmatchedRef.push(ref);
      continue;
    }
    targetByName.delete(ref.name);
    const changes: Change[] = [];
    if (ref.is_unique !== tgt.is_unique) {
      changes.push({ field: 'is_unique', severity: 'critical', reference: ref.is_unique, target: tgt.is_unique });
    }
    if (!sameList(ref.columns, tgt.columns)) {
      changes.push({ field: 'columns', severity: 'warning', reference: ref.columns, target: tgt.columns });
    }
    if (ref.method !== tgt.method) {
      changes.push({ field: 'method', severity: 'warning', reference: ref.method, target: tgt.method });
    }
    if (ref.predicate !== tgt.predicate) {
      changes.push({ field: 'predicate', severity: 'warning', reference: ref.predicate, target: tgt.predicate });
    }
    items.push(compared(base(ref.name), changes, ref, tgt));
  }

  // Langkah 2: sisanya dicocokkan berdasarkan definisi; namanya pasti berbeda.
  const rest = pairBySignature(unmatchedRef, [...targetByName.values()], indexSignature);
  for (const [ref, tgt] of rest.pairs) {
    const rename: Change = { field: 'name', severity: 'warning', reference: ref.name, target: tgt.name };
    items.push(compared(base(ref.name), [rename], ref, tgt));
  }
  for (const ref of rest.onlyReference) {
    items.push({
      ...base(ref.name),
      status: 'only_reference',
      severity: ref.is_unique ? 'critical' : 'warning',
      reference: asRecord(ref),
    });
  }
  for (const tgt of rest.onlyTarget) {
    items.push({
      ...base(tgt.name),
      status: 'only_target',
      severity: tgt.is_unique ? 'critical' : 'info',
      target: asRecord(tgt),
    });
  }

  return items.sort((a, b) => compareNames(a.object_name, b.object_name));
}

// ---------------------------------------------------------------------------
// Foreign key
// ---------------------------------------------------------------------------

function foreignKeySignature(fk: ForeignKey): string {
  return JSON.stringify([fk.columns, fk.ref_table, fk.ref_columns]);
}

function diffForeignKeys(tableName: string, reference: Table, target: Table): DiffItem[] {
  const base = (name: string) => ({
    object_type: 'foreign_key' as const,
    object_name: name,
    parent_name: tableName,
  });
  const matched = pairBySignature(reference.foreign_keys, target.foreign_keys, foreignKeySignature);
  const items: DiffItem[] = [];

  for (const [ref, tgt] of matched.pairs) {
    const changes: Change[] = [];
    for (const field of ['on_delete', 'on_update'] as const) {
      if (ref[field] !== tgt[field]) {
        changes.push({ field, severity: 'warning', reference: ref[field], target: tgt[field] });
      }
    }
    if (ref.name !== tgt.name) {
      changes.push({ field: 'name', severity: 'info', reference: ref.name, target: tgt.name });
    }
    items.push(compared(base(ref.name), changes, ref, tgt));
  }
  for (const ref of matched.onlyReference) {
    items.push({ ...base(ref.name), status: 'only_reference', severity: 'critical', reference: asRecord(ref) });
  }
  for (const tgt of matched.onlyTarget) {
    items.push({ ...base(tgt.name), status: 'only_target', severity: 'critical', target: asRecord(tgt) });
  }

  return items.sort((a, b) => compareNames(a.object_name, b.object_name));
}

// ---------------------------------------------------------------------------
// Tabel dan entry point
// ---------------------------------------------------------------------------

function tableSummary(table: Table): Record<string, unknown> {
  return {
    column_count: table.columns.length,
    index_count: table.indexes.length,
    foreign_key_count: table.foreign_keys.length,
  };
}

function tablesOf(snapshot: Snapshot): Map<string, Table> {
  // Map, bukan akses properti: nama tabel berasal dari input tidak tepercaya.
  return new Map(Object.entries(snapshot.objects.tables));
}

/**
 * Membandingkan snapshot acuan dengan snapshot target.
 * Severity dibaca dari sudut pandang: aplikasi ditulis untuk acuan, dijalankan terhadap target.
 */
export function diff(reference: Snapshot, target: Snapshot): DiffItem[] {
  const supported = (type: ObjectType): boolean =>
    reference.supported_objects.includes(type) && target.supported_objects.includes(type);

  // Tanpa daftar tabel tidak ada yang bisa dibandingkan.
  const comparable = OBJECT_TYPES.filter((type) => supported('table') && supported(type));
  const items: DiffItem[] = OBJECT_TYPES.filter((type) => !comparable.includes(type)).map(
    (type): DiffItem => ({ object_type: type, object_name: '*', status: 'unsupported' }),
  );
  if (!comparable.includes('table')) return items;

  const refTables = tablesOf(reference);
  const targetTables = tablesOf(target);
  const names = [...new Set([...refTables.keys(), ...targetTables.keys()])].sort(compareNames);

  for (const name of names) {
    const ref = refTables.get(name);
    const tgt = targetTables.get(name);
    const base = { object_type: 'table' as const, object_name: name };

    if (ref && tgt) {
      const children: DiffItem[] = [
        ...(comparable.includes('column') ? diffColumns(name, ref, tgt) : []),
        ...(comparable.includes('primary_key') ? diffPrimaryKey(name, ref, tgt) : []),
        ...(comparable.includes('index') ? diffIndexes(name, ref, tgt) : []),
        ...(comparable.includes('foreign_key') ? diffForeignKeys(name, ref, tgt) : []),
      ];
      const severity = maxSeverity(children.map((child) => child.severity));
      const changed = children.some((child) => child.status !== 'identical');
      items.push(changed ? { ...base, status: 'modified', severity } : { ...base, status: 'identical' });
      items.push(...children);
    } else if (ref) {
      items.push({ ...base, status: 'only_reference', severity: 'critical', reference: tableSummary(ref) });
    } else if (tgt) {
      items.push({ ...base, status: 'only_target', severity: 'warning', target: tableSummary(tgt) });
    }
  }

  return items;
}
