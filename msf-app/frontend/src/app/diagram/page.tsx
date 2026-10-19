"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { TableMetadata, DBConnection } from "@/lib/types";
import { api, getFriendlyErrorMessage } from "@/lib/api";
import DbConnector from "@/components/generator/DbConnector";
import DiagramCanvas from "@/components/diagram/DiagramCanvas";
import { Play, Sparkles, RefreshCw, Layers, Terminal, Info } from "lucide-react";
import { toast } from "sonner";
import { DDL_TEMPLATES } from "./templates";
import MaintenanceModal from "@/components/common/MaintenanceModal";

const DRAFT_KEY = "msf_diagram_draft";
const OVERWRITE_MESSAGE = "Kode DDL yang sudah Anda ubah akan ditimpa. Lanjutkan?";

const EXAMPLE_SQL = `-- Contoh SQL DDL untuk Visualisasi
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  user_id INT REFERENCES users(id) ON DELETE CASCADE
);`;

const DIALECT_LABELS: Record<string, string> = {
  postgresql: "PostgreSQL",
  mysql: "MySQL / MariaDB",
  sqlite: "SQLite",
  sqlserver: "SQL Server (MSSQL)",
};

const LABEL = "text-[11px] font-mono font-bold text-gray-700 uppercase tracking-wider block";
const FIELD =
  "w-full bg-gray-50 border border-border focus:border-accent rounded-xl px-3 py-2 text-xs font-mono text-gray-900 focus:outline-none transition-colors duration-150";
const PRIMARY_BUTTON =
  "w-full py-2.5 bg-accent hover:bg-accent/90 disabled:bg-gray-100 text-white disabled:text-muted-foreground text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider font-mono";

