"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Mail, Phone, X } from "lucide-react";

export default function UnderConstructionModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah pernah menutup modal ini sebelumnya
    const isClosed = localStorage.getItem("msf_under_construction_closed");
    if (!isClosed) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("msf_under_construction_closed", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md font-mono animate-fade-in">
      <div className="bg-white border border-border w-full max-w-md rounded-2xl shadow-card-lg overflow-hidden relative animate-fade-in-up">
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-gray-50 text-muted-foreground hover:text-gray-900 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 animate-bounce">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
              UNDER CONSTRUCTION / IN DEVELOPMENT
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Selamat datang di **MSF-DB**! Platform dokumentasi database otomatis ini masih dalam tahap pengembangan aktif dan uji coba.
            </p>
          </div>

          <div className="bg-gray-50 border-l-2 border-accent p-4 rounded-r-xl space-y-3">
            <p className="text-[10px] text-gray-700 leading-relaxed">
              Jika Anda menemukan bug, memiliki saran perbaikan, atau ingin berkolaborasi, silakan hubungi tim pengembang kami:
            </p>
            
            <div className="space-y-2 text-[10px] font-bold text-gray-800">
              <a 
                href="mailto:support@msf-db.my.id" 
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-accent" />
                <span>support@msf-db.my.id</span>
              </a>
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-accent" />
                <span>+62 812-3456-7890</span>
              </a>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-2.5 bg-accent hover:bg-accent/90 text-white text-xs font-bold rounded-xl transition-all shadow-sm uppercase tracking-wider"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
