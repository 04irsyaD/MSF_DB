import type { DevicePart } from "../../../components/PartsExplorer";

export const PALO_PARTS = {
  leds: {
    view: "front",
    name: "Lampu status (PWR, STS, HA, TEMP, ALM)",
    what: "Menunjukkan kondisi firewall: power, status sistem, peran HA, suhu, dan alarm.",
    how: [
      "STS hijau = normal; ALM menyala = ada alarm hardware.",
      "Lampu HA menunjukkan peran: active atau passive.",
    ],
    caution:
      "Kalau ALM menyala, cek log sistem dan show system state dulu sebelum restart apa pun.",
  },
  mgmt: {
    view: "front",
    name: "Port MGT",
    what: "Port manajemen untuk GUI (HTTPS) dan SSH, terpisah dari trafik user.",
    how: [
      "Akses GUI: https://<IP-MGT>.",
      "Tersambung ke jaringan manajemen (out-of-band).",
    ],
    caution:
      "Jangan sambungkan MGT ke jaringan publik; akses manajemen harus dibatasi.",
  },
  console: {
    view: "front",
    name: "Port console",
    what: "Akses CLI langsung lewat kabel serial.",
    how: [
      "Dipakai saat setup awal atau saat MGT tidak bisa diakses.",
      "Setting umum: 9600 baud, 8N1.",
    ],
    caution:
      "Tutup sesi CLI setelah selesai; jangan tinggalkan kabel console dan sesi login terbuka.",
  },
  usb: {
    view: "front",
    name: "Port USB",
    what: "Untuk bootstrap atau menyalin file tertentu sesuai prosedur vendor.",
    how: ["Hanya dipakai saat prosedur yang memang membutuhkannya."],
    caution: "Jangan colok media yang tidak jelas asalnya.",
  },
  ha: {
    view: "front",
    name: "Port HA (HA1, HA2)",
    what: "Menyambung dua firewall dalam mode High Availability. HA1 untuk kontrol, HA2 untuk sinkronisasi sesi.",
    how: [
      "Cek dengan show high-availability state.",
      "Pasangan HA yang sehat: satu active, satu passive.",
    ],
    caution:
      "Mencabut kabel HA bisa membuat kedua firewall merasa active (split-brain). Jangan disentuh tanpa MOP.",
  },
  data: {
    view: "front",
    name: "Port data (ethernet1/1 sampai 1/8)",
    what: "Port untuk trafik user. Setiap port masuk ke satu zone, mis. trust, untrust, atau dmz.",
    how: [
      "Cek dengan show interface all.",
      "Nama di GUI/CLI: ethernet1/1, sesuai nomor port fisik.",
    ],
    caution:
      "Pastikan zone dan port sesuai dokumen sebelum memindahkan kabel. Salah port = trafik masuk zone yang salah.",
  },
  sfp: {
    view: "front",
    name: "Port SFP (ethernet1/9 sampai 1/12)",
    what: "Port fiber berkecepatan tinggi, biasanya ke switch core atau ke ISP.",
    how: ["Modul SFP harus sesuai jenis kabel dan jarak (mis. SR atau LR)."],
    caution:
      "Port ke ISP atau core biasanya membawa semua trafik; mencabutnya memutus banyak layanan.",
  },
  psu1: {
    view: "rear",
    name: "Power supply 1 (PSU)",
    what: "Sumber listrik firewall. Umumnya dua PSU ke jalur listrik berbeda (A dan B).",
    how: ["Status PSU muncul di show system environmentals dan log sistem."],
    caution: "Pastikan PSU lain normal sebelum mencabut PSU yang rusak.",
  },
  psu2: {
    view: "rear",
    name: "Power supply 2 (PSU)",
    what: "PSU cadangan. Kalau PSU 1 mati, firewall tetap menyala.",
    how: [
      "Buka tiket dan ganti PSU rusak sesuai SOP walau firewall masih menyala.",
    ],
    caution: "Dengan satu PSU, redundansi hilang.",
  },
  fans: {
    view: "rear",
    name: "Modul kipas",
    what: "Membuang panas dari firewall.",
    how: ["Cek kondisi kipas dan suhu di show system environmentals."],
    caution:
      "Firewall yang kepanasan bisa menurunkan performa atau mati sendiri. Jangan halangi aliran udara.",
  },
} satisfies Record<string, DevicePart>;

export type PaloPartId = keyof typeof PALO_PARTS;
