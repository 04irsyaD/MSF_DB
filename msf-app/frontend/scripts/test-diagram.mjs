// Unit test logika diagram (layout + geometri).
// Jalankan: node --test scripts/test-diagram.mjs  (Node >= 22.18 / 24, type stripping)
// Fixture dihasilkan dari SQLParser backend untuk 10 template di src/app/diagram/templates.ts.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { CARD_WIDTH, LAYOUT_OPTIONS, MAX_ZOOM, MIN_ZOOM } from "../src/lib/diagram/constants.ts";
import {
  boundingBox,
  buildRelations,
  columnAnchorY,
  fitViewport,
  tableHeight,
  tableKey,
  zoomAt,
} from "../src/lib/diagram/geometry.ts";
import { computeLayout } from "../src/lib/diagram/layouts.ts";

const TEMPLATES = JSON.parse(readFileSync(new URL("./fixtures/diagram-templates.json", import.meta.url), "utf8"));
const STYLES = LAYOUT_OPTIONS.map((o) => o.value);

const col = (name, extra = {}) => ({
  name,
  data_type: "INT",
  is_nullable: true,
  is_primary_key: false,
  is_foreign_key: false,
  ...extra,
});
const fk = (column, references_table) => ({ column, references_table, references_column: "id" });
const table = (name, fks = [], schema = "public") => ({
  name,
  schema,
  columns: [col("id", { is_primary_key: true }), ...fks.map((f) => col(f.column, { is_foreign_key: true }))],
  foreign_keys: fks,
  indexes: [],
});

function overlaps(tables, positions) {
  const found = [];
  for (let i = 0; i < tables.length; i++) {
    for (let j = i + 1; j < tables.length; j++) {
      const a = positions[tableKey(tables[i])];
      const b = positions[tableKey(tables[j])];
      const ox = Math.min(a.x + CARD_WIDTH, b.x + CARD_WIDTH) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + tableHeight(tables[i]), b.y + tableHeight(tables[j])) - Math.max(a.y, b.y);
      if (ox > 0 && oy > 0) found.push(`${tables[i].name}/${tables[j].name}`);
    }
  }
  return found;
}

test("semua template x semua layout: setiap tabel punya posisi, tidak ada kartu bertumpuk, semua FK tergambar", () => {
  for (const [id, tables] of Object.entries(TEMPLATES)) {
    const fkCount = tables.reduce((n, t) => n + t.foreign_keys.length, 0);
    for (const style of STYLES) {
      const positions = computeLayout(style, tables);
      for (const t of tables) {
        const p = positions[tableKey(t)];
        assert.ok(p && Number.isFinite(p.x) && Number.isFinite(p.y), `${id}/${style}: posisi ${t.name}`);
      }
      assert.deepEqual(overlaps(tables, positions), [], `${id}/${style}: kartu bertumpuk`);
      assert.equal(buildRelations(tables, positions).length, fkCount, `${id}/${style}: jumlah garis`);
    }
  }
});

test("layout deterministik (termasuk Organik)", () => {
  for (const style of STYLES) {
    assert.deepEqual(computeLayout(style, TEMPLATES.hospital), computeLayout(style, TEMPLATES.hospital), style);
  }
});

test("layout Horizontal: DAG multi-jalur menaruh child setelah semua parent", () => {
  const tables = [table("a"), table("b", [fk("a_id", "a")]), table("c", [fk("a_id", "a"), fk("b_id", "b")])];
  const p = computeLayout("horizontal", tables);
  const x = (n) => p[`public.${n}`].x;
  assert.ok(x("a") < x("b") && x("b") < x("c"), JSON.stringify(p));
});

test("siklus dan self-reference tidak hang dan semua tabel diposisikan", () => {
  const tables = [
    table("a", [fk("c_id", "c")]),
    table("b", [fk("a_id", "a")]),
    table("c", [fk("b_id", "b")]),
    table("emp", [fk("manager_id", "emp")]),
  ];
  for (const style of STYLES) {
    const p = computeLayout(style, tables);
    assert.equal(Object.keys(p).length, 4, style);
    assert.deepEqual(overlaps(tables, p), [], style);
  }
});

test("tabel bernama sama di schema berbeda tidak bertabrakan", () => {
  const tables = [table("users", [], "s"), table("users", [], "t")];
  const p = computeLayout("grid", tables);
  assert.equal(Object.keys(p).length, 2);
  assert.deepEqual(overlaps(tables, p), []);
});

