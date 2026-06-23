"use client";

import { useEffect, useState, useRef } from "react";
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

  // Ref untuk akses settings terbaru tanpa trigger re-render / infinite loop
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Set default model once models load or provider changes
  // Menggunakan settingsRef (bukan settings di deps) untuk menghindari infinite loop
  useEffect(() => {
    const currentSettings = settingsRef.current;
    if (models.length > 0) {
      const modelNames = models.map(m => m.name);
      if (!modelNames.includes(currentSettings.model)) {
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

        onChange({
          ...currentSettings,
          model: defaultModel,
        });
      }
    } else {
      if (currentSettings.model !== "") {
        onChange({
          ...currentSettings,
          model: "",
        });
      }
    }
  }, [models, provider]); // Hapus settings dan onChange dari deps — pakai settingsRef

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
    <div className="space-y-6 bg-card border border-border p-6 rounded-[4px] flex flex-col h-full justify-between">
      <div className="space-y-5">
        <div>
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest mb-1">
            AI & DOCUMENTATION CONFIG
          </h3>
          <p className="text-xs text-muted-foreground leading-normal">
            Configure output details, business context, and AI LLM configurations.
          </p>
        </div>

        {/* Project Metadata */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
              PROJECT NAME
            </label>
            <input
              type="text"
              value={settings.project_name}
              onChange={(e) => handleFieldChange("project_name", e.target.value)}
              placeholder="E-Commerce DB"
              className="w-full bg-secondary/15 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2.5 px-3.5 text-xs text-white focus:outline-none transition-colors duration-150 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
              AUTHOR
            </label>
            <input
              type="text"
              value={settings.author}
              onChange={(e) => handleFieldChange("author", e.target.value)}
              placeholder="Developer"
              className="w-full bg-secondary/15 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2.5 px-3.5 text-xs text-white focus:outline-none transition-colors duration-150 font-mono"
            />
          </div>
        </div>

        {/* Business Context */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
            BUSINESS CONTEXT & DESCRIPTION
          </label>
          <textarea
            value={settings.business_context}
            onChange={(e) => handleFieldChange("business_context", e.target.value)}
            rows={2}
            placeholder="Sistem e-commerce B2B dengan fitur multi-vendor, payment gateway, dan inventory management..."
            className="w-full bg-secondary/15 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2 px-3 text-xs text-white focus:outline-none transition-colors duration-150 font-mono resize-none leading-relaxed"
          />
        </div>

        {/* Language & Detail */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
              OUTPUT LANGUAGE
            </label>
            <div className="flex bg-secondary/20 border border-border rounded-[4px] p-0.5">
              {languages.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => handleFieldChange("language", l.value)}
                  className={cn(
                    "flex-1 py-1.5 rounded-[2px] text-[11px] font-mono font-semibold transition-colors duration-150",
                    settings.language === l.value
                      ? "bg-accent/15 text-accent border border-accent/20"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {l.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
              FILE FORMAT
            </label>
            <div className="flex bg-secondary/20 border border-border rounded-[4px] p-0.5">
              {(["docx", "pdf"] as ExportFormat[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => handleFieldChange("output_format", f)}
                  className={cn(
                    "flex-1 py-1.5 rounded-[2px] text-[11px] font-mono font-semibold uppercase transition-colors duration-150",
                    settings.output_format === f
                      ? "bg-accent/15 text-accent border border-accent/20"
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
          <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
            DETAIL LEVEL
          </label>
          <div className="grid grid-cols-3 gap-2">
            {levels.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => handleFieldChange("detail_level", l.value)}
                className={cn(
                  "p-2.5 rounded-[4px] border text-left flex flex-col transition-colors duration-150",
                  settings.detail_level === l.value
                    ? "bg-accent/10 border-accent text-accent"
                    : "bg-secondary/20 border-border hover:border-accent/40 text-muted-foreground"
                )}
              >
                <span className="font-mono font-bold text-xs leading-none text-white">{l.label.toUpperCase()}</span>
                <span className="text-[9px] text-muted-foreground mt-1 leading-normal font-medium">
                  {l.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Provider & Model */}
        <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
              AI PROVIDER
            </label>
            <select
              value={provider}
              onChange={(e) => {
                const newProvider = e.target.value as AIProvider;
                setProvider(newProvider);
                onChange({
                  ...settings,
                  ai_provider: newProvider,
                });
              }}
              className="w-full bg-[#0D1117] border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2 px-3 text-xs text-white focus:outline-none transition-colors duration-150 font-mono cursor-pointer"
            >
              {providers.map((p) => (
                <option key={p.value} value={p.value} className="bg-[#0D1117] text-white">
                  {p.label.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
              AI MODEL
            </label>
            {modelsLoading ? (
              <div className="w-full bg-secondary/10 border border-border rounded-[4px] py-2 px-3 text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                <span className="font-mono">LOADING...</span>
              </div>
            ) : models.length > 0 ? (
              <select
                value={settings.model}
                onChange={(e) => handleFieldChange("model", e.target.value)}
                className="w-full bg-[#0D1117] border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2 px-3 text-xs text-white focus:outline-none transition-colors duration-150 font-mono cursor-pointer"
              >
                {models.map((m) => (
                  <option key={m.name} value={m.name} className="bg-[#0D1117] text-white">
                    {m.name.toUpperCase()} {m.size ? `(${m.size})` : ""}
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full bg-red-500/5 border border-red-500/20 rounded-[4px] py-2 px-3 text-xs text-red-400 font-mono font-bold">
                NO MODEL FOUND
              </div>
            )}
          </div>
        </div>

        {/* Warning if Ollama is selected but offline */}
        {provider === "ollama" && !modelsLoading && models.length === 0 && (
          <div className="p-3 bg-amber-500/5 border border-amber-500/25 text-amber-400/90 rounded-[4px] text-[10.5px] leading-relaxed font-mono font-semibold">
            ⚠️ OLLAMA LOKAL TIDAK TERDETEKSI ATAU TIDAK MEMILIKI MODEL YANG SIAP. SILAKAN JALANKAN OLLAMA DI SERVER LOKAL ANDA ATAU BERALIH KE PROVIDER API DEEPSEEK/OPENAI.
          </div>
        )}
      </div>

      {/* Submit Generate Button */}
      <div className="pt-4 border-t border-border mt-4">
        <button
          type="button"
          disabled={disabled || loading || (provider === "ollama" && models.length === 0)}
          onClick={onSubmit}
          className="w-full py-3 px-4 rounded-[4px] bg-accent text-black hover:bg-accent/90 font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-secondary/60 disabled:text-muted-foreground border border-transparent active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-black" />
              <span>PROSES...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-black animate-pulse" />
              <span>GENERATE DOKUMENTASI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
