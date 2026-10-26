import type { Command, Distro } from "./schema";

/**
 * Mengembalikan command sesuai distro yang dipilih.
 * Kalau ada `variants[distro]`, pakai itu; kalau tidak, pakai `command` default.
 */
export function resolveCommand(command: Command, distro: Distro): string {
  return command.variants?.[distro] ?? command.command;
}

/** True bila command punya perbedaan antar-distro (menampilkan penanda varian di UI). */
export function hasDistroVariants(command: Command): boolean {
  return Boolean(command.variants && Object.keys(command.variants).length > 0);
}
