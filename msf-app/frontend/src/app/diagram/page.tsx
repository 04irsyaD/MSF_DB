"use client";

import React, { useState, useEffect } from "react";
import { TableMetadata, DBConnection } from "@/lib/types";
import { api, getFriendlyErrorMessage } from "@/lib/api";
import DbConnector from "@/components/generator/DbConnector";
import DiagramCanvas from "@/components/diagram/DiagramCanvas";
import { Play, Sparkles, RefreshCw, Layers, Terminal, ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";

export default function DiagramPage() {
  const [mode, setMode] = useState<"ddl" | "database">("ddl");
  const [sqlContent, setSqlContent] = useState<string>(
    `-- Contoh SQL DDL. Klik 'Visualisasikan' di bawah untuk merender diagram!\n\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  username VARCHAR(50) NOT NULL,\n  email VARCHAR(100) UNIQUE,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE posts (\n  id SERIAL PRIMARY KEY,\n  title VARCHAR(200) NOT NULL,\n  content TEXT,\n  user_id INT REFERENCES users(id) ON DELETE CASCADE,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE comments (\n  id SERIAL PRIMARY KEY,\n  post_id INT REFERENCES posts(id) ON DELETE CASCADE,\n  author_name VARCHAR(100) NOT NULL,\n  comment_text TEXT,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`
  );
  
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

  // Auto visualize default DDL on mount
  useEffect(() => {
    handleVisualizeDDL(true);
  }, []);

  const handleVisualizeDDL = async (isInitial = false) => {
    if (!sqlContent || sqlContent.trim().length < 10) {
      if (!isInitial) toast.error("Silakan masukkan skrip SQL DDL yang valid (minimal 10 karakter).");
      return;
    }
    setLoading(true);
    try {
      const res = await api.parseDDL(sqlContent);
      if (res.length === 0) {
        if (!isInitial) toast.error("Tidak ada tabel yang terdeteksi di dalam DDL SQL.");
      } else {
        setTables(res);
        if (!isInitial) toast.success(`Berhasil merender ${res.length} tabel ke diagram!`);
      }
    } catch (err: any) {
      if (!isInitial) toast.error(`Error: ${getFriendlyErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVisualizeDB = async () => {
    if (!isDbVerified) {
      toast.error("Verifikasi koneksi database terlebih dahulu dengan 'Test Connection'.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.fetchDBMetadata({
        connection,
        schema_filter: schemaFilter,
        table_filter: tableFilter.length > 0 ? tableFilter : undefined,
      });
      if (res.tables.length === 0) {
        toast.error("Tidak ada tabel yang ditemukan di skema terpilih.");
      } else {
        setTables(res.tables);
        toast.success(`Berhasil memvisualisasikan ${res.tables.length} tabel dari database!`);
      }
    } catch (err: any) {
      toast.error(`Error: ${getFriendlyErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in-up h-[calc(100vh-120px)] flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border pb-3 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Layers className="h-5.5 w-5.5 text-accent" />
            MSF Diagram & Schema Visualizer
          </h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Sistem visualisasi skema terpisah (Split-Pane) terinspirasi oleh dbdiagram.io. Edit kode di sebelah kiri untuk melihat diagram secara langsung.
          </p>
        </div>
      </div>

      {/* Split Pane Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">
        {/* Left Pane (Code Editor & Connector Form) */}
        <div className="lg:col-span-4 flex flex-col min-h-0 bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* Mode Selector Tab */}
          <div className="flex border-b border-border bg-gray-50/50 p-1.5 shrink-0">
            <div className="flex p-0.5 bg-gray-100 border border-border rounded-lg w-full font-mono text-[9px] font-bold">
              <button
                type="button"
                onClick={() => setMode("ddl")}
                className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all duration-150 ${
                  mode === "ddl" ? "bg-white text-gray-900 shadow-sm" : "text-muted-foreground hover:text-gray-900"
                }`}
              >
                <Terminal className="h-3 w-3" />
                <span>SQL DDL EDITOR</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("database")}
                className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all duration-150 ${
                  mode === "database" ? "bg-white text-gray-900 shadow-sm" : "text-muted-foreground hover:text-gray-900"
                }`}
              >
                <Play className="h-3 w-3" />
                <span>LIVE DB CONNECTOR</span>
              </button>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {mode === "ddl" ? (
              <div className="h-full flex flex-col justify-between space-y-3 min-h-0">
                <div className="flex-1 flex flex-col min-h-0 space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gray-700 uppercase tracking-wider block">
                    KODE SQL DDL:
                  </label>
                  <textarea
                    placeholder="Masukkan skrip SQL CREATE TABLE di sini..."
                    value={sqlContent}
                    onChange={(e) => setSqlContent(e.target.value)}
                    className="flex-1 w-full bg-gray-50 border border-border focus:border-accent rounded-xl p-3.5 text-[10px] font-mono text-gray-900 focus:outline-none transition-colors duration-150 resize-none min-h-[250px]"
                  />
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleVisualizeDDL(false)}
                  className="w-full py-2.5 bg-accent hover:bg-accent/90 disabled:bg-gray-100 text-white disabled:text-muted-foreground text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider font-mono shrink-0"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span>Rerender Diagram</span>
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-between space-y-4 min-h-0">
                <div className="flex-1 overflow-y-auto min-h-0">
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

                <button
                  type="button"
                  disabled={loading || !isDbVerified}
                  onClick={handleVisualizeDB}
                  className="w-full py-2.5 bg-accent hover:bg-accent/90 disabled:bg-gray-100 text-white disabled:text-muted-foreground text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider font-mono shrink-0"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span>Tarik Skema & Render DB</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane (Interactive Canvas View) */}
        <div className="lg:col-span-8 flex flex-col min-h-0 bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* Canvas Status Header */}
          <div className="border-b border-border bg-gray-50/50 px-4 py-2.5 flex items-center justify-between shrink-0 font-mono text-[9px] font-bold text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${tables.length > 0 ? "bg-accent animate-pulse" : "bg-gray-400"}`} />
              STATUS: {tables.length > 0 ? `${tables.length} TABEL TERVISUALISASI` : "SIAP MENERIMA SKEMA"}
            </span>
            {tables.length > 0 && (
              <span className="text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded uppercase">
                Interactive SVG Canvas
              </span>
            )}
          </div>

          {/* Diagram Canvas Container */}
          <div className="flex-1 min-h-0 relative p-4">
            {tables.length > 0 ? (
              <DiagramCanvas tables={tables} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 border border-border flex items-center justify-center text-muted-foreground animate-bounce">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest font-mono">
                    Belum Ada Diagram
                  </h3>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Tempel kueri SQL di editor kiri atau hubungkan database langsung, lalu klik tombol sinkronisasi untuk merender diagram hubungan database.
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
