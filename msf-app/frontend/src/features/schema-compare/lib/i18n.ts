// Semua teks UI Schema Compare (EN/ID). Tambah/ubah copy di sini saja.
// Istilah teknis (primary key, index, foreign key, not null, ON DELETE) sengaja tidak diterjemahkan.

import { createContext, useContext } from "react";
import type { Lang } from "@/lib/useLang";
import type { ObjectType, Severity } from "../core/types";

const en = {
  page: {
    langLabel: "Language",
    referenceTitle: "Reference",
    referenceHint: "The structure the application expects, usually staging.",
    targetTitle: "Target",
    targetHint: "The database being checked, usually production.",
    footer: "Snapshot files are processed in your browser and never sent to the server. For databases on a private network or VPN, create a snapshot with the CLI",
    loadDemo: "Load example",
    empty: "Choose a reference and a target to see the differences, or load the example.",
  },
  slot: {
    sourceLabel: (title: string) => `Source for ${title}`,
    tabConnect: "Database connection",
    tabUpload: "Upload file",
    dropHint: "Choose or drop a .snapshot.json file",
    tables: (count: number) => `${count} tables`,
    liveSource: "database connection",
    download: "Download snapshot",
    downloadTitle: "Download the snapshot (structure only) to reuse it without connecting again",
    remove: (label: string) => `Remove snapshot ${label}`,
    errTooBig: "The file is larger than 10 MB.",
    errNotJson: "The file is not valid JSON.",
    errNotSnapshot: (errors: string) => `The file is not a valid snapshot: ${errors}`,
    errRead: "The file could not be read.",
    warnSuperuser: (role: string) =>
      `Account ${role} is a superuser: it can read and change all data. MSF DB only reads the structure, but for safety use a dedicated account without SELECT privileges.`,
    warnReadable: (count: number, names: string) =>
      `This account can read the contents of ${count} table(s) (${names}). MSF DB does not read them, but a dedicated account without SELECT privileges is recommended.`,
    more: (count: number) => `+${count} more`,
  },
  connect: {
    fields: {
      host: "Host",
      port: "Port",
      database: "Database",
      schema: "Schema",
      username: "User",
      password: "Password",
      label: "Label",
    },
    submit: "Fetch structure",
    busy: "Reading structure…",
    note: "PostgreSQL reachable from the internet only. Only the structure is read (tables, columns, primary keys, indexes, foreign keys) — table contents are never SELECTed. Credentials are not stored in the browser or on the server.",
    recipeTitle: "Safest: use an account that cannot read data",
    recipeBody:
      "Run this as a database admin. The account can still see the structure, but PostgreSQL rejects every SELECT on table contents — the guarantee comes from the database, not only from MSF DB's code.",
    copy: "Copy SQL",
    copied: "Copied",
    sql: {
      header: "-- Schema Compare account: can see the structure, cannot read table contents.",
      footer: "-- Do not GRANT SELECT on any table.",
      password: "replace-with-a-strong-password",
      database: "database_name",
    },
    errors: {
      AUTH_FAILED: "Authentication failed. Check the username and password.",
      DB_NOT_FOUND: "Database not found. Check the database name.",
      HOST_UNREACHABLE: "The database server cannot be reached. Check the host and port, and make sure it is reachable from the internet.",
      HOST_NOT_ALLOWED: "This host is not allowed. Use a host that is reachable from the internet.",
      SCHEMA_NOT_FOUND: "The schema was not found in this database.",
      CATALOG_TIMEOUT: "Reading the catalog took too long. Try again later.",
      CATALOG_FAILED: "The database catalog could not be read.",
      ENGINE_NOT_SUPPORTED: "Database connection currently supports PostgreSQL only.",
      VALIDATION_ERROR: "Some fields are invalid. Check the host, port, and database name.",
      HTTP_429: "Too many connection attempts. Try again later.",
    } as Record<string, string>,
    failed: "Failed to fetch the database structure.",
    invalidStructure: (errors: string) => `The database structure cannot be used: ${errors}`,
  },
  result: {
    left: "Left",
    right: "Right",
    roleReference: "reference",
    roleTarget: "target",
    swap: "Swap left and right",
    swapTitle: "Swap left and right. The reference and target roles do not change.",
    onlyIn: (count: number, label: string) => `${count} only in ${label}`,
    modified: (count: number) => `${count} with different definitions`,
    identical: (count: number, shown: boolean) => `${count} identical · ${shown ? "shown" : "hidden"}`,
    navLabel: "Objects with differences",
    allObjects: "All objects",
    changedObjects: "Objects with differences",
    noDifferences: "No differences.",
    allIdentical: "No differences: every compared object is identical.",
    identicalLabel: "identical",
  },
  detail: {
    missing: "missing",
    // [teks sebelum, nama snapshot (ditebalkan), teks sesudah]
    onlyTable: (where: string, columns: string, indexes: string, foreignKeys: string): [string, string, string] => [
      `This table only exists in `,
      where,
      ` (${columns} columns, ${indexes} indexes, ${foreignKeys} foreign keys).`,
    ],
    notCompared: (label: string) => `${label} not compared: one of the snapshots does not include it.`,
  },
  severity: { critical: "Critical", warning: "Warning", info: "Info" } satisfies Record<Severity, string>,
  objects: {
    table: "Table",
    column: "Column",
    primary_key: "Primary key",
    index: "Index",
    foreign_key: "Foreign key",
  } satisfies Record<ObjectType, string>,
  notices: {
    migrationsBehind: (behind: string, gap: number, ahead: string) => `${behind} is ${gap} migration(s) behind ${ahead}`,
    migrationDiffers: (ref: string, refLabel: string, target: string, targetLabel: string) =>
      `Latest migration differs: ${ref} (${refLabel}) vs ${target} (${targetLabel})`,
    engineDiffers: (ref: string, target: string) =>
      `The two snapshots come from different engines (${ref} vs ${target}). The comparison may not be meaningful.`,
    majorVersionDiffers:
      "The two snapshots use different PostgreSQL major versions. Some differences may come from dialect changes, not real schema changes.",
    schemaDiffers: (ref: string, target: string) =>
      `Schema names differ (${ref} vs ${target}). The comparison may not be meaningful.`,
    unsupported: (names: string) => `Not compared: ${names}. One of the snapshots does not include them.`,
    skipped: (label: string, count: number, names: string) => `${label}: ${count} table(s) skipped (${names})`,
  },
  explain: {
    unlimited: "unlimited",
    typeWider: (name: string, target: string, from: string, to: string) => `Type of ${name} is wider in ${target} (${from} → ${to})`,
    typeDiffers: (name: string, from: string, to: string) => `Type of ${name} differs (${from} → ${to}) — not compatible`,
    lengthShorter: (name: string, target: string, from: string, to: string) =>
      `Length of ${name} is shorter in ${target} (${from} → ${to}) — data may be truncated`,
    lengthLonger: (name: string, target: string, from: string, to: string) => `Length of ${name} is longer in ${target} (${from} → ${to})`,
    precision: "Precision",
    scale: "Scale",
    numericSmaller: (what: string, name: string, target: string, from: string, to: string) =>
      `${what} of ${name} is smaller in ${target} (${from} → ${to}) — values may be rejected or rounded`,
    numericLarger: (what: string, name: string, target: string, from: string, to: string) =>
      `${what} of ${name} is larger in ${target} (${from} → ${to})`,
    requiredNoDefault: (name: string, target: string) => `${name} is required in ${target} without a default — inserts from the application may fail`,
    requiredWithDefault: (name: string, target: string) => `${name} is required in ${target} (has a default)`,
    nullable: (name: string, target: string) => `${name} is nullable in ${target}`,
    defaultKind: (name: string, from: string, to: string) => `Default kind of ${name} differs (${from} vs ${to})`,
    defaultValue: (name: string, from: string, to: string) => `Default value of ${name} differs (${from} vs ${to})`,
    identity: (name: string, from: string, to: string) => `Identity kind of ${name} differs (${from} vs ${to})`,
    genericColumn: (field: string, name: string, from: string, to: string) => `${field} of ${name} differs (${from} vs ${to})`,
    rename: (kind: string, from: string, to: string) => `${kind} name differs (${from} vs ${to}), same definition`,
    columns: (kind: string, name: string, from: string, to: string) => `Columns of ${kind} ${name} differ: ${from} vs ${to}`,
    unique: (kind: string, name: string) => `${kind} ${name} is unique on one side only`,
    method: (kind: string, name: string, from: string, to: string) => `Method of ${kind} ${name} differs (${from} vs ${to})`,
    predicate: (kind: string, name: string) => `WHERE condition of ${kind} ${name} differs`,
    onDelete: (name: string, from: string, to: string) => `ON DELETE action of ${name} differs (${from} vs ${to})`,
    onUpdate: (name: string, from: string, to: string) => `ON UPDATE action of ${name} differs (${from} vs ${to})`,
    genericObject: (field: string, kind: string, name: string, from: string, to: string) =>
      `${field} of ${kind} ${name} differs (${from} vs ${to})`,
    missingIn: (kind: string, name: string, target: string) => `${kind} ${name} does not exist in ${target}`,
    onlyIn: (kind: string, name: string, target: string) => `${kind} ${name} only exists in ${target}`,
    onlyInRequired: (name: string, target: string) =>
      `Column ${name} only exists in ${target}, required without a default — inserts from the application may fail`,
  },
};

