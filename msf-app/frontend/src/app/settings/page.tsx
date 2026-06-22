"use client";

import { useState } from "react";
import useSWR from "swr";
import { api, swrFetcher } from "@/lib/api";
import { Settings as SettingsIcon, Cpu, ShieldAlert, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [testingOllama, setTestingOllama] = useState(false);
  const [ollamaResult, setOllamaResult] = useState<{ success: boolean; message: string } | null>(null);

  // Poll server health info
  const { data: health, mutate: mutateHealth } = useSWR("/api/health", swrFetcher, {
    refreshInterval: 10000,
  });

  // Fetch list of AI providers and status
  const { data: providers, isLoading: loadingProviders } = useSWR("/api/ai/providers", () => api.listAIProviders());

  const handleTestOllama = async () => {
    setTestingOllama(true);
    setOllamaResult(null);
    try {
      // Test using a simple query or health check endpoint
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Intro info box */}
      <div className="p-5 bg-card/40 border border-border rounded-2xl space-y-4 glass-panel">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-5 w-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-white">System Diagnostics & Configuration</h3>
            <p className="text-xs text-muted-foreground leading-normal mt-0.5">
              Verify system health, local AI dependencies, and API keys validation.
            </p>
          </div>
        </div>
      </div>

      {/* Services Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backend API Server Info */}
        <div className="bg-card/30 border border-border rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">FastAPI Backend</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-muted-foreground">API Status:</span>
              <span className={cn(
                "font-semibold flex items-center gap-1",
                health ? "text-emerald-400" : "text-red-400"
              )}>
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  health ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                )} />
                {health ? "Online" : "Offline"}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-muted-foreground">Version:</span>
              <span className="font-mono text-white">{health?.version || "2.0.0"}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground">Endpoints:</span>
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:underline font-semibold"
              >
                Interactive Swagger Docs
              </a>
            </div>
          </div>
        </div>

        {/* Local Ollama Info */}
        <div className="bg-card/30 border border-border rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Local Ollama LLM</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-muted-foreground">Ollama Connection:</span>
              <span
                className={cn(
                  "font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded border",
                  health?.services?.ollama === "up"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                )}
              >
                {health?.services?.ollama === "up" ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-muted-foreground">Default Model:</span>
              <span className="font-mono text-white truncate max-w-[150px]">
                {health?.services?.ollama_model || "None"}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground">Verification:</span>
              <button
                onClick={handleTestOllama}
                disabled={testingOllama}
                className="px-2.5 py-1 bg-secondary hover:bg-secondary/80 text-white rounded-lg border border-border hover:border-indigo-500/20 text-[10px] font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {testingOllama ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <span>Test Connection</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ollama Connection details box */}
      {ollamaResult && (
        <div
          className={cn(
            "p-3.5 rounded-xl border text-[11px] font-medium leading-relaxed font-mono",
            ollamaResult.success
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400/90"
              : "bg-amber-500/5 border-amber-500/20 text-amber-400/90"
          )}
        >
          <div className="font-bold mb-1 flex items-center gap-1.5">
            {ollamaResult.success ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Ready to generate
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-amber-400" /> Connection Alert
              </>
            )}
          </div>
          <div>{ollamaResult.message}</div>
        </div>
      )}

      {/* AI Providers Overview */}
      <div className="bg-card/40 border border-border rounded-2xl p-6 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Providers Configuration</h4>
          <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">
            Overview of AI providers configured in the system environment files.
          </p>
        </div>

        {loadingProviders ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
            <span>Loading providers...</span>
          </div>
        ) : providers && providers.length > 0 ? (
          <div className="space-y-3.5 pt-2">
            {providers.map((p: any) => (
              <div
                key={p.name}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-secondary/10"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-secondary/80 flex items-center justify-center border border-border">
                    <Cpu className="h-4.5 w-4.5 text-indigo-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white capitalize">{p.name}</h5>
                    <p className="text-[10px] text-muted-foreground leading-none mt-1">
                      {p.name === "ollama"
                        ? "Local inference engine running on localhost"
                        : "Cloud based API endpoint connectivity"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                      p.is_available
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"
                    )}
                  >
                    {p.is_available ? "Ready" : "Not Configured"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-400 flex items-start gap-2">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>
              Tidak ada AI providers yang terdaftar di backend server. Pastikan server FastAPI berjalan dengan benar.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
