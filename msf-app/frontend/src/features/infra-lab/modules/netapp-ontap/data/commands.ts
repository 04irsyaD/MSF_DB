import type {
  CommandCategory,
  LabCommand,
  RunResult,
  TermLine,
} from "../../../lib/types";
import { CLUSTER, INITIAL_ONTAP, runOntap } from "./ontap";

export const ONTAP_WELCOME: TermLine[] = [
  {
    tone: "dim",
    text: `Terhubung ke ${CLUSTER} (192.0.2.20) lewat SSH (simulasi). Ketik ? untuk daftar perintah.`,
  },
];

export const ONTAP_CATEGORIES: CommandCategory[] = [
  { id: "health", label: "Kesehatan" },
  { id: "capacity", label: "Kapasitas" },
  { id: "network", label: "Jaringan" },
  { id: "log", label: "Log" },
  { id: "change", label: "Perubahan" },
  { id: "danger", label: "Berbahaya" },
];

const USED_READING = [
  { tag: "< 80%", tone: "ok" as const, text: "Aman." },
  {
    tag: "80-89%",
    tone: "warn" as const,
    text: "Mulai rencanakan penambahan ruang.",
  },
  {
    tag: ">= 90%",
    tone: "bad" as const,
    text: "Risiko penuh: aplikasi bisa gagal menulis.",
  },
];

