"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { FrequencyToggle } from "@/components/donate/frequency-toggle";
import { GiftArray } from "@/components/donate/gift-array";
import { ImpactCallout } from "@/components/donate/impact-callout";
import { DonateButton } from "@/components/donate/donate-button";
import { DonateEmbeddedCheckout } from "@/components/donate/embedded-checkout";
import { CheckInstructions } from "@/components/donate/check-instructions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_AMOUNT, DEFAULT_FREQUENCY } from "@/lib/constants";

export function DonationForm() {
  const searchParams = useSearchParams();
  const initialAmount = searchParams.get("amount")
    ? Number(searchParams.get("amount"))
    : DEFAULT_AMOUNT;

  const [frequency, setFrequency] = useState<"monthly" | "one-time">(DEFAULT_FREQUENCY);
  const [amount, setAmount] = useState<number | null>(initialAmount);
  const [step, setStep] = useState<"amount" | "checkout">("amount");

  if (step === "checkout") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-2.5">
          <p className="text-sm">
            <span className="font-semibold">${amount}</span>
            <span className="text-muted-foreground">
              {frequency === "monthly" ? "/month" : " one-time gift"}
            </span>
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep("amount")}
            className="text-accent hover:text-accent"
          >
            Change
          </Button>
        </div>
        {amount ? (
          <DonateEmbeddedCheckout amount={amount} frequency={frequency} />
        ) : null}
        <div className="text-center">
          <CheckInstructions />
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-white py-0">
      <CardContent className="flex flex-col gap-6 p-6 md:p-8">
        <FrequencyToggle value={frequency} onChange={setFrequency} />
        <GiftArray value={amount} onChange={setAmount} />
        <ImpactCallout amount={amount} frequency={frequency} />
        <DonateButton
          amount={amount}
          frequency={frequency}
          onContinue={() => setStep("checkout")}
        />
        <Separator />
        <div className="text-center">
          <CheckInstructions />
        </div>
      </CardContent>
    </Card>
  );
}
