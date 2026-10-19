"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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
  estimateTime = "Coming Soon",
  storageKey = "msf_maintenance_notice",
}: MaintenanceModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Cek apakah sudah pernah ditutup dalam sesi browser ini
    let isDismissed: string | null = null;
    try {
      isDismissed = sessionStorage.getItem(storageKey);
    } catch {
      // sessionStorage diblokir: tampilkan modal seperti sesi baru
    }
    if (!isDismissed) {
      setIsOpen(true);
    }
  }, [storageKey]);

  const handleClose = useCallback(() => {
    try {
      sessionStorage.setItem(storageKey, "true");
    } catch {
      // abaikan: modal tetap tertutup untuk halaman ini
    }
    setIsOpen(false);
  }, [storageKey]);

  // Listener tombol Escape untuk menutup modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Modal Overlay & Card (hanya di area konten, tidak menutupi sidebar) */}
      {isOpen && (
        <div className="fixed inset-0 lg:left-64 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-card border border-border w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
            {/* Close Icon Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Tutup Pengumuman"
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
              <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {description}
              </p>
            </div>

            {/* Estimate Badge */}
            {estimateTime && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold">
                <Clock className="h-3.5 w-3.5 text-emerald-500 animate-spin-slow" />
                <span>ESTIMASI SELESAI: {estimateTime}</span>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 px-4 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer"
              >
                Saya Mengerti (Preview UI)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Info Pill saat modal tertutup */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-40 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Ringkas (ikon saja) agar tidak menutupi konten; teks muncul saat hover/fokus */}
          <button
            type="button"
            onClick={handleOpen}
            aria-label="Mode Maintenance - lihat info"
            title="Mode Maintenance"
            className="group flex items-center gap-2 px-2.5 py-2 bg-card/95 hover:bg-card text-foreground border border-border rounded-full shadow-lg text-xs font-mono font-semibold backdrop-blur-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <Info className="h-3.5 w-3.5 text-amber-500" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap transition-[max-width] duration-200 group-hover:max-w-[10rem] group-focus-visible:max-w-[10rem]">
              Mode Maintenance
            </span>
          </button>
        </div>
      )}
    </>,
    document.body
  );
}
