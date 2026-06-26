"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { swrFetcher } from "@/lib/api";
import { Hammer } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Monitor backend health
  const { data: health, error } = useSWR("/api/health", swrFetcher, {
    refreshInterval: 10000,
    shouldRetryOnError: true,
  });

  const isBackendDown = !health && !!error;

  // Landing page: render tanpa sidebar/header
  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="flex w-full min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {isBackendDown && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between gap-4 animate-fade-in-up">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <Hammer className="h-4 w-4 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-bold text-red-900">Koneksi API Bermasalah / Under Construction</p>
                  <p className="text-[10px] text-red-600 mt-0.5">
                    Gagal terhubung ke backend API. Beberapa fitur pembuatan dokumen dan database tidak dapat digunakan saat ini.
                  </p>
                </div>
              </div>
              <div className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-red-100 text-red-700 border border-red-200 shrink-0 uppercase tracking-wider">
                Maintenance
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
