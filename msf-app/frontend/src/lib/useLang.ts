"use client";

import { useEffect, useState } from "react";

/**
 * Bahasa UI (EN/ID), dipakai bersama landing page dan halaman workspace yang sudah dwibahasa.
 * Default "en". Pilihan user disimpan di localStorage ("msfdb-lang"), jadi ikut terbawa antar halaman.
 */
export type Lang = "en" | "id";

const STORAGE_KEY = "msfdb-lang";

export function useLang() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "id") setLang(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Simpan hanya saat user memilih — kalau disimpan di effect, nilai default
  // "en" bisa menimpa pilihan tersimpan sebelum sempat dibaca (StrictMode).
  const changeLang = (next: Lang) => {
    setLang(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  return [lang, changeLang] as const;
}
