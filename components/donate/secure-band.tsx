import type { ReactNode } from "react";
import { Lock } from "lucide-react";

/**
 * Tinted, bordered band around the payment fields. Visually fencing off the
 * card fields as a secure zone is one of the most reliable donation-form
 * lifts in the NextAfter data: security box around payment fields +48.9%
 * (exp. #31362), security-themed visual treatment +125.8% (exp. #30791).
 * First-party reassurance only — third-party trust seals tested −15%
 * (exp. #71469).
 */
export function SecureBand({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-cds-sage/40 bg-cds-sage/5 p-4">
      <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-cds-sage uppercase">
        <Lock className="size-3.5" aria-hidden />
        Secure, encrypted payment
      </p>
      {children}
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Processed by Stripe — your card details never touch our servers.
      </p>
    </div>
  );
}
