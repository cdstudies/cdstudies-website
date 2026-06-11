"use client";

import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DonateButtonProps {
  amount: number | null;
  frequency: "monthly" | "one-time";
  pending: boolean;
}

/**
 * Submit button with a value-proposition label instead of a bare "Donate $X" —
 * value prop on the donate button lifted donations +42.2% in the NextAfter
 * data (exp. #723630).
 */
export function DonateButton({ amount, frequency, pending }: DonateButtonProps) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={!amount || pending}
      className="h-auto w-full flex-col gap-0.5 bg-accent py-3 text-accent-foreground hover:bg-accent/90"
    >
      <span className="flex items-center gap-2 text-lg">
        {pending ? (
          <Loader2 data-icon="inline-start" className="animate-spin" />
        ) : (
          <Heart data-icon="inline-start" />
        )}
        {pending
          ? "Processing your gift…"
          : amount
            ? "I want to invest in children"
            : "Select an amount"}
      </span>
      {amount && !pending ? (
        <span className="text-sm font-normal opacity-90">
          ${amount}
          {frequency === "monthly" ? "/month" : " one-time"}
        </span>
      ) : null}
    </Button>
  );
}
