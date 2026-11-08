import type {
  CommandCategory,
  LabCommand,
  RunResult,
  TermLine,
} from "../../../lib/types";
import { SW_HOST } from "./device";
import { initialIos, runIos } from "./ios";

export const IOS_CONSOLE_PROMPT = `${SW_HOST}#`;

export const IOS_WELCOME: TermLine[] = [
  {
    tone: "dim",
    text: `Terhubung ke ${SW_HOST} lewat SSH (simulasi). Ketik ? untuk daftar perintah.`,
  },
];

export const IOS_CATEGORIES: CommandCategory[] = [
  { id: "info", label: "Info" },
  { id: "status", label: "Status port" },
  { id: "log", label: "Log" },
  { id: "config", label: "Konfigurasi" },
  { id: "danger", label: "Berbahaya" },
];

export const IOS_COMMANDS: LabCommand[] = [
  {
    id: "ifstatus",
    command: "show interfaces status",
    label: "show interfaces status",
    summary: "Status semua port",
    category: "status",
    risk: "safe",
    description:
      "Menampilkan semua port: nama (description), status, VLAN, kecepatan, dan jenis port.",
    when: [
      "Ada laporan user tidak bisa terhubung.",
      "Mencari port yang err-disabled atau notconnect.",
    ],
    reading: [
      {
        tag: "connected",
        tone: "ok",
        text: "Kabel tersambung dan perangkat di ujung menyala.",
      },
      {
        tag: "notconnect",
        tone: "warn",
        text: "Tidak ada link: kabel lepas atau perangkat di ujung mati.",
      },
      {
        tag: "err-disabled",
        tone: "bad",
        text: "Dimatikan otomatis oleh switch karena pelanggaran. Cari penyebabnya di show logging.",
      },
      {
        tag: "disabled",
        tone: "warn",
        text: "Sengaja dimatikan admin dengan shutdown.",
      },
    ],
  },
  {
    id: "ipbrief",
    command: "show ip interface brief",
    label: "show ip interface brief",
    summary: "Ringkasan interface dan IP",
    category: "status",
    risk: "safe",
    description:
      "Ringkasan semua interface: alamat IP, status port, dan status protokol.",
    when: [
      "Cek cepat port mana yang up atau down.",
      "Memastikan IP manajemen (VLAN 99) sudah terpasang.",
    ],
    reading: [
      { tag: "up / up", tone: "ok", text: "Port aktif dan terhubung." },
      {
        tag: "down / down",
        tone: "bad",
        text: "Kabel lepas, perangkat di ujung mati, atau port err-disabled.",
      },
      {
        tag: "administratively down",
        tone: "warn",
        text: "Port sengaja dimatikan (shutdown) oleh admin.",
      },
    ],
    caution:
      "Perintah show aman dijalankan kapan saja. Yang berisiko adalah perintah di mode configure, reload, dan write erase.",
  },
  {
    id: "logging",
    command: "show logging",
    label: "show logging",
    summary: "Log switch",
    category: "log",
    risk: "safe",
    description:
      "Menampilkan log di buffer switch: perubahan link, pelanggaran keamanan, perubahan konfigurasi.",
    when: [
      "Mencari penyebab port err-disabled atau link naik turun.",
      "Melihat siapa terakhir mengubah konfigurasi.",
    ],
    reading: [
      {
        tag: "-2- / -3-",
        tone: "bad",
        text: "Angka setelah nama fasilitas = tingkat keparahan. 0 sampai 3 = kritis/error.",
      },
      {
        tag: "-4-",
        tone: "warn",
        text: "Warning, mis. PM-4-ERR_DISABLE: port dimatikan otomatis.",
      },
      {
        tag: "-5- ke atas",
        tone: "ok",
        text: "Notifikasi/informasi, mis. SYS-5-CONFIG_I: ada perubahan konfigurasi.",
      },
    ],
    caution: "Catat waktu dan pesan log untuk laporan tiket.",
  },
  {
    id: "vlan",
    command: "show vlan brief",
    label: "show vlan brief",
    summary: "Daftar VLAN dan port-nya",
    category: "status",
    risk: "safe",
    description:
      "Menampilkan VLAN yang ada di switch beserta port akses di masing-masing VLAN.",
    when: ["Memastikan port user ada di VLAN yang benar."],
    reading: [
      { tag: "VLAN", tone: "info", text: "Nomor dan nama VLAN." },
      {
        tag: "Ports",
        tone: "info",
        text: "Port akses di VLAN itu. Port trunk (uplink) tidak muncul di sini.",
      },
    ],
  },
  {
    id: "mac",
    command: "show mac address-table",
    label: "show mac address-table",
    summary: "MAC per port",
    category: "status",
    risk: "safe",
    description:
      "Menampilkan alamat MAC yang dipelajari switch, beserta VLAN dan port-nya.",
    when: [
      "Mencari di port mana sebuah perangkat tersambung.",
      "Memastikan perangkat user benar-benar terdeteksi.",
    ],
    reading: [
      {
        tag: "DYNAMIC",
        tone: "ok",
        text: "MAC dipelajari otomatis dari trafik.",
      },
      {
        tag: "Te1/1/1",
        tone: "info",
        text: "MAC yang terlihat lewat uplink adalah perangkat di switch lain.",
      },
    ],
  },
  {
    id: "cdp",
    command: "show cdp neighbors",
    label: "show cdp neighbors",
    summary: "Perangkat tetangga",
    category: "info",
    risk: "safe",
    description:
      "Menampilkan perangkat Cisco yang tersambung langsung: nama, port lokal, dan port di sisi tetangga.",
    when: [
      "Memastikan uplink tersambung ke switch core yang benar.",
      "Mendokumentasikan topologi.",
    ],
    reading: [
      { tag: "Local Intrfce", tone: "info", text: "Port di switch ini." },
      { tag: "Port ID", tone: "info", text: "Port di perangkat tetangga." },
    ],
  },
  {
    id: "version",
    command: "show version",
    label: "show version",
    summary: "Versi, model, uptime",
    category: "info",
    risk: "safe",
    description:
      "Menampilkan versi IOS, model, nomor serial, dan lama switch menyala.",
    when: [
      "Membuka tiket ke Cisco TAC.",
      "Mengecek apakah switch baru saja restart.",
    ],
    reading: [
      {
        tag: "uptime",
        tone: "info",
        text: "Lama switch menyala. Uptime pendek tanpa jadwal = switch pernah restart sendiri.",
      },
      {
        tag: "Serial",
        tone: "info",
        text: "Dipakai saat membuka tiket ke vendor.",
      },
    ],
  },
  {
    id: "runint",
    command: "show running-config interface Gi1/0/12",
    label: "show run interface Gi1/0/12",
    summary: "Konfigurasi satu port",
    category: "config",
    risk: "safe",
    description: "Menampilkan konfigurasi aktif untuk satu port.",
    when: [
      "Sebelum mengubah port: simpan hasilnya sebagai catatan kondisi awal.",
    ],
    reading: [
      {
        tag: "switchport port-security",
        tone: "info",
        text: "Port membatasi MAC yang boleh tersambung.",
      },
      {
        tag: "shutdown",
        tone: "warn",
        text: "Kalau baris ini ada, port sedang dimatikan admin.",
      },
    ],
  },
  {
    id: "conft",
    command: "configure terminal",
    label: "configure terminal",
    summary: "Masuk mode konfigurasi",
    category: "config",
    risk: "caution",
    description:
      "Masuk ke Global configuration untuk mengubah konfigurasi switch.",
    when: ["Perubahan yang sudah direncanakan dan disetujui."],
    caution:
      "Setiap perintah di mode configure langsung aktif tanpa konfirmasi. Rencanakan dan catat perubahan sebelum mengetik.",
  },
  {
    id: "write",
    command: "write memory",
    label: "write memory",
    summary: "Simpan konfigurasi",
    category: "config",
    risk: "caution",
    description:
      "Menyimpan running-config ke startup-config supaya perubahan tidak hilang saat reboot.",
    when: ["Setelah perubahan diverifikasi berjalan benar."],
    caution:
      "Simpan hanya setelah verifikasi. Konfigurasi yang salah lalu disimpan akan terbawa saat reboot.",
  },
  {
    id: "reload",
    command: "reload",
    label: "reload",
    summary: "Restart switch, berbahaya",
    category: "danger",
    risk: "danger",
    description:
      "Me-restart switch. Semua user di switch ini terputus beberapa menit.",
    when: ["Hanya di maintenance window dengan MOP dan approval."],
    caution:
      "Konfigurasi yang belum disimpan hilang, dan semua perangkat di switch ini mati sementara (termasuk telepon dan AP PoE).",
  },
  {
    id: "wrerase",
    command: "write erase",
    label: "write erase",
    summary: "Hapus startup-config, berbahaya",
    category: "danger",
    risk: "danger",
    description:
      "Menghapus startup-config. Setelah reload, switch kembali kosong.",
    when: [
      "Hampir tidak pernah di production. Hanya saat decommission sesuai prosedur.",
    ],
    caution:
      "Kombinasi write erase lalu reload = switch kehilangan seluruh konfigurasi.",
  },
];

const CONSOLE_STATE = initialIos("priv");

/** Bagian "Perintah show": selalu dari Privileged EXEC dengan kondisi awal skenario. */
export function runIosConsole(raw: string): RunResult | null {
  const r = runIos(raw, CONSOLE_STATE);
  if (!r) return null;
  return { lines: r.lines, clear: r.clear, commandId: r.commandId };
}
