import type { Runbook, Distro } from "./schema";
import { resolveStepCommands, interpolate } from "./runbook";

/**
 * Susun runbook menjadi skrip .sh yang bisa diunduh.
 * Nilai variabel diasumsikan SUDAH divalidasi (validateParamValue) oleh pemanggil.
 */
export function buildShellScript(
  runbook: Runbook,
  distro: Distro,
  values: Record<string, string>
): string {
  const lines: string[] = [];

  lines.push("#!/usr/bin/env bash");
  lines.push("#");
  lines.push(`# ${runbook.title}`);
  lines.push(`# Distro target: ${distro === "ubuntu" ? "Ubuntu/Debian" : "RHEL/Rocky"}`);
  lines.push("#");
  lines.push("# PERINGATAN: Skrip ini dihasilkan dari Linux Helper untuk REFERENSI.");
  lines.push("# Baca tiap baris sebelum menjalankan. Jalankan di server yang benar,");
  lines.push("# backup data penting dulu, dan sesuaikan nilai bila perlu.");
  lines.push("# Skrip SENGAJA tidak memakai 'set -e' agar kamu menjalankan bertahap.");
  lines.push("#");
  lines.push("");

  runbook.steps.forEach((step, i) => {
    lines.push(`# [${i + 1}/${runbook.steps.length}] ${step.title}`);
    for (const cmd of resolveStepCommands(step, distro)) {
      lines.push(interpolate(cmd, values));
    }
    if (step.verify) {
      lines.push(`# Verifikasi: ${interpolate(step.verify, values)}`);
    }
    lines.push("");
  });

  return lines.join("\n");
}

/** Picu unduhan file .sh di browser. */
export function downloadShellScript(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/x-shellscript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".sh") ? filename : `${filename}.sh`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
