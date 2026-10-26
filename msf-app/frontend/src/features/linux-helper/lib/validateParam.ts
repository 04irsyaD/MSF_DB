import type { LinuxParam, ParamType } from "./schema";

/**
 * Validasi nilai variabel runbook SEBELUM di-interpolasi ke command shell.
 *
 * Pakai pendekatan WHITELIST per tipe (bukan blacklist) supaya metacharacter shell
 * yang berbahaya untuk command injection — `;` `|` `&` `` ` `` `$(` `>` `<` newline, dll —
 * tidak pernah lolos. Ini sengaja ketat: nilai yang butuh karakter aneh (mis. password
 * dengan simbol) TIDAK dimasukkan lewat variabel; set manual/interaktif di server.
 */

const PATTERNS: Record<ParamType, RegExp> = {
  // Nama db/user/tabel: huruf/underscore di awal, lalu huruf/angka/underscore.
  identifier: /^[A-Za-z_][A-Za-z0-9_]*$/,
  // Teks aman: huruf, angka, spasi, dan sedikit tanda baca non-shell.
  string: /^[A-Za-z0-9 ._\-:@,/]+$/,
  // Bilangan bulat.
  number: /^-?\d+$/,
  // Port diperiksa lagi rentangnya di bawah.
  port: /^\d{1,5}$/,
  // IPv4; tiap oktet diperiksa rentangnya di bawah.
  ip: /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/,
  // IPv4/prefix (CIDR).
  cidr: /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/,
  // Path: boleh diawali '/', hanya huruf/angka/._-/ (tanpa spasi & metachar).
  path: /^\/?[A-Za-z0-9._\-/]+$/,
};

function octetsInRange(octets: string[]): boolean {
  return octets.every((o) => {
    const n = Number(o);
    return n >= 0 && n <= 255 && String(n) === String(Number(o));
  });
}

/**
 * Kembalikan pesan error (bahasa Indonesia) bila nilai tidak valid, atau `null` bila valid.
 */
export function validateParamValue(param: LinuxParam, rawValue: string): string | null {
  const value = rawValue.trim();

  if (value.length === 0) {
    return param.required ? `${param.label} wajib diisi.` : null;
  }

  const pattern = PATTERNS[param.type];
  if (!pattern.test(value)) {
    switch (param.type) {
      case "identifier":
        return "Hanya huruf, angka, dan underscore; harus diawali huruf/underscore.";
      case "number":
        return "Harus berupa angka bulat.";
      case "port":
        return "Port harus angka.";
      case "ip":
        return "Format IPv4 tidak valid (contoh: 192.168.1.10).";
      case "cidr":
        return "Format CIDR tidak valid (contoh: 10.0.0.0/24).";
      case "path":
        return "Path hanya boleh huruf, angka, titik, minus, underscore, dan garis miring (tanpa spasi).";
      case "string":
        return "Mengandung karakter yang tidak diizinkan. Hindari ; | & ` $ ( ) < > dan spasi ganda.";
      default:
        return "Nilai tidak valid.";
    }
  }

  if (param.type === "port") {
    const n = Number(value);
    if (n < 1 || n > 65535) return "Port harus antara 1 dan 65535.";
  }

  if (param.type === "ip") {
    const m = value.match(PATTERNS.ip)!;
    if (!octetsInRange(m.slice(1, 5))) return "Setiap bagian IP harus 0-255.";
  }

  if (param.type === "cidr") {
    const m = value.match(PATTERNS.cidr)!;
    if (!octetsInRange(m.slice(1, 5))) return "Setiap bagian IP harus 0-255.";
    const prefix = Number(m[5]);
    if (prefix < 0 || prefix > 32) return "Prefix CIDR harus antara 0 dan 32.";
  }

  return null;
}

/** Validasi seluruh var; kembalikan map error per key (kosong bila semua valid). */
export function validateAllParams(
  params: LinuxParam[],
  values: Record<string, string>
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const p of params) {
    const err = validateParamValue(p, values[p.key] ?? "");
    if (err) errors[p.key] = err;
  }
  return errors;
}
