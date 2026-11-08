"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Power, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BTN_PRIMARY, CARD, FOCUS_RING, LABEL } from "../../../lib/ui";
import DeviceScreen from "../../../components/DeviceScreen";
import Note from "../../../components/Note";
import SectionIntro from "../../../components/SectionIntro";
import {
  BOOT_KEYS,
  BOOT_KEY_IDS,
  KEY_ENTER_DELAY_MS,
  POST_DURATION_MS,
  POST_LINES,
  POST_LINE_GAP_MS,
  POST_LINE_START_MS,
  type BootKeyId,
} from "../data/bootKeys";

type Screen =
  | { kind: "off" }
  | { kind: "posting"; shown: number }
  | { kind: "entering"; key: BootKeyId }
  | { kind: "menu"; key: BootKeyId; item: number | null }
  | { kind: "os" };

function isBootKey(key: string): key is BootKeyId {
  return (BOOT_KEY_IDS as string[]).includes(key);
}

function Logo({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 font-sans text-[22px] font-bold tracking-[0.06em] text-slate-100">
      {children}
    </div>
  );
}

const KBD =
  "inline-flex min-w-7 items-center justify-center rounded-md border border-border border-b-2 bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-foreground";

export default function BootSection({ active }: { active: boolean }) {
  const [screen, setScreen] = useState<Screen>({ kind: "off" });
  const [barFull, setBarFull] = useState(false);
  const [explain, setExplain] = useState<BootKeyId | null>(null);
  const [started, setStarted] = useState(false);
  const timers = useRef<number[]>([]);
  const monitorRef = useRef<HTMLDivElement>(null);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  function startBoot() {
    clearTimers();
    setStarted(true);
    setExplain(null);
    setBarFull(false);
    setScreen({ kind: "posting", shown: 0 });
    POST_LINES.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(
          () =>
            setScreen((s) =>
              s.kind === "posting" ? { kind: "posting", shown: i + 1 } : s,
            ),
          POST_LINE_START_MS + i * POST_LINE_GAP_MS,
        ),
      );
    });
    // Bar diisi lewat transisi CSS; dua frame supaya lebar 0% sempat ter-render dulu.
    requestAnimationFrame(() => requestAnimationFrame(() => setBarFull(true)));
    timers.current.push(
      window.setTimeout(
        () => setScreen((s) => (s.kind === "posting" ? { kind: "os" } : s)),
        POST_DURATION_MS,
      ),
    );
    monitorRef.current?.focus({ preventScroll: true });
  }

  const pressKey = useCallback(
    (k: BootKeyId) => {
      if (screen.kind !== "posting") {
        toast(
          screen.kind === "menu" || screen.kind === "entering"
            ? "Kamu sudah di dalam menu. Klik Restart untuk mencoba tombol lain."
            : "Nyalakan atau restart server dulu, lalu tekan tombol saat layar awal muncul.",
        );
        return;
      }
      clearTimers();
      setScreen({ kind: "entering", key: k });
      timers.current.push(
        window.setTimeout(() => {
          setScreen({ kind: "menu", key: k, item: null });
          setExplain(k);
        }, KEY_ENTER_DELAY_MS),
      );
    },
    [screen.kind, clearTimers],
  );

  // Tombol F2/F10/F11/F12 di keyboard fisik, hanya saat bagian ini sedang dibuka.
  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (isBootKey(e.key)) {
        e.preventDefault();
        pressKey(e.key);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, pressKey]);

  const pressedKey =
    screen.kind === "entering" || screen.kind === "menu" ? screen.key : null;
  const menuKey = screen.kind === "menu" ? BOOT_KEYS[screen.key] : null;
  const isBios = screen.kind === "menu" && menuKey?.items !== null;

  function renderScreen() {
    switch (screen.kind) {
      case "off":
        return (
          <div className="text-slate-500">
            [ layar mati ]
            <br />
            <br />
            Klik &quot;Nyalakan server&quot; untuk memulai.
          </div>
        );
      case "posting":
        return (
          <>
            <Logo>DELL</Logo>
            {POST_LINES.slice(0, screen.shown).map((l) => (
              <div key={l}>{l}</div>
            ))}
            <div className="mt-2.5 h-1 overflow-hidden rounded-sm bg-[#1b222a]">
              <div
                className="h-full bg-blue-500 transition-[width] ease-linear"
                style={{
                  width: barFull ? "100%" : "0%",
                  transitionDuration: barFull ? `${POST_DURATION_MS}ms` : "0ms",
                }}
              />
            </div>
          </>
        );
      case "entering":
        return (
          <>
            <Logo>DELL</Logo>
            <div className="text-sky-300">
              {screen.key} ditekan. Memasuki {BOOT_KEYS[screen.key].name}...
            </div>
          </>
        );
      case "os":
        return (
          <>
            <Logo>DELL</Logo>
            <div>Tidak ada tombol ditekan.</div>
            <div>Booting dari Integrated RAID Controller 1...</div>
            <div>Memuat VMware ESXi...</div>
            <br />
            <div className="text-amber-300">
              Terlewat? Klik &quot;Restart server&quot; lalu tekan tombol lebih
              cepat.
            </div>
          </>
        );
      case "menu": {
        const K = BOOT_KEYS[screen.key];
        if (!K.items) {
          return (
            <>
              <Logo>PXE</Logo>
              <div>Booting dari NIC Slot 1 Port 1...</div>
              <div>Mencari server DHCP / PXE...</div>
              <div>DHCP... DHCP... DHCP...</div>
              <div className="text-amber-300">
                Tidak ada respons PXE (timeout). Lanjut ke perangkat boot
                berikutnya.
              </div>
            </>
          );
        }
        const items = K.items;
        const item = screen.item;
        return (
          <>
            <div className="-mx-3 -mt-3 mb-3 bg-[#0b4f8a] px-3 py-2 font-bold text-white sm:-mx-4 sm:px-4">
              {K.name}{" "}
              <span className="font-normal opacity-80">· simulasi</span>
            </div>
            <div className="grid max-w-[420px] gap-1.5">
              {items.map(([title], i) => (
                <button
                  key={title}
                  type="button"
                  aria-pressed={item === i}
                  onClick={() =>
                    setScreen({ kind: "menu", key: screen.key, item: i })
                  }
                  className={cn(
                    "rounded border px-2.5 py-2 text-left font-mono text-xs sm:text-[13px]",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b4f8a] focus-visible:ring-offset-1",
                    item === i
                      ? "border-[#0b4f8a] bg-[#0b4f8a] text-white"
                      : "border-[#9fb0bf] bg-[#f4f7f9] text-[#10161c] hover:border-[#0b4f8a]",
                  )}
                >
                  {title}
                </button>
              ))}
            </div>
            <div className="mt-3 min-h-11 rounded-md border border-dashed border-[#8a9aa8] bg-[#eef2f5] p-2.5 whitespace-normal">
              {item === null
                ? "Klik salah satu menu untuk melihat isinya."
                : items[item][1] +
                  (screen.key === "F11" && item !== 0
                    ? " (Simulasi: pilihan ini hanya untuk satu kali boot.)"
                    : "")}
            </div>
          </>
        );
      }
    }
  }

  const ex = explain ? BOOT_KEYS[explain] : null;

  return (
    <>
      <SectionIntro title="Tombol (key) saat boot">
        Saat server menyala, ada beberapa detik di layar awal (POST) untuk
        menekan tombol khusus. Klik{" "}
        <strong className="text-foreground">Nyalakan</strong>, lalu tekan salah
        satu tombol sebelum bar penuh.
      </SectionIntro>

      <div className={cn(CARD, "flex flex-col gap-3")}>
        <DeviceScreen
          screenRef={monitorRef}
          focusable
          label="Layar monitor server"
          bios={isBios}
          footer={
            screen.kind === "posting" ? (
              <>
                <b>F2</b> System Setup · <b>F10</b> Lifecycle Controller ·{" "}
                <b>F11</b> Boot Manager · <b>F12</b> PXE Boot
              </>
            ) : undefined
          }
        >
          {renderScreen()}
        </DeviceScreen>

        <div
          className="grid grid-cols-4 gap-2"
          role="group"
          aria-label="Tombol saat boot"
        >
          {BOOT_KEY_IDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => pressKey(k)}
              aria-pressed={pressedKey === k}
              aria-label={`${k}, ${BOOT_KEYS[k].name}`}
              className={cn(
                "flex min-h-[60px] flex-col items-center justify-center gap-0.5 rounded-lg border border-b-[3px] px-1 py-1.5 transition-colors active:translate-y-px",
                FOCUS_RING,
                pressedKey === k
                  ? "border-accent bg-accent/10"
                  : "border-border bg-card hover:border-accent/50",
              )}
            >
              <span className="font-mono text-[15px] font-bold text-foreground">
                {k}
              </span>
              <span className="text-center text-[10px] leading-tight text-muted-foreground sm:text-[11px]">
                {BOOT_KEYS[k].name}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <button
            type="button"
            onClick={startBoot}
            className={cn(BTN_PRIMARY, "min-h-11")}
          >
            {started ? (
              <RotateCcw aria-hidden className="h-4 w-4" />
            ) : (
              <Power aria-hidden className="h-4 w-4" />
            )}
            {started ? "Restart server" : "Nyalakan server"}
          </button>
          <span className="text-xs text-muted-foreground">
            Di keyboard juga bisa (F11/F12 kadang dipakai browser, jadi klik
            tombolnya saja).
          </span>
        </div>
      </div>

      <article aria-live="polite" className={cn(CARD, "flex flex-col gap-3")}>
        {ex && explain ? (
          <>
            <h3 className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
              <kbd className={KBD}>{explain}</kbd>
              {ex.name}
            </h3>
            <p className="text-sm leading-relaxed text-foreground">{ex.what}</p>
            <div>
              <p className={cn(LABEL, "mb-1.5")}>Kapan dipakai</p>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground">
                {ex.when.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
            <Note tone="warn" title="Perhatikan:">
              <ul className="list-disc space-y-1 pl-5">
                {ex.caution.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </Note>
          </>
        ) : (
          <>
            <h3 className="text-[15px] font-semibold text-foreground">
              Penjelasan tombol
            </h3>
            <p className="text-sm text-muted-foreground">
              Tekan salah satu tombol saat layar awal untuk melihat
              penjelasannya di sini.
            </p>
          </>
        )}
      </article>

      <article className={cn(CARD, "flex flex-col gap-3")}>
        <h3 className="text-[15px] font-semibold text-foreground">
          Ringkasan tombol
        </h3>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[340px] border-collapse text-[13px]">
            <thead>
              <tr className="bg-muted/60">
                <th
                  scope="col"
                  className={cn(
                    LABEL,
                    "border-b border-border px-3 py-2 text-left",
                  )}
                >
                  Tombol
                </th>
                <th
                  scope="col"
                  className={cn(
                    LABEL,
                    "border-b border-border px-3 py-2 text-left",
                  )}
                >
                  Membuka
                </th>
                <th
                  scope="col"
                  className={cn(
                    LABEL,
                    "border-b border-border px-3 py-2 text-left",
                  )}
                >
                  Dipakai untuk
                </th>
              </tr>
            </thead>
            <tbody>
              {BOOT_KEY_IDS.map((k) => (
                <tr key={k} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2">
                    <kbd className={KBD}>{k}</kbd>
                  </td>
                  <td className="px-3 py-2 text-foreground">
                    {BOOT_KEYS[k].name}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {BOOT_KEYS[k].short}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Note tone="info">
          <strong>Tips:</strong> tombol ini bisa ditekan lewat keyboard fisik
          (crash cart) atau lewat <strong>Virtual Console iDRAC</strong> dari
          jauh. Supaya tidak berlomba dengan waktu, di iDRAC ada opsi{" "}
          <strong>Next Boot</strong> untuk memilih boot sekali ke BIOS Setup
          atau Lifecycle Controller.
        </Note>
      </article>
    </>
  );
}
