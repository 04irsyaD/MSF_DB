// Snapshot dari koneksi database: backend hanya membaca pg_catalog, penyusunan snapshot
// memakai core/catalog yang sama dengan CLI, jadi hasilnya setara dengan file snapshot CLI.

import { api } from "@/lib/api";
import type { SchemaCatalogAccess } from "@/lib/types";
import { buildSnapshot } from "../core/catalog";
import type { Snapshot } from "../core/types";
import { validateSnapshot } from "../core/validate";
import type { Strings } from "./i18n";

export interface LiveConnection {
  host: string;
  port: string;
  database: string;
  schema: string;
  username: string;
  password: string;
  label: string;
}

export interface LiveResult {
  snapshot: Snapshot;
  access: SchemaCatalogAccess;
}

/** Struktur dari database tidak lolos validasi snapshot (misal nama tabel terlarang). */
export class InvalidStructureError extends Error {
  constructor(readonly errors: string[]) {
    super(errors.join("; "));
    this.name = "InvalidStructureError";
  }
}

// Resep role yang hanya bisa membaca struktur: tanpa GRANT SELECT, isi tabel tertutup,
// tapi pg_catalog tetap terbaca.
export function readOnlyRoleSql(database: string, schema: string, sql: Strings["connect"]["sql"]): string {
  const db = database.trim() || sql.database;
  const sc = schema.trim() || "public";
  const quote = (name: string) => `"${name.replace(/"/g, '""')}"`;
  return [
    sql.header,
    `CREATE ROLE schema_reader LOGIN PASSWORD '${sql.password}';`,
    `GRANT CONNECT ON DATABASE ${quote(db)} TO schema_reader;`,
    `GRANT USAGE ON SCHEMA ${quote(sc)} TO schema_reader;`,
    sql.footer,
  ].join("\n");
}

export async function fetchLiveSnapshot(conn: LiveConnection): Promise<LiveResult> {
  const port = conn.port.trim() ? Number.parseInt(conn.port, 10) : undefined;
  const response = await api.fetchSchemaCatalog({
    engine: "postgresql",
    host: conn.host.trim(),
    port,
    database: conn.database.trim(),
    schema_name: conn.schema.trim() || "public",
    username: conn.username.trim(),
    password: conn.password,
  });

  const snapshot = buildSnapshot(response.catalog, {
    label: conn.label.trim() || response.database,
    database: response.database,
    schema: response.schema,
    captured_at: new Date(),
  });
  // Nama objek berasal dari database orang lain: tetap divalidasi seperti file upload.
  const result = validateSnapshot(snapshot);
  if (!result.ok) {
    throw new InvalidStructureError(result.errors.slice(0, 3));
  }
  return { snapshot: result.snapshot, access: response.access };
}

/** Unduh snapshot sebagai file agar bisa dipakai ulang tanpa konek lagi. Isinya hanya struktur. */
export function downloadSnapshot(snapshot: Snapshot): void {
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${snapshot.snapshot_id}.snapshot.json`;
  link.click();
  URL.revokeObjectURL(url);
}
