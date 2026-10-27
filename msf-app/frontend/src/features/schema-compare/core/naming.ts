// Disalin dari db-schema-compare/src/core (sumber utama beserta test-nya).
// Satu-satunya perbedaan: import tanpa akhiran .ts. Ubah di sumbernya, lalu salin ulang.

// Pola pengecualian tabel dan penamaan snapshot. Tanpa I/O.

/** Pola cocok jika sama persis, atau diakhiri `*` dan nama berawalan sama. */
export function matchesPattern(name: string, pattern: string): boolean {
  if (pattern.endsWith('*')) {
    return name.startsWith(pattern.slice(0, -1));
  }
  return name === pattern;
}

export function isExcluded(name: string, patterns: readonly string[]): boolean {
  return patterns.some((pattern) => matchesPattern(name, pattern));
}

/** Menyisakan huruf, angka, titik, garis bawah, dan tanda hubung; aman sebagai nama file. */
export function safeFileStem(value: string): string {
  const cleaned = value
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/\.{2,}/g, '.')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 100);
  return cleaned || 'snapshot';
}

/** Contoh: label "production" pada 2026-08-18 09:14:22 UTC menjadi `production-20260818T091422`. */
export function makeSnapshotId(label: string, capturedAt: Date): string {
  const stamp = capturedAt.toISOString().replace(/[-:]/g, '').slice(0, 15);
  return `${safeFileStem(label)}-${stamp}`;
}
