/**
 * Teks UI terpusat untuk Linux Helper (siap i18n).
 * Konten berbahasa Indonesia; istilah teknis Linux tetap Inggris.
 */
export const LINUX_HELPER_LABELS = {
  header: {
    title: "Linux Helper",
    subtitle: "Shortcut & command server, bertingkat dari dasar",
    infoTitle: "Jalur belajar terminal Linux untuk setup server DB",
    infoDescription:
      "Mulai dari shortcut keyboard dasar sampai runbook install & setup server database. Semua jalan di browser, tanpa koneksi ke server mana pun.",
    dismissInfo: "Tutup banner panduan",
  },
  levels: {
    "0": { name: "Dasar Terminal", short: "Dasar" },
    "1": { name: "Navigasi & File", short: "Navigasi" },
    "2": { name: "Sistem & Jaringan", short: "Sistem" },
    "3": { name: "Runbook Server DB", short: "Runbook" },
  },
  filter: {
    envLabel: "Lingkungan",
    distroLabel: "Distro",
    categoryLabel: "Kategori",
    desktop: "Desktop",
    ssh: "SSH",
    ubuntu: "Ubuntu / Debian",
    rhel: "RHEL / Rocky",
    allCategories: "Semua",
    resetAll: "Reset filter",
    clear: "Bersihkan",
  },
  categories: {
    dasar: "Dasar",
    info: "Info",
    navigasi: "Navigasi",
    file: "File",
    teks: "Teks",
    arsip: "Arsip",
    service: "Service",
    log: "Log",
    disk: "Disk",
    proses: "Proses",
    izin: "Izin",
    user: "User",
    jaringan: "Jaringan",
    firewall: "Firewall",
  } as Record<string, string>,
  variant: {
    label: "Menyesuaikan distro",
    hint: "Command berubah mengikuti distro yang dipilih di filter.",
  },
  search: {
    placeholder: "Cari shortcut atau command... (tekan / untuk fokus)",
    label: "Cari shortcut & command Linux",
    clear: "Bersihkan pencarian",
    shortcutHint: "/",
  },
  sections: {
    ssh: "Cara masuk ke server",
    shortcuts: "Shortcut keyboard",
    commands: "Command dasar",
  },
  ssh: {
    description:
      "Dari komputermu, buka terminal lalu sambungkan ke server lewat SSH. Ganti user dan host sesuai server kamu.",
    windowsHint:
      "Windows: buka Windows Terminal dari menu Win + X, atau cari \"Terminal\" di Start.",
  },
  shortcut: {
    warningPrefix: "Perhatian:",
    altLabel: "atau",
  },
  card: {
    copy: "Copy",
    copied: "Tersalin",
    details: "View Details",
  },
  drawer: {
    commandTitle: "Command",
    explainTitle: "Penjelasan per bagian",
    noteTitle: "Catatan",
    tagsTitle: "Tag",
    close: "Tutup",
  },
  terminal: {
    copy: "Salin command",
    copied: "Tersalin",
  },
  pagination: {
    prev: "Sebelumnya",
    next: "Berikutnya",
    pageOf: "dari",
  },
  palette: {
    open: "Cari cepat",
    placeholder: "Cari shortcut, command, atau runbook...",
    empty: "Tidak ada hasil.",
    hintKey: "Ctrl K",
    typeCommand: "Command",
    typeShortcut: "Shortcut",
    typeRunbook: "Runbook",
  },
  runbook: {
    open: "Buka runbook",
    back: "Kembali ke daftar runbook",
    varsTitle: "Isi variabel",
    varsHint:
      "Nilai di sini mengisi {{...}} di semua langkah. Hanya karakter aman yang diterima (anti command injection).",
    stepsTitle: "Langkah-langkah",
    verifyLabel: "Cek hasil",
    errorsTitle: "Error umum & solusi",
    errorLabel: "Error",
    fixLabel: "Solusi",
    stepDone: "Tandai langkah selesai",
    progressSuffix: "langkah selesai",
    export: "Unduh .sh",
    exportBlocked: "Lengkapi variabel wajib dulu sebelum mengunduh.",
    stepCount: "langkah",
  },
  toast: {
    copySuccess: "Disalin ke clipboard",
    copyFailed: "Gagal menyalin",
  },
  risk: {
    low: "Aman",
    medium: "Hati-hati",
    high: "Berisiko",
    bannerMedium:
      "Command ini mengubah file atau konfigurasi sistem. Pastikan kamu paham efeknya sebelum menjalankan.",
    bannerHigh:
      "Command ini berpotensi merusak: menghapus data, mengubah izin/akses, atau me-restart layanan. Backup dulu dan pastikan target sudah benar.",
    confirmPrompt: "Saya paham risikonya dan tetap ingin menyalin command ini.",
    confirmFirst: "Buka detail lalu konfirmasi dulu sebelum menyalin.",
  },
  empty: {
    title: "Belum ada konten",
    description: "Konten level ini sedang disiapkan.",
    filtered: "Tidak ada item yang cocok dengan filter.",
  },
} as const;
