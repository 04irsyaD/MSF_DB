/**
 * mermaidGenerator.ts
 *
 * Pure utility function untuk mengonversi TableMetadata[] ke sintaks
 * Mermaid.js `erDiagram`. Output dapat ditempel langsung ke GitHub
 * Markdown, Notion, GitLab, atau dbdiagram.io.
 *
 * Referensi sintaks: https://mermaid.js.org/syntax/entityRelationshipDiagram.html
 */

import { TableMetadata } from "@/lib/types";

/**
 * Peta tipe data SQL umum ke tipe Mermaid yang dikenali.
 * Mermaid erDiagram mendukung tipe alfanumerik tanpa spasi atau tanda kurung.
 */
const normalizeSqlType = (sqlType: string): string => {
  const type = sqlType.toUpperCase().replace(/\(.*?\)/g, "").trim();
  const typeMap: Record<string, string> = {
    "CHARACTER VARYING": "VARCHAR",
    "CHARACTER":         "CHAR",
    "DOUBLE PRECISION":  "DOUBLE",
    "TIMESTAMP WITHOUT TIME ZONE": "TIMESTAMP",
    "TIMESTAMP WITH TIME ZONE":    "TIMESTAMPTZ",
    "BOOLEAN":  "BOOL",
    "INTEGER":  "INT",
    "BIGINT":   "BIGINT",
    "SMALLINT": "SMALLINT",
    "SERIAL":   "INT",
    "BIGSERIAL":"BIGINT",
    "TEXT":     "TEXT",
    "JSON":     "JSON",
    "JSONB":    "JSONB",
    "UUID":     "UUID",
    "BYTEA":    "BYTEA",
    "DATE":     "DATE",
    "TIME":     "TIME",
    "NUMERIC":  "NUMERIC",
    "DECIMAL":  "DECIMAL",
    "FLOAT":    "FLOAT",
    "REAL":     "REAL",
  };
  return (typeMap[type] ?? type.replace(/\s+/g, "_")) || "VARCHAR";
};

/** Nama entitas Mermaid hanya boleh huruf, angka, `_` dan `-`. */
const entityName = (name: string): string => name.replace(/[^\w-]/g, "_");

/**
 * Konversi array TableMetadata ke string kode Mermaid erDiagram.
 *
 * @param tables - Array tabel yang sudah diparsing dari DDL atau live DB
 * @returns String kode Mermaid siap pakai (termasuk blok ```mermaid)
 */
export const toMermaidERD = (tables: TableMetadata[]): string => {
  if (tables.length === 0) return "";

  const lines: string[] = ["erDiagram"];

  // Definisi entitas (tabel + kolom)
  for (const table of tables) {
    lines.push(`  ${entityName(table.name)} {`);
    for (const col of table.columns) {
      const type    = normalizeSqlType(col.data_type || "VARCHAR");
      const name    = col.name.replace(/\s+/g, "_");
      const pk      = col.is_primary_key ? " PK" : "";
      const fkMark  = table.foreign_keys?.some((fk) => fk.column === col.name) ? " FK" : "";
      const notNull = col.is_nullable === false && !col.is_primary_key ? ' "NOT NULL"' : "";
      lines.push(`    ${type} ${name}${pk}${fkMark}${notNull}`);
    }
    lines.push("  }");
    lines.push("");
  }

  // Relasi FK (deduplication via Set)
  const seenRelations = new Set<string>();
  for (const table of tables) {
    for (const fk of table.foreign_keys ?? []) {
      // Dedup per tabel + kolom: dua FK ke tabel yang sama (origin_id, dest_id) tetap dua relasi
      const relKey = `${table.name}.${fk.column}--${fk.references_table}`;
      if (!seenRelations.has(relKey)) {
        seenRelations.add(relKey);
        lines.push(`  ${entityName(table.name)} }o--|| ${entityName(fk.references_table)} : "${fk.column}"`);
      }
    }
  }

  return lines.join("\n");
};
