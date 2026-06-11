"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ExpressCheckoutElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type {
  StripeExpressCheckoutElementConfirmEvent,
  StripeExpressCheckoutElementReadyEvent,
} from "@stripe/stripe-js";
import { confirmDonation } from "@/lib/confirm-donation";
import type { DonationFrequency } from "@/lib/donation";

interface ExpressCheckoutSectionProps {
  amount: number | null;
  frequency: DonationFrequency;
  /** Fallbacks when the wallet doesn't return billing details. */
  email: string;
  name?: string;
  disabled: boolean;
  onError: (message: string) => void;
}

/**
 * Deliberately de-emphasized wallet buttons (small, below the card form, with
 * value-framed microcopy). NextAfter's data shows presentation decides whether
 * express options help or hurt: shrinking the button +21.3% (exp. #58731),
 * prominent unexplained wallets −36.6% (exp. #718901). Self-contained so it
 * can be removed or A/B-tested without touching the rest of the form.
 */
export function ExpressCheckoutSection({
  amount,
  frequency,
  email,
  name,
  disabled,
  onError,
}: ExpressCheckoutSectionProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [hasWallets, setHasWallets] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function handleReady(event: StripeExpressCheckoutElementReadyEvent) {
    setHasWallets(Boolean(event.availablePaymentMethods));
  }

  async function handleConfirm(event: StripeExpressCheckoutElementConfirmEvent) {
    if (!stripe || !elements || !amount || disabled || confirming) return;
    setConfirming(true);
    const result = await confirmDonation({
      stripe,
      elements,
      amount,
      frequency,
      email: event.billingDetails?.email ?? email,
      name: event.billingDetails?.name ?? name,
    });
    if (result.ok) {
      router.push(result.redirectUrl);
      return;
    }
    setConfirming(false);
    if (result.error) onError(result.error);
  }

  return (
    <div className={hasWallets ? "flex flex-col gap-2" : "hidden"}>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or give in one tap</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className={disabled || confirming ? "pointer-events-none opacity-60" : undefined}>
        <ExpressCheckoutElement
          onReady={handleReady}
          onConfirm={handleConfirm}
          options={{
            buttonHeight: 40,
            emailRequired: true,
            // Wallets only — Link/PayPal/etc. buttons would re-introduce the
            // cluttered "express checkout" presentation that tested negative.
            paymentMethods: {
              applePay: "auto",
              googlePay: "auto",
              link: "never",
              paypal: "never",
              amazonPay: "never",
              klarna: "never",
            },
          }}
        />
      </div>
    </div>
  );
}
