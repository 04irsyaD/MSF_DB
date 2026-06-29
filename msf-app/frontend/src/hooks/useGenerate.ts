"use client";

import { useState, useEffect, useRef } from "react";
import { api, getFriendlyErrorMessage } from "@/lib/api";
import {
  GenerateFromDDLRequest,
  GenerateFromDBRequest,
  JobStatus,
  JobStatusResponse,
} from "@/lib/types";
import { toast } from "sonner";

export function useGenerate() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState<string | undefined>(undefined);
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

  // Load active job from localstorage on mount — validasi status dulu
  useEffect(() => {
    const savedJobId = localStorage.getItem("msf_active_job_id");
    if (savedJobId) {
      api.getJobStatus(savedJobId)
        .then((res) => {
          if (res.status === "queued" || res.status === "processing") {
            setJobId(savedJobId);
            setAccessCode(res.access_code);
            setIsGenerating(true);
          } else {
            // Job sudah selesai/error/cancelled — hapus dari localStorage
            localStorage.removeItem("msf_active_job_id");
          }
        })
        .catch(() => {
          // Job tidak ditemukan di backend (mungkin sudah expired) — hapus dari localStorage
          localStorage.removeItem("msf_active_job_id");
        });
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

    let pollCount = 0;
    let consecutiveErrors = 0;
    const maxPolls = 900; // 30 menit (900 * 2s) untuk mendukung banyak tabel pada LLM lokal
    const maxErrors = 5;

    const fetchStatus = async () => {
      pollCount++;
      if (pollCount > maxPolls) {
        setIsGenerating(false);
        setJobId(null);
        setAccessCode(undefined);
        localStorage.removeItem("msf_active_job_id");
        setStatus("error");
        setErrorMessage("Waktu tunggu pembuatan dokumentasi habis (Timeout).");
        toast.error("Waktu tunggu pembuatan dokumentasi habis.");
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        return;
      }

      try {
        const response = await api.getJobStatus(jobId);
        consecutiveErrors = 0;
        
        setStatus(response.status);
        setProgress(response.progress);
        setTablesTotal(response.tables_total);
        setTablesProcessed(response.tables_processed);
        setCurrentTable(response.current_table);
        setErrorMessage(response.error_message || null);
        setPreviewMarkdown(response.preview_markdown);
        setDownloadUrl(response.download_url);
        setAccessCode(response.access_code);

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
        } else if (response.status === "cancelled") {
          setIsGenerating(false);
          setStatus("cancelled");
          setJobId(null);
          localStorage.removeItem("msf_active_job_id");
          toast.warning("Pembuatan dokumentasi dibatalkan.");
        }
      } catch (err: any) {
        console.error("Gagal mengambil status job:", err);
        consecutiveErrors++;
        if (consecutiveErrors >= maxErrors) {
          setIsGenerating(false);
          setJobId(null);
          localStorage.removeItem("msf_active_job_id");
          setStatus("error");
          setErrorMessage("Koneksi ke API Server terputus.");
          toast.error("Gagal terhubung ke API server.");
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
        }
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
    setAccessCode(undefined);

    try {
      const res = await api.generateFromDDL(data);
      setJobId(res.job_id);
      localStorage.setItem("msf_active_job_id", res.job_id);
      toast.info("Proses dokumentasi DDL dimulai...");
      return res.job_id;
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
    setAccessCode(undefined);

    try {
      const res = await api.generateFromDB(data);
      setJobId(res.job_id);
      localStorage.setItem("msf_active_job_id", res.job_id);
      toast.info("Proses dokumentasi Live DB dimulai...");
      return res.job_id;
    } catch (err: any) {
      setIsGenerating(false);
      const msg = getFriendlyErrorMessage(err);
      setErrorMessage(msg);
      toast.error(msg);
      throw err;
    }
  };

  const trackJob = async (code: string) => {
    if (!code.trim()) return;
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const res = await api.getJobByAccessCode(code.trim().toUpperCase());
      
      // Simpan ke state
      setJobId(res.job_id);
      setAccessCode(res.access_code);
      setStatus(res.status);
      setProgress(res.progress);
      setTablesTotal(res.tables_total);
      setTablesProcessed(res.tables_processed);
      setCurrentTable(res.current_table);
      setErrorMessage(res.error_message || null);
      setPreviewMarkdown(res.preview_markdown);
      setDownloadUrl(res.download_url);
      
      // Simpan ke localStorage agar bisa dilacak terus
      localStorage.setItem("msf_active_job_id", res.job_id);
      toast.success("Pekerjaan ditemukan. Melanjutkan pelacakan...");
      return res.job_id;
    } catch (err: any) {
      setIsGenerating(false);
      const msg = getFriendlyErrorMessage(err);
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
      setAccessCode(undefined);
      localStorage.removeItem("msf_active_job_id");
      toast.warning("Pembuatan dokumentasi dibatalkan oleh pengguna.");
    } catch (err: any) {
      toast.error(`Gagal membatalkan job: ${err.message}`);
    }
  };

  const resetState = () => {
    setJobId(null);
    setAccessCode(undefined);
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
    accessCode,
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
    trackJob,
    cancelActiveJob,
    resetState,
  };
}
