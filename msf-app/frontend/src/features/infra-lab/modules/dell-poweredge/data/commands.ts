import type {
  CommandCategory,
  CommandReading,
  LabCommand,
  RunResult,
  TermLine,
} from "../../../lib/types";
import { normalizeCommand } from "../../../components/terminal/useTerminal";
import {
  BASE_LOGS,
  BAY_COUNT,
  IDRAC_HOST,
  IDRAC_IP,
  SERVICE_TAG,
  initialDiskState,
  type DiskState,
  type LogEntry,
} from "./idrac";

/**
 * Perintah racadm simulasi. Satu sumber untuk bagian "Perintah racadm" dan tab Terminal
 * di simulasi iDRAC, jadi contoh output di keduanya selalu sama.
 */

export const RACADM_PROMPT = "racadm>";

export const RACADM_WELCOME: TermLine[] = [
  {
    tone: "dim",
    text: `Terhubung ke iDRAC ${IDRAC_IP} (simulasi). Ketik help untuk daftar perintah.`,
  },
];

export const RACADM_CATEGORIES: CommandCategory[] = [
  { id: "info", label: "Info" },
  { id: "status", label: "Status" },
  { id: "log", label: "Log" },
  { id: "support", label: "Dukungan" },
  { id: "power", label: "Power (berisiko)" },
];

const SEVERITY_READING: CommandReading[] = [
  {
    tag: "CRITICAL",
    tone: "bad",
    text: "Masalah serius, perlu tindakan segera.",
  },
  {
    tag: "WARNING",
    tone: "warn",
    text: "Perlu diperhatikan, bisa jadi tanda awal kerusakan.",
  },
  {
    tag: "INFO",
    tone: "ok",
    text: "Catatan normal, mis. login atau disk baru terpasang.",
  },
];

const FORCE_POWER_CAUTION =
  "Risiko: aplikasi down, data yang belum tersimpan rusak. Hanya dengan MOP + approval + pendampingan senior.";