test("panah self-reference menghadap ke dalam kartu (ke kiri)", () => {
  const emp = table("emp", [fk("manager_id", "emp")]);
  const positions = { "public.emp": { x: 100, y: 100 } };
  const [rel] = buildRelations([emp], positions);
  const pts = rel.arrow.split(" ").map((s) => s.split(",").map(Number));
  const tipX = pts[2][0];
  const baseX = pts[0][0];
  assert.equal(tipX, 100 + CARD_WIDTH);
  assert.ok(baseX > tipX, "panah harus mengarah ke kiri, masuk ke tepi kanan kartu");
});

test("panah relasi biasa menghadap tabel tujuan", () => {
  const tables = [table("a"), table("b", [fk("a_id", "a")])];
  const left = buildRelations(tables, { "public.a": { x: 0, y: 0 }, "public.b": { x: 500, y: 0 } })[0];
  const right = buildRelations(tables, { "public.a": { x: 500, y: 0 }, "public.b": { x: 0, y: 0 } })[0];
  const dir = (rel) => {
    const pts = rel.arrow.split(" ").map((s) => s.split(",").map(Number));
    return Math.sign(pts[2][0] - pts[0][0]);
  };
  assert.equal(dir(left), -1, "b di kanan a: panah ke kiri");
  assert.equal(dir(right), 1, "b di kiri a: panah ke kanan");
});

test("titik garis FK berada di tengah baris kolom", () => {
  const t = table("b", [fk("a_id", "a")]);
  // border 1 + header 42 + padding list 4 + baris ke-1 (28) + setengah baris (14)
  assert.equal(columnAnchorY(t, { x: 0, y: 0 }, "a_id"), 1 + 42 + 4 + 28 + 14);
  assert.equal(tableHeight(t), 2 + 42 + 8 + 2 * 28);
});

test("Fit: seluruh bounding box masuk viewport dan berada di tengah", () => {
  for (const [w, h] of [[700, 380], [1300, 700], [360, 500]]) {
    for (const style of STYLES) {
      const positions = computeLayout(style, TEMPLATES.hospital);
      const box = boundingBox(TEMPLATES.hospital, positions);
      const v = fitViewport(box, w, h);
      const left = box.minX * v.zoom + v.x;
      const right = box.maxX * v.zoom + v.x;
      const top = box.minY * v.zoom + v.y;
      const bottom = box.maxY * v.zoom + v.y;
      if (v.zoom > MIN_ZOOM) {
        assert.ok(left >= -0.5 && top >= -0.5 && right <= w + 0.5 && bottom <= h + 0.5, `${style} ${w}x${h}`);
      }
      assert.ok(Math.abs((left + right) / 2 - w / 2) < 0.5, `${style}: tengah horizontal`);
      assert.ok(Math.abs((top + bottom) / 2 - h / 2) < 0.5, `${style}: tengah vertikal`);
    }
  }
});

test("Fit dengan topInset: konten berada di bawah toolbar", () => {
  const box = boundingBox(TEMPLATES.booking, computeLayout("horizontal", TEMPLATES.booking));
  const topInset = 70;
  const v = fitViewport(box, 1300, 600, 40, topInset);
  assert.ok(box.minY * v.zoom + v.y >= topInset + 40 - 0.5);
  assert.ok(box.maxY * v.zoom + v.y <= 600 - 40 + 0.5);
});

test("zoomAt menjaga titik pivot tetap di tempat dan menghormati batas zoom", () => {
  const view = { zoom: 0.8, x: 37, y: -12 };
  const pivot = { x: 320, y: 200 };
  const next = zoomAt(view, 1.4, pivot);
  const worldBefore = { x: (pivot.x - view.x) / view.zoom, y: (pivot.y - view.y) / view.zoom };
  assert.ok(Math.abs(worldBefore.x * next.zoom + next.x - pivot.x) < 1e-9);
  assert.ok(Math.abs(worldBefore.y * next.zoom + next.y - pivot.y) < 1e-9);
  assert.equal(zoomAt(view, 99, pivot).zoom, MAX_ZOOM);
  assert.equal(zoomAt(view, 0.001, pivot).zoom, MIN_ZOOM);
});
