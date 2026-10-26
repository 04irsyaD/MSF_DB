"use client";

import { cn } from "@/lib/utils";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";

interface CategoryChipsProps {
  categories: string[];
  active: string | null;
  onSelect: (category: string | null) => void;
}

function chipClass(selected: boolean) {
  return cn(
    "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
    selected
      ? "border-accent bg-accent/10 text-accent"
      : "border-border bg-card text-muted-foreground hover:text-foreground"
  );
}

/** Chip filter kategori untuk Level 1 & 2. Chip "Semua" mengosongkan filter. */
export default function CategoryChips({ categories, active, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-pressed={active === null}
        className={chipClass(active === null)}
      >
        {L.filter.allCategories}
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          aria-pressed={active === cat}
          className={chipClass(active === cat)}
        >
          {L.categories[cat] ?? cat}
        </button>
      ))}
    </div>
  );
}
