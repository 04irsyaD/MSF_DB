"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Database,
  Cpu,
  FileText,
  TerminalSquare,
  ShieldCheck,
  ListChecks,
  Lock,
  Languages,
} from "lucide-react";

/**
 * MSF DB — Landing page (EN default, ID via toggle)
 *
 * Semua warna ditulis eksplisit (bg-slate-950, text-slate-100, dst.) supaya
 * halaman TIDAK bergantung pada `prefers-color-scheme` / CSS variable bawaan
 * create-next-app.
 *
 * Bahasa: default "en". Pilihan user disimpan di localStorage ("msfdb-lang").
 * Semua teks ada di objek `dict` di bawah — tambah/ubah copy di situ saja.
 */

const APP_URL = "/dashboard"; // route workspace (src/app/dashboard)
const STORAGE_KEY = "msfdb-lang";

type Lang = "en" | "id";

const dict = {
  en: {
    nav: { features: "Features", how: "How It Works", tech: "Tech", open: "Open Workspace" },
    hero: {
      badge: "Database documentation with local AI",
      title1: "Document your database",
      title2: "in minutes",
      sub: "Turn a SQL schema or a live database connection into complete, well-structured documentation. Processed by local AI, so your data structure never leaves your machine.",
      primary: "Get Started — Free",
      secondary: "See How It Works",
      note: "No sign-up needed. Runs 100% offline with Ollama.",
    },
    preview: { done: "done", desc: "Stores user accounts and their access roles.", col: "Column", type: "Type", key: "Key" },
    features: {
      eyebrow: "Features",
      title: "Everything you need to document a schema",
      sub: "From raw DDL to a document ready to hand over to your team or auditors.",
      items: [
        { title: "Multi-Database", desc: "PostgreSQL, MySQL, SQLite, and SQL Server. Paste DDL or connect to the database directly." },
        { title: "Local or Cloud AI", desc: "Run offline with Ollama, or use DeepSeek and OpenAI when you need a bigger model." },
        { title: "Ready-to-Use Exports", desc: "Download the documentation as Markdown, Word (.docx), or PDF." },
        { title: "SQL Shortcuts", desc: "Ready-made DBA scripts for query tuning, performance checks, and index management." },
        { title: "Secure by Default", desc: "API keys stay protected, and with a local model your schema never leaves your own machine." },
        { title: "Background Queue", desc: "Jobs run in the background with per-table progress, so large schemas stay trackable." },
      ],
    },
    how: {
      eyebrow: "How It Works",
      title: "Three steps, no complicated setup",
      steps: [
        { title: "Enter your schema", desc: "Paste CREATE TABLE DDL into the SQL editor (Monaco), or fill in your database connection details." },
        { title: "Choose AI & format", desc: "Pick an AI provider, the output language (EN/ID), and the document format you want." },
        { title: "Download the docs", desc: "Track each table's status, preview the Markdown live, then download the result." },
      ],
    },
    tech: { eyebrow: "Supports & built with" },
    cta: {
      title: "Ready to tidy up your database docs?",
      sub: "Paste your first schema and see the result in a few minutes.",
      button: "Get Started — Free",
    },
    footer: "© 2026 MSF Team · 100% Local & Secure",
    langLabel: "Switch language",
  },
  id: {
    nav: { features: "Fitur", how: "Cara Kerja", tech: "Teknologi", open: "Buka Workspace" },
    hero: {
      badge: "Dokumentasi database dengan AI lokal",
      title1: "Dokumentasikan database",
      title2: "dalam hitungan menit",
      sub: "Ubah skema SQL atau koneksi database langsung menjadi dokumentasi yang lengkap dan rapi. Diproses dengan AI lokal, jadi struktur data Anda tetap di mesin sendiri.",
      primary: "Mulai Sekarang — Gratis",
      secondary: "Lihat Cara Kerja",
      note: "Tanpa daftar akun. Bisa berjalan 100% offline dengan Ollama.",
    },
    preview: { done: "selesai", desc: "Menyimpan akun pengguna beserta peran aksesnya.", col: "Kolom", type: "Tipe", key: "Ket." },
    features: {
      eyebrow: "Fitur",
      title: "Semua yang dibutuhkan untuk dokumentasi skema",
      sub: "Dari DDL mentah sampai dokumen yang siap diserahkan ke tim atau auditor.",
      items: [
        { title: "Multi-Database", desc: "PostgreSQL, MySQL, SQLite, dan SQL Server. Tempel DDL atau sambungkan langsung ke database." },
        { title: "AI Lokal atau Cloud", desc: "Jalankan offline dengan Ollama, atau pakai DeepSeek dan OpenAI kalau butuh model yang lebih besar." },
        { title: "Ekspor Siap Pakai", desc: "Hasil dokumentasi bisa diunduh sebagai Markdown, Word (.docx), atau PDF." },
        { title: "SQL Shortcuts", desc: "Kumpulan skrip DBA siap pakai untuk tuning query, cek performa, dan manajemen index." },
        { title: "Aman Sejak Awal", desc: "API key terlindungi, dan dengan model lokal skema Anda tidak pernah keluar dari mesin sendiri." },
        { title: "Antrian Background", desc: "Proses berjalan di background dengan progres per tabel, jadi skema besar tetap terpantau." },
      ],
    },
    how: {
      eyebrow: "Cara Kerja",
      title: "Tiga langkah, tanpa setup ribet",
      steps: [
        { title: "Masukkan skema", desc: "Tempel DDL CREATE TABLE di editor SQL (Monaco), atau isi detail koneksi database." },
        { title: "Pilih AI & format", desc: "Tentukan provider AI, bahasa output (ID/EN), dan format dokumen yang diinginkan." },
        { title: "Unduh dokumentasi", desc: "Pantau status tiap tabel, lihat preview Markdown secara live, lalu unduh hasilnya." },
      ],
    },
    tech: { eyebrow: "Mendukung & dibangun dengan" },
    cta: {
      title: "Siap merapikan dokumentasi database Anda?",
      sub: "Tempel skema pertama Anda dan lihat hasilnya dalam beberapa menit.",
      button: "Mulai Sekarang — Gratis",
    },
    footer: "© 2026 MSF Team · 100% Lokal & Aman",
    langLabel: "Ganti bahasa",
  },
} as const;

