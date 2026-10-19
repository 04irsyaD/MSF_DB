/**
 * Ukuran kartu tabel dan batas viewport diagram.
 * Nilai di sini WAJIB sama dengan ukuran render di `TableCard.tsx`
 * karena dipakai untuk menghitung titik garis relasi dan Fit.
 */

export const CARD_WIDTH = 220;
export const CARD_BORDER = 1;
export const HEADER_HEIGHT = 42;
export const ROW_HEIGHT = 28;
export const LIST_PADDING = 4;

export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 2;
export const ZOOM_STEP = 1.2;

export const FIT_PADDING = 40;
export const GAP_X = 100;
export const GAP_Y = 50;
export const LAYOUT_ORIGIN = 80;

export const LAYOUT_OPTIONS = [
  { value: "horizontal", label: "Horizontal" },
  { value: "vertical", label: "Vertikal" },
  { value: "grid", label: "Grid" },
  { value: "smart-grid", label: "Grid + Pusat Relasi" },
  { value: "radial", label: "Lingkaran" },
  { value: "centric", label: "Pusat Relasi" },
  { value: "organic", label: "Organik (Force)" },
] as const;

export type LayoutStyle = (typeof LAYOUT_OPTIONS)[number]["value"];
