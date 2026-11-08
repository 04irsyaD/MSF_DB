import type { Concept } from "../../../components/ConceptExplorer";
import { SW_HOST } from "./device";

export const SWITCH_ROLES = [
  {
    title: "Access",
    body: "Switch tempat perangkat user tersambung: PC, telepon IP, printer, access point. Paling sering kamu pegang.",
  },
  {
    title: "Distribution",
    body: "Mengumpulkan banyak switch access, biasanya per gedung atau lantai, dan sering menjadi tempat routing antar VLAN.",
  },
  {
    title: "Core",
    body: "Tulang punggung jaringan data center atau kampus. Gangguan di sini berdampak ke banyak layanan sekaligus.",
  },
];

export const CLI_MODES: Concept[] = [
  {
    id: "user",
    title: "User EXEC",
    summary: `Prompt ${SW_HOST}> : mode awal setelah login.`,
    detail:
      "Mode paling terbatas. Hanya sebagian kecil perintah yang bisa dipakai, dan tidak ada yang mengubah konfigurasi.",
    points: ["Ketik enable untuk naik ke Privileged EXEC."],
    example: `${SW_HOST}> enable\n${SW_HOST}#`,
  },
  {
    id: "priv",
    title: "Privileged EXEC",
    summary: `Prompt ${SW_HOST}# : semua perintah show tersedia.`,
    detail:
      "Tempat kerja harian untuk troubleshooting. Semua perintah show ada di sini, tapi juga perintah berbahaya seperti reload dan write erase.",
    points: [
      "Perintah show hanya membaca, aman dijalankan.",
      "write memory menyimpan konfigurasi yang sedang berjalan supaya tidak hilang saat reboot.",
    ],
    example: `${SW_HOST}# show ip interface brief`,
  },
  {
    id: "config",
    title: "Global configuration",
    summary: `Prompt ${SW_HOST}(config)# : mengubah konfigurasi switch.`,
    detail:
      "Masuk dengan configure terminal. Setiap perintah langsung aktif begitu Enter ditekan, tanpa tombol simpan atau konfirmasi.",
    points: [
      "Perubahan langsung berlaku di running-config.",
      "Perintah show bisa dijalankan dari sini dengan awalan do, mis. do show interfaces status.",
    ],
    example: `${SW_HOST}# configure terminal\n${SW_HOST}(config)#`,
  },
  {
    id: "if",
    title: "Interface configuration",
    summary: `Prompt ${SW_HOST}(config-if)# : mengubah satu port.`,
    detail:
      "Masuk dengan interface <nama port>. Perintah seperti shutdown, no shutdown, atau description hanya berlaku ke port itu.",
    points: [
      "end langsung kembali ke Privileged EXEC.",
      "exit naik satu tingkat ke Global configuration.",
    ],
    example: `${SW_HOST}(config)# interface gi1/0/12\n${SW_HOST}(config-if)# no shutdown`,
  },
  {
    id: "save",
    title: "running-config vs startup-config",
    summary: "Konfigurasi aktif di memori vs yang dibaca saat boot.",
    detail:
      "running-config adalah konfigurasi yang sedang dipakai (di RAM). startup-config adalah yang dibaca saat switch menyala. Perubahan yang belum disimpan hilang saat reload.",
    points: [
      "Simpan dengan write memory (atau copy running-config startup-config).",
      "Karena perubahan langsung aktif, kesalahan juga langsung berdampak. Simpan hanya setelah verifikasi.",
    ],
    example: `${SW_HOST}# write memory\nBuilding configuration...\n[OK]`,
  },
];
