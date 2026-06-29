"use client";

import { useState } from "react";
import { useGenerate } from "@/hooks/useGenerate";
import { GeneratorSettings, DBConnection, InputMode } from "@/lib/types";
import SqlEditor from "@/components/generator/SqlEditor";
import DbConnector from "@/components/generator/DbConnector";
import GeneratePanel from "@/components/generator/GeneratePanel";
import JobStatus from "@/components/generator/JobStatus";
import DocPreview from "@/components/generator/DocPreview";
import { FileText, Database, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { defaultSQL } from "@/components/generator/SqlEditor";
import { toast } from "sonner";

export default function GeneratePage() {
  const [mode, setMode] = useState<InputMode>("ddl");
  const [sqlContent, setSqlContent] = useState<string>(defaultSQL);
  const [dbConnection, setDbConnection] = useState<DBConnection>({
    engine: "postgresql",
    host: "localhost",
    port: 5432,
    database: "postgres",
    username: "postgres",
    password: "",
  });
  const [isDbVerified, setIsDbVerified] = useState<boolean>(false);
  const [schemaFilter, setSchemaFilter] = useState<string>("");
  const [tableFilter, setTableFilter] = useState<string[]>([]);

  const [settings, setSettings] = useState<GeneratorSettings>({
    language: "Indonesian",
    detail_level: "detailed",
    ai_provider: "ollama",
    model: "",
    output_format: "docx",
    business_context: "",
    project_name: "My Project DB",
    author: "Developer",
  });

  const [inputCode, setInputCode] = useState<string>("");

  const {
    status,
    progress,
    tablesTotal,
    tablesProcessed,
    currentTable,
    errorMessage,
    previewMarkdown,
    downloadUrl,
    isGenerating,
    generateFromDDL,
    generateFromDB,
    cancelActiveJob,
    resetState,
    accessCode,
    trackJob,
  } = useGenerate();

  const handleGenerate = async () => {
    if (!settings.model) {
      toast.warning("Silakan pilih model AI yang akan digunakan terlebih dahulu.");
      return;
    }

    if (mode === "ddl") {
      if (!sqlContent.trim()) {
        toast.warning("SQL DDL konten kosong. Ketik atau tempel SQL Anda dahulu.");
        return;
      }
      
      const payload = {
        sql_content: sqlContent,
        project_name: settings.project_name,
        project_description: settings.business_context,
        author: settings.author,
        language: settings.language,
        detail_level: settings.detail_level,
        business_context: settings.business_context,
        ai_provider: settings.ai_provider,
        model: settings.model,
        output_format: settings.output_format,
      };
      
      await generateFromDDL(payload);
    } else {
      if (!isDbVerified) {
        toast.warning("Pastikan Anda memverifikasi koneksi database dengan menekan tombol 'Test Koneksi' dahulu.");
        return;
      }
      const payload = {
        connection: dbConnection,
        project_name: settings.project_name,
        language: settings.language,
        detail_level: settings.detail_level,
        business_context: settings.business_context,
        ai_provider: settings.ai_provider,
        model: settings.model,
        output_format: settings.output_format,
        schema_filter: schemaFilter || undefined,
        table_filter: tableFilter.length > 0 ? tableFilter : undefined,
      };
      
      await generateFromDB(payload);
    }
  };

  const showPreview = status === "done" && previewMarkdown;

  return (
    <div className="space-y-6">
      {/* Jika sedang memproses pembuatan dokumentasi */}
      {isGenerating ? (
        <div className="py-12">
          <JobStatus
            status={status}
            progress={progress}
            tablesTotal={tablesTotal}
            tablesProcessed={tablesProcessed}
            currentTable={currentTable}
            errorMessage={errorMessage}
            previewMarkdown={previewMarkdown}
            onCancel={cancelActiveJob}
            accessCode={accessCode}
          />
        </div>
      ) : showPreview ? (
        // Preview dokumentasi selesai
        <DocPreview
          markdown={previewMarkdown}
          projectName={settings.project_name}
          downloadUrl={downloadUrl}
          format={settings.output_format}
          onReset={resetState}
        />
      ) : (
        // Tampilan Form Utama
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Sisi Kiri (Source Input: DDL Editor / DB Connector) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Input Mode Selector */}
              <div className="flex bg-secondary/15 border border-border p-0.5 rounded-[4px] max-w-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setMode("ddl")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 px-3.5 rounded-[2px] text-xs font-mono font-bold transition-colors duration-150",
                    mode === "ddl"
                      ? "bg-accent/15 border border-accent/20 text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
                  )}
                >
                  <FileText className="h-4 w-4" />
                  <span>SQL DDL PASTE</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setMode("database")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 px-3.5 rounded-[2px] text-xs font-mono font-bold transition-colors duration-150",
                    mode === "database"
                      ? "bg-accent/15 border border-accent/20 text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
                  )}
                >
                  <Database className="h-4 w-4" />
                  <span>KONEKSI LIVE DB</span>
                </button>
              </div>

              {/* Tampilan Editor / Form Koneksi */}
              {mode === "ddl" ? (
                <SqlEditor value={sqlContent} onChange={(val) => setSqlContent(val || "")} />
              ) : (
                <DbConnector
                  connection={dbConnection}
                  onChange={setDbConnection}
                  onVerified={setIsDbVerified}
                  schemaFilter={schemaFilter}
                  onSchemaFilterChange={setSchemaFilter}
                  tableFilter={tableFilter}
                  onTableFilterChange={setTableFilter}
                />
              )}
            </div>

            {/* Pelacakan Pekerjaan Aktif */}
            <div className="p-4 bg-white border border-border rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <h4 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest">
                  Lacak Pekerjaan Aktif
                </h4>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Punya proses dokumentasi yang sedang berjalan? Masukkan kode pelacakan Anda di bawah ini untuk melihat progress atau hasil unduhan.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="CONTOH: MSF-A1B2C3D4..."
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="flex-1 bg-gray-50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-1.5 px-3 text-xs text-gray-900 placeholder-muted-foreground/40 focus:outline-none transition-colors duration-150 font-mono tracking-wider uppercase"
                />
                <button
                  type="button"
                  onClick={() => trackJob(inputCode).then(() => setInputCode(""))}
                  className="px-4 py-1.5 bg-accent hover:bg-accent/90 text-white text-xs font-bold rounded-xl transition-all shadow-sm uppercase shrink-0 font-mono"
                >
                  Lacak
                </button>
              </div>
            </div>
            
            {/* Warning jika Live DB belum terverifikasi */}
            {mode === "database" && !isDbVerified && (
              <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 text-amber-400/90 rounded-[4px] text-[11px] leading-relaxed flex items-start gap-2.5 font-mono font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                <span>
                  CATATAN: SEBELUM GENERATE DOKUMENTASI, ANDA WAJIB VERIFIKASI KONEKSI DATABASE DENGAN MENEKAN TOMBOL 'TEST CONNECTION'.
                </span>
              </div>
            )}
          </div>

          {/* Sisi Kanan (Konfigurasi AI & Tombol Submit) */}
          <div className="lg:col-span-5">
            <GeneratePanel
              settings={settings}
              onChange={setSettings}
              onSubmit={handleGenerate}
              disabled={mode === "database" && !isDbVerified}
              loading={isGenerating}
            />
          </div>
        </div>
      )}
    </div>
  );
}
