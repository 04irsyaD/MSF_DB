"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BTN_PRIMARY } from "../../lib/ui";

interface TerminalInputProps {
  prompt: string;
  placeholder: string;
  label: string;
  onRun: (raw: string) => void;
  disabled?: boolean;
}

/** Baris input perintah dengan prompt di depan, mis. "racadm>". */
export default function TerminalInput({
  prompt,
  placeholder,
  label,
  onRun,
  disabled = false,
}: TerminalInputProps) {
  const [value, setValue] = useState("");

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onRun(value);
        setValue("");
      }}
    >
      <label
        className={cn(
          "flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3",
          "focus-within:ring-2 focus-within:ring-accent",
        )}
      >
        <span
          aria-hidden
          className="shrink-0 font-mono text-xs text-emerald-700 dark:text-emerald-400 sm:text-[13px]"
        >
          {prompt}
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={placeholder}
          aria-label={label}
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-[13px]"
        />
      </label>
      <button
        type="submit"
        disabled={disabled}
        className={cn(BTN_PRIMARY, "min-h-11 shrink-0")}
      >
        Jalankan
      </button>
    </form>
  );
}
