"use client";

import { useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { BTN, CARD } from "../lib/ui";
import Note from "./Note";
import { StatusDot } from "./StatusPill";

export interface QuizItem {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

/** Dua kartu "Lakukan" / "Jangan". */
export function DoDont({
  dos,
  donts,
}: {
  dos: ReactNode[];
  donts: ReactNode[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {(
        [
          ["Lakukan", "ok", dos],
          ["Jangan", "bad", donts],
        ] as const
      ).map(([title, tone, items]) => (
        <div key={title} className={CARD}>
          <h3 className="mb-2 flex items-center gap-2 text-[15px] font-semibold text-foreground">
            <StatusDot tone={tone} className="h-2.5 w-2.5" />
            {title}
          </h3>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground">
            {items.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Kuis pilihan ganda: jawaban terkunci setelah dipilih, penjelasan langsung muncul. */
export function Quiz({
  items,
  idPrefix,
}: {
  items: QuizItem[];
  idPrefix: string;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const answered = Object.keys(answers).length;
  const right = items.filter((q, i) => answers[i] === q.answer).length;
  const suffix =
    answered === items.length
      ? right === items.length
        ? " · Sempurna!"
        : " · Coba ulangi yang salah"
      : "";

  return (
    <>
      <h2 className="mt-2 text-lg font-semibold text-foreground">
        Kuis singkat
      </h2>

      {items.map((q, qi) => {
        const a = answers[qi];
        const done = a !== undefined;
        return (
          <fieldset key={q.q} className={cn(CARD, "space-y-2")}>
            {/* float + w-full: legend tetap di dalam kotak, tidak menumpang di garis border fieldset. */}
            <legend className="float-left w-full text-sm font-semibold text-foreground">
              {qi + 1}. {q.q}
            </legend>
            <div className="clear-both flex flex-col gap-1 pt-1">
              {q.options.map((o, oi) => {
                const isRight = done && oi === q.answer;
                const isWrong = done && oi === a && a !== q.answer;
                return (
                  <label
                    key={o}
                    className={cn(
                      "flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground",
                      done ? "cursor-default" : "cursor-pointer hover:bg-muted",
                      isRight && "bg-emerald-500/10",
                      isWrong && "bg-rose-500/10",
                    )}
                  >
                    <input
                      type="radio"
                      name={`${idPrefix}-quiz-${qi}`}
                      value={oi}
                      checked={a === oi}
                      disabled={done}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, [qi]: oi }))
                      }
                      className="mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--accent))]"
                    />
                    <span>{o}</span>
                    {isRight && (
                      <span className="sr-only">(jawaban benar)</span>
                    )}
                    {isWrong && (
                      <span className="sr-only">(jawabanmu, belum tepat)</span>
                    )}
                  </label>
                );
              })}
            </div>
            {done && (
              <Note tone={a === q.answer ? "ok" : "bad"}>
                <strong>{a === q.answer ? "Benar." : "Belum tepat."}</strong>{" "}
                {q.explain}
              </Note>
            )}
          </fieldset>
        );
      })}

      <div
        className={cn(
          CARD,
          "flex flex-wrap items-center justify-between gap-3",
        )}
      >
        <span className="text-lg font-bold text-foreground" aria-live="polite">
          Skor: {right} / {items.length}
          {suffix}
        </span>
        <button type="button" onClick={() => setAnswers({})} className={BTN}>
          <RotateCcw aria-hidden className="h-4 w-4" />
          Ulangi kuis
        </button>
      </div>
    </>
  );
}
