"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CARD, INPUT, chipClass } from "../../../lib/ui";
import Note from "../../../components/Note";
import SectionIntro from "../../../components/SectionIntro";
import { MODEL_EXAMPLES, decodeModel } from "../data/model";

const FORM_FACTORS = [
  {
    title: "Rack (R)",
    body: (
      <>
        Dipasang di rak data center. Tingginya diukur dalam <strong>U</strong>{" "}
        (1U ≈ 4,45 cm). Paling sering kamu temui.
      </>
    ),
  },
  {
    title: "Tower (T)",
    body: "Berdiri seperti PC besar. Biasanya di kantor cabang atau ruangan kecil.",
  },
  {
    title: "Modular (MX)",
    body: "Banyak server tipis (sled) dalam satu chassis, berbagi power dan jaringan.",
  },
];

export default function IntroSection() {
  const [model, setModel] = useState("R760");
  const parts = decodeModel(model);

  return (
    <>
      <SectionIntro title="Apa itu Dell PowerEdge?">
        PowerEdge adalah lini server Dell. Bentuknya mirip PC, tapi dibuat untuk
        menyala 24 jam, punya komponen cadangan (redundan), dan bisa dikelola
        dari jauh lewat <strong className="text-foreground">iDRAC</strong>. Di
        data center, server inilah yang menjalankan OS, hypervisor (mis. VMware
        ESXi) dan aplikasi.
      </SectionIntro>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {FORM_FACTORS.map((f) => (
          <div key={f.title} className={CARD}>
            <h3 className="mb-1.5 text-[15px] font-semibold text-foreground">
              {f.title}
            </h3>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              {f.body}
            </p>
          </div>
        ))}
      </div>

      <div className={cn(CARD, "flex flex-col gap-3")}>
        <div>
          <h3 className="text-[15px] font-semibold text-foreground">
            Coba: baca nama model
          </h3>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Ketik model seperti{" "}
            <code className="rounded bg-muted px-1 font-mono">R760</code>,{" "}
            <code className="rounded bg-muted px-1 font-mono">R650</code>,{" "}
            <code className="rounded bg-muted px-1 font-mono">T550</code> atau{" "}
            <code className="rounded bg-muted px-1 font-mono">R7525</code>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            maxLength={6}
            aria-label="Nama model"
            autoComplete="off"
            spellCheck={false}
            className={cn(
              INPUT,
              "w-36 font-mono text-lg font-semibold uppercase",
            )}
          />
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Contoh model"
          >
            {MODEL_EXAMPLES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModel(m)}
                aria-pressed={model.toUpperCase() === m}
                className={chipClass(model.toUpperCase() === m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div
          aria-live="polite"
          className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {parts ? (
            parts.map((p, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-muted/50 px-3 py-2"
              >
                <b className="block font-mono text-xl font-bold text-emerald-700 dark:text-accent">
                  {p.key}
                </b>
                <span className="text-[13px] text-foreground">{p.meaning}</span>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-[13px] text-muted-foreground">
              Format belum dikenali. Contoh: R760, T550, R7525.
            </div>
          )}
        </div>
        <p className="text-[13px] text-muted-foreground">
          Ini hanya patokan umum. Yang pasti selalu:{" "}
          <strong className="text-foreground">Service Tag</strong> di server,
          untuk cek spesifikasi dan garansi.
        </p>
      </div>

      <Note tone="info">
        <strong>Analogi untuk programmer:</strong> server = mesin production
        tempat aplikasi di-deploy. iDRAC = &quot;remote console +
        monitoring&quot; bawaan mesin itu, tetap hidup walau OS crash.
      </Note>
    </>
  );
}
