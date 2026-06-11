import type { ReactNode } from "react";

interface SectionLabelProps {
  step: number;
  children: ReactNode;
  hint?: ReactNode;
}

/**
 * Numbered section heading. Numbering the steps of a single-page form guides
 * reading and lifts conversion in the NextAfter data (numbered headers +12.5%,
 * exp. #36053; guided layout +54.5%, exp. #63899) — chunking without adding
 * actual steps (a real extra step tested −90.8%, exp. #720139).
 */
export function SectionLabel({ step, children, hint }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-sm leading-none text-accent-foreground"
      >
        {step}
      </span>
      <h2 className="font-heading text-2xl leading-none">{children}</h2>
      {hint ? <span className="translate-y-px text-xs">{hint}</span> : null}
    </div>
  );
}
