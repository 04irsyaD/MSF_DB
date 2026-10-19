// QA browser otomatis untuk /diagram (72 cek: layout, Fit, zoom, drag, touch, fullscreen, ekspor, parser).
// Tidak ikut dependensi project. Cara jalan (dari folder kosong mana pun di luar repo):
//   mkdir qa-diagram && cd qa-diagram && npm init -y && npm i playwright-core@1.47.2
//   salin file ini ke folder tersebut, lalu: node qa-browser.mjs http://localhost:3100 ./out (buat folder out dulu)
// Prasyarat: backend lokal :8000 dan frontend dev dengan BACKEND_URL=http://localhost:8000.
// Pilih browser: BROWSER=chrome|msedge|firefox (default chrome; firefox butuh `npx playwright-core install firefox`). Satu FAIL yang diketahui: 404 /favicon.ico (I-012).
// QA browser untuk /diagram. Usage: node qa.mjs <baseUrl> <outDir>
import { chromium, firefox } from "playwright-core";
import fs from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:3100";
const OUT = process.argv[3] ?? ".";
const TEMPLATES = ["blog", "ecommerce", "hr", "academic", "social", "saas", "booking", "warehouse", "library", "hospital"];
const LAYOUTS = ["horizontal", "vertical", "grid", "smart-grid", "radial", "centric", "organic"];
const results = [];
const record = (id, ok, note = "") => {
  results.push({ id, ok, note });
  console.log(`${ok ? "PASS" : "FAIL"} ${id}${note ? " - " + note : ""}`);
};

process.on("unhandledRejection", (e) => console.log("WARN harness:", String(e).slice(0, 120)));
const BR = process.env.BROWSER ?? "chrome";
const browser = BR === "firefox" ? await firefox.launch({ headless: true }) : await chromium.launch({ channel: BR, headless: true });
console.log("BROWSER", BR, browser.version());

async function openPage(width, height, opts = {}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, ...opts });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem("msf_maintenance_diagram", "true");
      localStorage.setItem("theme", localStorage.getItem("theme") || "dark");
    } catch {}
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error" || (m.type() === "warning" && /key|NaN|Warning/.test(m.text()))) errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("response", (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`); });
  await page.goto(`${BASE}/diagram`, { waitUntil: "networkidle" });
  return { page, context, errors };
}

async function loadTemplate(page, id) {
  await page.selectOption("#ddl-template", id);
  await page.waitForFunction(() => document.querySelectorAll("[data-table-card]").length > 0);
  await page.waitForTimeout(400);
}

/** Semua kartu berada di dalam kontainer kanvas (toleransi 1px). */
async function cardsInside(page) {
  return page.evaluate(() => {
    const container = document.querySelector("[data-table-card]")?.closest("[data-diagram-viewport]");
    const c0 = container.getBoundingClientRect();
    const tb = document.querySelector("[data-diagram-toolbar]").getBoundingClientRect();
    const c = { left: c0.left, right: c0.right, bottom: c0.bottom, top: Math.max(c0.top, tb.bottom) };
    const out = [];
    for (const el of document.querySelectorAll("[data-table-card]")) {
      const r = el.getBoundingClientRect();
      if (r.left < c.left - 1 || r.top < c.top - 1 || r.right > c.right + 1 || r.bottom > c.bottom + 1) {
        out.push(el.getAttribute("data-table-card"));
      }
    }
    return { outside: out, count: document.querySelectorAll("[data-table-card]").length };
  });
}

async function cardOverlaps(page) {
  return page.evaluate(() => {
    const rects = [...document.querySelectorAll("[data-table-card]")].map((el) => [el.dataset.tableCard, el.getBoundingClientRect()]);
    const hits = [];
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) {
        const [a, ra] = rects[i];
        const [b, rb] = rects[j];
        if (ra.left < rb.right - 1 && rb.left < ra.right - 1 && ra.top < rb.bottom - 1 && rb.top < ra.bottom - 1) hits.push(`${a}/${b}`);
      }
    return hits;
  });
}

