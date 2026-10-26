"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useDebouncedValue } from "@/features/sql-helper/hooks/useDebouncedValue";
import type { Level, Env, Distro } from "../lib/schema";

const LEVELS: Level[] = ["0", "1", "2", "3"];
const ENVS: Env[] = ["desktop", "ssh"];
const DISTROS: Distro[] = ["ubuntu", "rhel"];

const DEFAULT_LEVEL: Level = "0";
const DEFAULT_DISTRO: Distro = "ubuntu";

export interface LinuxFiltersState {
  level: Level;
  setLevel: (level: Level) => void;
  envs: Env[];
  toggleEnv: (env: Env) => void;
  distro: Distro;
  setDistro: (distro: Distro) => void;
  search: string;
  setSearch: (val: string) => void;
  debouncedSearch: string;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export function useLinuxFilters(): LinuxFiltersState {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialLevel = useMemo<Level>(() => {
    const raw = searchParams.get("level");
    return raw && (LEVELS as string[]).includes(raw) ? (raw as Level) : DEFAULT_LEVEL;
  }, [searchParams]);

  const initialEnvs = useMemo<Env[]>(() => {
    const raw = searchParams.get("env");
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s): s is Env => (ENVS as string[]).includes(s));
  }, [searchParams]);

  const initialDistro = useMemo<Distro>(() => {
    const raw = searchParams.get("distro");
    return raw && (DISTROS as string[]).includes(raw) ? (raw as Distro) : DEFAULT_DISTRO;
  }, [searchParams]);

  const initialQ = searchParams.get("q") || "";

  const [level, setLevelState] = useState<Level>(initialLevel);
  const [envs, setEnvs] = useState<Env[]>(initialEnvs);
  const [distro, setDistroState] = useState<Distro>(initialDistro);
  const [search, setSearchState] = useState<string>(initialQ);
  const debouncedSearch = useDebouncedValue(search, 200);

  // Sync state → URL (replace, tidak menumpuk history).
  useEffect(() => {
    const sp = new URLSearchParams();
    if (level !== DEFAULT_LEVEL) sp.set("level", level);
    if (envs.length > 0) sp.set("env", envs.join(","));
    if (distro !== DEFAULT_DISTRO) sp.set("distro", distro);
    if (debouncedSearch.trim()) sp.set("q", debouncedSearch.trim());

    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [level, envs, distro, debouncedSearch, pathname, router]);

  const setLevel = useCallback((next: Level) => setLevelState(next), []);
  const setDistro = useCallback((next: Distro) => setDistroState(next), []);
  const setSearch = useCallback((val: string) => setSearchState(val), []);

  const toggleEnv = useCallback((env: Env) => {
    setEnvs((prev) =>
      prev.includes(env) ? prev.filter((e) => e !== env) : [...prev, env]
    );
  }, []);

  const resetFilters = useCallback(() => {
    setLevelState(DEFAULT_LEVEL);
    setEnvs([]);
    setDistroState(DEFAULT_DISTRO);
    setSearchState("");
  }, []);

  const hasActiveFilters = Boolean(
    level !== DEFAULT_LEVEL ||
      envs.length > 0 ||
      distro !== DEFAULT_DISTRO ||
      search.trim()
  );

  return {
    level,
    setLevel,
    envs,
    toggleEnv,
    distro,
    setDistro,
    search,
    setSearch,
    debouncedSearch,
    resetFilters,
    hasActiveFilters,
  };
}
