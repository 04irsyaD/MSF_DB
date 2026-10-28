"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { swrFetcher, api } from "@/lib/api";
import { useGenerate } from "@/hooks/useGenerate";
import {
  Sparkles,
  Database,
  Search,
  Key,
  Shield,
  Clock,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LocalJob {
  jobId: string;
  projectName: string;
  accessCode?: string;
  status: string;
  timestamp: string;
}

export default function DashboardPage() {
  const [jobsHistory, setJobsHistory] = useState<LocalJob[]>([]);
  const [trackerCode, setTrackerCode] = useState("");
  const { trackJob } = useGenerate();

  // Fetch API & Ollama Health status
  const { data: health } = useSWR("/api/health", swrFetcher, {
    refreshInterval: 12000,
  });

  const isApiUp = !!health;
  const isOllamaUp = health?.services?.ollama === "up";
  const ollamaModel = health?.services?.ollama_model || "";

  // Load jobs history on mount
  useEffect(() => {
    try {
      const historyStr = localStorage.getItem("msf_jobs_history") || "[]";
      setJobsHistory(JSON.parse(historyStr));
    } catch (e) {
      console.error("Failed to load jobs history", e);
    }
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackerCode.trim()) return;
    try {
      await trackJob(trackerCode);
      window.location.href = "/generate";
    } catch (_) {
      // toast error already handled in useGenerate
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "done":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "error":
        return "bg-red-50 text-red-600 border-red-200";
      case "cancelled":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "processing":
        return "bg-blue-50 text-blue-600 border-blue-200 animate-pulse";
      default:
        return "bg-gray-50 text-gray-500 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in-up">
      {/* Welcome & Start Section */}
      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-5">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-gray-900">Mulai Dokumentasi Database</h2>
            <p className="text-xs text-muted-foreground">
              Pilih sumber skema database Anda untuk mulai menghasilkan dokumentasi otomatis bertenaga AI lokal.
            </p>
          </div>
          {/* Trust Signal Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50/50 border border-emerald-100/80 text-[10px] text-emerald-700 font-medium self-start md:self-auto shrink-0">
            <Shield className="h-3.5 w-3.5 text-emerald-600" />
            <span>100% Data Lokal &amp; Aman</span>
          </div>
        </div>

        {/* 2 Big Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/generate?tab=ddl"
            className="group flex items-start gap-4 p-5 rounded-2xl border border-border hover:border-accent/40 bg-white hover:bg-gray-50/40 transition-all duration-200 shadow-sm hover:shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-gray-900">Tempel SQL DDL</h3>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Salin &amp; tempel kode skrip SQL DDL (CREATE TABLE) Anda langsung ke editor untuk didokumentasikan.
              </p>
            </div>
          </Link>

          <Link
            href="/generate?tab=database"
            className="group flex items-start gap-4 p-5 rounded-2xl border border-border hover:border-accent/40 bg-white hover:bg-gray-50/40 transition-all duration-200 shadow-sm hover:shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <Database className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-gray-900">Koneksi Database Langsung</h3>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Hubungkan langsung ke PostgreSQL, MySQL, SQLite, atau SQL Server lokal untuk menarik skema otomatis.
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Recent Jobs History list */}
        <div className="md:col-span-2 bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-gray-50/30 flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-accent" />
              Riwayat Dokumentasi
            </h3>
            <span className="text-[10px] text-muted-foreground font-mono bg-gray-100 border border-border/80 px-2 py-0.5 rounded-lg">
              {jobsHistory.length} ITEM
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {jobsHistory.length > 0 ? (
              jobsHistory.map((job) => (
                <div key={job.jobId} className="p-4 flex items-center justify-between hover:bg-gray-50/20 transition-colors">
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate max-w-[240px]">{job.projectName}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                      <span>{new Date(job.timestamp).toLocaleDateString("id-ID")}</span>
                      {job.accessCode && (
                        <>
                          <span>•</span>
                          <span className="bg-gray-100 px-1 py-0.5 rounded border border-border/70 uppercase">CODE: {job.accessCode}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider", getStatusBadge(job.status))}>
                      {job.status}
                    </span>
                    {job.accessCode && (
                      <button
                        type="button"
                        onClick={() => {
                          trackJob(job.accessCode!).then(() => {
                            window.location.href = "/generate";
                          });
                        }}
                        className="p-1.5 rounded-lg border border-border hover:border-accent/40 text-muted-foreground hover:text-accent transition-colors"
                        title="Buka kembali pekerjaan ini"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-50 border border-border flex items-center justify-center text-muted-foreground">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-800 uppercase tracking-widest font-mono">Belum Ada Riwayat</p>
                  <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed">
                    Dokumentasi yang Anda buat akan muncul di sini agar Anda dapat melihat progres dan mengunduh hasilnya kembali.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Job Tracker Input & Privacy Info */}
        <div className="space-y-6">
          {/* Active Job Tracker Form */}
          <div className="bg-white border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-accent" />
                Lacak Pekerjaan
              </h3>
              <p className="text-[10px] text-muted-foreground leading-normal">
                Gunakan kode pelacakan untuk memantau progres generate database Anda.
              </p>
            </div>

            <form onSubmit={handleTrack} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="KODE: MSF-XXXXXXXX"
                  value={trackerCode}
                  onChange={(e) => setTrackerCode(e.target.value)}
                  className="w-full bg-gray-50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2 pl-3 pr-8 text-xs text-gray-900 placeholder-muted-foreground/40 focus:outline-none transition-colors duration-150 font-mono tracking-wider uppercase"
                />
                <button type="submit" className="absolute right-2 top-2.5 text-muted-foreground hover:text-accent transition-colors">
                  <Search className="h-4 w-4" />
                </button>
              </div>
              <button
                type="submit"
                disabled={!trackerCode.trim()}
                className="w-full py-2 bg-accent hover:bg-accent/90 disabled:bg-gray-100 text-white disabled:text-muted-foreground text-[10px] font-bold rounded-xl transition-all shadow-sm uppercase tracking-wider font-mono"
              >
                Lacak Progres
              </button>
            </form>
          </div>

          {/* Privacy & Trust Badge */}
          <div className="bg-gray-50 border border-border/70 p-5 rounded-2xl space-y-3">
            <h4 className="text-[10px] font-mono font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              KOMITMEN KEAMANAN
            </h4>
            <ul className="space-y-2 text-[10.5px] text-gray-600 leading-relaxed font-medium">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Pemrosesan Lokal:</strong> Skema database tidak pernah diunggah ke server cloud eksternal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Kredensial Aman:</strong> Detail koneksi database langsung hanya digunakan sementara dan tidak disimpan di server.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
