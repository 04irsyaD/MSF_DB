"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { TermLine } from "../../lib/types";
import { TERM_LINE } from "../../lib/ui";
import DeviceScreen from "../DeviceScreen";

interface TerminalScreenProps {
  lines: TermLine[];
  label: string;
  footer?: ReactNode;
}

/** Layar terminal dengan scroll internal; otomatis turun ke baris terbaru. */
export default function TerminalScreen({
  lines,
  label,
  footer,
}: TerminalScreenProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <DeviceScreen
      scroll
      bodyRef={bodyRef}
      label={label}
      footer={footer}
      focusable
    >
      {lines.map((l, i) => (
        <div
          key={i}
          className={cn("min-h-[1.5em] whitespace-pre", TERM_LINE[l.tone])}
        >
          {l.text}
        </div>
      ))}
    </DeviceScreen>
  );
}