/** Titik awal garis FK (circle) berada di tengah baris kolom pada tepi kartu. */
async function anchorsAligned(page) {
  return page.evaluate(() => {
    const rows = [...document.querySelectorAll("[data-table-card] > div:nth-child(2) > div")].map((r) => {
      const rr = r.getBoundingClientRect();
      const card = r.closest("[data-table-card]").getBoundingClientRect();
      return { cy: rr.top + rr.height / 2, left: card.left, right: card.right };
    });
    const bad = [];
    for (const c of document.querySelectorAll("svg[data-relations] circle")) {
      const r = c.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const ok = rows.some((row) => Math.abs(row.cy - cy) < 1.5 && (Math.abs(row.left - cx) < 40 || Math.abs(row.right - cx) < 40));
      if (!ok) bad.push([Math.round(cx), Math.round(cy)]);
    }
    return bad;
  });
}

async function pageLayout(page) {
  return page.evaluate(() => {
    const ta = document.querySelector("#ddl-sql").getBoundingClientRect();
    const btn = [...document.querySelectorAll("button")].find((b) => /Rerender Diagram/i.test(b.textContent)).getBoundingClientRect();
    const pane = document.querySelector("#ddl-sql").closest(".rounded-2xl").getBoundingClientRect();
    const frame = document.querySelector("[data-diagram-viewport]")?.parentElement.getBoundingClientRect();
    const rightPane = document.querySelector("[data-diagram-viewport]")?.closest(".xl\\:col-span-8")?.getBoundingClientRect();
    const scroller = document.querySelector("#ddl-sql").closest(".overflow-y-auto").getBoundingClientRect();
    return {
      textareaBottom: Math.min(ta.bottom, scroller.bottom),
      buttonTop: btn.top,
      buttonBottom: btn.bottom,
      paneBottom: pane.bottom,
      frameBottom: frame?.bottom,
      rightPaneBottom: rightPane?.bottom,
      pageScroll: document.documentElement.scrollHeight - window.innerHeight,
      innerHeight: window.innerHeight,
    };
  });
}

async function setLayout(page, layout) {
  await page.selectOption(".touch-none ~ * select, [class*='inset-x-3'] select", layout).catch(async () => {
    await page.locator("label:has-text('Layout') select").selectOption(layout);
  });
  await page.waitForTimeout(250);
}

async function cornerLuma(page, file) {
  const b64 = fs.readFileSync(file).toString("base64");
  return page.evaluate(async (src) => {
    const img = new Image(); img.src = src; await img.decode();
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
    const ctx = c.getContext("2d"); ctx.drawImage(img, 0, 0);
    const [r, g, b, a] = ctx.getImageData(2, 2, 1, 1).data;
    return { luma: Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b), alpha: a };
  }, "data:image/png;base64," + b64);
}

const fit = (page) => page.getByRole("button", { name: "Pusatkan layar (Fit)" }).click();

// ---------- 1. Layout halaman di beberapa viewport ----------
for (const [w, h, label, desktop] of [
  [1366, 666, "1366x666 (laptop user, area browser)", true],
  [1366, 768, "1366x768", true],
  [1280, 720, "1280x720", true],
  [1920, 1080, "1920x1080", true],
  [768, 1024, "768x1024 tablet", false],
  [390, 844, "390x844 HP", false],
]) {
  const { page, context, errors } = await openPage(w, h);
  await loadTemplate(page, "hospital");
  const L = await pageLayout(page);
  record(`B-01 ${label}: tombol tidak menumpuk textarea`, L.buttonTop >= L.textareaBottom - 0.5, `textareaBottom=${L.textareaBottom.toFixed(0)} buttonTop=${L.buttonTop.toFixed(0)}`);
  record(`B-03 ${label}: tombol di dalam pane`, L.buttonBottom <= L.paneBottom + 0.5);
  if (desktop) {
    record(`B-05 ${label}: halaman tidak scroll`, L.pageScroll <= 0, `overflow=${L.pageScroll}px`);
    record(`C-01 ${label}: kanvas tidak terpotong`, L.frameBottom <= L.rightPaneBottom + 0.5 && L.frameBottom <= L.innerHeight, `frameBottom=${L.frameBottom?.toFixed(0)} paneBottom=${L.rightPaneBottom?.toFixed(0)} vh=${L.innerHeight}`);
  }
  const inside = await cardsInside(page);
  record(`C-02 ${label}: hospital auto-fit, semua kartu terlihat`, inside.outside.length === 0, inside.outside.join(","));
  await page.screenshot({ path: `${OUT}/${BR}-page-${w}x${h}.png` });
  record(`E-06 ${label}: console bersih`, errors.length === 0, errors.join(" | "));
  await context.close().catch(() => {});
}

