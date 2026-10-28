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
  const { data: health, error, mutate } = useSWR("/api/health", swrFetcher, {
    refreshInterval: 10000,
    shouldRetryOnError: true,
  });

  const isBackendDown = !health && !!error;

  // Landing page: render tanpa sidebar/header
  if (pathname === "/") {
    return <>{children}</>;
  }

  // Admin page: standalone fullscreen console layout (bypass offline overlay)
  if (pathname === "/admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-mono">
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    );
  }

  // Secure and generic maintenance overlay for end-users
  if (isBackendDown) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-6 font-mono">
        <div className="max-w-md w-full bg-white border border-border rounded-3xl p-8 text-center space-y-6 shadow-xl animate-fade-in">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
            <Hammer className="h-7 w-7 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
              SISTEM SEDANG PEMELIHARAAN
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[280px] mx-auto uppercase">
              Kami sedang melakukan pemeliharaan rutin untuk meningkatkan kualitas layanan. Silakan coba hubungkan kembali beberapa saat lagi.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => mutate()}
              className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-white text-xs font-bold rounded-xl transition-all shadow-sm uppercase mx-auto"
            >
              Coba Hubungkan Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
