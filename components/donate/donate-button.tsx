"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DonateButtonProps {
  amount: number | null;
  frequency: "monthly" | "one-time";
  onContinue: () => void;
}

/**
 * Step-1 continue button. Value-proposition label instead of "Donate $X" —
 * the payment itself is submitted inside Stripe's embedded checkout.
 */
export function DonateButton({ amount, frequency, onContinue }: DonateButtonProps) {
  return (
    <Button
      size="lg"
      disabled={!amount}
      onClick={onContinue}
      className="h-auto w-full flex-col gap-0.5 bg-accent py-3 text-accent-foreground hover:bg-accent/90"
    >
      <span className="flex items-center gap-2 text-lg">
        <Heart data-icon="inline-start" />
        {amount ? "I want to invest in children" : "Select an amount"}
      </span>
      {amount ? (
        <span className="text-sm font-normal opacity-90">
          ${amount}
          {frequency === "monthly" ? "/month" : " one-time"}
        </span>
      ) : null}
    </Button>
  );
}
