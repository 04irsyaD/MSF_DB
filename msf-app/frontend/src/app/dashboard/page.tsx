"use client";

import Link from "next/link";
import useSWR from "swr";
import { swrFetcher, api } from "@/lib/api";
import { 
  Database, 
  Sparkles, 
  Terminal, 
  Settings, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Layers,
  FileText,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  // Fetch API Health
  const { data: health, isLoading: isHealthLoading } = useSWR("/api/health", swrFetcher, {
    refreshInterval: 10000,
  });

  // Fetch SQL Shortcuts count
  const { data: shortcutsData } = useSWR("/api/shortcuts", () => api.listShortcuts({ limit: 1 }));
  const totalShortcuts = shortcutsData?.total || 48;

  // Fetch real stats dari backend
  const { data: statsData } = useSWR("/api/stats", swrFetcher, {
    refreshInterval: 15000,
  });

  const isApiUp = !!health;
  const isOllamaUp = health?.services?.ollama === "up";
  const ollamaModel = health?.services?.ollama_model || "None";

  // Stats dari data real backend
  const stats = [
    {
      label: "Total Jobs",
      value: statsData?.total_jobs ?? '-',
      desc: "Antrean dokumentasi",
      icon: Layers,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Selesai",
      value: statsData?.jobs_done ?? '-',
      desc: "Berhasil digenerate",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Tabel Terproses",
      value: statsData?.tables_processed ?? '-',
      desc: "Skema teranalisis",
      icon: Database,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      label: "SQL Shortcuts",
      value: totalShortcuts,
      desc: "Skrip DBA siap pakai",
      icon: Terminal,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
  ];

  const quickActions = [
    {
      title: "Generate dari DDL",
      desc: "Paste skrip SQL CREATE TABLE dan generate dokumentasi instan menggunakan AI.",
      icon: Sparkles,
      href: "/generate",
      actionText: "Mulai Generator",
      color: "hover:border-emerald-200 hover:shadow-emerald-50/50",
    },
    {
      title: "Koneksi Live DB",
      desc: "Hubungkan langsung ke PostgreSQL atau MySQL untuk mengimpor schema otomatis.",
      icon: Database,
      href: "/generate?tab=db",
      actionText: "Hubungkan DB",
      color: "hover:border-indigo-200 hover:shadow-indigo-50/50",
    },
    {
      title: "Skrip DBA & Shortcuts",
      desc: "Koleksi SQL snippets optimal untuk melakukan diagnosis performa dan analisis database.",
      icon: Terminal,
      href: "/shortcuts",
      actionText: "Lihat Shortcuts",
      color: "hover:border-amber-200 hover:shadow-amber-50/50",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Selamat datang di MSF DB 👋</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Platform dokumentasi database otomatis bertenaga AI lokal. Kelola skema, generate markdown/PDF, dan cari SQL shortcuts dengan mudah.
          </p>
        </div>
        <Link
          href="/generate"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors shadow-sm self-start md:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          Mulai Dokumentasi
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-border p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
                <span className="text-[10px] text-muted-foreground block">{stat.desc}</span>
              </div>
              <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center", stat.color)}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Aksi Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <div
                key={i}
                className={cn(
                  "bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between transition-all duration-200 card-hover",
                  action.color
                )}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-base">{action.title}</h4>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{action.desc}</p>
                </div>
                <Link
                  href={action.href}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent/80 mt-6 group"
                >
                  {action.actionText}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Columns Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quick Guide */}
        <div className="lg:col-span-2 bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent" />
            Panduan Memulai Cepat
          </h3>
          <div className="space-y-3.5 text-xs text-gray-600 leading-relaxed">
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100 shrink-0">1</div>
              <p>
                <strong>Buka halaman AI Generator</strong> dan paste skema database Anda dalam format DDL SQL (misalnya hasil export `pg_dump` atau MySQL `show create table`).
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100 shrink-0">2</div>
              <p>
                <strong>Atur opsi generasi</strong> seperti detail level, bahasa dokumentasi, format output (PDF atau DOCX), serta konfigurasi AI Model yang akan digunakan.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100 shrink-0">3</div>
              <p>
                <strong>Pantau status proses</strong> per tabel secara live. Setelah selesai, Anda dapat langsung mengunduh file dokumentasi yang siap pakai.
              </p>
            </div>
            <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-amber-800 flex gap-2.5 mt-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px]">
                <strong>Rekomendasi AI:</strong> Jika menggunakan <strong>Ollama</strong> secara lokal, kami sarankan menggunakan model <code>deepseek-coder</code> atau <code>llama3.2</code> untuk pemahaman struktur database yang optimal.
              </p>
            </div>
          </div>
        </div>

        {/* Right: System Status Detail */}
        <div className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              Status Sistem Detail
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-50 bg-gray-50/30">
                <span className="text-xs text-muted-foreground">API Server</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                  isApiUp 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                    : "bg-red-50 text-red-600 border-red-200"
                )}>
                  {isApiUp ? "ONLINE" : "OFFLINE"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-50 bg-gray-50/30">
                <span className="text-xs text-muted-foreground">Ollama Service</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                  isOllamaUp 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                    : "bg-amber-50 text-amber-600 border-amber-200"
                )}>
                  {isOllamaUp ? "CONNECTED" : "OFFLINE"}
                </span>
              </div>

              {isOllamaUp && (
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-50 bg-gray-50/30">
                  <span className="text-xs text-muted-foreground">Ollama Model</span>
                  <span className="font-mono text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg border border-gray-200 truncate max-w-[120px]" title={ollamaModel}>
                    {ollamaModel.split(":")[0]}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Link
            href="/settings"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-3.5 w-3.5" />
            Konfigurasi AI
          </Link>
        </div>
      </div>
    </div>
  );
}