export const RACADM_COMMANDS: LabCommand[] = [
  {
    id: "getsysinfo",
    command: "racadm getsysinfo",
    label: "getsysinfo",
    summary: "Info sistem",
    category: "info",
    risk: "safe",
    description:
      "Menampilkan info iDRAC dan server: IP, model, Service Tag, host name, dan status power.",
    when: [
      "Memastikan kamu terhubung ke server yang benar sebelum bertindak.",
      "Mengambil Service Tag untuk tiket ke Dell.",
    ],
    reading: [
      {
        tag: "Service Tag",
        tone: "info",
        text: "Kode unik server. Cocokkan dengan tag di depan server.",
      },
      { tag: "Power Status", tone: "ok", text: "ON berarti server menyala." },
    ],
  },
  {
    id: "getversion",
    command: "racadm getversion",
    label: "getversion",
    summary: "Versi firmware",
    category: "info",
    risk: "safe",
    description: "Menampilkan versi BIOS, iDRAC, dan Lifecycle Controller.",
    when: [
      "Mengecek apakah firmware perlu di-update.",
      "Dicatat saat membuka tiket ke Dell.",
    ],
    reading: [
      {
        tag: "Version",
        tone: "info",
        text: "Bandingkan dengan versi standar di dokumen tim.",
      },
    ],
    caution:
      "Update firmware butuh reboot: lakukan hanya di maintenance window dengan MOP.",
  },
  {
    id: "pdisks",
    command: "racadm storage get pdisks",
    label: "storage get pdisks",
    summary: "Status disk fisik",
    category: "status",
    risk: "safe",
    description:
      "Menampilkan status semua disk fisik yang terpasang di server.",
    when: [
      "Ada alert Storage di Dashboard iDRAC.",
      "Sebelum dan sesudah mengganti disk.",
      "Memantau rebuild sampai selesai.",
    ],
    reading: [
      { tag: "Online", tone: "ok", text: "Disk sehat dan dipakai RAID." },
      {
        tag: "Rebuilding",
        tone: "warn",
        text: "Disk baru sedang diisi ulang. Hindari pekerjaan berat di server ini.",
      },
      {
        tag: "Failed",
        tone: "bad",
        text: "Disk rusak. Angka setelah Bay = nomor slot fisik yang harus diganti.",
      },
    ],
    caution:
      "Output ini hanya memberi tahu disk mana yang rusak. Sebelum mencabut, tetap nyalakan Blink dan cocokkan nomor bay di depan server.",
  },
  {
    id: "getsel",
    command: "racadm getsel",
    label: "getsel",
    summary: "System Event Log",
    category: "log",
    risk: "safe",
    description:
      "Menampilkan System Event Log (SEL): kejadian hardware beserta waktunya.",
    when: [
      "Ada lampu amber atau alert di Dashboard.",
      "Mencari kapan masalah mulai terjadi.",
    ],
    reading: SEVERITY_READING,
    caution: "Catat waktu dan pesan error untuk laporan dan tiket ke Dell.",
  },
  {
    id: "lclog",
    command: "racadm lclog view",
    label: "lclog view",
    summary: "Lifecycle Log",
    category: "log",
    risk: "safe",
    description:
      "Menampilkan Lifecycle Log: riwayat perubahan dan kejadian di server.",
    when: [
      "Melihat perubahan apa yang terjadi dan kapan.",
      "Melengkapi info dari getsel.",
    ],
    reading: SEVERITY_READING,
  },
  {
    id: "powerstatus",
    command: "racadm serveraction powerstatus",
    label: "serveraction powerstatus",
    summary: "Status power",
    category: "status",
    risk: "safe",
    description: "Menampilkan status power server: ON atau OFF.",
    when: ["Memastikan server benar-benar menyala atau mati dari jauh."],
    reading: [
      { tag: "ON", tone: "ok", text: "Server menyala." },
      {
        tag: "OFF",
        tone: "bad",
        text: "Server mati. Cari tahu penyebabnya sebelum menyalakan.",
      },
    ],
  },
  {
    id: "tsr",
    command: "racadm techsupreport collect",
    label: "techsupreport collect",
    summary: "Kumpulkan TSR untuk tiket",
    category: "support",
    risk: "safe",
    description:
      "Mengumpulkan Technical Support Report (TSR): paket log dan info hardware untuk Dell Support.",
    when: ["Saat membuka tiket ke Dell Support."],
    reading: [
      {
        tag: "selesai",
        tone: "ok",
        text: "File TSR siap dilampirkan ke tiket.",
      },
    ],
  },
  {
    id: "graceshutdown",
    command: "racadm serveraction graceshutdown",
    label: "serveraction graceshutdown",
    summary: "Shutdown OS, butuh MOP",
    category: "power",
    risk: "caution",
    description:
      "Meminta OS shutdown dengan sopan, seperti menekan tombol power sekali.",
    when: ["Maintenance terjadwal yang memang butuh server mati."],
    caution:
      "Shutdown mematikan layanan di server ini. Di production hanya boleh sesuai MOP dan maintenance window.",
  },
  {
    id: "powercycle",
    command: "racadm serveraction powercycle",
    label: "serveraction powercycle",
    summary: "Mati paksa, berbahaya",
    category: "power",
    risk: "danger",
    description:
      "Mematikan server secara paksa lalu menyalakannya lagi, seperti mencabut listrik.",
    when: [
      "Hanya jika server hang total, sudah disetujui, dan didampingi senior.",
    ],
    caution: FORCE_POWER_CAUTION,
  },
  {
    id: "hardreset",
    command: "racadm serveraction hardreset",
    label: "serveraction hardreset",
    summary: "Reset paksa, berbahaya",
    category: "power",
    risk: "danger",
    description: "Me-reset server secara paksa tanpa menunggu OS.",
    when: [
      "Hanya jika server hang total, sudah disetujui, dan didampingi senior.",
    ],
    caution: FORCE_POWER_CAUTION,
  },
];

const HELP_TEXT = `Perintah yang tersedia di simulasi:
  racadm getsysinfo            info sistem
  racadm getversion            versi firmware
  racadm getsel                System Event Log
  racadm lclog view            Lifecycle Log
  racadm storage get pdisks    status disk fisik
  racadm serveraction powerstatus
  racadm serveraction graceshutdown | powercycle | hardreset
  racadm techsupreport collect kumpulkan TSR
  clear`;

