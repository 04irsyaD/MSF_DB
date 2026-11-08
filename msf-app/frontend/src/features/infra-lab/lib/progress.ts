/**
 * Progres modul (bagian terakhir dan bagian yang sudah dibuka) disimpan di localStorage.
 * Semua akses dibungkus try/catch: mode privat atau storage diblokir cukup membuat progres
 * tidak tersimpan, halaman tetap jalan.
 */

export interface ModuleProgress {
  section: number;
  visited: number[];
}

const storageKey = (moduleId: string) => `msfdb:infralab:v1:${moduleId}`;

export function readProgress(moduleId: string): ModuleProgress | null {
  try {
    const raw = window.localStorage.getItem(storageKey(moduleId));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const { section, visited } = parsed as Record<string, unknown>;
    if (typeof section !== "number" || !Array.isArray(visited)) return null;
    return {
      section,
      visited: visited.filter((n): n is number => typeof n === "number"),
    };
  } catch {
    return null;
  }
}

export function writeProgress(moduleId: string, progress: ModuleProgress) {
  try {
    window.localStorage.setItem(storageKey(moduleId), JSON.stringify(progress));
  } catch {
    // Storage tidak tersedia: progres tidak disimpan.
  }
}
