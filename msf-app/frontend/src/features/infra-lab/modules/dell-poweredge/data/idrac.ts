/** Semua nilai di sini fiktif (RFC 5737 192.0.2.x, Service Tag DEMO123). */
export const IDRAC_HOST = "SRV-DEMO-01";
export const IDRAC_IP = "192.0.2.10";
export const SERVICE_TAG = "DEMO123";

export const BAY_COUNT = 8;
/** Bay disk yang rusak di skenario simulasi. */
export const FAILED_BAY = 5;

export type DiskState = "Online" | "Rebuilding" | "Failed" | "Offline";
export type Severity = "Critical" | "Warning" | "Info";

export interface LogEntry {
  time: string;
  severity: Severity;
  message: string;
}

export const STEP_TEXT = [
  "Lihat alert di Dashboard",
  "Baca log di tab Logs",
  "Nyalakan Blink pada disk yang rusak",
  "Ganti disk di bay yang benar",
  "Tunggu rebuild selesai",
];

export const BASE_LOGS: LogEntry[] = [
  {
    time: "2026-11-08 02:14:07",
    severity: "Critical",
    message: "Disk 5 di bay depan terdeteksi gagal (Failed).",
  },
  {
    time: "2026-11-08 02:14:09",
    severity: "Warning",
    message: "Virtual Disk 0 (RAID 5) berstatus Degraded.",
  },
  {
    time: "2026-11-07 22:01:33",
    severity: "Info",
    message: "Login iDRAC berhasil oleh user ops-demo.",
  },
  {
    time: "2026-11-06 09:12:50",
    severity: "Warning",
    message: "Disk 5 melaporkan predictive failure.",
  },
];

/** Waktu kejadian simulasi: tanggal skenario + jam lokal saat ini. */
export function simTimestamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `2026-11-08 ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/** Status disk kondisi awal skenario: satu disk rusak, sisanya Online. */
export function initialDiskState(bay: number): DiskState {
  return bay === FAILED_BAY ? "Failed" : "Online";
}