export interface RacadmContext {
  diskState: (bay: number) => DiskState;
  logs: LogEntry[];
}

export interface RacadmResult extends RunResult {
  /** Perintah membaca log (getsel / lclog view): dipakai langkah "Baca log". */
  readLogs?: boolean;
}

/** Kondisi awal skenario, untuk bagian Perintah racadm yang tidak terhubung ke simulasi iDRAC. */
export const DEFAULT_RACADM_CONTEXT: RacadmContext = {
  diskState: initialDiskState,
  logs: BASE_LOGS,
};

function block(tone: TermLine["tone"], text: string): TermLine[] {
  return text.split("\n").map((line) => ({ tone, text: line }));
}

function logLines(logs: LogEntry[]): TermLine[] {
  return logs.map((l): TermLine => ({
    tone:
      l.severity === "Critical"
        ? "err"
        : l.severity === "Warning"
          ? "warn"
          : "plain",
    text: `${l.time}  ${l.severity.toUpperCase()}  ${l.message}`,
  }));
}

/** Jalankan satu perintah racadm simulasi. null = input kosong. */
export function runRacadm(
  raw: string,
  ctx: RacadmContext,
): RacadmResult | null {
  const cmd = normalizeCommand(raw);
  if (!cmd) return null;
  const low = cmd.toLowerCase();
  const commandId = RACADM_COMMANDS.find((c) => c.command === low)?.id;

  if (low === "clear") return { lines: [], clear: true };
  if (low === "help" || low === "racadm help")
    return { lines: block("plain", HELP_TEXT) };
  if (!low.startsWith("racadm")) {
    return {
      lines: block(
        "err",
        "Perintah harus diawali 'racadm'. Contoh: racadm getsysinfo",
      ),
    };
  }

  switch (low) {
    case "racadm getsysinfo":
      return {
        commandId,
        lines: block(
          "plain",
          `RAC Information:
  iDRAC IP Address   = ${IDRAC_IP}
  Firmware Version   = x.yy.zz (contoh)
System Information:
  System Model       = PowerEdge R760 (simulasi)
  Service Tag        = ${SERVICE_TAG}
  Host Name          = ${IDRAC_HOST}
  Power Status       = ON`,
        ),
      };
    case "racadm getversion":
      return {
        commandId,
        lines: block(
          "plain",
          `BIOS Version                = a.b.c (contoh)
iDRAC Version               = x.yy.zz (contoh)
Lifecycle Controller Version = x.yy.zz (contoh)`,
        ),
      };
    case "racadm getsel":
    case "racadm lclog view":
      return { commandId, readLogs: true, lines: logLines(ctx.logs) };
    case "racadm storage get pdisks":
      return {
        commandId,
        lines: Array.from({ length: BAY_COUNT }, (_, i): TermLine => {
          const st = ctx.diskState(i);
          return {
            tone:
              st === "Online" ? "plain" : st === "Rebuilding" ? "warn" : "err",
            text: `Disk.Bay.${i}   State = ${st}`,
          };
        }),
      };
    case "racadm serveraction powerstatus":
      return { commandId, lines: block("plain", "Server power status: ON") };
    case "racadm serveraction graceshutdown":
      return {
        commandId,
        lines: block(
          "warn",
          `DITAHAN (simulasi): shutdown mematikan layanan di server ini.
Di production hanya boleh sesuai MOP dan maintenance window.`,
        ),
      };
    case "racadm serveraction powercycle":
    case "racadm serveraction hardreset":
    case "racadm serveraction powerdown":
      return {
        commandId,
        lines: block(
          "err",
          `DITOLAK (simulasi): perintah ini mematikan server secara paksa.
Risiko: aplikasi down, data yang belum tersimpan rusak.
Hanya dengan MOP + approval + pendampingan senior.`,
        ),
      };
    case "racadm techsupreport collect":
      return {
        commandId,
        lines: block(
          "ok",
          `Mengumpulkan Technical Support Report (TSR)... selesai (simulasi).
TSR ini dilampirkan saat membuka tiket ke Dell Support.`,
        ),
      };
    default:
      return {
        lines: block("err", "Perintah tidak dikenal di simulasi. Ketik help."),
      };
  }
}
