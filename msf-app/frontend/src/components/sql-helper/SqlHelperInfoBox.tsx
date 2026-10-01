"use client";

import { Info } from "lucide-react";

export default function SqlHelperInfoBox() {
  return (
    <div className="bg-teal-500/10 border border-teal-500/20 border-l-4 border-l-accent rounded-xl p-4 flex items-start gap-3 shadow-xs">
      <div className="p-1 rounded-lg bg-teal-500/15 text-accent shrink-0 mt-0.5">
        <Info className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-teal-800 dark:text-teal-300 tracking-tight">
          Diagnostic & Administration Scripts
        </h3>
        <p className="text-xs text-teal-700/90 dark:text-teal-400/80 mt-0.5 leading-relaxed">
          Gunakan skrip kueri siap pakai ini untuk menganalisis ukuran tabel, mendeteksi bloat indeks, memantau koneksi & lock aktif, serta mengoptimalkan konfigurasi database secara langsung.
        </p>
      </div>
    </div>
  );
}
