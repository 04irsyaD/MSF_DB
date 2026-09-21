"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Clock, Info, X } from "lucide-react";

interface MaintenanceModalProps {
  title?: string;
  description?: string;
  estimateTime?: string;
  storageKey?: string;
}

export default function MaintenanceModal({
  title = "Layanan AI Generator Sedang Maintenance",
  description = "Halo pengguna MSF DB, kami sedang melakukan pemeliharaan rutin pada modul ini untuk meningkatkan performa dan fitur. Harap sabar, kami akan segera kembali online!",
  estimateTime = "15 MENIT LAGI",
  storageKey = "msf_maintenance_notice",
}: MaintenanceModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Cek apakah sudah pernah ditutup dalam sesi browser ini
    const isDismissed = sessionStorage.getItem(storageKey);
    if (!isDismissed) {
      setIsOpen(true);
    }
  }, [storageKey]);

  const handleClose = () => {
    sessionStorage.setItem(storageKey, "true");
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Modal Overlay & Card (hanya di area konten, tidak menutupi sidebar) */}
      {isOpen && (
        <div className="fixed inset-0 lg:left-64 z-30 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white border border-border/80 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
            {/* Close Icon Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Tutup Pengumuman"
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Technician Illustration */}
            <div className="flex justify-center pt-2">
              <div className="relative w-44 h-28">
                <Image
                  src="/images/technician-avatar.png"
                  alt="Teknisi Server Sedang Pemeliharaan"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Title & Message */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                {title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                {description}
              </p>
            </div>

            {/* Estimate Badge */}
            {estimateTime && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 text-emerald-700 text-xs font-mono font-semibold">
                <Clock className="h-3.5 w-3.5 text-emerald-600 animate-spin-slow" />
                <span>ESTIMASI SELESAI: {estimateTime}</span>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer"
              >
                Saya Mengerti (Preview UI)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Info Pill saat modal tertutup */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            type="button"
            onClick={handleOpen}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/95 hover:bg-white text-gray-700 hover:text-gray-900 border border-border/80 rounded-full shadow-lg text-xs font-mono font-semibold backdrop-blur-sm transition-all hover:scale-105 cursor-pointer"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <Info className="h-3.5 w-3.5 text-amber-500" />
            <span>Mode Maintenance</span>
          </button>
        </div>
      )}
    </>
  );
}
