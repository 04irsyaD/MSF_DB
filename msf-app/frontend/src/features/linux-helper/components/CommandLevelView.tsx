"use client";

import { useEffect, useMemo, useState } from "react";
import { commandsByLevel, commandCategories } from "../data";
import { searchCommandsWithFuse } from "../lib/search";
import CommandCard from "./CommandCard";
import CommandDrawer from "./CommandDrawer";
import CategoryChips from "./CategoryChips";
import Pagination from "./Pagination";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";
import type { Level, Distro } from "../lib/schema";

interface CommandLevelViewProps {
  level: Exclude<Level, "0" | "3">;
  distro: Distro;
  search: string;
}

const PAGE_SIZE = 6;

export default function CommandLevelView({ level, distro, search }: CommandLevelViewProps) {
  const [category, setCategory] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const categories = useMemo(() => commandCategories(level), [level]);

  // Kategori yang aktif tidak lagi ada saat pindah level -> reset.
  useEffect(() => {
    setCategory(null);
  }, [level]);

  const filtered = useMemo(() => {
    const base = commandsByLevel(level).filter((c) => !category || c.category === category);
    return searchCommandsWithFuse(base, search);
  }, [level, category, search]);

  useEffect(() => {
    setPage(1);
  }, [level, category, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const selectedCommand = useMemo(
    () => filtered.find((c) => c.id === selectedId) ?? null,
    [filtered, selectedId]
  );

  return (
    <div className="space-y-5">
      {categories.length > 1 && (
        <CategoryChips categories={categories} active={category} onSelect={setCategory} />
      )}

      {filtered.length > 0 ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {paged.map((c) => (
              <CommandCard
                key={c.id}
                command={c}
                distro={distro}
                onSelect={() => setSelectedId(c.id)}
              />
            ))}
          </div>
          <Pagination page={safePage} pageCount={pageCount} onPage={setPage} />
        </>
      ) : (
        <p className="py-10 text-center text-sm text-muted-foreground">{L.empty.filtered}</p>
      )}

      <CommandDrawer
        command={selectedCommand}
        distro={distro}
        isOpen={selectedCommand !== null}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
