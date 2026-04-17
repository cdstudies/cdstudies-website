"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { FrequencyToggle } from "@/components/donate/frequency-toggle";
import { GiftArray } from "@/components/donate/gift-array";
import { AnnualImpact } from "@/components/donate/annual-impact";
import { DonateButton } from "@/components/donate/donate-button";
import { CheckInstructions } from "@/components/donate/check-instructions";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_AMOUNT, DEFAULT_FREQUENCY } from "@/lib/constants";

export function DonationForm() {
  const searchParams = useSearchParams();
  const initialAmount = searchParams.get("amount")
    ? Number(searchParams.get("amount"))
    : DEFAULT_AMOUNT;

  const [frequency, setFrequency] = useState<"monthly" | "one-time">(DEFAULT_FREQUENCY);
  const [amount, setAmount] = useState<number | null>(initialAmount);

  return (
    <div className="flex flex-col gap-6">
      <FrequencyToggle value={frequency} onChange={setFrequency} />
      <GiftArray value={amount} onChange={setAmount} />
      <AnnualImpact amount={amount} frequency={frequency} />
      <DonateButton amount={amount} frequency={frequency} />
      <Separator />
      <div className="text-center">
        <CheckInstructions />
      </div>
    </div>
  );
}
