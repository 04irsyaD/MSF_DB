"use client";

import { useState, useEffect } from "react";
import { ShortcutItem } from "@/lib/types";
import { Play, Code, SearchX, ChevronLeft, ChevronRight } from "lucide-react";

interface SqlHelperTableProps {
  shortcuts: ShortcutItem[];
  onSelect: (shortcut: ShortcutItem) => void;
}

export default function SqlHelperTable({
  shortcuts,
  onSelect,
}: SqlHelperTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Otomatis reset ke halaman 1 saat data hasil filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [shortcuts]);

  const totalPages = Math.ceil(shortcuts.length / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedShortcuts = shortcuts.slice(
    startIndex,
    startIndex + pageSize
  );

  const displayFrom = shortcuts.length === 0 ? 0 : startIndex + 1;
  const displayTo = Math.min(startIndex + pageSize, shortcuts.length);

  const getCategoryBadge = (category: string) => {
    switch (category.toLowerCase()) {
      case "diagnostic":
      case "monitoring":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "maintenance":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "performance":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "security":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getEngineBadge = (engine: string) => {
    switch (engine.toLowerCase()) {
      case "postgresql":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "mysql":
        return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20";
      case "oracle":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getRiskBadge = (level: string) => {
    const l = level.toLowerCase();
    if (l === "safe" || l === "read-only" || l === "low") {
      return {
        label: "LOW",
        classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      };
    }
    if (l === "caution" || l === "medium") {
      return {
        label: "MEDIUM",
        classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      };
    }
    return {
      label: "HIGH",
      classes: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    };
  };

  if (shortcuts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-10 sm:p-12 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
          <SearchX className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-bold text-foreground">
          Tidak Ada Skrip Kueri yang Cocok
        </h4>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Coba ubah kata kunci pencarian atau reset filter database engine dan kategori di atas.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
              <th className="py-3 px-4">Script Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Engine</th>
              <th className="py-3 px-4">Risk</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {paginatedShortcuts.map((shortcut) => {
              const risk = getRiskBadge(shortcut.risk_level);
              return (
                <tr
                  key={shortcut.id}
                  onClick={() => onSelect(shortcut)}
                  className="hover:bg-muted/50 transition-colors duration-100 cursor-pointer group"
                >
                  {/* Script Name & Description */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 max-w-md">
                      <div className="font-bold text-foreground group-hover:text-accent transition-colors flex items-center gap-2">
                        <Code className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="truncate">{shortcut.title}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {shortcut.description}
                      </p>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider ${getCategoryBadge(
                        shortcut.category
                      )}`}
                    >
                      {shortcut.category}
                    </span>
                  </td>

                  {/* Engine */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider ${getEngineBadge(
                        shortcut.engine
                      )}`}
                    >
                      {shortcut.engine}
                    </span>
                  </td>

                  {/* Risk */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider ${risk.classes}`}
                    >
                      {risk.label}
                    </span>
                  </td>

                  {/* Action Button */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(shortcut);
                      }}
                      title="Lihat & Salin Kueri"
                      className="p-1.5 rounded-lg text-accent hover:bg-accent/10 transition-colors inline-flex items-center gap-1 cursor-pointer font-mono text-xs font-bold"
                    >
                      <Play className="h-4 w-4 fill-accent" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar (Fixed Footer) */}
      <div className="border-t border-border px-4 py-3 bg-muted/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Left Side: Page Size & Summary */}
        <div className="flex items-center gap-3 text-muted-foreground font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px]">Tampilkan:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="py-1 px-2 bg-card border border-border rounded-md text-[11px] font-bold text-foreground focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value={5} className="bg-card text-foreground">5 baris</option>
              <option value={10} className="bg-card text-foreground">10 baris</option>
              <option value={20} className="bg-card text-foreground">20 baris</option>
            </select>
          </div>
          <span className="hidden sm:inline text-border">|</span>
          <span className="text-[11px]">
            Menampilkan <span className="font-bold text-foreground">{displayFrom}–{displayTo}</span> dari <span className="font-bold text-foreground">{shortcuts.length}</span> skrip
          </span>
        </div>

        {/* Right Side: Page Controls */}
        <div className="flex items-center gap-1 font-mono">
          <button
            type="button"
            disabled={safeCurrentPage <= 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="p-1.5 rounded-md border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page Number Badges */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              // Hanya tampilkan halaman terdekat jika total halaman banyak
              if (
                totalPages > 6 &&
                pageNum !== 1 &&
                pageNum !== totalPages &&
                Math.abs(pageNum - safeCurrentPage) > 1
              ) {
                if (pageNum === 2 || pageNum === totalPages - 1) {
                  return (
                    <span key={pageNum} className="px-1 text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return null;
              }

              const isActive = pageNum === safeCurrentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`min-w-[28px] h-7 px-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-accent text-accent-foreground shadow-xs"
                      : "bg-card border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={safeCurrentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="p-1.5 rounded-md border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Halaman Selanjutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
