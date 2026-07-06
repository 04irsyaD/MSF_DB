"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import Link from "next/link";
import { 
  ShieldAlert, 
  Terminal, 
  Activity, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Cpu, 
  Database,
  Lock,
  Unlock,
  Loader2,
  Server,
  Settings as SettingsIcon,
  Play
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { api, swrFetcher } from "@/lib/api";

// Custom fetcher dengan auth header
const adminFetcher = async ([url, passcode]: [string, string]) => {
  const response = await fetch(url, {
    headers: {
      "X-Admin-Passcode": passcode,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Gagal memuat data admin.");
  }
  return response.json();
};

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [logLimit, setLogLimit] = useState(100);
  const [autoScroll, setAutoScroll] = useState(true);
  const [testingOllama, setTestingOllama] = useState(false);
  const [ollamaResult, setOllamaResult] = useState<{ success: boolean; message: string } | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Load passcode dari localStorage saat mount
  useEffect(() => {
    const savedPasscode = localStorage.getItem("msf_admin_passcode");
    if (savedPasscode) {
      setPasscode(savedPasscode);
      verifyPasscodeOnMount(savedPasscode);
    }
  }, []);

  const verifyPasscodeOnMount = async (code: string) => {
    setVerifying(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "X-Admin-Passcode": code },
      });
      if (res.ok) {
        setIsAuthorized(true);
      } else {
        localStorage.removeItem("msf_admin_passcode");
      }
    } catch (e) {
      // API offline atau network error
    } finally {
      setVerifying(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    setVerifying(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "X-Admin-Passcode": passcode },
      });
      if (res.ok) {
        localStorage.setItem("msf_admin_passcode", passcode);
        setIsAuthorized(true);
        toast.success("Akses admin berhasil diverifikasi!");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.detail || "Passcode salah.");
      }
    } catch (e: any) {
      toast.error(`Gagal menghubungkan ke server: ${e.message}`);
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("msf_admin_passcode");
    setPasscode("");
    setIsAuthorized(false);
    toast.info("Keluar dari Admin Portal.");
  };

  // Poll stats dan jobs jika diotorisasi
  const { data: stats, error: statsError, mutate: mutateStats } = useSWR(
    isAuthorized ? ["/api/admin/stats", passcode] : null,
    adminFetcher,
    { refreshInterval: 5000 }
  );

  const { data: health, mutate: mutateHealth } = useSWR(
    isAuthorized ? "/api/health" : null,
    swrFetcher,
    { refreshInterval: 10000 }
  );

  const { data: jobsData, error: jobsError, mutate: mutateJobs } = useSWR(
    isAuthorized ? ["/api/admin/jobs", passcode] : null,
    adminFetcher,
    { refreshInterval: 4000 }
  );

  const { data: logsData, error: logsError, mutate: mutateLogs } = useSWR(
    isAuthorized ? [`/api/admin/logs?limit=${logLimit}`, passcode] : null,
    adminFetcher,
    { refreshInterval: 3000 }
  );

  // Auto scroll terminal log ke paling bawah
  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logsData, autoScroll]);

  const handleCleanup = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus seluruh riwayat pekerjaan dari memori server? File fisik di disk juga akan dibersihkan.")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/cleanup", {
        method: "POST",
        headers: { "X-Admin-Passcode": passcode },
      });
      if (res.ok) {
        toast.success("Riwayat berhasil dibersihkan!");
        mutateStats();
        mutateJobs();
      } else {
        toast.error("Gagal membersihkan riwayat.");
      }
    } catch (e: any) {
      toast.error(`Gagal menghubungi server: ${e.message}`);
    }
  };

  const handleTestOllama = async () => {
    setTestingOllama(true);
    setOllamaResult(null);
    try {
      const isUp = await api.testAIConnection("ollama", health?.services?.ollama_model || "");
      if (isUp.success) {
        setOllamaResult({ success: true, message: "Koneksi ke Ollama berhasil terhubung!" });
        toast.success("Ollama siap digunakan!");
      } else {
        setOllamaResult({ success: false, message: isUp.message || "Ollama tidak merespon." });
        toast.error("Gagal terhubung ke Ollama.");
      }
    } catch (err: any) {
      setOllamaResult({ success: false, message: err.message || "Gagal menghubungi API backend." });
      toast.error(`Koneksi gagal: ${err.message}`);
    } finally {
      setTestingOllama(false);
      mutateHealth();
    }
  };

  if (verifying && !isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 font-mono">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Memverifikasi Akses Admin...</span>
      </div>
    );
  }

  // Tampilan Login / Lock
  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-white border border-border rounded-2xl shadow-sm space-y-6 font-mono">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="h-12 w-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Lock className="h-5 w-5 animate-pulse" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">ADMIN PORTAL SECURED</h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[280px]">
            Halaman ini dilindungi. Masukkan admin passcode yang dikonfigurasi di server `.env`.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
              Admin Passcode
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="MASUKKAN PASSCODE..."
              className="w-full bg-gray-50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-indigo-600 focus:border-b-indigo-600 rounded-none py-2 px-3 text-xs text-gray-900 placeholder-muted-foreground/50 focus:outline-none transition-colors duration-150 font-mono text-center tracking-widest"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={verifying}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm uppercase"
          >
            {verifying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Unlock className="h-3.5 w-3.5" />}
            <span>Verifikasi Akses</span>
          </button>
        </form>
      </div>
    );
  }

  const summary = stats?.summary || {};
  const jobs = jobsData?.jobs || [];
  const logs = logsData?.logs || [];

  return (
    <div className="space-y-8 animate-fade-in-up font-mono">
      {/* Admin Header */}
      <div className="p-5 bg-white border border-border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Server className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0 animate-pulse" />
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
              SYSTEM CONTROL & ANALYTICS
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
              Pantau log server secara live, analisa statistik penggunaan model AI, dan kelola antrean background tasks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 hover:text-emerald-700 transition-colors duration-150 text-xs font-bold flex items-center gap-1.5 uppercase shadow-sm font-mono"
          >
            <span>← WORKSPACE</span>
          </Link>
          <button
            onClick={handleCleanup}
            className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 hover:text-red-700 transition-colors duration-150 text-xs font-bold flex items-center gap-1.5 uppercase shadow-sm"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-border text-gray-700 hover:text-gray-900 transition-colors duration-150 text-xs font-bold flex items-center gap-1.5 uppercase shadow-sm"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Generasi</span>
            <div className="text-2xl font-extrabold text-gray-900">{summary.total_jobs ?? "-"}</div>
            <span className="text-[9px] text-muted-foreground block">Semua pekerjaan terdaftar</span>
          </div>
          <div className="w-10 h-10 rounded-xl border bg-blue-50 border-blue-100 text-blue-600 flex items-center justify-center">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Success Rate</span>
            <div className="text-2xl font-extrabold text-gray-900">{summary.success_rate !== undefined ? `${summary.success_rate}%` : "-"}</div>
            <span className="text-[9px] text-muted-foreground block">Rasio keberhasilan AI</span>
          </div>
          <div className="w-10 h-10 rounded-xl border bg-emerald-50 border-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avg Duration</span>
            <div className="text-2xl font-extrabold text-gray-900">{summary.avg_duration_seconds !== undefined ? `${summary.avg_duration_seconds}s` : "-"}</div>
            <span className="text-[9px] text-muted-foreground block">Waktu respon rata-rata</span>
          </div>
          <div className="w-10 h-10 rounded-xl border bg-purple-50 border-purple-100 text-purple-600 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-border p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Tasks</span>
            <div className="text-2xl font-extrabold text-gray-900">
              {(summary.queued || 0) + (summary.processing || 0)}
            </div>
            <span className="text-[9px] text-muted-foreground block">
              {summary.processing || 0} memproses, {summary.queued || 0} mengantre
            </span>
          </div>
          <div className={cn(
            "w-10 h-10 rounded-xl border flex items-center justify-center",
            ((summary.queued || 0) + (summary.processing || 0)) > 0
              ? "bg-amber-50 border-amber-100 text-amber-600 animate-pulse"
              : "bg-gray-50 border-gray-100 text-gray-400"
          )}>
            <RefreshCw className={cn("h-5 w-5", ((summary.queued || 0) + (summary.processing || 0)) > 0 && "animate-spin")} />
          </div>
        </div>
      </div>

      {/* System Diagnostics (Moved from settings to admin-only area) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backend API Server Info */}
        <div className="bg-white border border-border rounded-2xl p-5 space-y-3 shadow-sm">
          <h4 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
            <Server className="h-4.5 w-4.5 text-indigo-600" />
            FastAPI Backend Diagnostics
          </h4>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-muted-foreground uppercase text-[10px]">API Status:</span>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1.5",
                health
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "bg-red-50 text-red-600 border-red-200"
              )}>
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  health ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                )} />
                {health ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-muted-foreground uppercase text-[10px]">Version:</span>
              <span className="text-gray-900">{health?.version || "2.1.0"}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground uppercase text-[10px]">Swagger Docs:</span>
              <a
                href="/api/docs"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline font-bold uppercase text-[10px] flex items-center gap-0.5"
              >
                <span>Swagger Docs</span>
                <span className="text-[8px]">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Local Ollama Info */}
        <div className="bg-white border border-border rounded-2xl p-5 space-y-3 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
              <Cpu className="h-4.5 w-4.5 text-indigo-600" />
              Local Ollama Instance
            </h4>
            <div className="space-y-2 text-xs font-mono mt-3">
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground uppercase text-[10px]">Status:</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                  health?.services?.ollama === "up"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : "bg-amber-50 text-amber-600 border-amber-200"
                )}>
                  {health?.services?.ollama === "up" ? "ACTIVE / RUNNING" : "OFFLINE / INACTIVE"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground uppercase text-[10px]">Active Model:</span>
                <span className="text-gray-900 truncate max-w-[150px]" title={health?.services?.ollama_model}>
                  {health?.services?.ollama_model ? health.services.ollama_model.split(":")[0].toUpperCase() : "NONE"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/40 mt-3 flex items-center justify-between gap-3">
            {ollamaResult && (
              <span className={cn(
                "text-[10px] font-mono leading-none font-bold",
                ollamaResult.success ? "text-emerald-600" : "text-amber-600"
              )}>
                {ollamaResult.message}
              </span>
            )}
            <button
              onClick={handleTestOllama}
              disabled={testingOllama}
              className="ml-auto px-3 py-1.5 rounded-xl border border-border hover:border-indigo-500/40 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider shrink-0"
            >
              {testingOllama ? (
                <Loader2 className="h-3 w-3 animate-spin text-indigo-600" />
              ) : (
                <Play className="h-3 w-3 text-indigo-600" />
              )}
              <span>Test AI Connection</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Live Log Viewer (Terminal) */}
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="bg-gray-50 border-b border-border px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Live Log Terminal</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="flex items-center gap-3 text-[10px]">
              <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-gray-900 select-none">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                />
                <span>AUTO SCROLL</span>
              </label>
              <select
                value={logLimit}
                onChange={(e) => setLogLimit(Number(e.target.value))}
                className="bg-white border border-border rounded px-2 py-0.5 font-bold text-gray-700 outline-none cursor-pointer"
              >
                <option value={50}>50 BARIS</option>
                <option value={100}>100 BARIS</option>
                <option value={200}>200 BARIS</option>
                <option value={500}>500 BARIS</option>
              </select>
            </div>
          </div>

          {/* Terminal Box */}
          <div className="flex-1 bg-gray-950 p-4 font-mono text-[10px] text-gray-200 overflow-y-auto leading-relaxed space-y-1">
            {logs.length > 0 ? (
              logs.map((log: string, index: number) => {
                // Beri warna berbeda untuk level log tertentu
                const isError = log.includes('"level": "error"') || log.includes("ERROR") || log.includes("Exception") || log.includes("Traceback");
                const isWarning = log.includes('"level": "warning"') || log.includes("WARNING");
                const isSuccess = log.includes("Job selesai") || log.includes("200 OK");
                
                return (
                  <div 
                    key={index} 
                    className={cn(
                      "whitespace-pre-wrap break-all",
                      isError && "text-red-400 font-bold",
                      isWarning && "text-amber-400",
                      isSuccess && "text-emerald-400"
                    )}
                  >
                    {log}
                  </div>
                );
              })
            ) : (
              <div className="text-muted-foreground italic text-center pt-8">
                Membuka koneksi log server...
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Right: Distribution Analysis */}
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Usage Distribution</h4>
              <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                Analisa penggunaan model AI dan database engine.
              </p>
            </div>

            {/* AI Provider Bar Charts */}
            <div className="space-y-3.5">
              <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-indigo-600" />
                AI Providers
              </h5>
              <div className="space-y-2.5 text-[10px]">
                {stats?.ai_distribution && Object.keys(stats.ai_distribution).length > 0 ? (
                  Object.entries(stats.ai_distribution).map(([provider, count]: [string, any]) => {
                    const pct = summary.total_jobs ? (count / summary.total_jobs) * 100 : 0;
                    return (
                      <div key={provider} className="space-y-1">
                        <div className="flex justify-between font-bold text-gray-700 uppercase">
                          <span>{provider}</span>
                          <span>{count} ({Math.round(pct)}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 rounded-full" 
                            style={{ width: `${pct}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-muted-foreground italic text-[10px]">Belum ada data AI</span>
                )}
              </div>
            </div>

            {/* DB Engine Bar Charts */}
            <div className="space-y-3.5 pt-2">
              <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-indigo-600" />
                Database Engines
              </h5>
              <div className="space-y-2.5 text-[10px]">
                {stats?.db_distribution && Object.keys(stats.db_distribution).length > 0 ? (
                  Object.entries(stats.db_distribution).map(([engine, count]: [string, any]) => {
                    const pct = summary.total_jobs ? (count / summary.total_jobs) * 100 : 0;
                    return (
                      <div key={engine} className="space-y-1">
                        <div className="flex justify-between font-bold text-gray-700 uppercase">
                          <span>{engine}</span>
                          <span>{count} ({Math.round(pct)}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 rounded-full" 
                            style={{ width: `${pct}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-muted-foreground italic text-[10px]">Belum ada data DB</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs History Table */}
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-gray-50 flex items-center justify-between">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
            Detailed Job History
          </h4>
          <span className="text-[10px] font-bold text-muted-foreground">
            POLLING SETIAP 4 DETIK
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-gray-50/50 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                <th className="py-3 px-5">Job ID</th>
                <th className="py-3 px-4">Project Name</th>
                <th className="py-3 px-4">AI Model</th>
                <th className="py-3 px-4">DB Engine</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Created At</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? (
                jobs.map((job: any) => (
                  <tr key={job.job_id} className="border-b border-border/50 hover:bg-gray-50/30 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-[10px] text-gray-500 font-semibold select-all">
                      {job.job_id.substring(0, 8)}...
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900 truncate max-w-[150px]" title={job.project_name}>
                      {job.project_name}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 uppercase text-[10px]">
                      {job.ai_provider} ({job.model || "default"})
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 uppercase text-[10px]">
                      {job.db_engine}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                        job.status === "done" && "bg-emerald-50 text-emerald-600 border-emerald-200",
                        job.status === "processing" && "bg-blue-50 text-blue-600 border-blue-200 animate-pulse",
                        job.status === "queued" && "bg-gray-50 text-gray-500 border-gray-200",
                        job.status === "error" && "bg-red-50 text-red-600 border-red-200",
                        job.status === "cancelled" && "bg-amber-50 text-amber-600 border-amber-200"
                      )}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-700">
                      {job.progress}%
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground text-[10px]">
                      {job.created_at ? new Date(job.created_at).toLocaleString("id-ID") : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground italic">
                    Belum ada riwayat pekerjaan di server.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
