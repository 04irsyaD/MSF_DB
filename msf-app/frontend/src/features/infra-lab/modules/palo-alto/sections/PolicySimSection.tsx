"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BTN, BTN_PRIMARY, CARD, FOCUS_RING, LABEL } from "../../../lib/ui";
import Note from "../../../components/Note";
import SectionIntro from "../../../components/SectionIntro";
import { StatusPill, TagBadge } from "../../../components/StatusPill";
import TaskPanel, { type TaskMessage } from "../../../components/TaskPanel";
import TerminalScreen from "../../../components/terminal/TerminalScreen";
import { useTerminal } from "../../../components/terminal/useTerminal";
import {
  FLOWS,
  FW_PROMPT,
  INITIAL_RULES,
  PORTAL_IP,
  USER_IP,
  evaluate,
  testCommand,
  testOutput,
  type SecRule,
} from "../data/policy";

const STEPS = [
  "Uji trafik portal: rule mana yang menolak?",
  "Perbaiki urutan rule di candidate config",
  "Commit perubahan",
  "Uji ulang: trafik portal harus allow",
  "Pastikan SSH ke DMZ tetap ditolak",
];

const COMMIT_MS = 1200;

const portalFlow = FLOWS.find((f) => f.id === "portal")!;
const sshFlow = FLOWS.find((f) => f.id === "ssh")!;

const sameRules = (a: SecRule[], b: SecRule[]) =>
  a.length === b.length &&
  a.every((r, i) => r.id === b[i].id && r.enabled === b[i].enabled);

const portalAllowed = (rules: SecRule[]) =>
  evaluate(rules, portalFlow).action === "allow";

interface Sim {
  running: SecRule[];
  candidate: SecRule[];
  done: boolean[];
  msg: TaskMessage | null;
}

const INITIAL: Sim = {
  running: INITIAL_RULES,
  candidate: INITIAL_RULES,
  done: STEPS.map(() => false),
  msg: null,
};

