"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";

interface PaginationProps {
  page: number;
  pageCount: number;
  onPage: (page: number) => void;
}

function navClass(disabled: boolean) {
  return cn(
    "inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
    disabled
      ? "cursor-not-allowed text-muted-foreground/40"
      : "text-muted-foreground hover:text-foreground"
  );
}

/** Pagination minimal: Prev / indikator halaman / Next. Tidak dirender bila hanya 1 halaman. */
export default function Pagination({ page, pageCount, onPage }: PaginationProps) {
  if (pageCount <= 1) return null;

  const atStart = page <= 1;
  const atEnd = page >= pageCount;

  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onPage(page - 1)}
        disabled={atStart}
        aria-label={L.pagination.prev}
        className={navClass(atStart)}
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {L.pagination.prev}
      </button>

      <span className="text-xs tabular-nums text-muted-foreground" aria-live="polite">
        {page} {L.pagination.pageOf} {pageCount}
      </span>

      <button
        type="button"
        onClick={() => onPage(page + 1)}
        disabled={atEnd}
        aria-label={L.pagination.next}
        className={navClass(atEnd)}
      >
        {L.pagination.next}
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
