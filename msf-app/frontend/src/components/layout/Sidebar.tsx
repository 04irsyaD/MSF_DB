"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, FileText, Settings, Sparkles, Terminal, Activity, X } from "lucide-react";
import useSWR from "swr";
import { swrFetcher } from "@/lib/api";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Check health status to display live indicators
  const { data: health } = useSWR("/api/health", swrFetcher, {
    refreshInterval: 15000, // Sync to 15s to match Header and deduplicate
    errorRetryCount: 2,
  });

  const isOllamaUp = health?.services?.ollama === "up";
  const ollamaModel = health?.services?.ollama_model || "None";

  const menuItems = [
    {
      label: "AI Generator",
      href: "/generate",
      icon: Sparkles,
      description: "DDL & Live DB Docs",
    },
    {
      label: "SQL Shortcuts",
      href: "/shortcuts",
      icon: Terminal,
      description: "DBA & Optimizations",
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      description: "AI & Connection Config",
    },
  ];

  return (
    <>
      {/* Backdrop overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 w-64 border-r border-border bg-card/90 lg:bg-card/60 backdrop-blur-md flex flex-col min-h-screen shrink-0 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-20",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Brand Logo & Mobile Close Button */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent tracking-wide">
                MSF_DB
              </span>
              <span className="text-[10px] block font-medium text-indigo-400/80 -mt-1 uppercase tracking-widest">
                v2.0 Backend Core
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-secondary/50 border border-border lg:hidden text-muted-foreground hover:text-foreground"
            title="Tutup Menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href) || (item.href === "/generate" && pathname === "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40 border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-105",
                  isActive ? "text-indigo-400" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm leading-tight">{item.label}</span>
                <span className="text-[10px] text-muted-foreground/60 font-medium group-hover:text-muted-foreground/80 transition-colors">
                  {item.description}
                </span>
              </div>
              
              {/* Highlight line on active item */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-500 rounded-r" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Status Panel (Bottom) */}
      <div className="p-4 border-t border-border bg-secondary/10 flex flex-col gap-3">
        {/* API Server status */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-3.5 w-3.5" />
            <span>API Server</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold">
            <span className={cn(
              "h-1.5 w-1.5 rounded-full animate-pulse",
              health ? "bg-emerald-500" : "bg-red-500"
            )} />
            <span className={health ? "text-emerald-400" : "text-red-400"}>
              {health ? "Connected" : "Offline"}
            </span>
          </div>
        </div>

        {/* Ollama Status */}
        <div className="flex flex-col gap-1.5 bg-black/30 p-2.5 rounded-lg border border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground text-[11px]">Local Ollama</span>
            <span
              className={cn(
                "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                isOllamaUp
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              )}
            >
              {isOllamaUp ? "Active" : "Offline"}
            </span>
          </div>
          {isOllamaUp && (
            <div className="text-[10px] text-muted-foreground flex justify-between items-center">
              <span>Active Model:</span>
              <span className="font-mono text-indigo-300 font-medium truncate max-w-[100px]" title={ollamaModel}>
                {ollamaModel}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
);
}