type Copy = (typeof dict)[Lang];

const featureIcons = [Database, Cpu, FileText, TerminalSquare, ShieldCheck, ListChecks];

const stack = [
  "PostgreSQL", "MySQL", "SQLite", "SQL Server", "Ollama",
  "DeepSeek API", "OpenAI API", "Next.js", "FastAPI", "Docker",
];

function useLang() {
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

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500 font-mono text-sm font-bold text-slate-950">
        M
      </span>
      <span className="text-base font-semibold tracking-tight text-slate-100">MSF DB</span>
    </span>
  );
}

function LangSwitch({ lang, onChange, label }: { lang: Lang; onChange: (l: Lang) => void; label: string }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-0.5 font-mono text-xs"
    >
      <Languages className="mx-1.5 hidden h-3.5 w-3.5 text-slate-500 sm:block" aria-hidden />
      {(["en", "id"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          aria-pressed={lang === l}
          className={`rounded-md px-2 py-1 font-semibold uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 ${
            lang === l ? "bg-slate-700 text-slate-50" : "text-slate-400 hover:text-slate-100"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
    >
      {children}
    </Link>
  );
}

function SecondaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
    >
      {children}
    </Link>
  );
}

/** Ilustrasi produk: DDL di kiri → dokumentasi tabel di kanan */
function ProductPreview({ t }: { t: Copy["preview"] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
        <span className="ml-3 font-mono text-xs text-slate-500">schema.sql → users.md</span>
      </div>
      <div className="grid md:grid-cols-2">
        <pre className="overflow-x-auto border-b border-slate-800 p-5 font-mono text-[12.5px] leading-6 text-slate-300 md:border-b-0 md:border-r">
          <code>
            <span className="text-sky-300">CREATE TABLE</span> users (
            {"\n"}  id <span className="text-amber-200">BIGSERIAL</span>{" "}
            <span className="text-sky-300">PRIMARY KEY</span>,
            {"\n"}  email <span className="text-amber-200">VARCHAR</span>(255){" "}
            <span className="text-sky-300">NOT NULL UNIQUE</span>,
            {"\n"}  role_id <span className="text-amber-200">INT</span>{" "}
            <span className="text-sky-300">REFERENCES</span> roles(id),
            {"\n"}  created_at <span className="text-amber-200">TIMESTAMPTZ</span>{" "}
            <span className="text-sky-300">DEFAULT</span> now()
            {"\n"});
          </code>
        </pre>
        <div className="p-5">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-mono text-xs text-emerald-400">## users</span>
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
              {t.done}
            </span>
          </div>
          <p className="mb-4 text-xs leading-5 text-slate-400">{t.desc}</p>
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500">
              <tr className="border-b border-slate-800">
                <th className="py-1.5 font-medium">{t.col}</th>
                <th className="py-1.5 font-medium">{t.type}</th>
                <th className="py-1.5 font-medium">{t.key}</th>
              </tr>
            </thead>
            <tbody className="font-mono text-slate-300">
              {[
                ["id", "bigserial", "PK"],
                ["email", "varchar(255)", "UQ"],
                ["role_id", "int", "FK"],
                ["created_at", "timestamptz", "—"],
              ].map(([c, ty, k]) => (
                <tr key={c} className="border-b border-slate-800/60 last:border-0">
                  <td className="py-1.5">{c}</td>
                  <td className="py-1.5 text-slate-400">{ty}</td>
                  <td className="py-1.5 text-emerald-300">{k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useLang();
  const t = dict[lang];

  return (
    <div data-page="landing" className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" aria-label="MSF DB">
            <Logo />
          </Link>
          <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#features" className="transition-colors hover:text-slate-100">{t.nav.features}</a>
            <a href="#how-it-works" className="transition-colors hover:text-slate-100">{t.nav.how}</a>
            <a href="#tech" className="transition-colors hover:text-slate-100">{t.nav.tech}</a>
          </div>
          <div className="flex items-center gap-2">
            <LangSwitch lang={lang} onChange={setLang} label={t.langLabel} />
            <Link
              href={APP_URL}
              className="hidden items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 sm:inline-flex"
            >
              {t.nav.open} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(30_41_59/0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgb(30_41_59/0.5)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
          />
          <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-emerald-300">
                <Lock className="h-3.5 w-3.5" /> {t.hero.badge}
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-slate-50 sm:text-6xl">
                {t.hero.title1} <span className="text-emerald-400">{t.hero.title2}</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">{t.hero.sub}</p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <PrimaryButton href={APP_URL}>
                  {t.hero.primary} <ArrowRight className="h-4 w-4" />
                </PrimaryButton>
                <SecondaryButton href="#how-it-works">{t.hero.secondary}</SecondaryButton>
              </div>
              <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                {t.hero.note}
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-4xl">
              <ProductPreview t={t.preview} />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="scroll-mt-16 border-t border-slate-800/80 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-emerald-400">{t.features.eyebrow}</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">{t.features.title}</h2>
              <p className="mt-4 text-slate-400">{t.features.sub}</p>
            </div>
            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-slate-800 bg-slate-800 sm:grid-cols-2 lg:grid-cols-3">
              {t.features.items.map(({ title, desc }, i) => {
                const Icon = featureIcons[i];
                return (
                  <div key={i} className="bg-slate-950 p-6 transition-colors hover:bg-slate-900">
                    <Icon className="h-5 w-5 text-emerald-400" />
                    <h3 className="mt-4 font-semibold text-slate-100">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="scroll-mt-16 border-t border-slate-800/80 bg-slate-900/40 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-emerald-400">{t.how.eyebrow}</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">{t.how.title}</h2>
            </div>
            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {t.how.steps.map((s, i) => (
                <li key={i} className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                  <span className="font-mono text-sm font-semibold text-emerald-400">0{i + 1}</span>
                  <h3 className="mt-3 text-lg font-semibold text-slate-100">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* TECH */}
        <section id="tech" className="scroll-mt-16 border-t border-slate-800/80 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-center font-mono text-xs font-medium uppercase tracking-wider text-slate-500">
              {t.tech.eyebrow}
            </p>
            <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2.5">
              {stack.map((s) => (
                <li key={s} className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 font-mono text-xs text-slate-300">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-slate-800/80 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] px-6 py-14 text-center sm:px-12">
              <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">{t.cta.title}</h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-400">{t.cta.sub}</p>
              <div className="mt-8 flex justify-center">
                <PrimaryButton href={APP_URL}>
                  {t.cta.button} <ArrowRight className="h-4 w-4" />
                </PrimaryButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <Logo />
          <p className="font-mono text-xs text-slate-500">{t.footer}</p>
        </div>
      </footer>
    </div>
  );
}
