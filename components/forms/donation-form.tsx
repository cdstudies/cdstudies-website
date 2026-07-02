"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { FrequencyToggle } from "@/components/donate/frequency-toggle";
import { GiftArray } from "@/components/donate/gift-array";
import { ImpactCallout } from "@/components/donate/impact-callout";
import { PaymentSection } from "@/components/donate/payment-section";
import { CheckInstructions } from "@/components/donate/check-instructions";
import { SectionLabel } from "@/components/donate/section-label";
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
interface DonationFormProps {
  /** False for visitors outside the US (per Vercel geo header) — ACH only
   *  works with US bank accounts, so they get card only. */
  achEligible: boolean;
}

export function DonationForm({ achEligible }: DonationFormProps) {
  const searchParams = useSearchParams();
  const queryAmount = Number(searchParams.get("amount"));
  const initialAmount = isValidDonationAmount(queryAmount)
    ? queryAmount
    : DEFAULT_AMOUNT;
  // Let links (e.g. the thank-you page's top-up / upgrade links) preset the tab.
  const queryFrequency = searchParams.get("frequency");
  const initialFrequency =
    queryFrequency === "monthly" || queryFrequency === "one-time"
      ? queryFrequency
      : DEFAULT_FREQUENCY;

  const [frequency, setFrequency] = useState<"monthly" | "one-time">(initialFrequency);
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
    <Card className="overflow-hidden border-border/60 bg-white py-0 shadow-lg shadow-primary/5">
      <CardContent className="flex flex-col gap-6 p-6 md:p-8">
        <div className="flex flex-col gap-4">
          <SectionLabel step={1}>Choose your gift</SectionLabel>
          <FrequencyToggle value={frequency} onChange={setFrequency} />
          <GiftArray value={amount} onChange={setAmount} />
          <ImpactCallout amount={amount} frequency={frequency} />
        </div>
        <Separator />
        <Elements
          stripe={stripePromise}
          options={{
            mode: frequency === "monthly" ? "subscription" : "payment",
            amount: validCents ?? lastValidCents,
            currency: CURRENCY,
            // One-time gifts save the card off-session so they can be upgraded
            // to monthly in one click on the thank-you page. In deferred-intent
            // mode this must match the PaymentIntent's setup_future_usage
            // (set in /api/donate) or confirmPayment is rejected. Subscriptions
            // handle saving the card themselves.
            ...(frequency === "monthly"
              ? {}
              : { setupFutureUsage: "off_session" as const }),
            // Card is always first so it stays the default tab; it also hides
            // Cash App Pay (see theo-stripe-recommendations.md) and Link's
            // save-my-info box (extra fields test badly for donations). Wallets
            // are offered separately via ExpressCheckoutSection. ACH Direct
            // Debit is added on monthly only — the validated recurring win
            // (NextAfter #2700) — and only for US visitors (it can't debit
            // non-US banks). Must match /api/donate's payment_method_types,
            // which re-derives both conditions server-side.
            paymentMethodTypes:
              frequency === "monthly" && achEligible
                ? ["card", "us_bank_account"]
                : ["card"],
            appearance: donationAppearance,
          }}
        >
          <PaymentSection
            amount={amount}
            frequency={frequency}
            achEligible={achEligible}
          />
        </Elements>
        <Separator />
        <div className="text-center">
          <CheckInstructions />
        </div>
      </CardContent>
    </Card>
  );
}
