import type { LucideIcon } from "lucide-react";

/** Nada status yang dipakai konsisten di semua modul: hijau OK, amber warning, merah gagal. */
export type Tone = "ok" | "warn" | "bad" | "info";

export interface LabSection {
  title: string;
  /** Satu kalimat untuk daftar isi modul di halaman Infra Lab. */
  summary: string;
}

export interface InfraModule {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  status: "active" | "soon";
  /** Wajib untuk modul aktif. */
  href?: string;
  tags: string[];
  sections: readonly LabSection[];
}

/** Satu baris di layar terminal simulasi. */
export interface TermLine {
  tone: "plain" | "dim" | "ok" | "warn" | "err";
  text: string;
}

export type CommandRisk = "safe" | "caution" | "danger";

export interface CommandReading {
  /** Potongan output yang dijelaskan, mis. "Online" atau "up / up". */
  tag: string;
  tone: Tone;
  text: string;
}

export interface LabCommand {
  id: string;
  /** Perintah lengkap seperti diketik di terminal. */
  command: string;
  /** Teks pendek di tombol perintah. */
  label: string;
  summary: string;
  category: string;
  risk: CommandRisk;
  description: string;
  when: string[];
  reading?: CommandReading[];
  caution?: string;
}

export interface CommandCategory {
  id: string;
  label: string;
}

export interface RunResult {
  lines: TermLine[];
  /** Bersihkan layar (perintah clear). */
  clear?: boolean;
  /** Perintah yang dikenali, untuk menampilkan penjelasannya. */
  commandId?: string;
}
