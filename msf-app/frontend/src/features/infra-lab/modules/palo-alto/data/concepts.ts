import type { Concept } from "../../../components/ConceptExplorer";

export const PALO_CONCEPTS: Concept[] = [
  {
    id: "zone",
    title: "Zone",
    summary: "Kelompok interface dengan tingkat kepercayaan sama.",
    detail:
      "Setiap interface data masuk ke satu zone, mis. trust (LAN kantor), untrust (internet), dmz (server yang bisa diakses dari luar). Security policy ditulis dari zone ke zone.",
    points: [
      "Trafik antar zone ditolak kecuali ada rule yang mengizinkan (interzone-default: deny).",
      "Trafik di dalam zone yang sama diizinkan secara default (intrazone-default).",
    ],
    example:
      "trust -> untrust : user kantor ke internet\ntrust -> dmz     : user kantor ke server DMZ",
  },
  {
    id: "policy",
    title: "Security policy",
    summary: "Daftar aturan izinkan/tolak yang dibaca dari atas.",
    detail:
      "Firewall memeriksa rule dari atas ke bawah dan berhenti di rule pertama yang cocok. Urutan rule sama pentingnya dengan isinya.",
    points: [
      "Rule yang terlalu umum di atas bisa menutupi (shadow) rule spesifik di bawahnya.",
      "Uji dengan test security-policy-match untuk tahu rule mana yang kena.",
    ],
    example:
      "test security-policy-match from trust to dmz source 192.0.2.25\n  destination 198.51.100.80 destination-port 443 protocol 6 application ssl",
  },
  {
    id: "appid",
    title: "App-ID",
    summary: "Mengenali aplikasi dari isi trafik, bukan cuma port.",
    detail:
      "Palo Alto bisa membedakan ssl, web-browsing, facebook-base, dan lainnya walau sama-sama lewat port 443. Rule sebaiknya memakai nama aplikasi, bukan sekadar nomor port.",
    points: [
      "Service application-default = aplikasi hanya diizinkan di port standarnya.",
    ],
    example: "application: ssl\nservice: application-default",
  },
  {
    id: "nat",
    title: "NAT",
    summary: "Menerjemahkan alamat IP saat trafik lewat.",
    detail:
      "Source NAT membuat user internal keluar ke internet dengan IP publik. Destination NAT membuat server di DMZ bisa diakses dari luar lewat IP publik.",
    points: [
      "Policy NAT dan security policy terpisah; keduanya harus benar.",
      "Security policy memakai IP tujuan sebelum NAT (pre-NAT) dan zone tujuan setelah NAT.",
    ],
  },
  {
    id: "commit",
    title: "Candidate vs running config",
    summary: "Perubahan baru aktif setelah commit.",
    detail:
      "Semua perubahan di GUI atau CLI masuk ke candidate config. Firewall tetap memakai running config sampai kamu menjalankan Commit.",
    points: [
      "Lupa commit = perubahan belum berlaku.",
      "Sebelum commit, cek Preview Changes dan pastikan sesuai MOP.",
    ],
    example: "admin@FW-DEMO-01> configure\nadmin@FW-DEMO-01# commit",
  },
  {
    id: "planes",
    title: "Management vs data plane",
    summary: "Otak manajemen dan mesin pemroses trafik terpisah.",
    detail:
      "Management plane menjalankan GUI, CLI, dan log. Data plane memproses trafik user. Karena terpisah, GUI yang lambat belum tentu berarti trafik terganggu, dan sebaliknya.",
    points: ["Port MGT tersambung ke management plane, bukan ke trafik user."],
  },
];
