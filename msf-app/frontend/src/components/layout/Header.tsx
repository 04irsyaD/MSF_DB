"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, Sparkles, Terminal, Settings, Cpu, Menu, Layers } from "lucide-react";
import useSWR from "swr";
import { swrFetcher } from "@/lib/api";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();

  const getPageInfo = () => {
    if (pathname.startsWith("/dashboard")) return { title: "Dashboard", desc: "Ringkasan aktivitas dan riwayat dokumentasi", icon: LayoutDashboard };
    if (pathname.startsWith("/shortcuts")) return { title: "Shortcuts", desc: "Skrip database siap pakai untuk DBA dan optimasi", icon: Terminal };
    if (pathname.startsWith("/settings")) return { title: "Pengaturan", desc: "Konfigurasi AI provider, model, dan koneksi", icon: Settings };
    if (pathname.startsWith("/diagram")) return { title: "Diagram", desc: "Visualisasi skema dan relasi antartabel database", icon: Layers };
    return { title: "Generator", desc: "Buat dokumentasi dari DDL SQL atau koneksi database langsung", icon: Sparkles };
  };

  const { title, desc, icon: Icon } = getPageInfo();

  const { data: health } = useSWR("/api/health", swrFetcher, { refreshInterval: 15000 });

  return (
    <header className="h-16 border-b border-border bg-sidebar flex items-center justify-between px-6 z-20 shrink-0 sticky top-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground lg:hidden transition-colors"
          title="Buka Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="p-2 rounded-lg bg-accent/10">
          <Icon className="h-4 w-4 text-accent" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground leading-tight">{title}</h1>
          <p className="text-[11px] text-muted-foreground hidden sm:block">{desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {health?.services && (
          <div className={cn(
            "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium border",
            health.services.ollama === "up"
              ? "bg-accent/10 text-accent border-accent/20"
              : "bg-amber-50 text-amber-600 border-amber-200"
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", health.services.ollama === "up" ? "bg-accent pulse-dot" : "bg-amber-400")} />
            <Cpu className="h-3 w-3" />
            <span>{health.services.ollama_model ? health.services.ollama_model.split(":")[0] : "Ollama Offline"}</span>
          </div>
        )}
      </div>
    </header>
  );
}
