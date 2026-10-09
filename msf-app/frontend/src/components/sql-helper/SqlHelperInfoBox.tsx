"use client";

import { useState, useEffect } from "react";
import { Info, X } from "lucide-react";

const STORAGE_KEY = "msfdb:sqlhelper:v1:infoDismissed";

export default function SqlHelperInfoBox() {
  const [dismissed, setDismissed] = useState(true); // default true to avoid layout shift

  useEffect(() => {
    try {
      const isDismissed = localStorage.getItem(STORAGE_KEY) === "true";
      setDismissed(isDismissed);
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore localStorage errors in private mode
    }
  };

  if (dismissed) return null;

  return (
    <div className="bg-teal-500/10 border border-teal-500/20 border-l-4 border-l-accent rounded-xl p-3.5 flex items-start justify-between gap-3 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="p-1 rounded-lg bg-teal-500/15 text-accent shrink-0 mt-0.5">
          <Info className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-teal-900 dark:text-teal-300 tracking-tight">
            DBA Diagnostic & Optimization Reference
          </h3>
          <p className="text-xs text-teal-800/80 dark:text-teal-400/80 mt-0.5 leading-relaxed">
            Kumpulan kueri SQL siap pakai untuk menganalisis bloat tabel, memantau lock & koneksi, serta audit performa database tanpa dependensi backend.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="p-1 text-teal-700/70 hover:text-teal-950 dark:text-teal-400/70 dark:hover:text-teal-200 rounded-md hover:bg-teal-500/10 transition-colors shrink-0"
        title="Tutup informasi"
        aria-label="Tutup box panduan"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

