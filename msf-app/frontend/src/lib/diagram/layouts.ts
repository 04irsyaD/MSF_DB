/**
 * Algoritma auto-layout diagram. Fungsi murni & deterministik:
 * input yang sama selalu menghasilkan posisi yang sama.
 * Semua posisi dinormalisasi agar dimulai di (LAYOUT_ORIGIN, LAYOUT_ORIGIN).
 */

import type { TableMetadata } from "@/lib/types";
import { CARD_WIDTH, GAP_X, GAP_Y, LAYOUT_ORIGIN, type LayoutStyle } from "./constants.ts";
import { resolveFkTarget, tableHeight, tableKey, type Positions } from "./geometry.ts";

interface Node {
  key: string;
  height: number;
}

interface Graph {
  nodes: Node[];
  /** parent (tabel yang dirujuk) -> children (tabel yang punya FK), tanpa self-loop */
  children: Record<string, string[]>;
  parents: Record<string, string[]>;
  degree: Record<string, number>;
}

function buildGraph(tables: TableMetadata[]): Graph {
  const nodes = tables.map((t) => ({ key: tableKey(t), height: tableHeight(t) }));
  const children: Record<string, string[]> = {};
  const parents: Record<string, string[]> = {};
  const degree: Record<string, number> = {};
  nodes.forEach((n) => {
    children[n.key] = [];
    parents[n.key] = [];
    degree[n.key] = 0;
  });

  for (const table of tables) {
    const child = tableKey(table);
    for (const fk of table.foreign_keys ?? []) {
      const target = resolveFkTarget(tables, table, fk);
      if (!target) continue;
      const parent = tableKey(target);
      degree[child]++;
      degree[parent]++;
      if (parent === child || children[parent].includes(child)) continue;
      children[parent].push(child);
      parents[child].push(parent);
    }
  }
  return { nodes, children, parents, degree };
}

/** Level = jalur terpanjang dari root (Kahn). Siklus diputus secara deterministik. */
function computeLevels(graph: Graph): Record<string, number> {
  const level: Record<string, number> = {};
  const remaining: Record<string, number> = {};
  const done = new Set<string>();
  graph.nodes.forEach((n) => {
    level[n.key] = 0;
    remaining[n.key] = graph.parents[n.key].length;
  });

  const queue = graph.nodes.filter((n) => remaining[n.key] === 0).map((n) => n.key);
  while (done.size < graph.nodes.length) {
    if (queue.length === 0) {
      // Siklus: ambil node belum selesai dengan sisa parent paling sedikit
      const next = graph.nodes
        .filter((n) => !done.has(n.key))
        .reduce((best, n) => (remaining[n.key] < remaining[best.key] ? n : best));
      queue.push(next.key);
    }
    const key = queue.shift()!;
    if (done.has(key)) continue;
    done.add(key);
    for (const child of graph.children[key]) {
      if (done.has(child)) continue;
      level[child] = Math.max(level[child], level[key] + 1);
      remaining[child]--;
      if (remaining[child] === 0) queue.push(child);
    }
  }
  return level;
}

/** Kelompokkan per level, urutkan dengan barycenter parent untuk mengurangi garis bersilangan. */
function groupByLevel(graph: Graph, level: Record<string, number>): Node[][] {
  const maxLevel = Math.max(0, ...Object.values(level));
  const groups: Node[][] = Array.from({ length: maxLevel + 1 }, () => []);
  graph.nodes.forEach((n) => groups[level[n.key]].push(n));

  const order: Record<string, number> = {};
  groups.forEach((group, lvl) => {
    if (lvl > 0) {
      const score = (n: Node) => {
        const ps = graph.parents[n.key].filter((p) => order[p] !== undefined);
        return ps.length ? ps.reduce((sum, p) => sum + order[p], 0) / ps.length : Number.MAX_SAFE_INTEGER;
      };
      const indexed = group.map((n, i) => ({ n, i, s: score(n) }));
      indexed.sort((a, b) => a.s - b.s || a.i - b.i);
      group.splice(0, group.length, ...indexed.map((x) => x.n));
    }
    group.forEach((n, i) => (order[n.key] = i));
  });
  return groups.filter((g) => g.length > 0);
}

function stackColumns(columns: Node[][]): Positions {
  const positions: Positions = {};
  const heights = columns.map((col) => col.reduce((sum, n) => sum + n.height, 0) + GAP_Y * (col.length - 1));
  const tallest = Math.max(...heights);
  columns.forEach((col, c) => {
    let y = (tallest - heights[c]) / 2;
    col.forEach((n) => {
      positions[n.key] = { x: c * (CARD_WIDTH + GAP_X), y };
      y += n.height + GAP_Y;
    });
  });
  return positions;
}

