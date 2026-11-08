export type BootKeyId = "F2" | "F10" | "F11" | "F12";

export interface BootKey {
  name: string;
  short: string;
  what: string;
  when: string[];
  caution: string[];
  /** [judul menu, penjelasan]. null = tidak ada menu (PXE langsung boot dari jaringan). */
  items: [string, string][] | null;
}

export const BOOT_KEY_IDS: BootKeyId[] = ["F2", "F10", "F11", "F12"];

export const BOOT_KEYS: Record<BootKeyId, BootKey> = {
  F2: {
    name: "System Setup",
    short: "BIOS, iDRAC, RAID",
    what: "Pengaturan dasar server: BIOS, pengaturan iDRAC, dan perangkat seperti RAID controller dan NIC.",
    when: [
      "Mengatur IP iDRAC saat server baru dipasang",
      "Mengubah urutan boot atau boot mode (UEFI/BIOS)",
      "Mengaktifkan fitur virtualization untuk hypervisor",
    ],
    caution: [
      "Perubahan BIOS bisa membuat OS gagal boot, misalnya mengganti boot mode.",
      "Catat nilai lama sebelum mengubah, dan ubah hanya sesuai MOP.",
      "Keluar lewat Finish lalu konfirmasi simpan atau batalkan.",
    ],
    items: [
      [
        "System BIOS",
        "Pengaturan prosesor, memori, boot mode, urutan boot, dan keamanan.",
      ],
      [
        "iDRAC Settings",
        "Atur IP, user, dan jaringan iDRAC. Sering dipakai saat setup awal.",
      ],
      [
        "Device Settings",
        "Masuk ke konfigurasi perangkat: RAID controller (PERC), NIC, dan lainnya.",
      ],
    ],
  },
  F10: {
    name: "Lifecycle Controller",
    short: "Wizard OS, firmware, RAID",
    what: "Tool bawaan dengan wizard untuk install OS, update firmware, konfigurasi RAID, dan diagnostik, tanpa media tambahan.",
    when: [
      "Install OS dengan driver yang sudah disiapkan",
      "Update firmware dari file atau repository",
      "Membuat RAID lewat wizard",
      "Menjalankan diagnostik hardware",
    ],
    caution: [
      "Membuat RAID baru menghapus data di disk yang dipakai.",
      "Update firmware butuh reboot dan bisa lama: lakukan di maintenance window.",
      "Jangan matikan server saat update sedang berjalan.",
    ],
    items: [
      ["OS Deployment", "Wizard install OS, termasuk menyiapkan driver."],
      ["Firmware Update", "Update BIOS, iDRAC, PERC, NIC, dan lainnya."],
      [
        "Hardware Configuration",
        "Konfigurasi RAID dan perangkat lewat wizard.",
      ],
      [
        "Hardware Diagnostics",
        "Tes hardware untuk mencari komponen bermasalah.",
      ],
      ["Lifecycle Log", "Riwayat perubahan dan kejadian di server."],
    ],
  },
  F11: {
    name: "Boot Manager",
    short: "Pilih boot sekali jalan",
    what: "Memilih perangkat boot untuk sekali jalan, tanpa mengubah urutan boot permanen.",
    when: [
      "Boot dari file ISO yang di-mount lewat Virtual Media iDRAC",
      "Boot dari USB untuk tool tertentu",
    ],
    caution: [
      "Pastikan memilih perangkat yang benar. Boot dari installer bisa berlanjut ke proses install yang memformat disk.",
      "Pilihan ini hanya untuk sekali boot; boot berikutnya kembali normal.",
    ],
    items: [
      [
        "Integrated RAID Controller 1: VMware ESXi",
        "Disk lokal berisi OS. Boot normal.",
      ],
      [
        "Virtual Optical Drive (iDRAC)",
        "ISO dari laptop yang di-mount lewat Virtual Media.",
      ],
      ["Front USB", "Flashdisk yang dicolok di depan."],
      ["NIC Slot 1 Port 1 (PXE)", "Boot dari jaringan."],
    ],
  },
  F12: {
    name: "PXE Boot",
    short: "Boot dari jaringan",
    what: "Server boot dari jaringan: mencari server DHCP/PXE untuk mengambil image OS atau tool.",
    when: [
      "Install OS massal secara otomatis",
      "Menjalankan tool diagnostik lewat jaringan",
    ],
    caution: [
      "Kalau di jaringan ada server PXE dengan instalasi otomatis, server bisa langsung terinstal ulang dan disknya terhapus.",
      "Tanpa server PXE, proses akan timeout lalu lanjut ke perangkat boot berikutnya.",
    ],
    items: null,
  },
};

export const POST_LINES = [
  "Memeriksa memori... 256 GB OK",
  "Inisialisasi iDRAC... IP 192.0.2.10",
  "Inisialisasi PERC... VD0 RAID 5 Optimal",
  "Inisialisasi NIC... 4 port terdeteksi",
  "Menunggu input tombol...",
];

/** Lama layar POST sebelum lanjut boot ke OS (ms). */
export const POST_DURATION_MS = 8500;
export const POST_LINE_START_MS = 500;
export const POST_LINE_GAP_MS = 1300;
/** Jeda tampilan "F2 ditekan..." sebelum menu muncul (ms). */
export const KEY_ENTER_DELAY_MS = 800;
