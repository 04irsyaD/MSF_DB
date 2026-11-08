import type { QuizItem } from "../../../components/Quiz";

export const QUIZ: QuizItem[] = [
  {
    q: "Lampu status di depan server berkedip amber. Apa langkah pertama yang tepat?",
    options: [
      "Langsung restart server",
      "Cek Dashboard dan log di iDRAC untuk tahu komponen yang bermasalah",
      "Cabut semua disk satu per satu",
      "Abaikan, server masih menyala",
    ],
    answer: 1,
    explain:
      "Amber berarti ada masalah hardware. Cari tahu komponennya dulu lewat iDRAC sebelum mengambil tindakan.",
  },
  {
    q: "Tombol apa yang ditekan saat boot untuk masuk System Setup (BIOS)?",
    options: ["F2", "F10", "F11", "F12"],
    answer: 0,
    explain:
      "F2 = System Setup. F10 Lifecycle Controller, F11 Boot Manager, F12 PXE.",
  },
  {
    q: "Kamu harus mengganti disk rusak. Apa yang dilakukan sebelum mencabut disk?",
    options: [
      "Matikan server dulu",
      "Nyalakan Blink di iDRAC dan cocokkan nomor bay",
      "Cabut disk yang paling panas",
      "Format disk lewat F10",
    ],
    answer: 1,
    explain:
      "Disk hot-swap, jadi server tidak perlu mati. Yang penting: pastikan slot yang benar dengan Blink.",
  },
  {
    q: "RAID 5 dengan 6 disk @ 1,92 TB. Berapa kapasitas terpakainya?",
    options: ["11,52 TB", "9,6 TB", "5,76 TB", "7,68 TB"],
    answer: 1,
    explain: "RAID 5 = (n − 1) disk. (6 − 1) × 1,92 TB = 9,6 TB.",
  },
  {
    q: "Satu PSU mati, server masih menyala. Tindakan yang benar?",
    options: [
      "Biarkan saja karena server masih normal",
      "Cabut PSU yang masih hidup untuk tes",
      "Buka tiket dan ganti PSU sesuai SOP, karena redundansi sudah hilang",
      "Restart server",
    ],
    answer: 2,
    explain:
      "Server berjalan tanpa cadangan. Kalau PSU kedua ikut mati, server langsung down.",
  },
  {
    q: "Port iDRAC dedicated terhubung ke jaringan apa?",
    options: [
      "Jaringan aplikasi",
      "Jaringan manajemen (out-of-band)",
      "Jaringan storage iSCSI",
      "Internet publik",
    ],
    answer: 1,
    explain:
      "iDRAC berada di jaringan manajemen terpisah, supaya server tetap bisa dikelola walau jaringan aplikasi atau OS bermasalah.",
  },
  {
    q: "Kenapa F12 (PXE boot) perlu hati-hati di production?",
    options: [
      "Bisa merusak keyboard",
      "Kalau ada server PXE dengan instalasi otomatis, server bisa terinstal ulang dan disk terhapus",
      "PXE mematikan iDRAC",
      "F12 menghapus BIOS",
    ],
    answer: 1,
    explain:
      "PXE mengambil image dari jaringan. Di lingkungan dengan auto-install, efeknya bisa menghapus OS yang ada.",
  },
];
