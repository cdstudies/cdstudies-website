"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DonateButtonProps {
  amount: number | null;
  frequency: "monthly" | "one-time";
}

export function DonateButton({ amount, frequency }: DonateButtonProps) {
  const label = amount
    ? `Donate $${amount}${frequency === "monthly" ? " Monthly" : ""}`
    : "Select an Amount";

  function handleClick() {
    if (!amount) return;
    console.log("Donation:", { amount, frequency, currency: "usd", recurring: frequency === "monthly" });
    alert(`Thank you! Payment processing will be connected soon. You selected: $${amount} ${frequency}.`);
  }

  return (
    <Button
      size="lg"
      disabled={!amount}
      onClick={handleClick}
      className="w-full bg-accent text-lg text-accent-foreground hover:bg-accent/90"
    >
      <Heart data-icon="inline-start" />
      {label}
    </Button>
  );
}
