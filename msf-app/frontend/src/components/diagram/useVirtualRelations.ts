"use client";

import { useEffect, useState } from "react";
import { ColumnMetadata } from "@/lib/types";

/**
 * Relasi virtual: garis antar kolom yang dibuat user di diagram tanpa
 * FOREIGN KEY di SQL. Disimpan di localStorage browser berdasarkan nama
 * tabel + kolom, jadi tetap muncul saat DDL yang sama di-render ulang.
 */
export interface VirtualRelation {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
}

const STORAGE_KEY = "msf-diagram-virtual-relations";

export const relationId = (r: Omit<VirtualRelation, "id">) =>
  `${r.fromTable}.${r.fromColumn}->${r.toTable}.${r.toColumn}`;

const isRelation = (value: unknown): value is VirtualRelation => {
  const r = value as VirtualRelation;
  return (
    !!r &&
    typeof r.fromTable === "string" &&
    typeof r.fromColumn === "string" &&
    typeof r.toTable === "string" &&
    typeof r.toColumn === "string"
  );
};

export function useVirtualRelations() {
  const [relations, setRelations] = useState<VirtualRelation[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Baca setelah mount (localStorage tidak ada saat SSR)
  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(parsed)) {
        setRelations(parsed.filter(isRelation).map((r) => ({ ...r, id: relationId(r) })));
      }
    } catch {
      // Storage diblokir / data rusak: mulai dari kosong
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(relations));
    } catch {
      // Abaikan: relasi tetap ada selama halaman terbuka
    }
  }, [relations, loaded]);

  const addRelation = (r: Omit<VirtualRelation, "id">) => {
    const id = relationId(r);
    setRelations((prev) => (prev.some((p) => p.id === id) ? prev : [...prev, { ...r, id }]));
  };

  const removeRelation = (id: string) => {
    setRelations((prev) => prev.filter((r) => r.id !== id));
  };

  return { relations, addRelation, removeRelation };
}

// Kelompok tipe kasar untuk peringatan "tipe data beda" (bukan validasi ketat)
const typeFamily = (dataType: string) => {
  const t = dataType.toLowerCase().replace(/\(.*\)/, "").trim();
  if (/^(int|integer|bigint|smallint|tinyint|mediumint|serial|bigserial|smallserial|int[248]|serial[248])$/.test(t)) return "integer";
  if (/^(varchar|character varying|char|character|text|nvarchar|nchar|string|citext)$/.test(t)) return "text";
  if (/^(numeric|decimal|float|float[48]|real|double|double precision|money)$/.test(t)) return "number";
  if (/^(uuid|uniqueidentifier)$/.test(t)) return "uuid";
  return t;
};

export const getRelationWarnings = (from?: ColumnMetadata, to?: ColumnMetadata): string[] => {
  const warnings: string[] = [];
  if (!from || !to) return warnings;
  if (typeFamily(from.data_type) !== typeFamily(to.data_type)) {
    warnings.push(
      `Tipe data berbeda: ${from.data_type.toLowerCase()} → ${to.data_type.toLowerCase()}. Pastikan kolomnya memang berpasangan.`
    );
  }
  if (!to.is_primary_key) {
    warnings.push(
      `Kolom tujuan "${to.name}" bukan primary key. Biasanya relasi mengarah ke kolom id tabel tujuan — coba "Tukar arah" kalau terbalik.`
    );
  }
  return warnings;
};