export default function DiagramPage() {
  const [mode, setMode] = useState<"ddl" | "database">("ddl");
  const [sqlContent, setSqlContent] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [loadedSql, setLoadedSql] = useState<string>("");

  const [connection, setConnection] = useState<DBConnection>({
    engine: "postgresql",
    host: "localhost",
    port: 5432,
    database: "",
    username: "",
    password: "",
    schema_name: "public",
  });
  const [schemaFilter, setSchemaFilter] = useState<string>("public");
  const [tableFilter, setTableFilter] = useState<string[]>([]);
  const [isDbVerified, setIsDbVerified] = useState<boolean>(false);

  const [tables, setTables] = useState<TableMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dialect, setDialect] = useState<string>("postgresql");
  const [renderedDialect, setRenderedDialect] = useState<string | null>(null);

  // D-07: hanya respons dari request terakhir yang dipakai
  const requestIdRef = useRef(0);

  const runParse = useCallback(async (sql: string, sqlDialect: string, silent: boolean) => {
    if (!sql || sql.trim().length < 10) {
      if (!silent) toast.error("Silakan masukkan skrip SQL DDL yang valid (minimal 10 karakter).");
      return;
    }
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      const res = await api.parseDDL(sql, sqlDialect);
      if (requestId !== requestIdRef.current) return;
      if (res.length === 0) {
        if (!silent) toast.error("Tidak ada tabel yang terdeteksi di dalam DDL SQL.");
      } else {
        setTables(res);
        setRenderedDialect(sqlDialect);
        if (!silent) toast.success(`Berhasil merender ${res.length} tabel ke diagram!`);
      }
    } catch (err: unknown) {
      if (requestId === requestIdRef.current && !silent) {
        toast.error(`Error: ${getFriendlyErrorMessage(err)}`);
      }
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  // D-08: pulihkan draft DDL (per tab browser) lalu render ulang secara diam-diam
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as { sql?: string; dialect?: string; template?: string };
      if (!draft.sql) return;
      const draftDialect = draft.dialect && DIALECT_LABELS[draft.dialect] ? draft.dialect : "postgresql";
      setSqlContent(draft.sql);
      setDialect(draftDialect);
      setSelectedTemplate(draft.template ?? "");
      setLoadedSql(draft.template ? DDL_TEMPLATES.find((t) => t.id === draft.template)?.sql ?? "" : "");
      runParse(draft.sql, draftDialect, true);
    } catch {
      // sessionStorage tidak tersedia / data rusak: mulai kosong
    }
  }, [runParse]);

  useEffect(() => {
    try {
      if (sqlContent) {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ sql: sqlContent, dialect, template: selectedTemplate }));
      } else {
        sessionStorage.removeItem(DRAFT_KEY);
      }
    } catch {
      // abaikan: draft hanya kenyamanan
    }
  }, [sqlContent, dialect, selectedTemplate]);

  const isDirty = sqlContent.trim().length > 0 && sqlContent !== loadedSql;
  const confirmOverwrite = () => !isDirty || window.confirm(OVERWRITE_MESSAGE);

  const loadExampleSql = () => {
    if (!confirmOverwrite()) return;
    setSqlContent(EXAMPLE_SQL);
    setLoadedSql(EXAMPLE_SQL);
    setSelectedTemplate("");
    toast.success("Contoh skema berhasil dimuat ke editor.");
  };

  const handleSelectTemplate = (templateId: string) => {
    const template = DDL_TEMPLATES.find((t) => t.id === templateId);
    if (!template || !confirmOverwrite()) return;
    setSelectedTemplate(template.id);
    setSqlContent(template.sql);
    setLoadedSql(template.sql);
    setDialect(template.dialect);
    runParse(template.sql, template.dialect, false);
  };

  const handleSqlChange = (value: string) => {
    setSqlContent(value);
    // D-06: kode sudah diedit -> dropdown kembali ke placeholder agar template bisa dipilih ulang
    if (selectedTemplate && value !== loadedSql) setSelectedTemplate("");
  };

  const handleVisualizeDB = async () => {
    if (!isDbVerified) {
      toast.error("Verifikasi koneksi database terlebih dahulu dengan 'Test Connection'.");
      return;
    }
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try {
      const res = await api.fetchDBMetadata({
        connection,
        schema_filter: schemaFilter,
        table_filter: tableFilter.length > 0 ? tableFilter : undefined,
      });
      if (requestId !== requestIdRef.current) return;
      if (res.tables.length === 0) {
        toast.error("Tidak ada tabel yang ditemukan di skema terpilih.");
      } else {
        setTables(res.tables);
        setRenderedDialect(null);
        toast.success(`Berhasil memvisualisasikan ${res.tables.length} tabel dari database!`);
      }
    } catch (err: unknown) {
      if (requestId === requestIdRef.current) toast.error(`Error: ${getFriendlyErrorMessage(err)}`);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  };

  const dialectChanged = mode === "ddl" && renderedDialect !== null && renderedDialect !== dialect;

  return (
    // Split dua kolom mulai xl (>= 1280px): di bawahnya panel kiri terlalu sempit karena sidebar 256px.
    // Tinggi xl = 100dvh - header (64px) - padding main lg:p-8 (64px). Di bawah xl halaman scroll biasa.
    <div className="flex flex-col gap-5 animate-fade-in-up xl:h-[calc(100dvh-128px)] xl:min-h-[480px]">
      <MaintenanceModal
        title="Layanan MSF Diagram Sedang Maintenance"
        description="Halo pengguna MSF DB, kami sedang melakukan pemeliharaan rutin pada modul parser & visualisasi diagram database. Harap sabar, kami akan segera kembali online!"
        estimateTime="Coming Soon"
        storageKey="msf_maintenance_diagram"
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border pb-3 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Layers className="h-[22px] w-[22px] text-accent" />
            MSF Diagram & Schema Visualizer
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tempel atau pilih DDL di panel kiri, lalu klik Rerender Diagram untuk memvisualisasikan skema dan relasinya.
          </p>
        </div>
      </div>

      {/* Split Pane Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 xl:flex-1 xl:min-h-0">
        {/* Left Pane: tab (atas) / form yang bisa di-scroll (tengah) / tombol aksi (footer tetap) */}
        <div className="xl:col-span-4 flex flex-col h-[520px] xl:h-auto xl:min-h-0 bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="flex border-b border-border bg-gray-50/50 p-1.5 shrink-0">
            <div role="tablist" className="flex p-0.5 bg-gray-100 border border-border rounded-lg w-full font-mono text-[11px] font-bold">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "ddl"}
                onClick={() => setMode("ddl")}
                className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all duration-150 ${
                  mode === "ddl" ? "bg-white text-gray-900 shadow-sm" : "text-muted-foreground hover:text-gray-900"
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>SQL DDL EDITOR</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "database"}
                onClick={() => setMode("database")}
                className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all duration-150 ${
                  mode === "database" ? "bg-white text-gray-900 shadow-sm" : "text-muted-foreground hover:text-gray-900"
                }`}
              >
                <Play className="h-3.5 w-3.5" />
                <span>LIVE DB CONNECTOR</span>
              </button>
            </div>
          </div>

          {mode === "ddl" ? (
            <>
              <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3">
                <div className="space-y-1.5 shrink-0">
                  <label htmlFor="ddl-template" className={LABEL}>
                    Pilih Template Contoh DDL:
                  </label>
                  <select
                    id="ddl-template"
                    value={selectedTemplate}
                    disabled={loading}
                    onChange={(e) => handleSelectTemplate(e.target.value)}
                    className={FIELD}
                  >
                    <option value="" disabled>
                      -- Pilih Skenario DB --
                    </option>
                    {DDL_TEMPLATES.map((tmpl) => (
                      <option key={tmpl.id} value={tmpl.id}>
                        {tmpl.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 shrink-0">
                  <label htmlFor="ddl-dialect" className={LABEL}>
                    Dialek Database:
                  </label>
                  <select id="ddl-dialect" value={dialect} onChange={(e) => setDialect(e.target.value)} className={FIELD}>
                    {Object.entries(DIALECT_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {dialectChanged && (
                    <p className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400">
                      <Info className="h-3.5 w-3.5 shrink-0" />
                      Klik Rerender Diagram untuk menerapkan dialek ini.
                    </p>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-1.5 min-h-[180px]">
                  <div className="flex items-center justify-between shrink-0">
                    <label htmlFor="ddl-sql" className={LABEL}>
                      Kode SQL DDL:
                    </label>
                    <button
                      type="button"
                      onClick={loadExampleSql}
                      className="text-[11px] font-mono font-bold text-accent hover:underline uppercase"
                    >
                      Gunakan Contoh
                    </button>
                  </div>
                  <textarea
                    id="ddl-sql"
                    placeholder="-- Tempel kode DDL SQL (CREATE TABLE) Anda di sini..."
                    value={sqlContent}
                    onChange={(e) => handleSqlChange(e.target.value)}
                    spellCheck={false}
                    className="flex-1 w-full min-h-[150px] bg-gray-50 border border-border focus:border-accent rounded-xl p-3.5 text-xs leading-relaxed font-mono text-gray-900 focus:outline-none transition-colors duration-150 resize-none"
                  />
                </div>
              </div>

              <div className="shrink-0 border-t border-border p-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => runParse(sqlContent, dialect, false)}
                  className={PRIMARY_BUTTON}
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  <span>Rerender Diagram</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 min-h-0 overflow-y-auto p-4">
                <DbConnector
                  connection={connection}
                  onChange={setConnection}
                  onVerified={setIsDbVerified}
                  schemaFilter={schemaFilter}
                  onSchemaFilterChange={setSchemaFilter}
                  tableFilter={tableFilter}
                  onTableFilterChange={setTableFilter}
                />
              </div>

              <div className="shrink-0 border-t border-border p-3">
                <button
                  type="button"
                  disabled={loading || !isDbVerified}
                  onClick={handleVisualizeDB}
                  className={PRIMARY_BUTTON}
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  <span>Tarik Skema & Render DB</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Pane (Interactive Canvas View) */}
        <div className="xl:col-span-8 flex flex-col h-[65vh] min-h-[420px] xl:h-auto xl:min-h-0 bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-border bg-gray-50/50 px-4 py-2.5 flex items-center justify-between gap-2 shrink-0 font-mono text-[11px] font-bold text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${tables.length > 0 ? "bg-accent animate-pulse" : "bg-gray-400"}`} />
              STATUS: {tables.length > 0 ? `${tables.length} TABEL TERVISUALISASI` : "SIAP MENERIMA SKEMA"}
            </span>
            {tables.length > 0 && (
              <span className="hidden sm:inline text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded uppercase">
                Interactive SVG Canvas
              </span>
            )}
          </div>

          <div className="flex-1 min-h-0 relative p-3 sm:p-4 flex flex-col">
            {tables.length > 0 ? (
              <DiagramCanvas tables={tables} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 border border-border flex items-center justify-center text-muted-foreground animate-bounce">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest font-mono">Belum Ada Diagram</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Tempel kueri SQL di editor kiri atau hubungkan database langsung, lalu klik tombol render untuk
                    menampilkan diagram hubungan database.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
