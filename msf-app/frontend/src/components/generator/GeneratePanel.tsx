"use client";

import { useEffect, useState } from "react";
import { GeneratorSettings, AIProvider, OutputLanguage, DetailLevel, ExportFormat } from "@/lib/types";
import { useAIModels } from "@/hooks/useOllamaModels";
import { Sparkles, Globe, FileText, BarChart, Settings, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneratePanelProps {
  settings: GeneratorSettings;
  onChange: (settings: GeneratorSettings) => void;
  onSubmit: () => void;
  disabled: boolean;
  loading: boolean;
}

export default function GeneratePanel({
  settings,
  onChange,
  onSubmit,
  disabled,
  loading,
}: GeneratePanelProps) {
  const [provider, setProvider] = useState<AIProvider>(settings.ai_provider);

  // Load models for current provider
  const { models, isAvailable, isLoading: modelsLoading } = useAIModels(provider);

  // Sync provider setting changes
  useEffect(() => {
    handleFieldChange("ai_provider", provider);
  }, [provider]);

  // Set default model once models load
  useEffect(() => {
    if (models.length > 0) {
      // Find default model based on provider or use first
      let defaultModel = models[0].name;
      
      // Ollama defaults
      if (provider === "ollama") {
        const preferred = models.find(m => m.name.includes("deepseek") || m.name.includes("llama") || m.name.includes("mistral"));
        if (preferred) defaultModel = preferred.name;
      } 
      // Deepseek defaults
      else if (provider === "deepseek") {
        defaultModel = "deepseek-chat";
      } 
      // OpenAI defaults
      else if (provider === "openai") {
        defaultModel = "gpt-4o-mini";
      }

      handleFieldChange("model", defaultModel);
    } else {
      handleFieldChange("model", "");
    }
  }, [models, provider]);

  const handleFieldChange = (key: keyof GeneratorSettings, val: any) => {
    onChange({
      ...settings,
      [key]: val,
    });
  };

  const providers: { label: string; value: AIProvider }[] = [
    { label: "Ollama (Lokal)", value: "ollama" },
    { label: "DeepSeek API", value: "deepseek" },
    { label: "OpenAI API", value: "openai" },
  ];

  const languages: { label: string; value: OutputLanguage }[] = [
    { label: "Bahasa Indonesia", value: "Indonesian" },
    { label: "English", value: "English" },
  ];

  const levels: { label: string; value: DetailLevel; desc: string }[] = [
    { label: "Simple", value: "simple", desc: "Metadata & deskripsi singkat" },
    { label: "Detailed", value: "detailed", desc: "Penjelasan relasi & tipe data" },
    { label: "Comprehensive", value: "comprehensive", desc: "Dilengkapi analisis bisnis & indexes" },
  ];

  return (
    <div className="space-y-6 bg-card/40 backdrop-blur-md border border-border p-6 rounded-2xl flex flex-col h-full justify-between">
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-bold text-white mb-1">AI & Documentation Config</h3>
          <p className="text-xs text-muted-foreground leading-normal">
            Configure output details, business context, and AI LLM configurations.
          </p>
        </div>

        {/* Project Metadata */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Project Name
            </label>
            <input
              type="text"
              value={settings.project_name}
              onChange={(e) => handleFieldChange("project_name", e.target.value)}
              placeholder="E-Commerce DB"
              className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Author
            </label>
            <input
              type="text"
              value={settings.author}
              onChange={(e) => handleFieldChange("author", e.target.value)}
              placeholder="Developer"
              className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Business Context */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Business Context & Description
          </label>
          <textarea
            value={settings.business_context}
            onChange={(e) => handleFieldChange("business_context", e.target.value)}
            rows={2}
            placeholder="Sistem e-commerce B2B dengan fitur multi-vendor, payment gateway, dan inventory management..."
            className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Language & Detail */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Output Language
            </label>
            <div className="flex bg-secondary/20 border border-border rounded-xl p-1">
              {languages.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => handleFieldChange("language", l.value)}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
                    settings.language === l.value
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/10 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              File Format
            </label>
            <div className="flex bg-secondary/20 border border-border rounded-xl p-1">
              {(["docx", "pdf"] as ExportFormat[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => handleFieldChange("output_format", f)}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-[11px] font-semibold uppercase transition-all",
                    settings.output_format === f
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/10 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detail Level */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Detail Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {levels.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => handleFieldChange("detail_level", l.value)}
                className={cn(
                  "p-2.5 rounded-xl border text-left flex flex-col transition-all duration-200",
                  settings.detail_level === l.value
                    ? "bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-500/5"
                    : "bg-secondary/20 border-border hover:bg-secondary/30 text-muted-foreground"
                )}
              >
                <span className="font-bold text-xs leading-none text-white">{l.label}</span>
                <span className="text-[9px] text-muted-foreground mt-1 leading-normal font-medium">
                  {l.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Provider & Model */}
        <div className="border-t border-border/60 pt-4 grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              AI Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as AIProvider)}
              className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-all cursor-pointer"
            >
              {providers.map((p) => (
                <option key={p.value} value={p.value} className="bg-card text-white">
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              AI Model
            </label>
            {modelsLoading ? (
              <div className="w-full bg-secondary/10 border border-border rounded-xl py-2 px-3 text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                <span>Loading models...</span>
              </div>
            ) : models.length > 0 ? (
              <select
                value={settings.model}
                onChange={(e) => handleFieldChange("model", e.target.value)}
                className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-all cursor-pointer font-mono"
              >
                {models.map((m) => (
                  <option key={m.name} value={m.name} className="bg-card text-white">
                    {m.name} {m.size ? `(${m.size})` : ""}
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full bg-red-500/5 border border-red-500/20 rounded-xl py-2 px-3 text-xs text-red-400 font-medium">
                No model found
              </div>
            )}
          </div>
        </div>

        {/* Warning if Ollama is selected but offline */}
        {provider === "ollama" && !modelsLoading && models.length === 0 && (
          <div className="p-3 bg-amber-500/5 border border-amber-500/25 text-amber-400/90 rounded-xl text-[10.5px] leading-relaxed font-semibold">
            ⚠️ Ollama lokal tidak terdeteksi atau tidak memiliki model yang siap. Silakan jalankan Ollama di server lokal Anda atau beralih ke provider API DeepSeek/OpenAI.
          </div>
        )}
      </div>

      {/* Submit Generate Button */}
      <div className="pt-4 border-t border-border/60 mt-4">
        <button
          type="button"
          disabled={disabled || loading || (provider === "ollama" && models.length === 0)}
          onClick={onSubmit}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-secondary/60 disabled:to-secondary/60 disabled:text-muted-foreground border border-white/5 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-white animate-pulse-glow" />
              <span>Generate Dokumentasi</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
