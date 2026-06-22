"use client";

import { usePathname } from "next/navigation";
import { Sparkles, Terminal, Settings, Database, Cpu, HelpCircle, Menu } from "lucide-react";
import useSWR from "swr";
import { swrFetcher } from "@/lib/api";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();

  const getPageInfo = () => {
    if (pathname.startsWith("/shortcuts")) {
      return {
        title: "SQL Shortcuts",
        desc: "Ready-to-use database diagnostics & analysis scripts",
        icon: Terminal,
      };
    }
    if (pathname.startsWith("/settings")) {
      return {
        title: "Settings",
        desc: "Configure AI providers, LLMs, and default metadata settings",
        icon: Settings,
      };
    }
    return {
      title: "AI Generator",
      desc: "Parse SQL DDL or connect live DB to generate documentations",
      icon: Sparkles,
    };
  };

  const { title, desc, icon: Icon } = getPageInfo();

  // Load API Health details for information
  const { data: health } = useSWR("/api/health", swrFetcher, {
    refreshInterval: 15000,
  });

  return (
    <header className="h-20 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
      {/* Title & Desc */}
      <div className="flex items-center gap-3">
        {/* Burger Button for Mobile */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg bg-secondary/50 border border-border lg:hidden text-muted-foreground hover:text-foreground mr-1"
          title="Buka Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="p-2 rounded-lg bg-secondary/50 border border-border">
          <Icon className="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-tight">{title}</h1>
          <p className="text-[11px] text-muted-foreground font-medium hidden sm:block">
            {desc}
          </p>
        </div>
      </div>

      {/* Stats/Badges right side */}
      <div className="flex items-center gap-4">
        {/* API Engine Status badge */}
        {health?.services && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30 border border-border text-[11px] font-medium text-muted-foreground">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI Status:</span>
            <span className="font-semibold text-white uppercase font-mono">
              {health.services.ollama_model || "ollama (offline)"}
            </span>
          </div>
        )}

        {/* Quick Help */}
        <button
          onClick={() => {
            window.open("https://github.com", "_blank");
          }}
          className="p-2 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border"
          title="Bantuan & Dokumentasi"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
