export type ServerView = "front" | "rear";

export interface ServerPart {
  view: ServerView;
  name: string;
  /** Fungsinya */
  what: string;
  /** Cara pakai */
  how: string[];
  /** Perhatikan */
  caution: string;
}

export const PARTS = {
  power: {
    view: "front",
    name: "Tombol power",
    what: "Menyalakan dan mematikan server. Biasanya ada lampu di sekelilingnya yang menyala saat server hidup.",
    how: [
      "Tekan sekali saat server mati = menyala.",
      "Tekan sekali saat server hidup = minta OS shutdown dengan sopan (graceful).",
      "Tahan beberapa detik = mati paksa, seperti mencabut listrik.",
    ],
    caution:
      "Jangan pernah menahan tombol power di server production tanpa izin dan MOP. Mati paksa bisa merusak data aplikasi.",
  },
  health: {
    view: "front",
    name: "Indikator status / health",
    what: "Lampu yang memberi tahu kondisi server. Di beberapa model ada panel LCD kecil yang menampilkan pesan error.",
    how: [
      "Biru atau hijau = normal.",
      "Amber (oranye), terutama berkedip = ada masalah hardware.",
      "Lihat pesan di LCD, lalu cek detailnya di iDRAC.",
    ],
    caution:
      "Lampu amber bukan berarti server mati, tapi jangan diabaikan. Selalu cari penyebabnya di log iDRAC.",
  },
  tag: {
    view: "front",
    name: "Service Tag (tag tarik)",
    what: "Tag yang bisa ditarik dari bagian depan, berisi Service Tag (kode 7 karakter) dan info awal iDRAC.",
    how: [
      "Tarik tag-nya untuk membaca Service Tag.",
      "Pakai Service Tag untuk cek garansi, spesifikasi asli, dan buka tiket ke Dell Support.",
      "Di server baru, password awal iDRAC sering tercetak di sini.",
    ],
    caution:
      "Foto Service Tag boleh untuk tiket, tapi jangan sebarkan info password awal iDRAC.",
  },
  drives: {
    view: "front",
    name: "Drive bay (slot disk)",
    what: "Tempat disk HDD/SSD/NVMe dipasang. Tiap bay punya nomor dan dua lampu: aktivitas dan status.",
    how: [
      "Disk bisa dicabut saat server menyala (hot-swap).",
      "Lampu status amber berkedip = disk rusak atau akan rusak (predictive failure).",
      "Nyalakan Blink di iDRAC supaya lampu disk yang dituju berkedip.",
    ],
    caution:
      "Kesalahan paling klasik: salah hitung nomor bay lalu mencabut disk sehat. Di RAID yang sudah degraded, ini bisa menghilangkan data.",
  },
  frontio: {
    view: "front",
    name: "Port depan (USB & VGA)",
    what: "Untuk menyambung monitor dan keyboard langsung ke server (sering disebut crash cart).",
    how: [
      "Sambung monitor ke VGA dan keyboard ke USB.",
      "Berguna saat jaringan dan iDRAC tidak bisa diakses.",
    ],
    caution:
      "Jangan colok flashdisk sembarangan ke server production; bisa berisi malware atau memicu boot dari USB.",
  },
  idracdirect: {
    view: "front",
    name: "iDRAC Direct",
    what: "Port USB khusus untuk menyambung laptop langsung ke iDRAC, tanpa lewat jaringan.",
    how: [
      "Sambung kabel USB dari laptop ke port ini.",
      "Buka browser ke alamat iDRAC Direct sesuai panduan model.",
      "Dipakai saat setup awal atau saat IP iDRAC belum diketahui.",
    ],
    caution:
      "Pastikan kamu tahu kredensial iDRAC yang berlaku dan catat aktivitasmu.",
  },
  rearports: {
    view: "rear",
    name: "Port belakang (VGA, serial, USB)",
    what: "Port tambahan di belakang untuk monitor, keyboard, atau kabel serial.",
    how: ["Fungsinya sama dengan port depan, hanya letaknya di belakang rak."],
    caution:
      "Rapikan kabel kembali setelah selesai; kabel menggantung bisa tercabut orang lain.",
  },
  sysid: {
    view: "rear",
    name: "Tombol System ID",
    what: "Menyalakan lampu biru di depan dan belakang server supaya mudah ditemukan di antara banyak server di rak.",
    how: [
      "Tekan tombolnya, atau nyalakan Identify dari iDRAC secara remote.",
      "Rekan di data center tinggal mencari server yang berkedip biru.",
    ],
    caution:
      "Biasakan Identify server dulu sebelum mencabut kabel apa pun di belakang rak.",
  },
  idrac: {
    view: "rear",
    name: "Port iDRAC (dedicated)",
    what: "Port jaringan khusus iDRAC. Tersambung ke jaringan manajemen (out-of-band), terpisah dari jaringan aplikasi.",
    how: [
      "Akses lewat browser: https://<IP-iDRAC>.",
      "Bisa juga SSH ke IP iDRAC untuk memakai perintah racadm.",
    ],
    caution:
      "Jangan tertukar dengan port NIC biasa. Kalau kabel iDRAC dicabut, tim kehilangan akses remote ke server.",
  },
  pcie: {
    view: "rear",
    name: "Slot PCIe (riser)",
    what: "Tempat kartu tambahan: NIC tambahan, HBA Fibre Channel untuk storage, GPU, atau RAID controller.",
    how: [
      "Catat kartu apa ada di slot berapa (lihat di iDRAC > System > Network/Storage).",
    ],
    caution: "Menambah atau melepas kartu butuh server dimatikan dan MOP.",
  },
  nic: {
    view: "rear",
    name: "Port jaringan (LOM/OCP)",
    what: "Port Ethernet utama yang tersambung ke switch Cisco untuk trafik aplikasi dan storage (mis. iSCSI/NFS).",
    how: [
      "Lampu link menyala = kabel tersambung. Lampu kedip = ada trafik.",
      "Cocokkan label kabel dengan dokumen: port server mana ke port switch mana.",
    ],
    caution:
      "Mencabut kabel NIC bisa memutus layanan aplikasi. Pastikan kabel yang benar dan ada izin.",
  },
  psu1: {
    view: "rear",
    name: "Power supply 1 (PSU)",
    what: "Sumber daya listrik server. Biasanya ada dua PSU (redundan) yang masing-masing ke jalur listrik berbeda (A dan B).",
    how: [
      "Lampu hijau = normal. Amber = rusak atau tidak dapat listrik.",
      "PSU bisa diganti saat server menyala (hot-swap).",
    ],
    caution:
      "Sebelum mencabut PSU yang rusak, pastikan PSU lainnya hijau. Jangan pernah mencabut keduanya.",
  },
  psu2: {
    view: "rear",
    name: "Power supply 2 (PSU)",
    what: "PSU cadangan. Kalau PSU 1 mati, server tetap menyala dari PSU ini.",
    how: ["Cek status kedua PSU di iDRAC > Dashboard atau System > Power."],
    caution:
      "Server tetap nyala dengan satu PSU, tapi redundansi hilang. Tetap buka tiket dan ganti sesuai SOP.",
  },
} satisfies Record<string, ServerPart>;

export type PartId = keyof typeof PARTS;

export const PART_IDS = Object.keys(PARTS) as PartId[];

/** Bagian yang dipilih otomatis saat berganti tampak. */
export const DEFAULT_PART: Record<ServerView, PartId> = {
  front: "drives",
  rear: "psu1",
};