export type Strings = typeof en;

const id: Strings = {
  page: {
    langLabel: "Bahasa",
    referenceTitle: "Acuan",
    referenceHint: "Struktur yang diharapkan aplikasi, biasanya staging.",
    targetTitle: "Target",
    targetHint: "Database yang diperiksa, biasanya production.",
    footer: "File snapshot diproses di browser dan tidak dikirim ke server. Untuk database di jaringan privat atau VPN, buat snapshot dengan CLI",
    loadDemo: "Muat contoh",
    empty: "Pilih acuan dan target untuk melihat perbedaannya, atau muat contoh.",
  },
  slot: {
    sourceLabel: (title) => `Sumber ${title}`,
    tabConnect: "Koneksi database",
    tabUpload: "Unggah file",
    dropHint: "Pilih atau seret file .snapshot.json",
    tables: (count) => `${count} tabel`,
    liveSource: "koneksi database",
    download: "Unduh snapshot",
    downloadTitle: "Unduh snapshot (hanya struktur) agar bisa dipakai lagi tanpa koneksi ulang",
    remove: (label) => `Lepas snapshot ${label}`,
    errTooBig: "Ukuran file melebihi 10 MB.",
    errNotJson: "File bukan JSON yang sah.",
    errNotSnapshot: (errors) => `File bukan snapshot yang sah: ${errors}`,
    errRead: "File tidak bisa dibaca.",
    warnSuperuser: (role) =>
      `Akun ${role} adalah superuser: bisa membaca dan mengubah semua data. MSF DB hanya membaca struktur, tapi untuk keamanan pakai akun khusus yang tidak punya hak SELECT.`,
    warnReadable: (count, names) =>
      `Akun ini bisa membaca isi ${count} tabel (${names}). MSF DB tidak membacanya, tapi sebaiknya pakai akun khusus yang tidak punya hak SELECT.`,
    more: (count) => `+${count} lainnya`,
  },
  connect: {
    fields: {
      host: "Host",
      port: "Port",
      database: "Database",
      schema: "Schema",
      username: "User",
      password: "Password",
      label: "Label",
    },
    submit: "Ambil struktur",
    busy: "Membaca struktur…",
    note: "Hanya PostgreSQL yang bisa diakses dari internet. Yang dibaca hanya struktur (tabel, kolom, primary key, index, foreign key) — isi tabel tidak pernah di-SELECT. Kredensial tidak disimpan di browser maupun server.",
    recipeTitle: "Paling aman: pakai akun yang tidak bisa membaca data",
    recipeBody:
      "Jalankan sebagai admin database. Akun ini tetap bisa melihat struktur, tetapi PostgreSQL menolak setiap SELECT ke isi tabel — jaminannya dari database, bukan hanya dari kode MSF DB.",
    copy: "Salin SQL",
    copied: "Tersalin",
    sql: {
      header: "-- Akun khusus Schema Compare: bisa melihat struktur, tidak bisa membaca isi tabel.",
      footer: "-- Jangan beri GRANT SELECT ke tabel mana pun.",
      password: "ganti-dengan-password-kuat",
      database: "nama_database",
    },
    errors: {
      AUTH_FAILED: "Autentikasi gagal. Periksa username dan password.",
      DB_NOT_FOUND: "Database tidak ditemukan. Periksa nama database.",
      HOST_UNREACHABLE: "Server database tidak dapat dihubungi. Periksa host dan port, dan pastikan bisa diakses dari internet.",
      HOST_NOT_ALLOWED: "Host ini tidak diizinkan. Gunakan host yang bisa diakses dari internet.",
      SCHEMA_NOT_FOUND: "Schema tidak ditemukan di database ini.",
      CATALOG_TIMEOUT: "Membaca katalog melebihi batas waktu. Coba lagi nanti.",
      CATALOG_FAILED: "Katalog database tidak bisa dibaca.",
      ENGINE_NOT_SUPPORTED: "Koneksi database saat ini baru mendukung PostgreSQL.",
      VALIDATION_ERROR: "Ada isian yang tidak valid. Periksa host, port, dan nama database.",
      HTTP_429: "Terlalu banyak percobaan koneksi. Coba lagi nanti.",
    },
    failed: "Gagal mengambil struktur database.",
    invalidStructure: (errors) => `Struktur database tidak bisa dipakai: ${errors}`,
  },
  result: {
    left: "Kiri",
    right: "Kanan",
    roleReference: "acuan",
    roleTarget: "target",
    swap: "Tukar posisi kiri dan kanan",
    swapTitle: "Tukar posisi kiri dan kanan. Peran acuan dan target tidak berubah.",
    onlyIn: (count, label) => `${count} hanya di ${label}`,
    modified: (count) => `${count} beda definisi`,
    identical: (count, shown) => `${count} identik · ${shown ? "ditampilkan" : "disembunyikan"}`,
    navLabel: "Objek berbeda",
    allObjects: "Semua objek",
    changedObjects: "Objek berbeda",
    noDifferences: "Tidak ada perbedaan.",
    allIdentical: "Tidak ada perbedaan: semua objek yang dibandingkan identik.",
    identicalLabel: "identik",
  },
  detail: {
    missing: "tidak ada",
    onlyTable: (where, columns, indexes, foreignKeys) => [
      `Tabel ini hanya ada di `,
      where,
      ` (${columns} kolom, ${indexes} index, ${foreignKeys} foreign key).`,
    ],
    notCompared: (label) => `${label} tidak dibandingkan: salah satu snapshot tidak memuatnya.`,
  },
  severity: { critical: "Kritis", warning: "Peringatan", info: "Info" },
  objects: {
    table: "Tabel",
    column: "Kolom",
    primary_key: "Primary key",
    index: "Index",
    foreign_key: "Foreign key",
  },
  notices: {
    migrationsBehind: (behind, gap, ahead) => `${behind} tertinggal ${gap} migrasi dari ${ahead}`,
    migrationDiffers: (ref, refLabel, target, targetLabel) =>
      `Migrasi terakhir berbeda: ${ref} (${refLabel}) vs ${target} (${targetLabel})`,
    engineDiffers: (ref, target) =>
      `Dua snapshot berasal dari engine berbeda (${ref} vs ${target}). Perbandingan mungkin tidak bermakna.`,
    majorVersionDiffers:
      "Dua snapshot menggunakan major version PostgreSQL berbeda. Beberapa perbedaan mungkin disebabkan perubahan dialek, bukan perubahan schema sesungguhnya.",
    schemaDiffers: (ref, target) => `Nama schema berbeda (${ref} vs ${target}). Perbandingan mungkin tidak bermakna.`,
    unsupported: (names) => `Tidak dibandingkan: ${names}. Salah satu snapshot tidak memuatnya.`,
    skipped: (label, count, names) => `${label}: ${count} tabel dilewati (${names})`,
  },
  explain: {
    unlimited: "tanpa batas",
    typeWider: (name, target, from, to) => `Tipe ${name} lebih lebar di ${target} (${from} → ${to})`,
    typeDiffers: (name, from, to) => `Tipe ${name} berbeda (${from} → ${to}) — tidak kompatibel`,
    lengthShorter: (name, target, from, to) => `Panjang ${name} lebih pendek di ${target} (${from} → ${to}) — data bisa terpotong`,
    lengthLonger: (name, target, from, to) => `Panjang ${name} lebih besar di ${target} (${from} → ${to})`,
    precision: "Presisi",
    scale: "Skala",
    numericSmaller: (what, name, target, from, to) =>
      `${what} ${name} lebih kecil di ${target} (${from} → ${to}) — nilai bisa ditolak atau dibulatkan`,
    numericLarger: (what, name, target, from, to) => `${what} ${name} lebih besar di ${target} (${from} → ${to})`,
    requiredNoDefault: (name, target) => `${name} wajib isi di ${target} tanpa default — insert dari aplikasi bisa gagal`,
    requiredWithDefault: (name, target) => `${name} wajib isi di ${target} (ada default)`,
    nullable: (name, target) => `${name} boleh kosong di ${target}`,
    defaultKind: (name, from, to) => `Jenis default ${name} berbeda (${from} vs ${to})`,
    defaultValue: (name, from, to) => `Nilai default ${name} berbeda (${from} vs ${to})`,
    identity: (name, from, to) => `Jenis identity ${name} berbeda (${from} vs ${to})`,
    genericColumn: (field, name, from, to) => `${field} ${name} berbeda (${from} vs ${to})`,
    rename: (kind, from, to) => `Nama ${kind} berbeda (${from} vs ${to}), definisinya sama`,
    columns: (kind, name, from, to) => `Kolom ${kind} ${name} berbeda: ${from} vs ${to}`,
    unique: (kind, name) => `${kind} ${name} unik hanya di satu sisi`,
    method: (kind, name, from, to) => `Metode ${kind} ${name} berbeda (${from} vs ${to})`,
    predicate: (kind, name) => `Syarat WHERE ${kind} ${name} berbeda`,
    onDelete: (name, from, to) => `Aksi ON DELETE ${name} berbeda (${from} vs ${to})`,
    onUpdate: (name, from, to) => `Aksi ON UPDATE ${name} berbeda (${from} vs ${to})`,
    genericObject: (field, kind, name, from, to) => `${field} ${kind} ${name} berbeda (${from} vs ${to})`,
    missingIn: (kind, name, target) => `${kind} ${name} tidak ada di ${target}`,
    onlyIn: (kind, name, target) => `${kind} ${name} hanya ada di ${target}`,
    onlyInRequired: (name, target) => `Kolom ${name} hanya ada di ${target}, wajib isi tanpa default — insert dari aplikasi bisa gagal`,
  },
};

export const STRINGS: Record<Lang, Strings> = { en, id };

const I18nContext = createContext<Strings>(en);

export const I18nProvider = I18nContext.Provider;

export function useT(): Strings {
  return useContext(I18nContext);
}
