import type { DevicePart } from "../../../components/PartsExplorer";

export const NETAPP_PARTS = {
  ctrlA: {
    view: "controller",
    name: "Controller A (node 01)",
    what: "Satu node: CPU, memori, dan NVRAM yang menjalankan ONTAP.",
    how: [
      "Bersama Controller B membentuk HA pair.",
      "Lampu amber di controller = ada fault; cek event log show.",
    ],
    caution:
      "Jangan mencabut controller yang masih melayani data. Penggantian controller selalu lewat takeover terencana.",
  },
  ctrlB: {
    view: "controller",
    name: "Controller B (node 02)",
    what: "Pasangan HA dari Controller A.",
    how: [
      "Kalau satu node mati, node ini mengambil alih disk dan layanannya (takeover).",
    ],
    caution:
      "Sebelum maintenance di salah satu node, pastikan storage failover show menyatakan takeover possible = true.",
  },
  console: {
    view: "controller",
    name: "Port console",
    what: "Akses serial langsung ke node.",
    how: ["Dipakai saat node tidak bisa diakses lewat jaringan."],
    caution:
      "Hati-hati di prompt LOADER: perintah di sana bisa mengubah cara node boot.",
  },
  e0m: {
    view: "controller",
    name: "Port manajemen (e0M)",
    what: "Port Ethernet untuk manajemen node dan cluster, juga dipakai Service Processor/BMC.",
    how: [
      "SSH ke IP manajemen cluster untuk CLI, atau buka System Manager di browser.",
    ],
    caution:
      "Jangan tertukar dengan port data. Kabel e0M lepas = kehilangan akses manajemen ke node itu.",
  },
  cluster: {
    view: "controller",
    name: "Port cluster interconnect (e0a, e0b)",
    what: "Jalur khusus antar node untuk sinkronisasi cluster.",
    how: [
      "Tersambung ke switch cluster atau langsung antar controller.",
      "Cek dengan network port show -ipspace Cluster.",
    ],
    caution:
      "Mencabut kabel cluster bisa membuat node keluar dari cluster. Jangan disentuh tanpa MOP.",
  },
  data: {
    view: "controller",
    name: "Port data (e0c, e0d)",
    what: "Port tempat LIF data melayani client NFS, SMB, atau iSCSI.",
    how: [
      "Biasanya digabung jadi ifgrp (link aggregation) ke switch.",
      "Cek dengan network port show dan network interface show.",
    ],
    caution:
      "Port data tercabut bisa memindahkan LIF ke port lain. Setelah pekerjaan kabel, pastikan semua LIF Is Home = true.",
  },
  storage: {
    view: "controller",
    name: "Port storage (ke disk shelf)",
    what: "Kabel SAS atau NVMe dari controller ke disk shelf.",
    how: [
      "Dipasang berlapis (multipath) supaya satu kabel putus tidak mengganggu akses disk.",
    ],
    caution:
      "Saat mengganti kabel, cabut satu jalur saja dan pastikan jalur lain sehat dulu.",
  },
  psu: {
    view: "controller",
    name: "Power supply",
    what: "Dua PSU redundan untuk satu chassis controller.",
    how: [
      "Status PSU muncul di event log dan system node environment sensors show.",
    ],
    caution: "Pastikan PSU lain hijau sebelum mencabut yang rusak.",
  },
  drives: {
    view: "shelf",
    name: "Drive bay disk shelf",
    what: "Tempat disk atau SSD. Setiap disk punya lampu aktivitas dan lampu fault.",
    how: [
      "Disk rusak otomatis digantikan spare, lalu RAID di-rebuild (reconstruct).",
      "Lihat disk rusak dengan storage disk show -broken.",
    ],
    caution:
      "Cabut hanya disk yang lampu fault-nya menyala dan tercatat broken. Salah cabut saat reconstruct berisiko.",
  },
  shelfid: {
    view: "shelf",
    name: "Shelf ID",
    what: "Angka di depan shelf yang membedakan satu shelf dengan yang lain.",
    how: ["Nama disk memakai shelf ID: 1.0.5 = stack 1, shelf 0, bay 5."],
    caution: "Jangan mengubah shelf ID saat sistem berjalan.",
  },
  shelfled: {
    view: "shelf",
    name: "Lampu status shelf",
    what: "Menunjukkan power dan fault di shelf.",
    how: [
      "Amber = ada komponen shelf yang bermasalah: disk, PSU, atau modul IO.",
    ],
    caution: "Cari komponen yang fault di event log sebelum bertindak.",
  },
} satisfies Record<string, DevicePart>;

export type NetappPartId = keyof typeof NETAPP_PARTS;