function stackRows(rows: Node[][]): Positions {
  const positions: Positions = {};
  const widths = rows.map((row) => row.length * CARD_WIDTH + GAP_X * (row.length - 1));
  const widest = Math.max(...widths);
  let y = 0;
  rows.forEach((row, r) => {
    let x = (widest - widths[r]) / 2;
    row.forEach((n) => {
      positions[n.key] = { x, y };
      x += CARD_WIDTH + GAP_X;
    });
    y += Math.max(...row.map((n) => n.height)) + GAP_Y;
  });
  return positions;
}

function gridLayout(nodes: Node[]): Positions {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const rows: Node[][] = [];
  nodes.forEach((n, i) => {
    (rows[Math.floor(i / cols)] ??= []).push(n);
  });
  const positions: Positions = {};
  let y = 0;
  rows.forEach((row) => {
    row.forEach((n, c) => (positions[n.key] = { x: c * (CARD_WIDTH + GAP_X), y }));
    y += Math.max(...row.map((n) => n.height)) + GAP_Y;
  });
  return positions;
}

function hubKey(graph: Graph): string {
  return graph.nodes.reduce((best, n) => (graph.degree[n.key] > graph.degree[best.key] ? n : best)).key;
}

function smartGridLayout(graph: Graph): Positions {
  const hub = hubKey(graph);
  const columns: Node[][] = [[], [], []];
  for (const n of graph.nodes) {
    if (n.key === hub) continue;
    const pointsToHub = graph.parents[n.key].includes(hub);
    const hubPointsToIt = graph.children[n.key].includes(hub);
    if (pointsToHub && !hubPointsToIt) columns[0].push(n);
    else if (hubPointsToIt && !pointsToHub) columns[2].push(n);
    else columns[graph.degree[n.key] % 2 === 0 ? 0 : 2].push(n);
  }
  const hubNode = graph.nodes.find((n) => n.key === hub)!;
  columns[1].push(hubNode);
  return stackColumns(columns.filter((c) => c.length > 0));
}

function ringRadius(count: number, spacing: number, min: number): number {
  return Math.max(min, (count * spacing) / (2 * Math.PI));
}

function placeOnRing(positions: Positions, nodes: Node[], radius: number, phase = 0) {
  nodes.forEach((n, i) => {
    const angle = (i / Math.max(1, nodes.length)) * 2 * Math.PI + phase - Math.PI / 2;
    positions[n.key] = {
      x: radius * Math.cos(angle) - CARD_WIDTH / 2,
      y: radius * Math.sin(angle) - n.height / 2,
    };
  });
}

function spacingOf(nodes: Node[]): number {
  return Math.max(CARD_WIDTH, ...nodes.map((n) => n.height)) + GAP_Y;
}

function radialLayout(nodes: Node[]): Positions {
  const positions: Positions = {};
  placeOnRing(positions, nodes, ringRadius(nodes.length, spacingOf(nodes), 220));
  return positions;
}

function centricLayout(graph: Graph): Positions {
  const hub = hubKey(graph);
  const hubNode = graph.nodes.find((n) => n.key === hub)!;
  const neighbors = graph.nodes.filter(
    (n) => n.key !== hub && (graph.parents[n.key].includes(hub) || graph.children[n.key].includes(hub))
  );
  const others = graph.nodes.filter((n) => n.key !== hub && !neighbors.includes(n));
  const spacing = spacingOf(graph.nodes);

  const positions: Positions = { [hub]: { x: -CARD_WIDTH / 2, y: -hubNode.height / 2 } };
  const inner = ringRadius(neighbors.length, spacing, spacing * 1.3);
  placeOnRing(positions, neighbors, inner);
  placeOnRing(positions, others, ringRadius(others.length, spacing, inner + spacing), Math.PI / 4);
  return positions;
}

