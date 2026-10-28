"use client";

import { useState, useEffect } from "react";
import { Info, X } from "lucide-react";
import { SQL_HELPER_LABELS } from "../lib/labels";

const STORAGE_KEY = "msfdb:sqlhelper:v1:infoDismissed";

export function InfoBanner() {
  const [dismissed, setDismissed] = useState(true); // default true to avoid hydration mismatch

  useEffect(() => {
    try {
      const isDismissed = localStorage.getItem(STORAGE_KEY) === "true";
      setDismissed(isDismissed);
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore localStorage errors
    }
  };

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="SQL Helper Guide"
      className="bg-primary/5 border border-primary/20 border-l-4 border-l-primary rounded-xl p-3.5 flex items-start justify-between gap-3 shadow-xs"
    >
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
          <Info className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-foreground tracking-tight">
            {SQL_HELPER_LABELS.header.infoTitle}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {SQL_HELPER_LABELS.header.infoDescription}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/60 transition-colors shrink-0"
        title={SQL_HELPER_LABELS.header.dismissInfo}
        aria-label={SQL_HELPER_LABELS.header.dismissInfo}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
