"use client";

import { useEffect, useState, useRef } from "react";
import { GeneratorSettings, AIProvider, OutputLanguage, DetailLevel, ExportFormat } from "@/lib/types";
import { useAIModels } from "@/hooks/useOllamaModels";
import { Sparkles, FileText, Loader2, Search, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneratePanelProps {
  settings: GeneratorSettings;
  onChange: (settings: GeneratorSettings) => void;
  onSubmit: () => void;
  disabled: boolean;
  loading: boolean;
  trackJob?: (code: string) => Promise<any>;
  inputCode?: string;
  onInputCodeChange?: (code: string) => void;
}

export default function GeneratePanel({
  settings,
  onChange,
  onSubmit,
  disabled,
  loading,
  trackJob,
  inputCode = "",
  onInputCodeChange,
}: GeneratePanelProps) {
  const [provider, setProvider] = useState<AIProvider>(settings.ai_provider);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

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
    { label: "Simple", value: "simple", desc: "Metadata & deskripsi" },
    { label: "Detailed", value: "detailed", desc: "Penjelasan relasi" },
    { label: "Comprehensive", value: "comprehensive", desc: "Analisis bisnis" },
  ];

  return (
    <div className="flex flex-col h-full bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Scrollable config area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div>
          <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest mb-0.5">
            AI & DOCUMENTATION CONFIG
          </h3>
          <p className="text-xs text-muted-foreground leading-normal">
            Configure output details, business context, and AI LLM configurations.
          </p>
        </div>

        {/* AI Provider & Model (Esenisal - Top) */}
        <div className="grid grid-cols-2 gap-4 pb-2 border-b border-border/50">
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
              className="w-full bg-white border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2 px-3 text-xs text-gray-900 focus:outline-none transition-colors duration-150 font-mono cursor-pointer font-bold"
            >
              {providers.map((p) => (
                <option key={p.value} value={p.value} className="bg-white text-gray-900">
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
              <div className="w-full bg-gray-50 border border-border rounded-xl py-2 px-3 text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                <span className="font-mono">LOADING...</span>
              </div>
            ) : models.length > 0 ? (
              <select
                value={settings.model}
                onChange={(e) => handleFieldChange("model", e.target.value)}
                className="w-full bg-white border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2 px-3 text-xs text-gray-900 focus:outline-none transition-colors duration-150 font-mono cursor-pointer font-bold"
              >
                {models.map((m) => (
                  <option key={m.name} value={m.name} className="bg-white text-gray-900">
                    {m.name.toUpperCase()} {m.size ? `(${m.size})` : ""}
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full bg-red-50 border border-red-200 rounded-xl py-2 px-3 text-xs text-red-600 font-mono font-bold">
                NO MODEL FOUND
              </div>
            )}
          </div>
        </div>

        {/* Language & Format */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
              OUTPUT LANGUAGE
            </label>
            <div className="flex bg-gray-50 border border-border rounded-xl p-0.5">
              {languages.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => handleFieldChange("language", l.value)}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-colors duration-150",
                    settings.language === l.value
                      ? "bg-white text-accent shadow-sm border border-gray-200/55"
                      : "text-muted-foreground hover:text-gray-900"
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
            <div className="flex bg-gray-50 border border-border rounded-xl p-0.5">
              {(["docx", "pdf"] as ExportFormat[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => handleFieldChange("output_format", f)}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-[11px] font-mono font-semibold uppercase transition-colors duration-150",
                    settings.output_format === f
                      ? "bg-white text-accent shadow-sm border border-gray-200/55"
                      : "text-muted-foreground hover:text-gray-900"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Options Section */}
        <div className="border-t border-border/60 pt-3">
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center justify-between w-full py-1.5 text-[10px] font-mono font-bold text-gray-500 hover:text-accent transition-colors uppercase tracking-wider"
          >
            <span>Opsi Lanjutan (Opsional)</span>
            {isAdvancedOpen ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          {isAdvancedOpen && (
            <div className="space-y-4 pt-3 border-t border-dashed border-border/80 mt-2 animate-fade-in">
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
                    className="w-full bg-gray-50/50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2 px-3 text-xs text-gray-900 focus:outline-none transition-colors duration-150 font-mono"
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
                    className="w-full bg-gray-50/50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2 px-3 text-xs text-gray-900 focus:outline-none transition-colors duration-150 font-mono"
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
                  placeholder="Sistem e-commerce B2B dengan fitur multi-vendor..."
                  className="w-full bg-gray-50/50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2 px-3 text-xs text-gray-900 focus:outline-none transition-colors duration-150 font-mono resize-none leading-relaxed"
                />
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
                        "p-2.5 rounded-xl border text-left flex flex-col transition-colors duration-150",
                        settings.detail_level === l.value
                          ? "bg-emerald-50/50 border-accent text-accent"
                          : "bg-gray-50 border-border hover:border-accent/40 text-muted-foreground"
                      )}
                    >
                      <span className={cn(
                        "font-mono font-bold text-[10px] leading-none",
                        settings.detail_level === l.value ? "text-accent" : "text-gray-900"
                      )}>
                        {l.label.toUpperCase()}
                      </span>
                      <span className="text-[9px] text-muted-foreground mt-1 leading-normal font-medium">
                        {l.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Warning if Ollama is selected but offline */}
        {provider === "ollama" && !modelsLoading && models.length === 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-[10.5px] leading-relaxed font-mono font-semibold">
            OLLAMA TIDAK TERDETEKSI. JALANKAN OLLAMA DI LOKAL ATAU GUNAKAN DEEPSEEK/OPENAI.
          </div>
        )}
      </div>

      {/* Sticky bottom: Job Tracker + Generate button */}
      <div className="shrink-0 border-t border-border p-4 space-y-3 bg-white">
        {/* Job Tracker */}
        {trackJob && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-gray-700 uppercase tracking-widest">Lacak Job Aktif</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MSF-A1B2C3D4..."
                value={inputCode}
                onChange={(e) => onInputCodeChange?.(e.target.value)}
                className="flex-1 bg-gray-50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-1.5 px-3 text-xs text-gray-900 placeholder-muted-foreground/40 focus:outline-none transition-colors duration-150 font-mono tracking-wider uppercase"
              />
              <button
                type="button"
                onClick={() => trackJob(inputCode).then(() => onInputCodeChange?.(""))}
                className="px-3 py-1.5 bg-gray-100 hover:bg-accent hover:text-white text-gray-600 text-xs font-bold rounded-xl transition-all shadow-sm uppercase shrink-0 font-mono flex items-center gap-1"
              >
                <Search className="h-3 w-3" />
                <span>Lacak</span>
              </button>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          type="button"
          disabled={disabled || loading || (provider === "ollama" && models.length === 0)}
          onClick={onSubmit}
          className="w-full py-3 px-4 rounded-xl bg-accent text-white hover:bg-accent/90 font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-muted-foreground border border-transparent shadow-sm active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>PROSES...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-white animate-pulse" />
              <span>GENERATE DOKUMENTASI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
