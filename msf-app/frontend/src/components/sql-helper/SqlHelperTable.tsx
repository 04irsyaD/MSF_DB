"use client";

import { useState, useEffect } from "react";
import { ShortcutItem } from "@/lib/types";
import { Copy, Check, ChevronRight, SearchX, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/clipboard";

interface SqlHelperTableProps {
  shortcuts: ShortcutItem[];
  onSelect: (shortcut: ShortcutItem) => void;
}

export default function SqlHelperTable({
  shortcuts,
  onSelect,
}: SqlHelperTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Automatically reset to page 1 when filtered list changes
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

  const handleCopy = async (e: React.MouseEvent, shortcut: ShortcutItem) => {
    e.stopPropagation();
    const ok = await copyToClipboard(shortcut.sql);
    if (ok) {
      setCopiedId(shortcut.id);
      toast.success(`Query "${shortcut.title}" copied to clipboard!`);
      setTimeout(() => {
        setCopiedId((prev) => (prev === shortcut.id ? null : prev));
      }, 2000);
    } else {
      toast.error("Failed to copy query to clipboard");
    }
  };

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
          <SearchX className="h-6 w-6" aria-hidden="true" />
        </div>
        <h4 className="text-sm font-bold text-foreground">
          No Matching Scripts Found
        </h4>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Try adjusting your search terms or resetting the DB engine, category, or risk level filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
              <th className="py-3 px-4">Script Name & Purpose</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Engine</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {paginatedShortcuts.map((shortcut) => {
              const risk = getRiskBadge(shortcut.risk_level);
              const isCopied = copiedId === shortcut.id;

              return (
                <tr
                  key={shortcut.id}
                  onClick={() => onSelect(shortcut)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(shortcut);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for script: ${shortcut.title}`}
                  className="hover:bg-muted/40 focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent transition-colors duration-100 cursor-pointer group"
                >
                  {/* Script Name & Description */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1 max-w-md lg:max-w-xl">
                      <div className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors">
                        <span className="truncate">{shortcut.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
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

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleCopy(e, shortcut)}
                        title="Copy SQL Query"
                        aria-label={`Copy query for ${shortcut.title}`}
                        className={`py-1 px-2.5 rounded-lg border text-xs font-mono font-bold transition-all inline-flex items-center gap-1 cursor-pointer shadow-xs ${
                          isCopied
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                            : "bg-card hover:bg-muted border-border text-foreground hover:border-accent/50"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>COPIED</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                            <span>COPY</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(shortcut);
                        }}
                        title="View Query Details"
                        aria-label={`View details for ${shortcut.title}`}
                        className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar (Fixed Footer) */}
      <div className="border-t border-border px-4 py-3 bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Left Side: Page Size & Summary */}
        <div className="flex items-center gap-3 text-muted-foreground font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px]">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="py-1 px-2 bg-card border border-border rounded-md text-[11px] font-bold text-foreground focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value={10} className="bg-card text-foreground">10</option>
              <option value={20} className="bg-card text-foreground">20</option>
              <option value={50} className="bg-card text-foreground">50</option>
            </select>
          </div>
          <span className="hidden sm:inline text-border">|</span>
          <span className="text-[11px]">
            Showing <span className="font-bold text-foreground">{displayFrom}–{displayTo}</span> of <span className="font-bold text-foreground">{shortcuts.length}</span> scripts
          </span>
        </div>

        {/* Right Side: Page Controls */}
        <div className="flex items-center gap-1 font-mono">
          <button
            type="button"
            disabled={safeCurrentPage <= 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="p-1.5 rounded-md border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Previous Page"
            aria-label="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page Number Badges */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
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
            title="Next Page"
            aria-label="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