/** PRNG deterministik (mulberry32) dengan seed dari nama tabel. */
function seededRandom(seedText: string): () => number {
  let seed = 0;
  for (let i = 0; i < seedText.length; i++) seed = (Math.imul(31, seed) + seedText.charCodeAt(i)) | 0;
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function organicLayout(graph: Graph): Positions {
  const random = seededRandom(graph.nodes.map((n) => n.key).join("|"));
  const radius = ringRadius(graph.nodes.length, spacingOf(graph.nodes), 200);
  const sim = graph.nodes.map((n, i) => {
    const angle = (i / graph.nodes.length) * 2 * Math.PI;
    return {
      n,
      x: radius * Math.cos(angle) + (random() - 0.5) * 50,
      y: radius * Math.sin(angle) + (random() - 0.5) * 50,
      fx: 0,
      fy: 0,
    };
  });
  const byKey = Object.fromEntries(sim.map((s) => [s.n.key, s]));
  const iterations = 120;

  for (let step = 0; step < iterations; step++) {
    sim.forEach((s) => ((s.fx = 0), (s.fy = 0)));
    for (let i = 0; i < sim.length; i++) {
      for (let j = i + 1; j < sim.length; j++) {
        const a = sim[i];
        const b = sim[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy) || 1;
        const force = 40000 / (dist * dist);
        a.fx += (dx / dist) * force;
        a.fy += (dy / dist) * force;
        b.fx -= (dx / dist) * force;
        b.fy -= (dy / dist) * force;
      }
    }
    for (const parent of graph.nodes) {
      for (const child of graph.children[parent.key]) {
        const a = byKey[parent.key];
        const b = byKey[child];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy) || 1;
        const force = dist * 0.05;
        a.fx -= (dx / dist) * force;
        a.fy -= (dy / dist) * force;
        b.fx += (dx / dist) * force;
        b.fy += (dy / dist) * force;
      }
    }
    const temp = 12 * (1 - step / iterations);
    sim.forEach((s) => {
      const mag = Math.hypot(s.fx, s.fy) || 1;
      s.x += (s.fx / mag) * Math.min(mag, temp) * 1.5;
      s.y += (s.fy / mag) * Math.min(mag, temp) * 1.5;
    });
  }

  const positions: Positions = {};
  sim.forEach((s) => (positions[s.n.key] = { x: s.x - CARD_WIDTH / 2, y: s.y - s.n.height / 2 }));
  return positions;
}

/** Dorong kartu yang tumpang tindih sampai berjarak minimal `gap`. */
export function resolveOverlaps(positions: Positions, nodes: Node[], gap = 30): Positions {
  const result: Positions = Object.fromEntries(Object.entries(positions).map(([k, p]) => [k, { ...p }]));
  for (let pass = 0; pass < 50; pass++) {
    let moved = false;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = result[nodes[i].key];
        const b = result[nodes[j].key];
        const overlapX = Math.min(a.x + CARD_WIDTH, b.x + CARD_WIDTH) - Math.max(a.x, b.x) + gap;
        const overlapY =
          Math.min(a.y + nodes[i].height, b.y + nodes[j].height) - Math.max(a.y, b.y) + gap;
        if (overlapX <= 0 || overlapY <= 0) continue;
        moved = true;
        if (overlapX < overlapY) {
          const shift = overlapX / 2;
          const sign = a.x <= b.x ? -1 : 1;
          a.x += sign * shift;
          b.x -= sign * shift;
        } else {
          const shift = overlapY / 2;
          const sign = a.y <= b.y ? -1 : 1;
          a.y += sign * shift;
          b.y -= sign * shift;
        }
      }
    }
    if (!moved) break;
  }
  return result;
}

function normalize(positions: Positions): Positions {
  const values = Object.values(positions);
  if (values.length === 0) return positions;
  const minX = Math.min(...values.map((p) => p.x));
  const minY = Math.min(...values.map((p) => p.y));
  return Object.fromEntries(
    Object.entries(positions).map(([k, p]) => [
      k,
      { x: Math.round(p.x - minX + LAYOUT_ORIGIN), y: Math.round(p.y - minY + LAYOUT_ORIGIN) },
    ])
  );
}

export function computeLayout(style: LayoutStyle, tables: TableMetadata[]): Positions {
  if (tables.length === 0) return {};
  const graph = buildGraph(tables);

  let positions: Positions;
  switch (style) {
    case "grid":
      positions = gridLayout(graph.nodes);
      break;
    case "smart-grid":
      positions = smartGridLayout(graph);
      break;
    case "radial":
      positions = resolveOverlaps(radialLayout(graph.nodes), graph.nodes);
      break;
    case "centric":
      positions = resolveOverlaps(centricLayout(graph), graph.nodes);
      break;
    case "organic":
      positions = resolveOverlaps(organicLayout(graph), graph.nodes);
      break;
    case "vertical":
      positions = stackRows(groupByLevel(graph, computeLevels(graph)));
      break;
    default:
      positions = stackColumns(groupByLevel(graph, computeLevels(graph)));
  }
  return normalize(positions);
}
