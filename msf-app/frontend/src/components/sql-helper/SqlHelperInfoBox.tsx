"use client";

import { Info } from "lucide-react";

export default function SqlHelperInfoBox() {
  return (
    <div className="bg-[#e0f7fa]/70 border border-teal-100 border-l-4 border-l-[#00bfa5] rounded-xl p-4 flex items-start gap-3 shadow-sm">
      <div className="p-1 rounded-lg bg-teal-100/50 text-[#00bfa5] shrink-0 mt-0.5">
        <Info className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-[#00695c] tracking-tight">
          Diagnostic & Administration Scripts
        </h3>
        <p className="text-xs text-[#00796b] mt-0.5 leading-relaxed">
          Gunakan skrip kueri siap pakai ini untuk menganalisis ukuran tabel, mendeteksi bloat indeks, memantau koneksi & lock aktif, serta mengoptimalkan konfigurasi database secara langsung.
        </p>
      </div>
    </div>
  );
}
