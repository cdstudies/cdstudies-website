"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { FrequencyToggle } from "@/components/donate/frequency-toggle";
import { GiftArray } from "@/components/donate/gift-array";
import { ImpactCallout } from "@/components/donate/impact-callout";
import { PaymentSection } from "@/components/donate/payment-section";
import { CheckInstructions } from "@/components/donate/check-instructions";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { stripePromise } from "@/lib/stripe-client";
import { donationAppearance } from "@/lib/stripe-appearance";
import { isValidDonationAmount } from "@/lib/donation";
import { CURRENCY, DEFAULT_AMOUNT, DEFAULT_FREQUENCY } from "@/lib/constants";

/**
 * Single-page donation form: gift array, donor details, and payment fields
 * all visible at once. The Payment Element renders in deferred-intent mode
 * (no client secret yet) so amount/frequency changes just update the mounted
 * element — the PaymentIntent/Subscription is only created at submit.
 */
export function DonationForm() {
  const searchParams = useSearchParams();
  const queryAmount = Number(searchParams.get("amount"));
  const initialAmount = isValidDonationAmount(queryAmount)
    ? queryAmount
    : DEFAULT_AMOUNT;

  const [frequency, setFrequency] = useState<"monthly" | "one-time">(DEFAULT_FREQUENCY);
  const [amount, setAmount] = useState<number | null>(initialAmount);

  // Elements requires a positive amount at all times; while the custom field
  // is empty or out of range, keep the element on the last valid amount and
  // gate submission separately in PaymentSection.
  const validCents =
    amount !== null && isValidDonationAmount(amount)
      ? Math.round(amount * 100)
      : null;
  const [lastValidCents, setLastValidCents] = useState(initialAmount * 100);
  if (validCents !== null && validCents !== lastValidCents) {
    setLastValidCents(validCents);
  }

  return (
    <Card className="bg-white py-0">
      <CardContent className="flex flex-col gap-6 p-6 md:p-8">
        <FrequencyToggle value={frequency} onChange={setFrequency} />
        <GiftArray value={amount} onChange={setAmount} />
        <ImpactCallout amount={amount} frequency={frequency} />
        <Elements
          stripe={stripePromise}
          options={{
            mode: frequency === "monthly" ? "subscription" : "payment",
            amount: validCents ?? lastValidCents,
            currency: CURRENCY,
            // Card only in the main form: hides Cash App Pay (see
            // theo-stripe-recommendations.md) and Link's save-my-info box
            // (extra fields test badly for donations). Wallets are offered
            // separately via ExpressCheckoutSection.
            paymentMethodTypes: ["card"],
            appearance: donationAppearance,
          }}
        >
          <PaymentSection amount={amount} frequency={frequency} />
        </Elements>
        <Separator />
        <div className="text-center">
          <CheckInstructions />
        </div>
      </CardContent>
    </Card>
  );
}
