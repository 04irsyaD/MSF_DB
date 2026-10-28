"use client";

import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { SQL_HELPER_LABELS } from "../lib/labels";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear?: () => void;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  className = "",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut: "/" to focus search, "Esc" to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in another input/textarea or contentEditable
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (e.key === "/" && !isInput) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      } else if (e.key === "Escape" && document.activeElement === inputRef.current) {
        if (value) {
          onChange("");
        } else {
          inputRef.current?.blur();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [value, onChange]);

  const handleClear = () => {
    if (onClear) onClear();
    else onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <label htmlFor="sql-helper-search-input" className="sr-only">
        {SQL_HELPER_LABELS.search.label}
      </label>

      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />

      <input
        ref={inputRef}
        id="sql-helper-search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={SQL_HELPER_LABELS.search.placeholder}
        className="w-full pl-10 pr-20 py-2.5 text-sm bg-background/80 hover:bg-background border border-border/80 focus:border-primary/60 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/70"
        autoComplete="off"
        spellCheck="false"
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            aria-label={SQL_HELPER_LABELS.search.clear}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd
            className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground bg-muted border border-border/60 rounded shadow-xs select-none"
            title="Press / to focus search"
          >
            /
          </kbd>
        )}
      </div>
    </div>
  );
}