// ---------- 1b. Browser zoom 125% / 150% di layar 1366x666 ----------
for (const z of [1.25, 1.5]) {
  const w = Math.floor(1366 / z), h = Math.floor(666 / z);
  const label = `zoom ${z * 100}% (${w}x${h} css)`;
  const { page, context, errors } = await openPage(w, h, { deviceScaleFactor: z });
  await loadTemplate(page, "hospital");
  const L = await pageLayout(page);
  record(`B-10 ${label}: tombol tidak menumpuk textarea`, L.buttonTop >= L.textareaBottom - 0.5, `textareaBottom=${L.textareaBottom.toFixed(0)} buttonTop=${L.buttonTop.toFixed(0)}`);
  record(`B-10 ${label}: tombol di dalam pane`, L.buttonBottom <= L.paneBottom + 0.5);
  record(`B-10 ${label}: kanvas di dalam pane`, L.frameBottom <= L.rightPaneBottom + 0.5, `frameBottom=${L.frameBottom?.toFixed(0)} paneBottom=${L.rightPaneBottom?.toFixed(0)} pageScroll=${L.pageScroll}`);
  let inside = await cardsInside(page);
  record(`C-02 ${label}: auto-fit semua kartu terlihat`, inside.outside.length === 0, inside.outside.join(","));
  await page.getByRole("button", { name: "Layar penuh" }).click();
  await page.waitForTimeout(400);
  inside = await cardsInside(page);
  const fsBox = await page.evaluate(() => { const r = document.querySelector("[aria-label='Diagram layar penuh']").getBoundingClientRect(); return [r.width, r.height]; });
  record(`D-01 ${label}: fullscreen penuh & di-fit`, fsBox[0] === w && fsBox[1] === h && inside.outside.length === 0, `${fsBox} out=${inside.outside}`);
  await page.screenshot({ path: `${OUT}/${BR}-zoom${z * 100}-fullscreen.png` });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${BR}-zoom${z * 100}.png`, fullPage: true });
  record(`E-06 ${label}: console bersih`, errors.filter((e) => !/404/.test(e)).length === 0, errors.join(" | "));
  await context.close().catch(() => {});
}

// ---------- 2. Matriks template x layout di 1366x666 ----------
{
  const { page, context, errors } = await openPage(1366, 666);
  const failures = [];
  for (const t of TEMPLATES) {
    await loadTemplate(page, t);
    for (const l of LAYOUTS) {
      await setLayout(page, l);
      await fit(page);
      await page.waitForTimeout(80);
      const inside = await cardsInside(page);
      const overlaps = await cardOverlaps(page);
      const zoomText = await page.locator("span.tabular-nums[aria-live='polite']").textContent();
      const minZoom = zoomText.trim() === "20%";
      if ((inside.outside.length && !minZoom) || overlaps.length) failures.push(`${t}/${l}: out=${inside.outside} overlap=${overlaps}`);
    }
  }
  record("E matriks 10 template x 7 layout (Fit + tanpa tumpukan)", failures.length === 0, failures.slice(0, 5).join(" ; "));

  // C-04: template dengan jumlah tabel sama
  await setLayout(page, "horizontal");
  await loadTemplate(page, "social");
  await page.getByRole("button", { name: "Perbesar" }).click();
  await page.getByRole("button", { name: "Perbesar" }).click();
  await loadTemplate(page, "booking");
  await page.waitForTimeout(300);
  let inside = await cardsInside(page);
  record("C-04 social(8) -> booking(8) auto-fit", inside.outside.length === 0, inside.outside.join(","));

  // E-05: titik garis tepat di tengah baris (zoom 200%)
  for (let i = 0; i < 8; i++) await page.getByRole("button", { name: "Perbesar" }).click();
  const bad = await anchorsAligned(page);
  record("E-05 titik garis FK di tengah baris kolom (zoom maks)", bad.length === 0, JSON.stringify(bad.slice(0, 3)));
  await fit(page);

  // C-08: zoom berporos di tengah
  const centerBefore = await page.evaluate(() => {
    const c = document.querySelector("[data-diagram-viewport]").getBoundingClientRect();
    const world = document.querySelector("[data-diagram-viewport] > div").getBoundingClientRect();
    return { cx: c.left + c.width / 2, cy: c.top + c.height / 2, wx: world.left, wy: world.top, ww: world.width };
  });
  await page.getByRole("button", { name: "Perbesar" }).click();
  const centerAfter = await page.evaluate(() => {
    const world = document.querySelector("[data-diagram-viewport] > div").getBoundingClientRect();
    return { wx: world.left, wy: world.top, ww: world.width };
  });
  const scale = centerAfter.ww / centerBefore.ww;
  const fixedX = (centerBefore.cx - centerBefore.wx) * scale + centerAfter.wx;
  const fixedY = (centerBefore.cy - centerBefore.wy) * scale + centerAfter.wy;
  record("C-08 zoom berporos di tengah", Math.abs(fixedX - centerBefore.cx) < 2 && Math.abs(fixedY - centerBefore.cy) < 2, `drift=${(fixedX - centerBefore.cx).toFixed(1)},${(fixedY - centerBefore.cy).toFixed(1)}`);

  // C-10: drag tabel di zoom != 1 menempel ke kursor
  await fit(page);
  for (const z of ["Perkecil", "Perbesar"]) {
    await page.getByRole("button", { name: z }).click();
    const centerId = await page.evaluate(() => {
      const c = document.querySelector("[data-diagram-viewport]").getBoundingClientRect();
      const cx = c.left + c.width / 2, cy = c.top + c.height / 2;
      let best = null, bestD = Infinity;
      for (const h of document.querySelectorAll("[data-drag-handle]")) {
        const r = h.getBoundingClientRect();
        const d = Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy);
        if (d < bestD) { bestD = d; best = h.dataset.dragHandle; }
      }
      return best;
    });
    const handle = page.locator(`[data-drag-handle="${centerId}"]`);
    const before = await handle.boundingBox();
    const sx = before.x + 40;
    const sy = before.y + before.height / 2;
    await page.mouse.move(sx, sy);
    await page.mouse.down();
    await page.mouse.move(sx + 60, sy + 30, { steps: 5 });
    await page.mouse.move(sx + 120, sy + 50, { steps: 5 });
    await page.mouse.up();
    const after = await handle.boundingBox();
    const dx = after.x - before.x;
    const dy = after.y - before.y;
    record(`C-10 drag setelah ${z}: kartu ikut kursor`, Math.abs(dx - 120) < 2 && Math.abs(dy - 50) < 2, `dx=${dx.toFixed(1)} dy=${dy.toFixed(1)}`);
  }

  // C-14: drag tabel ke koordinat negatif lalu Fit -> garis tetap ada & semua terlihat
  await fit(page);
  const handle = page.locator("[data-drag-handle]").first();
  const b = await handle.boundingBox();
  await page.mouse.move(b.x + 30, b.y + 10);
  await page.mouse.down();
  await page.mouse.move(b.x - 600, b.y - 400, { steps: 10 });
  await page.mouse.up();
  await fit(page);
  inside = await cardsInside(page);
  const circles = await page.locator("svg[data-relations] circle").count();
  const fkCount = await page.evaluate(() => document.querySelectorAll("svg[data-relations] g").length);
  record("C-14 tabel di koordinat negatif: Fit mencakup & garis tergambar", inside.outside.length === 0 && circles === fkCount && circles > 0, `circles=${circles}`);

  // C-12 pan
  const w0 = await page.locator("[data-diagram-viewport] > div").boundingBox();
  const c0 = await page.locator("[data-diagram-viewport]").boundingBox();
  await page.mouse.move(c0.x + 15, c0.y + c0.height - 15);
  await page.mouse.down();
  await page.mouse.move(c0.x + 115, c0.y + c0.height - 55, { steps: 5 });
  await page.mouse.up();
  const w1 = await page.locator("[data-diagram-viewport] > div").boundingBox();
  record("C-12 pan area kosong", Math.abs(w1.x - w0.x - 100) < 2 && Math.abs(w1.y - w0.y + 40) < 2, `dx=${(w1.x - w0.x).toFixed(1)} dy=${(w1.y - w0.y).toFixed(1)}`);

  // C-09 ctrl+wheel zoom di kursor
  const z0 = await page.locator("span.tabular-nums[aria-live='polite']").textContent();
  await page.mouse.move(c0.x + c0.width / 2, c0.y + c0.height / 2);
  await page.keyboard.down("Control");
  await page.mouse.wheel(0, -200);
  await page.keyboard.up("Control");
  await page.waitForTimeout(100);
  const z1 = await page.locator("span.tabular-nums[aria-live='polite']").textContent();
  record("C-09 Ctrl+wheel zoom", parseInt(z1) > parseInt(z0), `${z0} -> ${z1}`);

  // ---------- 3. Fullscreen ----------
  await page.getByRole("button", { name: "Layar penuh" }).click();
  await page.waitForTimeout(400);
  const fs = await page.evaluate(() => {
    const dlg = document.querySelector("[role='dialog'][aria-label='Diagram layar penuh']");
    const r = dlg?.getBoundingClientRect();
    return { exists: !!dlg, w: r?.width, h: r?.height, overflow: document.body.style.overflow, focused: document.activeElement?.getAttribute("aria-label") };
  });
  record("D-01 fullscreen menutup layar penuh", fs.exists && fs.w === 1366 && fs.h === 666, JSON.stringify(fs));
  inside = await cardsInside(page);
  record("D-01 fullscreen: diagram di-fit", inside.outside.length === 0, inside.outside.join(","));
  record("D-07 scroll body terkunci", fs.overflow === "hidden");
  record("D-10 fokus di tombol keluar", fs.focused === "Keluar layar penuh", fs.focused);
  await page.screenshot({ path: `${OUT}/fullscreen-1366x666.png` });

  // D-05 Mermaid di atas overlay, Esc pertama tutup modal, Esc kedua keluar fullscreen
  await page.getByRole("button", { name: "Ekspor kode Mermaid.js" }).click();
  await page.waitForTimeout(200);
  const modalOnTop = await page.evaluate(() => {
    const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    return !!el?.closest(".z-\\[201\\]");
  });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
  const stillFs = await page.locator("[aria-label='Diagram layar penuh']").count();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const afterEsc = await page.locator("[aria-label='Diagram layar penuh']").count();
  record("D-05 Mermaid di atas overlay; Esc bertahap", modalOnTop && stillFs === 1 && afterEsc === 0, `modalOnTop=${modalOnTop} stillFs=${stillFs} afterEsc=${afterEsc}`);
  const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
  record("D-02 keluar fullscreen memulihkan scroll body", bodyOverflow === "");
  inside = await cardsInside(page);
  record("D-02 setelah keluar fullscreen: diagram di-fit", inside.outside.length === 0, inside.outside.join(","));

  // G-01 PNG
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 15000 }),
    page.getByRole("button", { name: "Unduh diagram (PNG)" }).click(),
  ]);
  await download.saveAs(`${OUT}/export-dark.png`);
  const dark = await cornerLuma(page, `${OUT}/export-dark.png`);
  record("G-01 PNG tema dark: latar gelap & tidak transparan", dark.luma < 60 && dark.alpha === 255, JSON.stringify(dark));

  record("E-06 console bersih (seluruh sesi matriks)", errors.length === 0, errors.slice(0, 3).join(" | "));
  await context.close().catch(() => {});
}

// ---------- 4. Touch (HP) ----------
if (BR !== "firefox") {
  const { page, context, errors } = await openPage(390, 844, { hasTouch: true, isMobile: true });
  await loadTemplate(page, "booking");
  const canvas = page.locator("[data-diagram-viewport]");
  await canvas.scrollIntoViewIfNeeded();
  const c = await canvas.boundingBox();
  const w0 = await page.locator("[data-diagram-viewport] > div").boundingBox();
  const scroll0 = await page.evaluate(() => window.scrollY);
  const cdp = await context.newCDPSession(page);
  const touch = async (type, x, y) =>
    cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y, id: 1 }] });
  const sx = c.x + 20;
  const sy = c.y + c.height * 0.5;
  await touch("touchStart", sx, sy);
  for (let i = 1; i <= 5; i++) await touch("touchMove", sx + i * 10, sy - i * 6);
  await touch("touchEnd", 0, 0);
  await page.waitForTimeout(100);
  const w1 = await page.locator("[data-diagram-viewport] > div").boundingBox();
  const scroll1 = await page.evaluate(() => window.scrollY);
  record("C-13 geser kanvas dengan jari", Math.abs(w1.x - w0.x - 50) < 3 && Math.abs(w1.y - w0.y + 30) < 3 && scroll1 === scroll0, `dx=${(w1.x - w0.x).toFixed(1)} dy=${(w1.y - w0.y).toFixed(1)} pageScroll=${scroll1 - scroll0}`);
  await page.screenshot({ path: `${OUT}/mobile-390.png`, fullPage: true });
  record("E-06 HP console bersih", errors.length === 0, errors.slice(0, 2).join(" | "));
  await context.close().catch(() => {});
}

// ---------- 5. Tema light + parser lewat UI ----------
{
  const { page, context, errors } = await openPage(1366, 768);
  await page.evaluate(() => localStorage.setItem("theme", "light"));
  await page.reload({ waitUntil: "networkidle" });
  await loadTemplate(page, "booking");
  const types = await page.evaluate(() => {
    const card = document.querySelector('[data-table-card="public.bookings"]');
    return [...card.querySelectorAll(":scope > div:nth-child(2) > div")].map((r) => r.innerText.replace(/\s+/g, " ").trim());
  });
  record("F-02 tipe kolom bookings benar", types.join("|") === "id int|customer_id int|showtime_id int|booking_date timestamp", types.join("|"));
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 15000 }),
    page.getByRole("button", { name: "Unduh diagram (PNG)" }).click(),
  ]);
  await download.saveAs(`${OUT}/export-light.png`);
  const light = await cornerLuma(page, `${OUT}/export-light.png`);
  record("G-02 PNG tema light: latar terang", light.luma > 200 && light.alpha === 255, JSON.stringify(light));
  await page.screenshot({ path: `${OUT}/${BR}-page-light-1366x768.png` });

  // D-06/G-05: edit kode -> dropdown kembali placeholder; pilih template yang sama -> confirm
  await page.fill("#ddl-sql", "CREATE TABLE a (id INT PRIMARY KEY); CREATE TABLE b (id INT, a_id INT); ALTER TABLE b ADD CONSTRAINT fk FOREIGN KEY (a_id) REFERENCES a(id);");
  const selectVal = await page.inputValue("#ddl-template");
  record("D-06 edit kode mereset dropdown template", selectVal === "", `value='${selectVal}'`);
  let dialogs = 0;
  page.once("dialog", (d) => {
    dialogs++;
    d.dismiss();
  });
  await page.selectOption("#ddl-template", "booking");
  await page.waitForTimeout(200);
  record("G-05 konfirmasi sebelum menimpa kode", dialogs === 1 && (await page.inputValue("#ddl-template")) === "");

  // F-04 lewat UI: ALTER TABLE FK menghasilkan garis
  await page.getByRole("button", { name: /Rerender Diagram/ }).click();
  await page.waitForFunction(() => document.querySelectorAll("[data-table-card]").length === 2);
  await page.waitForTimeout(300);
  record("F-04 FK dari ALTER TABLE tergambar", (await page.locator("svg[data-relations] circle").count()) === 1);

  // G-07 draft tersimpan saat pindah halaman
  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
  await page.goto(`${BASE}/diagram`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const draft = await page.inputValue("#ddl-sql");
  const cards = await page.locator("[data-table-card]").count();
  record("G-07 draft DDL & diagram pulih setelah pindah halaman", draft.includes("ALTER TABLE b") && cards === 2, `cards=${cards}`);

  // G-08 race: pilih 3 template cepat
  page.on("dialog", (d) => d.accept());
  await page.selectOption("#ddl-template", "blog").catch(() => {});
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    const sel = document.querySelector("#ddl-template");
    for (const v of ["hospital", "hr", "saas"]) {
      sel.value = v;
      sel.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
  await page.waitForTimeout(1500);
  const finalCount = await page.locator("[data-table-card]").count();
  record("G-08 pilihan template terakhir menang", finalCount === 6, `cards=${finalCount} (saas=6)`);

  record("E-06 console bersih (light + parser)", errors.length === 0, errors.slice(0, 3).join(" | "));
  await context.close().catch(() => {});
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\nTOTAL ${results.length} | PASS ${results.length - failed.length} | FAIL ${failed.length}`);
process.exit(failed.length ? 1 : 0);
