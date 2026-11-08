import type { QuizItem } from "../../../components/Quiz";

export const CISCO_QUIZ: QuizItem[] = [
  {
    q: "Prompt SW-DEMO-01> berarti kamu sedang di mode apa?",
    options: [
      "User EXEC",
      "Privileged EXEC",
      "Global configuration",
      "Interface configuration",
    ],
    answer: 0,
    explain:
      "Tanda > = User EXEC. Ketik enable untuk naik ke Privileged EXEC (tanda #).",
  },
  {
    q: "Sebuah port berstatus err-disabled. Apa langkah pertama yang tepat?",
    options: [
      "Langsung shutdown lalu no shutdown",
      "Cek show logging untuk tahu penyebabnya",
      "Reload switch",
      "Pindahkan kabel ke port lain",
    ],
    answer: 1,
    explain:
      "Kalau penyebabnya belum hilang (mis. perangkat asing masih tercolok), port akan err-disabled lagi setelah dinyalakan.",
  },
  {
    q: "Kamu mengubah konfigurasi, lalu switch reload sebelum write memory. Apa yang terjadi?",
    options: [
      "Perubahan tetap ada",
      "Perubahan hilang; switch memakai startup-config lama",
      "Switch tidak bisa boot",
      "Seluruh konfigurasi terhapus",
    ],
    answer: 1,
    explain:
      "Perubahan hanya ada di running-config (RAM). Tanpa write memory, startup-config tidak berubah.",
  },
  {
    q: "Port mana yang paling berbahaya untuk di-shutdown?",
    options: [
      "Port printer",
      "Port user yang sedang cuti",
      "Port uplink ke core",
      "Port yang notconnect",
    ],
    answer: 2,
    explain:
      "Uplink membawa trafik semua user di switch itu. Kalau kamu SSH lewat uplink itu, sesimu juga ikut putus.",
  },
  {
    q: "PC-A di VLAN 10 dan PC-B di VLAN 20, di switch yang sama. Bisakah mereka langsung saling kirim data?",
    options: [
      "Bisa, karena satu switch",
      "Tidak, harus lewat routing (router atau SVI) dan diizinkan aturan akses",
      "Bisa, asal kabelnya sama",
      "Tidak, kecuali switch di-reload",
    ],
    answer: 1,
    explain:
      "VLAN memisahkan jaringan di Layer 2. Antar VLAN harus di-route, dan biasanya dibatasi ACL atau firewall.",
  },
  {
    q: "Perintah untuk melihat perangkat Cisco yang tersambung langsung ke switch ini?",
    options: [
      "show vlan brief",
      "show cdp neighbors",
      "show version",
      "show logging",
    ],
    answer: 1,
    explain:
      "show cdp neighbors menampilkan nama tetangga, port lokal, dan port di sisi tetangga.",
  },
  {
    q: "Kenapa perintah show aman dijalankan di jam kerja?",
    options: [
      "Karena hanya membaca status, tidak mengubah konfigurasi",
      "Karena otomatis dibatalkan setelah 1 menit",
      "Karena hanya admin yang bisa menjalankannya",
      "Karena tidak tercatat di log",
    ],
    answer: 0,
    explain:
      "Yang perlu hati-hati adalah perintah di mode configure, reload, dan write erase.",
  },
];
