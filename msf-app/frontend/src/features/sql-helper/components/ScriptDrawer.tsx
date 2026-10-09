"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  Star,
  Share2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Tag,
  Info,
  AlertTriangle,
} from "lucide-react";
import { ScriptItem } from "../lib/schema";
import { RiskBadge, EngineBadge, CategoryBadge } from "./Badges";
import { RiskBanner } from "./RiskBanner";
import { SqlViewer } from "./SqlViewer";
import { ParamForm } from "./ParamForm";
import {
  interpolateSql,
  getDefaultParamValues,
  getParamStorageKey,
} from "../lib/interpolate";
import { copyScriptWithToast } from "../lib/clipboard";
import { copyToClipboard } from "@/lib/clipboard";
import { toast } from "sonner";
import { SQL_HELPER_LABELS } from "../lib/labels";

interface ScriptDrawerProps {
  script: ScriptItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelectTag?: (tag: string) => void;
  onAccessScript?: (scriptId: string) => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

export function ScriptDrawer({
  script,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectTag,
  onAccessScript,
  hasPrev = false,
  hasNext = false,
  onPrev,
  onNext,
}: ScriptDrawerProps) {
  const [highRiskConfirmed, setHighRiskConfirmed] = useState(false);
  const [copiedPrimary, setCopiedPrimary] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});

  // Reset confirmation state & load/initialize parameters whenever script changes or drawer opens
  useEffect(() => {
    setHighRiskConfirmed(false);
    setCopiedPrimary(false);

    if (script && isOpen) {
      onAccessScript?.(script.id);

      // Initialize parameters from localStorage or defaults
      if (script.params && script.params.length > 0) {
        const defaults = getDefaultParamValues(script.params);
        try {
          const stored = window.localStorage.getItem(getParamStorageKey(script.id));
          if (stored) {
            const parsed = JSON.parse(stored);
            setParamValues({ ...defaults, ...parsed });
          } else {
            setParamValues(defaults);
          }
        } catch {
          setParamValues(defaults);
        }
      } else {
        setParamValues({});
      }
    }
  }, [script, isOpen, onAccessScript]);

  // Keyboard navigation: ArrowLeft (prev), ArrowRight (next)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (isEditing) return;

      if (e.key === "ArrowLeft") {
        if (hasPrev && onPrev) {
          e.preventDefault();
          onPrev();
        }
      } else if (e.key === "ArrowRight") {
        if (hasNext && onNext) {
          e.preventDefault();
          onNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onPrev, onNext]);

  // Handle parameter value updates and persist to localStorage
  const handleParamChange = useCallback(
    (key: string, value: string) => {
      if (!script) return;
      setParamValues((prev) => {
        const updated = { ...prev, [key]: value };
        try {
          window.localStorage.setItem(
            getParamStorageKey(script.id),
            JSON.stringify(updated)
          );
        } catch {
          // Ignore localStorage errors
        }
        return updated;
      });
    },
    [script]
  );

  const handleResetParams = useCallback(() => {
    if (!script || !script.params) return;
    const defaults = getDefaultParamValues(script.params);
    setParamValues(defaults);
    try {
      window.localStorage.removeItem(getParamStorageKey(script.id));
    } catch {
      // Ignore
    }
    toast.info(SQL_HELPER_LABELS.toast.paramsReset);
  }, [script]);

  // Real-time SQL interpolation
  const interpolation = useMemo(() => {
    if (!script) {
      return {
        interpolatedSql: "",
        isValid: true,
        errors: {},
        missingRequired: [],
      };
    }
    return interpolateSql(script.sql, script.params || [], paramValues);
  }, [script, paramValues]);

  if (!script) return null;

  const hasParams = script.params && script.params.length > 0;
  const isHighRiskLocked = script.risk === "high" && !highRiskConfirmed;
  const isParamInvalid = !interpolation.isValid;
  const isCopyDisabled = isHighRiskLocked || isParamInvalid;

  const copyDisabledReason = isParamInvalid
    ? interpolation.missingRequired.length > 0
      ? SQL_HELPER_LABELS.params.fillRequiredWarning
      : SQL_HELPER_LABELS.params.invalidFormatWarning
    : isHighRiskLocked
    ? SQL_HELPER_LABELS.risk.highConfirmRequired
    : undefined;

  const handleCopyPrimary = async () => {
    if (isCopyDisabled) {
      if (copyDisabledReason) {
        toast.warning(copyDisabledReason);
      }
      return;
    }
    const success = await copyScriptWithToast(interpolation.interpolatedSql);
    if (success) {
      onAccessScript?.(script.id);
      setCopiedPrimary(true);
      setTimeout(() => setCopiedPrimary(false), 2000);
    }
  };

  const handleShareLink = async () => {
    if (typeof window === "undefined") return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?script=${script.id}`;
    const success = await copyToClipboard(shareUrl);
    if (success) {
      toast.success(SQL_HELPER_LABELS.toast.shareSuccess);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Animated Backdrop Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Slide-over Content Drawer */}
        <Dialog.Content
          aria-describedby="script-drawer-desc"
          className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-2xl bg-background border-l border-border shadow-2xl flex flex-col focus:outline-none transition-transform duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
        >
          {/* Header */}
          <div className="p-5 border-b border-border/80 bg-muted/20 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 pr-6">
                <Dialog.Title className="text-lg font-bold text-foreground leading-snug">
                  {script.title}
                </Dialog.Title>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <EngineBadge engine={script.engine} minVersion={script.minVersion} />
                  <CategoryBadge category={script.category} />
                  <RiskBadge risk={script.risk} />
                </div>
              </div>

              {/* Action buttons (Star, Share, Close) */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={onToggleFavorite}
                  aria-label={SQL_HELPER_LABELS.card.favorite}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorite
                      ? "text-amber-500 bg-amber-500/10 hover:text-amber-600"
                      : "text-muted-foreground hover:text-amber-500 hover:bg-muted"
                  }`}
                >
                  <Star
                    className={`w-4 h-4 ${isFavorite ? "fill-amber-500" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                <button
                  type="button"
                  onClick={handleShareLink}
                  aria-label={SQL_HELPER_LABELS.drawer.share}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label={SQL_HELPER_LABELS.drawer.close}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Risk Banner (medium & high) */}
            <RiskBanner
              risk={script.risk}
              isConfirmed={highRiskConfirmed}
              onConfirmChange={setHighRiskConfirmed}
              showConfirmation={false}
            />

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                {SQL_HELPER_LABELS.drawer.descriptionHeading}
              </h4>
              <p
                id="script-drawer-desc"
                className="text-sm text-foreground/90 leading-relaxed"
              >
                {script.description}
              </p>
            </div>

            {/* When to Use */}
            {script.whenToUse && (
              <div className="p-3.5 rounded-xl border border-border/80 bg-muted/30 text-xs space-y-1">
                <span className="font-semibold text-foreground flex items-center gap-1.5 font-mono">
                  <Info className="w-3.5 h-3.5 text-primary" />
                  {SQL_HELPER_LABELS.drawer.whenToUseHeading}
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  {script.whenToUse}
                </p>
              </div>
            )}

            {/* Template Parameters Form (if script has params) */}
            {hasParams && (
              <ParamForm
                params={script.params}
                values={paramValues}
                errors={interpolation.errors}
                onChange={handleParamChange}
                onReset={handleResetParams}
              />
            )}

            {/* SQL Viewer with real-time interpolated SQL */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                {SQL_HELPER_LABELS.viewer.heading}
              </h4>
              <SqlViewer
                sql={interpolation.interpolatedSql}
                scriptId={script.id}
                isCopyDisabled={isCopyDisabled}
                copyDisabledReason={copyDisabledReason}
              />
            </div>

            {/* Notes */}
            {script.notes && (
              <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-xs space-y-1">
                <span className="font-semibold text-primary font-mono block">
                  {SQL_HELPER_LABELS.drawer.notesHeading}
                </span>
                <p className="text-foreground/80 leading-relaxed">{script.notes}</p>
              </div>
            )}

            {/* Tags */}
            {script.tags && script.tags.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/60">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono block">
                  {SQL_HELPER_LABELS.drawer.tagsHeading}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {script.tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => onSelectTag?.(tag)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-muted/60 hover:bg-primary/10 hover:text-primary text-muted-foreground border border-border/60 transition-colors"
                    >
                      <Tag className="w-3 h-3 opacity-60" />
                      <span>#{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Footer */}
          <div className="p-4 border-t border-border/80 bg-background/95 backdrop-blur-xs space-y-3">
            {/* Warning banner if parameters are invalid/incomplete */}
            {isParamInvalid && (
              <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 font-medium">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{copyDisabledReason}</span>
              </div>
            )}

            {/* High-risk confirmation checkbox in footer */}
            {script.risk === "high" && (
              <label className="flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 font-medium cursor-pointer p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <input
                  type="checkbox"
                  checked={highRiskConfirmed}
                  onChange={(e) => setHighRiskConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <span>{SQL_HELPER_LABELS.risk.highConfirmPrompt}</span>
              </label>
            )}

            <div className="flex items-center justify-between gap-3">
              {/* Prev/Next Navigation */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={!hasPrev}
                  onClick={onPrev}
                  aria-label={SQL_HELPER_LABELS.drawer.prevScript}
                  title="Previous script (Press ←)"
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium border border-border/70 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {SQL_HELPER_LABELS.drawer.prevScript}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={!hasNext}
                  onClick={onNext}
                  aria-label={SQL_HELPER_LABELS.drawer.nextScript}
                  title="Next script (Press →)"
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium border border-border/70 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                >
                  <span className="hidden sm:inline">
                    {SQL_HELPER_LABELS.drawer.nextScript}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Primary Copy Button */}
              <button
                type="button"
                disabled={isCopyDisabled}
                onClick={handleCopyPrimary}
                title={copyDisabledReason || SQL_HELPER_LABELS.drawer.copyPrimary}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold font-mono tracking-wide transition-all shadow-xs ${
                  isCopyDisabled
                    ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
                    : copiedPrimary
                    ? "bg-emerald-600 text-white"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                }`}
              >
                {copiedPrimary ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{SQL_HELPER_LABELS.drawer.copiedPrimary}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{SQL_HELPER_LABELS.drawer.copyPrimary}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
