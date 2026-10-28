// Disalin dari db-schema-compare/src/core (sumber utama beserta test-nya).
// Satu-satunya perbedaan: import tanpa akhiran .ts. Ubah di sumbernya, lalu salin ulang.

// Normalisasi tipe data dan nilai default sebelum masuk snapshot.
// Dipanggil adapter; differ tidak pernah memanggil modul ini.

import type { DefaultKind, IdentityKind } from './types';

export interface NormalizedType {
  data_type: string;
  character_maximum_length: number | null;
  numeric_precision: number | null;
  numeric_scale: number | null;
  // true untuk serial/bigserial/smallserial: kolom punya default dari sequence.
  implies_sequence: boolean;
}

export interface NormalizedDefault {
  default: string | null;
  default_kind: DefaultKind;
  identity: IdentityKind | null;
}

const TYPE_ALIASES: Record<string, string> = {
  int2: 'smallint',
  int4: 'integer',
  int: 'integer',
  int8: 'bigint',
  smallserial: 'smallint',
  serial2: 'smallint',
  serial: 'integer',
  serial4: 'integer',
  bigserial: 'bigint',
  serial8: 'bigint',
  float4: 'real',
  float8: 'double precision',
  bool: 'boolean',
  decimal: 'numeric',
  timestamptz: 'timestamp with time zone',
  timestamp: 'timestamp without time zone',
  timetz: 'time with time zone',
  time: 'time without time zone',
  'character varying': 'varchar',
  character: 'char',
  bpchar: 'char',
};

const SERIAL_TYPES = new Set(['smallserial', 'serial2', 'serial', 'serial4', 'bigserial', 'serial8']);

/**
 * Menormalisasi teks tipe seperti keluaran `format_type()` PostgreSQL,
 * misal `character varying(255)`, `numeric(10,2)`, `int4`, `integer[]`.
 */
export function normalizeType(rawType: string): NormalizedType {
  let text = rawType.trim().toLowerCase().replace(/\s+/g, ' ');

  let arraySuffix = '';
  while (text.endsWith('[]')) {
    arraySuffix += '[]';
    text = text.slice(0, -2).trimEnd();
  }

  // Argumen bisa di tengah: `timestamp(3) without time zone`.
  let args: number[] = [];
  const withArgs = /^([^(]*?)\s*\(([\d\s,]+)\)\s*(.*)$/.exec(text);
  let head = text;
  let tail = '';
  if (withArgs) {
    head = withArgs[1] ?? '';
    args = (withArgs[2] ?? '').split(',').map((part) => Number.parseInt(part.trim(), 10));
    tail = withArgs[3] ?? '';
  }

  const baseRaw = tail ? `${head} ${tail}` : head;
  const base = TYPE_ALIASES[baseRaw] ?? baseRaw;
  const result: NormalizedType = {
    data_type: base,
    character_maximum_length: null,
    numeric_precision: null,
    numeric_scale: null,
    implies_sequence: SERIAL_TYPES.has(baseRaw),
  };

  const first = args[0];
  if (base === 'varchar' || base === 'char') {
    if (first !== undefined && Number.isFinite(first)) {
      result.character_maximum_length = first;
    } else if (base === 'varchar') {
      // varchar tanpa panjang setara text.
      result.data_type = 'text';
    }
  } else if (base === 'numeric') {
    if (first !== undefined && Number.isFinite(first)) {
      result.numeric_precision = first;
      result.numeric_scale = args[1] ?? 0;
    }
  } else if (args.length > 0) {
    // Presisi tipe lain (misal timestamp(3)) tetap bagian dari nama tipe,
    // ditaruh sebelum akhiran zona waktu seperti di PostgreSQL.
    const zoned = /^(.*?)( with(?:out)? time zone)$/.exec(base);
    result.data_type = zoned
      ? `${zoned[1]}(${args.join(',')})${zoned[2]}`
      : `${base}(${args.join(',')})`;
  }

  result.data_type += arraySuffix;
  return result;
}

// Kelanjutan nama tipe multi-kata yang boleh mengikuti cast `::`.
const CAST_TYPE = new RegExp(
  String.raw`^\s*(?:"[^"]+"|[a-z_][a-z0-9_]*)(?:\.(?:"[^"]+"|[a-z_][a-z0-9_]*))?` +
    String.raw`(?:\s+(?:varying|precision))?` +
    String.raw`(?:\s*\(\s*\d+(?:\s*,\s*\d+)?\s*\))?` +
    String.raw`(?:\s+with(?:out)?\s+time\s+zone)?` +
    String.raw`(?:\s*\[\s*\])*`,
  'i',
);

/** Membuang cast `::tipe` yang berada di luar string literal. */
export function stripCasts(expression: string): string {
  let out = '';
  let i = 0;
  while (i < expression.length) {
    const char = expression[i];
    if (char === "'") {
      // Salin string literal apa adanya; '' adalah kutip yang di-escape.
      let end = i + 1;
      while (end < expression.length) {
        if (expression[end] === "'") {
          if (expression[end + 1] === "'") {
            end += 2;
            continue;
          }
          break;
        }
        end += 1;
      }
      out += expression.slice(i, end + 1);
      i = end + 1;
      continue;
    }
    if (char === ':' && expression[i + 1] === ':') {
      const match = CAST_TYPE.exec(expression.slice(i + 2));
      if (match) {
        i += 2 + match[0].length;
        continue;
      }
    }
    out += char;
    i += 1;
  }
  return out.trim();
}

const NEXTVAL = /^nextval\(\s*'((?:[^']|'')+)'\s*\)$/i;
const NUMBER_LITERAL = /^-?\d+(?:\.\d+)?$/;
const STRING_LITERAL = /^'(?:[^']|'')*'$/;
const KEYWORD_LITERAL = /^(?:true|false|null)$/i;

function stripSchema(qualifiedName: string): string {
  const match = /^(?:(?:"[^"]+"|[^".]+)\.)?(.+)$/.exec(qualifiedName);
  return match?.[1] ?? qualifiedName;
}

/**
 * Menormalisasi ekspresi default kolom.
 * `identity` diisi jika kolom `GENERATED ... AS IDENTITY`.
 */
export function normalizeDefault(expression: string | null, identity: IdentityKind | null = null): NormalizedDefault {
  if (identity) {
    return { default: null, default_kind: 'identity', identity };
  }
  if (expression === null || expression.trim() === '') {
    return { default: null, default_kind: 'none', identity: null };
  }

  const cleaned = stripCasts(expression);

  const sequence = NEXTVAL.exec(cleaned);
  if (sequence?.[1]) {
    return { default: `nextval('${stripSchema(sequence[1])}')`, default_kind: 'sequence', identity: null };
  }

  if (NUMBER_LITERAL.test(cleaned) || STRING_LITERAL.test(cleaned) || KEYWORD_LITERAL.test(cleaned)) {
    return { default: cleaned, default_kind: 'literal', identity: null };
  }

  return { default: cleaned, default_kind: 'expression', identity: null };
}
