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
    <div className="flex flex-col" style={{ height: "calc(100vh - 8rem)" }}>
      {/* Jika sedang memproses pembuatan dokumentasi */}
      {isGenerating ? (
        <div className="flex-1 overflow-y-auto py-6">
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
        <div className="flex-1 overflow-y-auto py-2">
          <DocPreview
            markdown={previewMarkdown}
            projectName={settings.project_name}
            downloadUrl={downloadUrl}
            format={settings.output_format}
            onReset={resetState}
          />
        </div>
      ) : (
        // Tampilan Form Utama — full height, no page scroll
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 overflow-hidden">
          {/* Sisi Kiri (Source Input: DDL Editor / DB Connector) */}
          <div className="lg:col-span-7 flex flex-col gap-3 min-h-0 overflow-hidden">
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

            {/* Warning jika Live DB belum terverifikasi */}
            {mode === "database" && !isDbVerified && (
              <div className="p-3 bg-amber-500/5 border border-amber-500/20 text-amber-400/90 rounded-[4px] text-[11px] leading-relaxed flex items-start gap-2.5 font-mono font-semibold shrink-0">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                <span>WAJIB VERIFIKASI KONEKSI DATABASE DENGAN MENEKAN TOMBOL 'TEST CONNECTION' TERLEBIH DAHULU.</span>
              </div>
            )}

            {/* Editor / DB Connector — grows to fill remaining space */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {mode === "ddl" ? (
                <SqlEditor value={sqlContent} onChange={(val) => setSqlContent(val || "")} />
              ) : (
                <div className="h-full overflow-y-auto">
                  <DbConnector
                    connection={dbConnection}
                    onChange={setDbConnection}
                    onVerified={setIsDbVerified}
                    schemaFilter={schemaFilter}
                    onSchemaFilterChange={setSchemaFilter}
                    tableFilter={tableFilter}
                    onTableFilterChange={setTableFilter}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sisi Kanan (Konfigurasi AI + Job Tracker + Tombol Submit) */}
          <div className="lg:col-span-5 min-h-0 overflow-hidden">
            <GeneratePanel
              settings={settings}
              onChange={setSettings}
              onSubmit={handleGenerate}
              disabled={mode === "database" && !isDbVerified}
              loading={isGenerating}
              trackJob={trackJob}
              inputCode={inputCode}
              onInputCodeChange={setInputCode}
            />
          </div>
        </div>
      )}
    </div>
  );
}
