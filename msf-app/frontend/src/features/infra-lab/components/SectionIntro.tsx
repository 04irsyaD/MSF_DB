import type { ReactNode } from "react";

/** Judul + paragraf pembuka di awal setiap bagian modul. */
export default function SectionIntro({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 id={id} className="text-lg font-semibold text-foreground">
        {title}
      </h2>
      <p className="mt-1.5 max-w-[70ch] text-sm leading-relaxed text-muted-foreground">
        {children}
      </p>
    </div>
  );
}
