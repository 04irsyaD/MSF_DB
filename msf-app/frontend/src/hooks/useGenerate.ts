"use client";

import { useState, useRef } from "react";
import { api, getFriendlyErrorMessage } from "@/lib/api";
import {
  GenerateFromDDLRequest,
  GenerateFromDBRequest,
  JobStatus,
  TableMetadata,
} from "@/lib/types";
import { toast } from "sonner";

export function useGenerate() {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [tablesTotal, setTablesTotal] = useState<number>(0);
  const [tablesProcessed, setTablesProcessed] = useState<number>(0);
  const [currentTable, setCurrentTable] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewMarkdown, setPreviewMarkdown] = useState<string | undefined>(undefined);
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Use a ref to track cancellation
  const isCancelledRef = useRef<boolean>(false);

  const resetState = () => {
    setStatus(null);
    setProgress(0);
    setTablesTotal(0);
    setTablesProcessed(0);
    setCurrentTable(undefined);
    setErrorMessage(null);
    setPreviewMarkdown(undefined);
    setDownloadUrl(undefined);
    setIsGenerating(false);
    isCancelledRef.current = false;
  };

  const cancelActiveJob = () => {
    isCancelledRef.current = true;
    setStatus("cancelled");
    setIsGenerating(false);
    toast.warning("Pembuatan dokumentasi dibatalkan oleh pengguna.");
  };

  /**
   * Helper to build overview header section
   */
  const buildHeader = (projectName: string, tables: TableMetadata[], language: string): string => {
    const now = new Date().toLocaleDateString(language === "Indonesian" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const tableList = tables
      .map(t => `- [${t.name}](#${t.name.toLowerCase().replace(/\s+/g, "-")})`)
      .join("\n");

    if (language === "Indonesian") {
      return `# ${projectName}

**Tanggal Generate:** ${now}
**Total Tabel:** ${tables.length}
**Dibuat dengan:** MSF-APP Serverless v2.0

## Daftar Tabel

${tableList}`;
    } else {
      return `# ${projectName}

**Generated:** ${now}
**Total Tables:** ${tables.length}
**Created with:** MSF-APP Serverless v2.0

## Table of Contents

${tableList}`;
    }
  };

  /**
   * Helper to build relations summary section
   */
  const buildRelationsSummary = (tables: TableMetadata[], language: string): string => {
    const fks: string[] = [];
    for (const table of tables) {
      if (table.foreign_keys) {
        for (const fk of table.foreign_keys) {
          fks.push(`- \`${table.name}.${fk.column}\` → \`${fk.references_table}.${fk.references_column}\``);
        }
      }
    }
    if (fks.length === 0) return "";

    if (language === "Indonesian") {
      return `## Ringkasan Relasi Antar Tabel\n\n${fks.join("\n")}`;
    } else {
      return `## Table Relationships Summary\n\n${fks.join("\n")}`;
    }
  };

  /**
   * Orchestrate the table generation client-side
   */
  const runGeneration = async (
    tables: TableMetadata[],
    projectName: string,
    language: string,
    detailLevel: string,
    businessContext: string,
    aiProvider: string,
    model: string
  ) => {
    isCancelledRef.current = false;
    setTablesTotal(tables.length);
    setTablesProcessed(0);
    setProgress(5);
    setStatus("processing");

    const sections: string[] = [buildHeader(projectName, tables, language)];
    
    // Process tables sequentially
    for (let i = 0; i < tables.length; i++) {
      if (isCancelledRef.current) {
        return;
      }

      const table = tables[i];
      setCurrentTable(table.name);
      toast.info(`Menganalisis tabel ${table.name}...`);

      try {
        const res = await api.generateTable({
          table,
          language,
          detail_level: detailLevel,
          business_context: businessContext || undefined,
          ai_provider: aiProvider as any,
          model,
        });

        sections.push(res.markdown);
      } catch (err: any) {
        console.error(`Gagal generate tabel ${table.name}:`, err);
        // Fallback representation if API fails
        const fallbackMd = language === "Indonesian"
          ? `## Tabel: \`${table.name}\`\n\n> ⚠️ AI description tidak tersedia: ${err.message || err}`
          : `## Table: \`${table.name}\`\n\n> ⚠️ AI description not available: ${err.message || err}`;
        sections.push(fallbackMd);
      }

      setTablesProcessed(i + 1);
      setProgress(Math.round(((i + 1) / tables.length) * 90)); // 5% to 95%
    }

    if (isCancelledRef.current) return;

    // Add relations summary
    if (detailLevel !== "simple" && tables.length > 1) {
      const relSummary = buildRelationsSummary(tables, language);
      if (relSummary) {
        sections.push(relSummary);
      }
    }

    setProgress(100);
    const finalMarkdown = sections.join("\n\n---\n\n");
    setPreviewMarkdown(finalMarkdown);
    setStatus("done");
    setIsGenerating(false);
    toast.success("Dokumentasi database berhasil dibuat!");
  };

  const generateFromDDL = async (data: GenerateFromDDLRequest) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setProgress(0);
    setPreviewMarkdown(undefined);
    setDownloadUrl(undefined);
    setStatus("queued");

    try {
      // 1. Parse DDL first to extract table metadata
      toast.info("Mengurai SQL DDL...");
      const parseResult = await api.parseSchema(data.sql_content);
      if (!parseResult.valid || parseResult.tables.length === 0) {
        throw new Error(parseResult.message || "Gagal mengurai DDL.");
      }

      // 2. Start single-table AI generation orchestration
      await runGeneration(
        parseResult.tables,
        data.project_name || "My Project DB",
        data.language,
        data.detail_level,
        data.business_context || "",
        data.ai_provider,
        data.model
      );
    } catch (err: any) {
      setIsGenerating(false);
      const msg = getFriendlyErrorMessage(err);
      setErrorMessage(msg);
      toast.error(msg);
      throw err;
    }
  };

  const generateFromDB = async (data: GenerateFromDBRequest) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setProgress(0);
    setPreviewMarkdown(undefined);
    setDownloadUrl(undefined);
    setStatus("queued");

    try {
      // 1. Fetch metadata (tables list) from DB connection
      toast.info("Menghubungkan ke database & mengambil schema...");
      const metadata = await api.fetchDBMetadata({
        connection: data.connection,
        schema_filter: data.schema_filter,
        include_views: data.include_views,
        include_functions: data.include_functions,
      });

      if (!metadata.tables || metadata.tables.length === 0) {
        throw new Error("Tidak ditemukan tabel di database tersebut.");
      }

      // If user selected specific tables, filter them
      let targetTables = metadata.tables;
      if (data.table_filter && data.table_filter.length > 0) {
        targetTables = metadata.tables.filter(t => data.table_filter!.includes(t.name));
      }

      // 2. Start single-table AI generation orchestration
      await runGeneration(
        targetTables,
        data.project_name || data.connection.database || "Database Docs",
        data.language,
        data.detail_level,
        data.business_context || "",
        data.ai_provider,
        data.model
      );
    } catch (err: any) {
      setIsGenerating(false);
      const msg = getFriendlyErrorMessage(err);
      setErrorMessage(msg);
      toast.error(msg);
      throw err;
    }
  };

  return {
    jobId: null, // No background job ID needed in serverless
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
  };
}
