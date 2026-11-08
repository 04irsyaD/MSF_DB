import type { ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

interface DeviceScreenProps {
  children: ReactNode;
  /** Baris petunjuk di bawah layar (mis. daftar tombol boot). */
  footer?: ReactNode;
  /** Layar menu BIOS: latar terang seperti System Setup asli. */
  bios?: boolean;
  /** Tinggi tetap dengan scroll di dalam layar (terminal). */
  scroll?: boolean;
  bodyRef?: Ref<HTMLDivElement>;
  screenRef?: Ref<HTMLDivElement>;
  className?: string;
  label?: string;
  focusable?: boolean;
}

/**
 * Layar "perangkat" (monitor server, terminal). Warnanya selalu gelap dengan bezel,
 * jadi tampil sama di tema light dan dark. Konten lebar di-scroll di dalam layar,
 * bukan di halaman.
 */
export default function DeviceScreen({
  children,
  footer,
  bios = false,
  scroll = false,
  bodyRef,
  screenRef,
  className,
  label,
  focusable = false,
}: DeviceScreenProps) {
  return (
    <div
      ref={screenRef}
      role="region"
      aria-label={label}
      aria-live="polite"
      tabIndex={focusable ? 0 : undefined}
      className={cn(
        "relative overflow-hidden rounded-xl border-[7px] border-[#22272e] font-mono text-xs leading-relaxed sm:border-[10px] sm:text-[13px]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        bios ? "bg-[#dfe5ea] text-[#10161c]" : "bg-[#05070a] text-slate-300",
        className,
      )}
    >
      <div
        ref={bodyRef}
        className={cn(
          "overflow-x-auto px-3 py-3 sm:px-4",
          scroll ? "h-[300px] overflow-y-auto" : "min-h-[280px]",
          footer && "pb-12",
        )}
      >
        {children}
      </div>
      {footer && (
        <div className="absolute inset-x-0 bottom-0 bg-[#11161c] px-3 py-2 text-[11px] text-sky-300 sm:px-4 sm:text-xs">
          {footer}
        </div>
      )}
    </div>
  );
}
