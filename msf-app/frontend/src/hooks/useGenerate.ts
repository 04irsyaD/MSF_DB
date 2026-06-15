"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import {
  GenerateFromDDLRequest,
  GenerateFromDBRequest,
  JobStatus,
  JobStatusResponse,
} from "@/lib/types";
import { toast } from "sonner";

export function useGenerate() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [tablesTotal, setTablesTotal] = useState<number>(0);
  const [tablesProcessed, setTablesProcessed] = useState<number>(0);
  const [currentTable, setCurrentTable] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewMarkdown, setPreviewMarkdown] = useState<string | undefined>(undefined);
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load active job from localstorage on mount
  useEffect(() => {
    const savedJobId = localStorage.getItem("msf_active_job_id");
    if (savedJobId) {
      setJobId(savedJobId);
      setIsGenerating(true);
    }
  }, []);

  // Poll status when jobId is active
  useEffect(() => {
    if (!jobId) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    const fetchStatus = async () => {
      try {
        const response = await api.getJobStatus(jobId);
        
        setStatus(response.status);
        setProgress(response.progress);
        setTablesTotal(response.tables_total);
        setTablesProcessed(response.tables_processed);
        setCurrentTable(response.current_table);
        setErrorMessage(response.error_message || null);
        setPreviewMarkdown(response.preview_markdown);
        setDownloadUrl(response.download_url);

        if (response.status === "done") {
          setIsGenerating(false);
          setJobId(null);
          localStorage.removeItem("msf_active_job_id");
          toast.success("Dokumentasi database berhasil dibuat!");
        } else if (response.status === "error") {
          setIsGenerating(false);
          setJobId(null);
          localStorage.removeItem("msf_active_job_id");
          toast.error(`Gagal membuat dokumentasi: ${response.error_message || "Unknown error"}`);
        }
      } catch (err: any) {
        console.error("Gagal mengambil status job:", err);
        // Jangan hentikan generator jika hanya network timeout sesekali
      }
    };

    // First fetch immediately
    fetchStatus();

    // Set polling interval
    pollIntervalRef.current = setInterval(fetchStatus, 2000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [jobId]);

  const generateFromDDL = async (data: GenerateFromDDLRequest) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setProgress(0);
    setPreviewMarkdown(undefined);
    setDownloadUrl(undefined);
    setStatus("queued");

    try {
      const res = await api.generateFromDDL(data);
      setJobId(res.job_id);
      localStorage.setItem("msf_active_job_id", res.job_id);
      toast.info("Proses dokumentasi DDL dimulai...");
      return res.job_id;
    } catch (err: any) {
      setIsGenerating(false);
      const msg = err.message || "Gagal memulai pembuatan dokumentasi.";
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
      const res = await api.generateFromDB(data);
      setJobId(res.job_id);
      localStorage.setItem("msf_active_job_id", res.job_id);
      toast.info("Proses dokumentasi Live DB dimulai...");
      return res.job_id;
    } catch (err: any) {
      setIsGenerating(false);
      const msg = err.message || "Gagal memulai pembuatan dokumentasi.";
      setErrorMessage(msg);
      toast.error(msg);
      throw err;
    }
  };

  const cancelActiveJob = async () => {
    if (!jobId) return;
    try {
      await api.cancelJob(jobId);
      setIsGenerating(false);
      setJobId(null);
      localStorage.removeItem("msf_active_job_id");
      toast.warning("Pembuatan dokumentasi dibatalkan oleh pengguna.");
    } catch (err: any) {
      toast.error(`Gagal membatalkan job: ${err.message}`);
    }
  };

  const resetState = () => {
    setJobId(null);
    setStatus(null);
    setProgress(0);
    setTablesTotal(0);
    setTablesProcessed(0);
    setCurrentTable(undefined);
    setErrorMessage(null);
    setPreviewMarkdown(undefined);
    setDownloadUrl(undefined);
    setIsGenerating(false);
    localStorage.removeItem("msf_active_job_id");
  };

  return {
    jobId,
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
