"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Sparkles, Terminal, Settings, Activity, X, Circle, ShieldAlert, Layers } from "lucide-react";
import useSWR from "swr";
import { swrFetcher } from "@/lib/api";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const { data: health } = useSWR("/api/health", swrFetcher, {
    refreshInterval: 15000,
    errorRetryCount: 2,
  });

  const isApiUp = !!health;
  const isOllamaUp = health?.services?.ollama === "up";
  const ollamaModel = health?.services?.ollama_model || null;

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Overview & statistik",
    },
    {
      label: "AI Generator",
      href: "/generate",
      icon: Sparkles,
      description: "Generate dokumentasi DB",
    },
    {
      label: "MSF Diagram",
      href: "/diagram",
      icon: Layers,
      description: "Visualisasi skema & relasi",
    },
    {
      label: "SQL Shortcuts",
      href: "/shortcuts",
      icon: Terminal,
      description: "Skrip DBA & optimasi",
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      description: "Konfigurasi AI & koneksi",
    },
    {
      label: "Admin Portal",
      href: "/admin",
      icon: ShieldAlert,
      description: "Log & kontrol sistem",
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-border flex flex-col h-screen shrink-0 z-50 transition-transform duration-200 lg:sticky lg:top-0 lg:translate-x-0 lg:z-20",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <span className="font-bold text-base text-foreground tracking-tight">MSF DB</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 block pl-9">v2.0 — AI Docs Platform</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {menuItems.map((item) => {
            const isActive =
              pathname.startsWith(item.href) ||
              (item.href === "/dashboard" && pathname === "/dashboard");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-all duration-150",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <div className="flex flex-col">
                  <span className={cn("text-sm font-medium leading-tight", isActive ? "text-accent" : "")}>
                    {item.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground leading-none mt-0.5 font-normal">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Status Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Activity className="h-3 w-3" />
              API Server
            </span>
            <div className="flex items-center gap-1.5">
              <span className={cn("w-1.5 h-1.5 rounded-full pulse-dot", isApiUp ? "bg-accent" : "bg-red-400")} />
              <span className={cn("text-[11px] font-semibold", isApiUp ? "text-accent" : "text-red-500")}>
                {isApiUp ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Circle className="h-3 w-3" />
              Ollama
            </span>
            <div className="flex items-center gap-1.5">
              <span className={cn("w-1.5 h-1.5 rounded-full", isOllamaUp ? "bg-accent pulse-dot" : "bg-amber-400")} />
              <span className={cn("text-[11px] font-semibold", isOllamaUp ? "text-accent" : "text-amber-500")}>
                {isOllamaUp ? (ollamaModel ? ollamaModel.split(":")[0] : "Active") : "Offline"}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-[10px] text-muted-foreground text-center">
              Powered by{" "}
              <span className="text-accent font-semibold">MSF Team</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
