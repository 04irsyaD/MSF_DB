import type { QuizItem } from "../../../components/Quiz";

export const PALO_QUIZ: QuizItem[] = [
  {
    q: "Bagaimana firewall membaca security policy?",
    options: [
      "Acak, tergantung beban",
      "Dari atas ke bawah, berhenti di rule pertama yang cocok",
      "Dari bawah ke atas",
      "Semua rule dicek lalu yang paling spesifik menang",
    ],
    answer: 1,
    explain:
      "Karena itu urutan penting: rule umum di atas bisa menutupi rule spesifik di bawahnya.",
  },
  {
    q: "Kamu sudah memindahkan rule, tapi trafik masih ditolak. Apa yang paling mungkin terlewat?",
    options: ["Reboot firewall", "Commit", "Ganti kabel", "Hapus traffic log"],
    answer: 1,
    explain: "Perubahan ada di candidate config dan baru aktif setelah commit.",
  },
  {
    q: "Traffic log: action allow, session end reason tcp-rst-from-server. Artinya?",
    options: [
      "Firewall memblokir trafik",
      "Server tujuan yang memutus koneksi; firewall sudah mengizinkan",
      "Ada virus",
      "Kabel putus",
    ],
    answer: 1,
    explain:
      "Masalahnya di sisi server atau aplikasi, bukan di policy firewall.",
  },
  {
    q: "Trafik dari trust ke dmz tidak cocok dengan rule mana pun. Hasilnya?",
    options: [
      "Diizinkan",
      "Ditolak oleh interzone-default",
      "Masuk Threat log",
      "Diteruskan ke peer HA",
    ],
    answer: 1,
    explain: "Trafik antar zone ditolak kecuali ada rule yang mengizinkan.",
  },
  {
    q: "Port MGT dipakai untuk apa?",
    options: [
      "Trafik user ke internet",
      "Akses manajemen GUI dan SSH",
      "Sinkronisasi HA",
      "Koneksi ke ISP",
    ],
    answer: 1,
    explain:
      "MGT tersambung ke management plane dan sebaiknya di jaringan manajemen terpisah.",
  },
  {
    q: "Kenapa rule sebaiknya memakai App-ID, bukan hanya port?",
    options: [
      "Supaya firewall lebih cepat",
      "Karena banyak aplikasi berbeda lewat port yang sama, mis. 443",
      "Karena port tidak bisa dipakai di rule",
      "Supaya log lebih kecil",
    ],
    answer: 1,
    explain:
      "Dengan App-ID, kamu bisa mengizinkan ssl tapi tetap menolak aplikasi lain di port 443.",
  },
  {
    q: "Mencabut kabel HA1/HA2 sembarangan bisa menyebabkan apa?",
    options: [
      "Tidak ada efek",
      "Kedua firewall bisa sama-sama active (split-brain)",
      "Firewall update otomatis",
      "Semua rule terhapus",
    ],
    answer: 1,
    explain:
      "Split-brain bisa membuat trafik kacau. Pekerjaan di link HA harus sesuai MOP.",
  },
];
