import { cn } from "@/lib/utils";

interface KeycapProps {
  /** Satu kombinasi tombol, mis. ["Ctrl","Alt","T"]. */
  keys: string[];
  className?: string;
}

/**
 * Menampilkan satu kombinasi tombol sebagai <kbd> bergaya tombol keyboard.
 * Tombol dipisah tanda "+". Kontras teks dijaga >= 4.5:1 di light & dark.
 */
export default function Keycap({ keys, className }: KeycapProps) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {keys.map((key, i) => (
        <span key={`${key}-${i}`} className="inline-flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden className="text-xs text-muted-foreground">
              +
            </span>
          )}
          <kbd className="inline-flex min-w-[1.75rem] items-center justify-center rounded-md border border-border border-b-2 bg-muted px-2 py-1 font-mono text-xs font-semibold text-foreground shadow-sm">
            {key}
          </kbd>
        </span>
      ))}
    </span>
  );
}