export const ONTAP_COMMANDS: LabCommand[] = [
  {
    id: "cluster",
    command: "cluster show",
    label: "cluster show",
    summary: "Kesehatan node",
    category: "health",
    risk: "safe",
    description:
      "Menampilkan semua node di cluster beserta status kesehatannya.",
    when: [
      "Langkah pertama saat ada laporan gangguan storage.",
      "Sebelum dan sesudah maintenance.",
    ],
    reading: [
      { tag: "Health true", tone: "ok", text: "Node sehat." },
      {
        tag: "Health false",
        tone: "bad",
        text: "Node bermasalah; cek event log show dan hubungi support.",
      },
      {
        tag: "Eligibility",
        tone: "info",
        text: "false = node tidak ikut quorum cluster.",
      },
    ],
  },
  {
    id: "failover",
    command: "storage failover show",
    label: "storage failover show",
    summary: "Kesiapan HA",
    category: "health",
    risk: "safe",
    description:
      "Menampilkan status HA pair: apakah tiap node siap mengambil alih pasangannya.",
    when: [
      "Sebelum maintenance di salah satu node.",
      "Setelah takeover/giveback selesai.",
    ],
    reading: [
      {
        tag: "Possible true",
        tone: "ok",
        text: "HA siap: kalau satu node mati, pasangannya bisa mengambil alih.",
      },
      {
        tag: "Possible false",
        tone: "bad",
        text: "Redundansi hilang. Tunda maintenance node sampai kembali true.",
      },
    ],
  },
  {
    id: "aggr",
    command: "storage aggregate show",
    label: "storage aggregate show",
    summary: "Kapasitas aggregate",
    category: "capacity",
    risk: "safe",
    description:
      "Menampilkan ukuran, ruang kosong, dan status RAID setiap aggregate.",
    when: ["Sebelum memperbesar volume.", "Pemantauan kapasitas rutin."],
    reading: [
      {
        tag: "aggr0",
        tone: "info",
        text: "Aggregate root berisi sistem ONTAP. Used% tinggi di sini normal.",
      },
      {
        tag: "Available",
        tone: "ok",
        text: "Ruang yang masih bisa dipakai untuk volume.",
      },
      {
        tag: "raid_dp, normal",
        tone: "ok",
        text: "RAID sehat. Kata degraded/reconstruct = ada disk rusak dan sedang dibangun ulang.",
      },
    ],
  },
  {
    id: "volume",
    command: "volume show",
    label: "volume show",
    summary: "Kapasitas volume",
    category: "capacity",
    risk: "safe",
    description: "Menampilkan semua volume: ukuran, ruang tersisa, dan Used%.",
    when: ["Ada alert volume hampir penuh.", "Aplikasi gagal menulis file."],
    reading: USED_READING,
  },
  {
    id: "snapshot",
    command: "volume snapshot show -volume vol_app",
    label: "volume snapshot show",
    summary: "Daftar snapshot",
    category: "capacity",
    risk: "safe",
    description:
      "Menampilkan snapshot di sebuah volume beserta ruang yang dipakai.",
    when: [
      "Mencari tahu kenapa volume cepat penuh.",
      "Memastikan snapshot terjadwal berjalan.",
    ],
    reading: [
      {
        tag: "daily / weekly",
        tone: "info",
        text: "Snapshot terjadwal; dihapus otomatis sesuai retensi.",
      },
      {
        tag: "snapmirror.*",
        tone: "warn",
        text: "Dipakai replikasi (DR). Jangan dihapus manual.",
      },
    ],
  },
  {
    id: "lif",
    command: "network interface show",
    label: "network interface show",
    summary: "Status LIF",
    category: "network",
    risk: "safe",
    description:
      "Menampilkan semua LIF: IP, status, node dan port saat ini, serta apakah di port asalnya.",
    when: [
      "Client tidak bisa mount atau akses share.",
      "Setelah pekerjaan kabel atau failover.",
    ],
    reading: [
      { tag: "up/up", tone: "ok", text: "LIF aktif." },
      {
        tag: "Is Home false",
        tone: "warn",
        text: "LIF sedang tidak di port asalnya. Kembalikan dengan network interface revert setelah penyebabnya beres.",
      },
    ],
  },
  {
    id: "event",
    command: "event log show",
    label: "event log show",
    summary: "Event dan alert",
    category: "log",
    risk: "safe",
    description:
      "Menampilkan event sistem: alert kapasitas, disk, jaringan, dan lainnya.",
    when: ["Ada alert dari monitoring.", "Mencari kapan masalah mulai."],
    reading: [
      { tag: "ALERT / ERROR", tone: "bad", text: "Perlu ditindaklanjuti." },
      { tag: "NOTICE", tone: "info", text: "Informasi kejadian normal." },
    ],
    caution:
      "Catat waktu dan nama event untuk tiket. Lampirkan AutoSupport saat membuka kasus ke NetApp.",
  },
  {
    id: "broken",
    command: "storage disk show -broken",
    label: "storage disk show -broken",
    summary: "Disk rusak",
    category: "health",
    risk: "safe",
    description: "Menampilkan disk yang ditandai rusak (broken).",
    when: ["Lampu fault menyala di disk shelf.", "Ada event disk failed."],
    reading: [{ tag: "no entries", tone: "ok", text: "Tidak ada disk rusak." }],
  },
  {
    id: "volsize",
    command: "volume size -vserver svm_demo -volume vol_app -new-size +100g",
    label: "volume size ... +100g",
    summary: "Perbesar volume",
    category: "change",
    risk: "caution",
    description:
      "Mengubah ukuran volume. Tanda + menambah dari ukuran sekarang.",
    when: ["Volume hampir penuh dan aggregate masih punya ruang."],
    caution:
      "Cek ruang aggregate (storage aggregate show) dulu, dan tambah secukupnya. Ruang aggregate dipakai bersama volume lain.",
  },
  {
    id: "snapdelete",
    command:
      "volume snapshot delete -vserver svm_demo -volume vol_app -snapshot daily.2026-11-06_0010",
    label: "volume snapshot delete",
    summary: "Hapus snapshot",
    category: "change",
    risk: "caution",
    description:
      "Menghapus satu snapshot. Ruang yang hanya dipakai snapshot itu kembali bebas.",
    when: [
      "Disetujui pemilik data, mis. snapshot lama yang sudah tidak dibutuhkan.",
    ],
    caution:
      "Snapshot yang dihapus tidak bisa dikembalikan, dan titik restore hari itu hilang. Jangan hapus snapshot snapmirror atau milik backup.",
  },
  {
    id: "voldelete",
    command: "volume delete -vserver svm_demo -volume vol_app",
    label: "volume delete",
    summary: "Hapus volume, berbahaya",
    category: "danger",
    risk: "danger",
    description:
      "Menghapus volume beserta seluruh datanya (volume harus offline dulu).",
    when: ["Hanya dengan permintaan tertulis pemilik data dan MOP."],
    caution:
      "Data hilang. Pastikan backup sudah diverifikasi dan tidak ada client yang masih memakai volume itu.",
  },
  {
    id: "takeover",
    command: "storage failover takeover -ofnode cluster-demo-02",
    label: "storage failover takeover",
    summary: "Takeover node, berbahaya",
    category: "danger",
    risk: "danger",
    description: "Memindahkan semua layanan dari satu node ke pasangannya.",
    when: [
      "Maintenance node terjadwal, setelah storage failover show = possible true.",
    ],
    caution:
      "Layanan bisa terputus sesaat. Hanya di maintenance window dengan MOP.",
  },
];

/** Bagian "Perintah ONTAP": selalu dari kondisi awal skenario. */
export function runOntapConsole(raw: string): RunResult | null {
  const r = runOntap(raw, INITIAL_ONTAP);
  if (!r) return null;
  return { lines: r.lines, clear: r.clear, commandId: r.commandId };
}
