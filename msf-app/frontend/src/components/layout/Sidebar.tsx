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
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-150"
          onClick={onClose}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 w-64 border-r border-border bg-card flex flex-col h-screen shrink-0 z-50 transition-transform duration-150 lg:sticky lg:top-0 lg:translate-x-0 lg:z-20",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Brand Logo & Mobile Close Button */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="font-mono font-bold text-base tracking-widest text-white border-b border-accent/40 pb-0.5 inline-block">
              MSF_DB
            </span>
            <span className="font-mono text-[9px] block text-accent/80 uppercase tracking-wider">
              SYSINSTRUMENT v2.0
            </span>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-1 rounded bg-secondary/50 border border-border lg:hidden text-muted-foreground hover:text-foreground"
            title="Tutup Menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href) || (item.href === "/generate" && pathname === "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-[4px] group relative transition-all duration-150 border-l-[3px]",
                  isActive
                    ? "border-accent bg-transparent text-white font-medium"
                    : "border-transparent text-muted-foreground hover:text-white hover:border-border"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-150",
                    isActive ? "text-accent" : "text-muted-foreground group-hover:text-white"
                  )}
                />
                <div className="flex flex-col">
                  <span className="text-xs tracking-wide leading-tight">{item.label}</span>
                  <span className="text-[9px] text-muted-foreground font-light leading-none mt-0.5">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Thin rule separator */}
        <div className="h-[1px] bg-border mx-4 my-2" />

        {/* Status Panel (Bottom) */}
        <div className="p-4 flex flex-col gap-2.5 font-mono text-[10px]">
          {/* API Server status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Activity className="h-3 w-3" />
              <span>API_SERVER:</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={cn(
                "h-1.5 w-1.5 rounded-full",
                health ? "bg-accent tech-pulse-dot" : "bg-red-500"
              )} />
              <span className={health ? "text-accent font-semibold" : "text-red-500 font-semibold"}>
                {health ? "CONNECTED" : "OFFLINE"}
              </span>
            </div>
          </div>

          {/* Ollama Status */}
          <div className="flex flex-col gap-1 bg-black/40 p-2 border border-border rounded-[2px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">LOCAL_OLLAMA:</span>
              <span
                className={cn(
                  "px-1 py-0.5 rounded-[2px] text-[8px] font-bold tracking-wider uppercase border",
                  isOllamaUp
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                )}
              >
                {isOllamaUp ? "ACTIVE" : "OFFLINE"}
              </span>
            </div>
            {isOllamaUp && (
              <div className="text-[9px] text-muted-foreground flex justify-between items-center mt-0.5">
                <span>MODEL:</span>
                <span className="text-accent truncate max-w-[110px]" title={ollamaModel}>
                  {ollamaModel}
                </span>
              </div>
            )}
          </div>

          {/* Powered by */}
          <div className="text-center pt-2 border-t border-border/20 mt-1">
            <span className="text-[9px] text-muted-foreground/50 font-medium">
              Powered by <span className="text-accent font-semibold">MSF Team & Antigravity AI</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
