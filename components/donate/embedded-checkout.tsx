"use client";

import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

// Module-level so the Stripe.js instance survives re-mounts. The connected
// account id scopes Stripe.js to CDS's account — required because sessions
// are created as direct charges, so their client_secrets live on that account.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  { stripeAccount: process.env.NEXT_PUBLIC_STRIPE_CONNECTED_ACCOUNT_ID! },
);

interface DonateEmbeddedCheckoutProps {
  amount: number;
  frequency: "monthly" | "one-time";
}

export function DonateEmbeddedCheckout({
  amount,
  frequency,
}: DonateEmbeddedCheckoutProps) {
  const fetchClientSecret = useCallback(async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, frequency }),
    });
    const data = await res.json();
    if (!res.ok || !data.clientSecret) {
      throw new Error(data.error ?? "Could not start checkout. Please try again.");
    }
    return data.clientSecret as string;
  }, [amount, frequency]);

  // Checkout Sessions are immutable: the key forces a full iframe
  // destroy/recreate whenever the amount or frequency changes.
  return (
    <div className="min-h-[24rem] overflow-hidden rounded-xl bg-white pb-12">
      <EmbeddedCheckoutProvider
        key={`${amount}-${frequency}`}
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