export default function PolicySimSection() {
  const [sim, setSim] = useState<Sim>(INITIAL);
  const [flowId, setFlowId] = useState(portalFlow.id);
  const [committing, setCommitting] = useState(false);
  const commitTimer = useRef<number | null>(null);
  const term = useTerminal([
    {
      tone: "dim",
      text: "Hasil uji trafik (test security-policy-match) muncul di sini.",
    },
  ]);

  useEffect(
    () => () => {
      if (commitTimer.current) window.clearTimeout(commitTimer.current);
    },
    [],
  );

  const dirty = !sameRules(sim.running, sim.candidate);

  function runTest() {
    const flow = FLOWS.find((f) => f.id === flowId)!;
    const m = evaluate(sim.running, flow);
    term.append(`${FW_PROMPT} ${testCommand(flow)}`, {
      lines: testOutput(m, flow),
    });

    const done = [...sim.done];
    let msg = sim.msg;
    if (flow.id === "portal") {
      if (m.action === "deny") {
        done[0] = true;
        msg =
          dirty && portalAllowed(sim.candidate)
            ? {
                tone: "warn",
                body: "Hasil masih deny: perubahanmu baru ada di candidate config. Firewall tetap memakai running config sampai di-commit.",
              }
            : {
                tone: "info",
                body: (
                  <>
                    Ditolak oleh rule{" "}
                    <strong>
                      #{m.index} {m.rule?.name ?? "interzone-default"}
                    </strong>
                    . Rule allow-app-portal sebenarnya mengizinkan, tapi
                    letaknya di bawah; firewall berhenti di rule pertama yang
                    cocok.
                  </>
                ),
              };
      } else {
        done[0] = true;
        if (done[2]) {
          done[3] = true;
          msg = {
            tone: "ok",
            body: `Portal sekarang allow lewat rule ${m.rule?.name}. Terakhir, pastikan akses lain ke DMZ (mis. SSH) tetap ditolak.`,
          };
        }
      }
    } else if (flow.id === "ssh" && done[3]) {
      if (m.action === "deny") {
        done[4] = true;
        msg = {
          tone: "ok",
          body: (
            <>
              <strong>Selesai!</strong> Portal terbuka hanya untuk ssl ke{" "}
              {PORTAL_IP}, dan SSH ke DMZ tetap ditolak. Catat perubahan urutan
              rule di tiket.
            </>
          ),
        };
      }
    } else {
      msg = {
        tone: m.action === "allow" ? "ok" : "info",
        body: `${flow.label}: ${m.action} oleh rule #${m.index} ${m.rule?.name ?? "interzone-default"}.`,
      };
    }
    setSim((p) => ({ ...p, done, msg }));
  }

  function editCandidate(next: SecRule[]) {
    setSim((p) => {
      const done = [...p.done];
      done[1] = portalAllowed(next);
      return { ...p, candidate: next, done };
    });
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= sim.candidate.length) return;
    const next = [...sim.candidate];
    [next[i], next[j]] = [next[j], next[i]];
    editCandidate(next);
  }

  function toggle(i: number) {
    editCandidate(
      sim.candidate.map((r, k) =>
        k === i ? { ...r, enabled: !r.enabled } : r,
      ),
    );
  }

  function commit() {
    setCommitting(true);
    commitTimer.current = window.setTimeout(() => {
      setCommitting(false);
      setSim((p) => {
        const done = [...p.done];
        const fixed = portalAllowed(p.candidate);
        const denyRule = p.candidate.find(
          (r) => r.name === "deny-trust-to-dmz",
        );
        const disabledAllow = p.candidate
          .filter((r) => r.action === "allow" && !r.enabled)
          .map((r) => r.name);
        let msg: TaskMessage;
        if (disabledAllow.length > 0) {
          msg = {
            tone: "warn",
            body: `Commit berhasil, tapi rule ${disabledAllow.join(", ")} nonaktif: trafik yang biasanya diizinkan rule itu sekarang ikut ditolak.`,
          };
        } else if (fixed && denyRule && !denyRule.enabled) {
          msg = {
            tone: "warn",
            body: "Commit berhasil dan portal akan terbuka, tapi rule deny-trust-to-dmz kini nonaktif. Lebih rapi memindahkan rule allow ke atasnya: maksud kebijakan tetap jelas dan trafik yang ditolak tetap tercatat dengan nama rule.",
          };
        } else if (fixed) {
          msg = {
            tone: "ok",
            body: "Commit berhasil (job FIN OK). Uji ulang trafik portal.",
          };
        } else {
          msg = {
            tone: "info",
            body: "Commit berhasil, tapi trafik portal masih akan ditolak. Cek lagi urutan rule.",
          };
        }
        if (fixed) done[2] = true;
        return { ...p, running: p.candidate, done, msg };
      });
    }, COMMIT_MS);
  }

  function revert() {
    editCandidate(sim.running);
  }

  function reset() {
    if (commitTimer.current) window.clearTimeout(commitTimer.current);
    setCommitting(false);
    setSim(INITIAL);
    setFlowId(portalFlow.id);
    term.show();
  }

  return (
    <>
      <SectionIntro title="Simulasi: user tidak bisa buka portal">
        Cari rule yang menolak trafik, perbaiki urutannya di candidate config,
        commit, lalu buktikan perbaikanmu tidak membuka akses lain.
      </SectionIntro>

      <Note tone="info" title="Tiket">
        User {USER_IP} (zone trust) tidak bisa membuka portal aplikasi https://
        {PORTAL_IP} di DMZ. Tim aplikasi bilang server sehat.
      </Note>

      <TaskPanel
        steps={STEPS}
        done={sim.done}
        onReset={reset}
        msg={sim.msg}
        idle="Mulai dengan menguji trafik portal."
      />

      <div className={cn(CARD, "flex flex-col gap-3")}>
        <p className={LABEL}>Uji trafik (memakai running config)</p>
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex min-w-0 flex-1 flex-col gap-1 text-[13px] font-semibold text-muted-foreground">
            Trafik
            <select
              value={flowId}
              onChange={(e) => setFlowId(e.target.value)}
              className={cn(
                "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground",
                FOCUS_RING,
              )}
            >
              {FLOWS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label} ({f.application}, port {f.port})
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={runTest}
            disabled={committing}
            className={cn(BTN_PRIMARY, "min-h-11")}
          >
            Uji trafik
          </button>
        </div>
        <TerminalScreen
          lines={term.lines}
          label="Hasil test security-policy-match"
        />
      </div>

      <div className={cn(CARD, "flex flex-col gap-3")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={LABEL}>Security policy (candidate config)</p>
          {dirty ? (
            <TagBadge tone="warn">Belum di-commit</TagBadge>
          ) : (
            <TagBadge tone="ok">Sama dengan running</TagBadge>
          )}
        </div>

        <ol className="flex flex-col gap-2">
          {sim.candidate.map((r, i) => (
            <li
              key={r.id}
              className={cn(
                "flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-border px-3 py-2",
                !r.enabled && "bg-muted/50",
              )}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[11px] font-semibold text-muted-foreground">
                {i + 1}
              </span>
              {/* min-w: di HP kontrol turun ke baris bawah, bukan memeras nama rule. */}
              <div className="min-w-[12rem] flex-1">
                <p
                  className={cn(
                    "break-words font-mono text-[13px] font-semibold",
                    r.enabled
                      ? "text-foreground"
                      : "text-muted-foreground line-through",
                  )}
                >
                  {r.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {r.from} ke {r.to} · tujuan {r.destination} ·{" "}
                  {r.application.join(", ")}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <StatusPill tone={r.action === "allow" ? "ok" : "bad"}>
                  {r.action}
                </StatusPill>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={r.enabled}
                    onChange={() => toggle(i)}
                    disabled={committing}
                    className="h-4 w-4 accent-[hsl(var(--accent))]"
                  />
                  Aktif
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0 || committing}
                    aria-label={`Naikkan rule ${r.name}`}
                    className={cn(BTN, "min-h-9 px-2")}
                  >
                    <ChevronUp aria-hidden className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === sim.candidate.length - 1 || committing}
                    aria-label={`Turunkan rule ${r.name}`}
                    className={cn(BTN, "min-h-9 px-2")}
                  >
                    <ChevronDown aria-hidden className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          <li className="flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[11px] font-semibold text-muted-foreground">
              {sim.candidate.length + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[13px] font-semibold text-muted-foreground">
                interzone-default
              </p>
              <p className="text-xs text-muted-foreground">
                rule bawaan: trafik antar zone yang tidak cocok rule mana pun
              </p>
            </div>
            <StatusPill tone="bad">deny</StatusPill>
          </li>
        </ol>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={commit}
            disabled={!dirty || committing}
            className={BTN_PRIMARY}
          >
            {committing && (
              <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
            )}
            {committing ? "Commit berjalan..." : "Commit"}
          </button>
          <button
            type="button"
            onClick={revert}
            disabled={!dirty || committing}
            className={BTN}
          >
            Batalkan perubahan
          </button>
        </div>
      </div>
    </>
  );
}
