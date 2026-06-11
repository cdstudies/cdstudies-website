import { Lock } from "lucide-react";

/**
 * Trust reassurance shown directly beneath the payment fields. Security cues
 * next to card fields are one of the most reliable donation-form lifts in the
 * NextAfter experiment data (+125.8%, exp. #30791).
 */
export function SecureBadge() {
  return (
    <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
      <Lock className="size-3.5" aria-hidden />
      Secure, encrypted donation · processed by Stripe
    </p>
  );
}
