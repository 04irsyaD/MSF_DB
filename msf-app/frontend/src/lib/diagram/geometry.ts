/**
 * Geometri diagram: identitas tabel, ukuran kartu, bounding box, Fit,
 * zoom berporos, dan rute garis relasi FK.
 * Fungsi murni tanpa React/DOM agar bisa dites dengan `node --test`.
 */

import type { ForeignKeyMetadata, TableMetadata } from "@/lib/types";
import {
  CARD_BORDER,
  CARD_WIDTH,
  FIT_PADDING,
  HEADER_HEIGHT,
  LIST_PADDING,
  MAX_ZOOM,
  MIN_ZOOM,
  ROW_HEIGHT,
} from "./constants.ts";

export interface Point {
  x: number;
  y: number;
}

export interface Box {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface Viewport {
  zoom: number;
  x: number;
  y: number;
}

export type Positions = Record<string, Point>;

/** Kunci unik tabel: schema + nama, agar tabel bernama sama di schema berbeda tidak bertabrakan. */
export function tableKey(table: Pick<TableMetadata, "schema" | "name">): string {
  return `${table.schema ?? ""}.${table.name}`;
}

export function tableHeight(table: Pick<TableMetadata, "columns">): number {
  return CARD_BORDER * 2 + HEADER_HEIGHT + LIST_PADDING * 2 + table.columns.length * ROW_HEIGHT;
}

/** Cari tabel tujuan FK: utamakan schema yang sama, lalu nama saja. */
export function resolveFkTarget(
  tables: TableMetadata[],
  source: TableMetadata,
  fk: ForeignKeyMetadata
): TableMetadata | undefined {
  return (
    tables.find((t) => t.name === fk.references_table && t.schema === source.schema) ??
    tables.find((t) => t.name === fk.references_table)
  );
}

export function boundingBox(tables: TableMetadata[], positions: Positions): Box | null {
  let box: Box | null = null;
  for (const table of tables) {
    const pos = positions[tableKey(table)];
    if (!pos) continue;
    const right = pos.x + CARD_WIDTH;
    const bottom = pos.y + tableHeight(table);
    box = box
      ? {
          minX: Math.min(box.minX, pos.x),
          minY: Math.min(box.minY, pos.y),
          maxX: Math.max(box.maxX, right),
          maxY: Math.max(box.maxY, bottom),
        }
      : { minX: pos.x, minY: pos.y, maxX: right, maxY: bottom };
  }
  return box;
}

export function expandBox(box: Box, margin: number): Box {
  return { minX: box.minX - margin, minY: box.minY - margin, maxX: box.maxX + margin, maxY: box.maxY + margin };
}

export function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

/**
 * Viewport yang menampilkan seluruh `box` di tengah area `width` x `height`.
 * `topInset` = tinggi area yang tertutup toolbar mengambang di atas kanvas.
 */
export function fitViewport(
  box: Box,
  width: number,
  height: number,
  padding = FIT_PADDING,
  topInset = 0
): Viewport {
  const boxW = Math.max(1, box.maxX - box.minX);
  const boxH = Math.max(1, box.maxY - box.minY);
  const usableH = Math.max(1, height - topInset);
  const availW = Math.max(1, width - padding * 2);
  const availH = Math.max(1, usableH - padding * 2);
  const zoom = clampZoom(Math.min(availW / boxW, availH / boxH, 1.3));
  return {
    zoom,
    x: width / 2 - (box.minX + boxW / 2) * zoom,
    y: topInset + usableH / 2 - (box.minY + boxH / 2) * zoom,
  };
}

/** Zoom dengan titik `pivot` (koordinat layar relatif kontainer) tetap di tempat. */
export function zoomAt(view: Viewport, nextZoom: number, pivot: Point): Viewport {
  const zoom = clampZoom(nextZoom);
  const worldX = (pivot.x - view.x) / view.zoom;
  const worldY = (pivot.y - view.y) / view.zoom;
  return { zoom, x: pivot.x - worldX * zoom, y: pivot.y - worldY * zoom };
}

export function screenToWorld(view: Viewport, point: Point): Point {
  return { x: (point.x - view.x) / view.zoom, y: (point.y - view.y) / view.zoom };
}

/** Titik Y tengah baris kolom pada kartu (fallback ke tengah header jika kolom tidak ada). */
export function columnAnchorY(table: TableMetadata, pos: Point, columnName: string): number {
  const idx = table.columns.findIndex((c) => c.name === columnName);
  if (idx < 0) return pos.y + CARD_BORDER + HEADER_HEIGHT / 2;
  return pos.y + CARD_BORDER + HEADER_HEIGHT + LIST_PADDING + idx * ROW_HEIGHT + ROW_HEIGHT / 2;
}

export interface Relation {
  key: string;
  sourceKey: string;
  targetKey: string;
  d: string;
  arrow: string;
  start: Point;
}

const STUB = 24;
const ARROW = 6;

/** Garis relasi bergaya siku (H -> V -> H) dengan panah yang selalu menghadap tabel tujuan. */
export function buildRelations(tables: TableMetadata[], positions: Positions): Relation[] {
  const relations: Relation[] = [];
  const exitCounts: Record<string, { left: number; right: number }> = {};
  let relationIndex = 0;

  for (const source of tables) {
    const sourceKey = tableKey(source);
    const sourcePos = positions[sourceKey];
    if (!sourcePos) continue;

    source.foreign_keys?.forEach((fk, fkIdx) => {
      const target = resolveFkTarget(tables, source, fk);
      if (!target) return;
      const targetKey = tableKey(target);
      const targetPos = positions[targetKey];
      if (!targetPos) return;

      relationIndex++;
      const sourceY = columnAnchorY(source, sourcePos, fk.column);
      const targetY = columnAnchorY(target, targetPos, fk.references_column);

      const sourceIsLeft = sourcePos.x + CARD_WIDTH <= targetPos.x;
      const sourceIsRight = sourcePos.x >= targetPos.x + CARD_WIDTH;
      const overlapping = !sourceIsLeft && !sourceIsRight;

      let side: "left" | "right";
      let startX: number;
      let endX: number;
      if (sourceIsLeft) {
        side = "right";
        startX = sourcePos.x + CARD_WIDTH;
        endX = targetPos.x;
      } else if (sourceIsRight) {
        side = "left";
        startX = sourcePos.x;
        endX = targetPos.x + CARD_WIDTH;
      } else {
        const distRight = Math.abs(sourcePos.x + CARD_WIDTH - (targetPos.x + CARD_WIDTH / 2));
        const distLeft = Math.abs(sourcePos.x - (targetPos.x + CARD_WIDTH / 2));
        side = sourceKey === targetKey || distRight < distLeft ? "right" : "left";
        startX = side === "right" ? sourcePos.x + CARD_WIDTH : sourcePos.x;
        endX = side === "right" ? targetPos.x + CARD_WIDTH : targetPos.x;
      }

      exitCounts[sourceKey] ??= { left: 0, right: 0 };
      const parallelOffset = exitCounts[sourceKey][side]++ * 6;
      const sx = side === "right" ? startX + parallelOffset : startX - parallelOffset;
      const lane = (((relationIndex * 17) % 5) - 2) * 12;

      let lastX: number;
      let d: string;
      if (!overlapping) {
        lastX = (sx + endX) / 2 + lane;
        d = `M ${sx} ${sourceY} H ${lastX} V ${targetY} H ${endX}`;
      } else {
        const outward = side === "right" ? 1 : -1;
        const edge = side === "right" ? Math.max(sx, endX) : Math.min(sx, endX);
        lastX = edge + outward * (STUB + Math.abs(lane) * 0.5);
        d = `M ${sx} ${sourceY} H ${lastX} V ${targetY} H ${endX}`;
      }

      // Panah menghadap arah segmen terakhir (dari lastX ke endX)
      const dir = endX >= lastX ? 1 : -1;
      const baseX = endX - dir * ARROW;
      const arrow = `${baseX},${targetY - 4} ${baseX},${targetY + 4} ${endX},${targetY}`;

      relations.push({
        key: `${sourceKey}:${fk.column}:${fkIdx}`,
        sourceKey,
        targetKey,
        d,
        arrow,
        start: { x: sx, y: sourceY },
      });
    });
  }
  return relations;
}

/** Bounding box seluruh konten (kartu + rute garis) untuk ukuran SVG dan ekspor. */
export function contentBox(tables: TableMetadata[], positions: Positions): Box | null {
  const box = boundingBox(tables, positions);
  return box ? expandBox(box, STUB + 60) : null;
}
