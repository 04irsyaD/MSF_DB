"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ZOOM_STEP } from "@/lib/diagram/constants";
import { fitViewport, zoomAt, type Box, type Point, type Viewport } from "@/lib/diagram/geometry";

/** Tinggi toolbar mengambang (`[data-diagram-toolbar]`) yang menutupi bagian atas kanvas. */
function toolbarInset(container: HTMLDivElement | null): number {
  const toolbar = container?.parentElement?.querySelector("[data-diagram-toolbar]");
  if (!container || !toolbar) return 0;
  return Math.max(0, toolbar.getBoundingClientRect().bottom - container.getBoundingClientRect().top);
}

/**
 * State zoom + pan kanvas, ukuran kontainer (ResizeObserver), dan zoom via wheel.
 * Semua jalur zoom memakai `zoomAt` agar selalu berporos dan berbatas sama.
 */
export function useCanvasViewport(container: HTMLDivElement | null, getContentBox: () => Box | null) {
  const [view, setView] = useState<Viewport>({ zoom: 1, x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const userAdjustedRef = useRef(false);
  const pendingFitRef = useRef(true);
  const getContentBoxRef = useRef(getContentBox);
  getContentBoxRef.current = getContentBox;

  useEffect(() => {
    if (!container) return;
    const update = () => setSize({ width: container.clientWidth, height: container.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [container]);

  const fit = useCallback(() => {
    const box = getContentBoxRef.current();
    if (!box || size.width === 0 || size.height === 0) {
      pendingFitRef.current = true;
      return;
    }
    pendingFitRef.current = false;
    userAdjustedRef.current = false;
    setView(fitViewport(box, size.width, size.height, undefined, toolbarInset(container)));
  }, [container, size.width, size.height]);

  /** Minta Fit secepatnya (setelah ukuran & posisi siap). */
  const requestFit = useCallback(() => {
    pendingFitRef.current = true;
    userAdjustedRef.current = false;
  }, []);

  // Jalankan Fit tertunda, atau Fit ulang saat ukuran berubah jika user belum zoom/pan manual
  useEffect(() => {
    if (size.width === 0 || size.height === 0) return;
    if (pendingFitRef.current || !userAdjustedRef.current) fit();
  }, [size.width, size.height, fit]);

  const zoomBy = useCallback(
    (factor: number, pivot?: Point) => {
      userAdjustedRef.current = true;
      const p = pivot ?? { x: size.width / 2, y: size.height / 2 };
      setView((v) => zoomAt(v, v.zoom * factor, p));
    },
    [size.width, size.height]
  );

  const zoomTo = useCallback((zoom: number, pivot: Point) => {
    userAdjustedRef.current = true;
    setView((v) => zoomAt(v, zoom, pivot));
  }, []);

  const panBy = useCallback((dx: number, dy: number) => {
    userAdjustedRef.current = true;
    setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
  }, []);

  // Ctrl/Cmd + wheel (dan pinch trackpad) = zoom di posisi kursor; wheel biasa = geser kanvas
  useEffect(() => {
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) {
        const factor = Math.exp(-e.deltaY * 0.0025);
        userAdjustedRef.current = true;
        setView((v) => zoomAt(v, v.zoom * factor, { x: e.clientX - rect.left, y: e.clientY - rect.top }));
      } else {
        userAdjustedRef.current = true;
        setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
      }
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [container]);

  return {
    view,
    size,
    fit,
    requestFit,
    zoomIn: () => zoomBy(ZOOM_STEP),
    zoomOut: () => zoomBy(1 / ZOOM_STEP),
    zoomTo,
    panBy,
    pendingFitRef,
  };
}
