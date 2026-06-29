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
      <div className="p-5 bg-white border border-border rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-5 w-5 text-accent animate-pulse" />
          <div>
            <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest">
              SYSTEM DIAGNOSTICS & CONFIGURATION
            </h3>
            <p className="text-xs text-muted-foreground leading-normal mt-1 font-mono uppercase tracking-wide">
              Verify system health, local AI dependencies, and API keys validation.
            </p>
          </div>
        </div>
      </div>

      {/* Services Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backend API Server Info */}
        <div className="bg-white border border-border rounded-2xl p-5 space-y-3 shadow-sm">
          <h4 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest">FastAPI Backend</h4>
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
              <span className="text-gray-900">{health?.version || "2.0.0"}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground uppercase text-[10px]">Endpoints:</span>
              <a
                href="https://msf-db.my.id/api/docs"
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline font-bold uppercase text-[10px]"
              >
                SWAGGER API DOCS
              </a>
            </div>
          </div>
        </div>

        {/* Local Ollama Info */}
        <div className="bg-white border border-border rounded-2xl p-5 space-y-3 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest mb-3">Local Ollama LLM</h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground uppercase text-[10px]">Ollama Connection:</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1.5",
                    health?.services?.ollama === "up"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-amber-50 text-amber-600 border-amber-200"
                  )}
                >
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    health?.services?.ollama === "up" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  )} />
                  {health?.services?.ollama === "up" ? "CONNECTED" : "OFFLINE"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground uppercase text-[10px]">Default Model:</span>
                <span className="text-gray-900 truncate max-w-[150px]">
                  {health?.services?.ollama_model || "None"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground uppercase text-[10px]">Verification:</span>
                <button
                  onClick={handleTestOllama}
                  disabled={testingOllama}
                  className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-border hover:border-accent/40 text-[10px] font-mono font-bold flex items-center gap-1.5 transition-colors duration-150 disabled:opacity-50 uppercase"
                >
                  {testingOllama ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin text-accent" />
                      <span>TESTING...</span>
                    </>
                  ) : (
                    <span>TEST CONNECTION</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Installed Models Section */}
          {health?.services?.ollama === "up" && (
            <div className="pt-3 border-t border-border/40 space-y-2 mt-2">
              <span className="text-muted-foreground uppercase text-[10px] font-bold block">Installed Models:</span>
              <OllamaModelsList />
            </div>
          )}
        </div>
      </div>

      {/* Ollama Connection details box */}
      {ollamaResult && (
        <div
          className={cn(
            "p-3.5 rounded-xl border text-[11px] font-medium leading-relaxed font-mono",
            ollamaResult.success
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
          )}
        >
          <div className="font-bold mb-1 flex items-center gap-1.5 uppercase">
            {ollamaResult.success ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> READY TO GENERATE
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-amber-600" /> CONNECTION ALERT
              </>
            )}
          </div>
          <div>{ollamaResult.message.toUpperCase()}</div>
        </div>
      )}

      {/* AI Providers Overview */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-4 shadow-sm">
        <div>
          <h4 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest">AI Providers Configuration</h4>
          <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">
            Overview of AI providers configured in the system environment files.
          </p>
        </div>

        {loadingProviders ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2 font-mono">
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
            <span>LOADING PROVIDERS...</span>
          </div>
        ) : providers && providers.length > 0 ? (
          <div className="space-y-3.5 pt-2">
            {providers.map((p: any) => (
              <div
                key={p.name}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-gray-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center border border-border">
                    <Cpu className="h-4.5 w-4.5 text-accent" />
                  </div>
                  <div>
                    <h5 className="text-xs font-mono font-bold text-gray-900 uppercase">{p.name}</h5>
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
                      "px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border",
                      p.is_available
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-gray-100 text-gray-400 border-gray-255"
                    )}
                  >
                    {p.is_available ? "READY" : "NOT CONFIGURED"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2 font-mono">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-amber-600" />
            <span>
              TIDAK ADA AI PROVIDERS YANG TERDAFTAR DI BACKEND SERVER. PASTIKAN SERVER FASTAPI BERJALAN DENGAN BENAR.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function OllamaModelsList() {
  const { data: modelsData, error, isLoading } = useSWR("/api/ai/models?provider=ollama", swrFetcher);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
        <span>LOADING INSTALLED MODELS...</span>
      </div>
    );
  }

  if (error || !modelsData?.models) {
    return (
      <div className="text-[10px] text-red-500 font-mono font-bold uppercase">
        Gagal memuat model.
      </div>
    );
  }

  const models = modelsData.models;

  if (models.length === 0) {
    return (
      <div className="text-[10px] text-amber-600 font-mono font-bold uppercase">
        Tidak ada model terinstall. Jalankan 'ollama pull'
      </div>
    );
  }

  return (
    <div className="max-h-[110px] overflow-y-auto space-y-1.5 pr-1 font-mono">
      {models.map((m: any) => (
        <div
          key={m.name}
          className="flex justify-between items-center bg-gray-50 hover:bg-gray-100/80 px-2.5 py-1.5 rounded-lg border border-border/60 text-[10px] transition-colors duration-150"
        >
          <span className="text-gray-900 font-bold truncate max-w-[155px]">{m.name}</span>
          <span className="text-muted-foreground text-[9px]">{m.size || "Unknown size"}</span>
        </div>
      ))}
    </div>
  );
}
