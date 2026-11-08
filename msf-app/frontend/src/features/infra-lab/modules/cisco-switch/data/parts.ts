import type { DevicePart } from "../../../components/PartsExplorer";

export const SWITCH_PARTS = {
  leds: {
    view: "front",
    name: "LED sistem (SYST, STAT) + tombol MODE",
    what: "Lampu status switch secara keseluruhan, plus tombol MODE untuk mengganti arti lampu di setiap port.",
    how: [
      "SYST hijau = normal; amber = ada masalah hardware atau POST gagal.",
      "Tombol MODE mengganti arti lampu port: status, kecepatan, duplex, atau PoE.",
    ],
    caution:
      "SYST amber bukan berarti semua port mati, tapi cek show logging dan show environment secepatnya.",
  },
  ports: {
    view: "front",
    name: "Port akses (RJ45, PoE)",
    what: "Port untuk perangkat user: PC, telepon IP, access point, kamera. Port PoE juga memberi listrik ke perangkat.",
    how: [
      "Lampu hijau = link up, berkedip = ada trafik, amber = port diblok atau err-disabled.",
      "Nama port Gi1/0/12 = switch 1, modul 0, port 12. Di stack, angka pertama = nomor anggota stack.",
    ],
    caution:
      "Cocokkan label kabel dan nomor port sebelum mencabut. Satu port bisa jadi telepon direksi atau access point satu lantai.",
  },
  uplinks: {
    view: "front",
    name: "Port uplink (SFP)",
    what: "Port modul SFP berkecepatan tinggi yang menyambung switch ini ke switch distribution atau core.",
    how: [
      "Biasanya ada dua uplink untuk redundansi.",
      "Cek dengan show interfaces status dan show cdp neighbors.",
    ],
    caution:
      "Mencabut atau shutdown uplink bisa memutus SEMUA user di switch ini. Ini kesalahan paling mahal.",
  },
  usb: {
    view: "front",
    name: "Port USB",
    what: "Untuk menyalin file, mis. image IOS atau backup konfigurasi.",
    how: ["Hanya dipakai saat upgrade atau backup sesuai MOP."],
    caution: "Jangan salin atau boot dari flashdisk yang tidak jelas asalnya.",
  },
  console: {
    view: "rear",
    name: "Port console",
    what: "Akses CLI langsung pakai kabel console, tanpa lewat jaringan.",
    how: [
      "Setting umum terminal: 9600 baud, 8 data bit, tanpa parity, 1 stop bit (8N1).",
      "Dipakai saat setup awal atau saat switch tidak bisa diakses lewat jaringan.",
    ],
    caution:
      "Jangan tinggalkan kabel console tercolok dan sesi login terbuka di rak.",
  },
  mgmt: {
    view: "rear",
    name: "Port manajemen (Gi0/0)",
    what: "Port khusus jaringan manajemen (out-of-band), terpisah dari trafik user.",
    how: ["SSH ke IP manajemen untuk administrasi harian."],
    caution:
      "Jangan pakai port ini untuk trafik user, dan batasi siapa yang bisa SSH ke IP manajemen.",
  },
  stack: {
    view: "rear",
    name: "Port stack",
    what: "Menyambung beberapa switch jadi satu stack yang dikelola sebagai satu switch.",
    how: [
      "Cek anggota stack dengan show switch.",
      "Port di switch kedua bernama Gi2/0/x, ketiga Gi3/0/x, dan seterusnya.",
    ],
    caution:
      "Kabel stack yang tercabut bisa memecah stack. Ikuti MOP saat mengganti kabel atau anggota stack.",
  },
  fan: {
    view: "rear",
    name: "Kipas",
    what: "Membuang panas dari dalam switch.",
    how: ["Cek kondisi kipas dan suhu dengan show environment."],
    caution:
      "Jangan halangi aliran udara di depan atau belakang rak. Switch yang kepanasan bisa mati sendiri.",
  },
  psu1: {
    view: "rear",
    name: "Power supply 1 (PSU)",
    what: "Sumber listrik switch. Umumnya ada dua PSU yang tersambung ke jalur listrik berbeda (A dan B).",
    how: [
      "Lampu hijau = normal, amber = rusak atau tidak dapat listrik.",
      "PSU bisa diganti saat switch menyala (hot-swap).",
    ],
    caution:
      "Sebelum mencabut PSU yang rusak, pastikan PSU lainnya hijau. Di switch PoE, satu PSU mungkin tidak cukup untuk semua perangkat.",
  },
  psu2: {
    view: "rear",
    name: "Power supply 2 (PSU)",
    what: "PSU cadangan. Kalau PSU 1 mati, switch tetap menyala dari PSU ini.",
    how: ["Cek status kedua PSU dengan show environment power."],
    caution:
      "Switch tetap menyala dengan satu PSU, tapi redundansi hilang. Buka tiket dan ganti sesuai SOP.",
  },
} satisfies Record<string, DevicePart>;

export type SwitchPartId = keyof typeof SWITCH_PARTS;
