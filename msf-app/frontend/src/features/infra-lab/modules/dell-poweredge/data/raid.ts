export type RaidLevel = 0 | 1 | 5 | 6 | 10;
export type DiskRole = "data" | "parity" | "mirror";

export const RAID_LEVELS: RaidLevel[] = [0, 1, 5, 6, 10];

export const DISK_SIZES = [
  { value: 0.96, label: "960 GB" },
  { value: 1.92, label: "1,92 TB" },
  { value: 3.84, label: "3,84 TB" },
  { value: 8, label: "8 TB" },
];

export const DISK_MIN = 2;
export const DISK_MAX = 12;

export interface RaidInfo {
  min: number;
  ok: boolean;
  /** Jumlah disk yang menjadi kapasitas terpakai. */
  usable: number;
  tolerance: string;
  note: string;
  use: string;
}

export function raidInfo(level: RaidLevel, n: number): RaidInfo {
  switch (level) {
    case 0:
      return {
        min: 2,
        ok: true,
        usable: n,
        tolerance: "0 disk",
        note: "Cepat, tapi satu disk rusak = semua data hilang. Hampir tidak dipakai di production.",
        use: "Data sementara",
      };
    case 1:
      return {
        min: 2,
        ok: n === 2,
        usable: 1,
        tolerance: "1 disk",
        note: "Dua disk saling mirror. Di PERC, RAID 1 memakai tepat 2 disk; untuk lebih banyak pakai RAID 10.",
        use: "Disk OS",
      };
    case 5:
      return {
        min: 3,
        ok: n >= 3,
        usable: n - 1,
        tolerance: "1 disk",
        note: "Paritas tersebar di semua disk. Hemat kapasitas, tapi rebuild disk besar lama dan berisiko.",
        use: "Data umum",
      };
    case 6:
      return {
        min: 4,
        ok: n >= 4,
        usable: n - 2,
        tolerance: "2 disk",
        note: "Seperti RAID 5 dengan dua paritas. Lebih aman untuk disk besar.",
        use: "Data besar / arsip",
      };
    case 10:
      return {
        min: 4,
        ok: n >= 4 && n % 2 === 0,
        usable: n / 2,
        tolerance: "1 per pasangan",
        note: "Gabungan mirror dan stripe. Performa tulis bagus, kapasitas 50%. Butuh jumlah disk genap.",
        use: "Database, VM",
      };
  }
}

export function invalidReason(level: RaidLevel, min: number) {
  if (level === 1) return "RAID 1 di PERC memakai tepat 2 disk.";
  if (level === 10) return "RAID 10 butuh minimal 4 disk dan jumlahnya genap.";
  return `RAID ${level} butuh minimal ${min} disk.`;
}

/** Peran disk ke-i (untuk warna & label) dan teks kecil di bawah nomor disk. */
export function diskRole(
  level: RaidLevel,
  n: number,
  i: number,
): { role: DiskRole; label: string } {
  if (level === 1) return { role: "mirror", label: "mirror" };
  if (level === 10)
    return { role: "mirror", label: `pasangan ${Math.floor(i / 2) + 1}` };
  if (level === 5 || level === 6) {
    const parity = i >= n - (level === 5 ? 1 : 2);
    return parity
      ? { role: "parity", label: "setara paritas" }
      : { role: "data", label: "data" };
  }
  return { role: "data", label: "data" };
}

/** Apakah data hilang dengan disk rusak tertentu. */
export function isDataLost(level: RaidLevel, failed: number[]): boolean {
  const count = failed.length;
  if (count === 0) return false;
  if (level === 0) return true;
  if (level === 1 || level === 5) return count >= 2;
  if (level === 6) return count >= 3;
  const perPair = new Map<number, number>();
  for (const i of failed) {
    const pair = Math.floor(i / 2);
    perPair.set(pair, (perPair.get(pair) ?? 0) + 1);
  }
  return [...perPair.values()].some((c) => c >= 2);
}

/** Format angka gaya Indonesia: 9.6 -> "9,6". */
export function fmtTb(x: number) {
  return (Math.round(x * 100) / 100).toString().replace(".", ",");
}
