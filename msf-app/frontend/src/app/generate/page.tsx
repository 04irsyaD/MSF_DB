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
  } = useGenerate();

  const handleGenerate = async () => {
    if (mode === "ddl") {
      if (!sqlContent.trim()) {
        alert("SQL DDL konten kosong. Ketik atau tempel SQL Anda dahulu.");
        return;
      }
      await generateFromDDL({
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
      });
    } else {
      if (!isDbVerified) {
        alert("Pastikan Anda memverifikasi koneksi database dengan menekan tombol 'Test Koneksi' dahulu.");
        return;
      }
      await generateFromDB({
        connection: dbConnection,
        project_name: settings.project_name,
        language: settings.language,
        detail_level: settings.detail_level,
        business_context: settings.business_context,
        ai_provider: settings.ai_provider,
        model: settings.model,
        output_format: settings.output_format,
      });
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
          />
        </div>
      ) : showPreview ? (
        // Preview dokumentasi selesai
        <DocPreview
          markdown={previewMarkdown}
          projectName={settings.project_name}
          downloadUrl={downloadUrl}
          onReset={resetState}
        />
      ) : (
        // Tampilan Form Utama
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Sisi Kiri (Source Input: DDL Editor / DB Connector) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Input Mode Selector */}
              <div className="flex bg-secondary/15 border border-border p-1 rounded-2xl max-w-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setMode("ddl")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition-all duration-200",
                    mode === "ddl"
                      ? "bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-sm shadow-indigo-500/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/10"
                  )}
                >
                  <FileText className="h-4 w-4" />
                  <span>SQL DDL Paste</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setMode("database")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition-all duration-200",
                    mode === "database"
                      ? "bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-sm shadow-indigo-500/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/10"
                  )}
                >
                  <Database className="h-4 w-4" />
                  <span>Koneksi Live DB</span>
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
                />
              )}
            </div>
            
            {/* Warning jika Live DB belum terverifikasi */}
            {mode === "database" && !isDbVerified && (
              <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 text-amber-400/90 rounded-2xl text-[11px] leading-relaxed flex items-start gap-2.5 font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Catatan: Sebelum menekan tombol generate, Anda wajib melakukan tes koneksi ke database dan memastikannya berhasil terhubung.
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
