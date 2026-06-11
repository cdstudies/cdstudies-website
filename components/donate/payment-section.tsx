"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DonateButton } from "@/components/donate/donate-button";
import { ExpressCheckoutSection } from "@/components/donate/express-checkout";
import { SecureBadge } from "@/components/donate/secure-badge";
import { confirmDonation } from "@/lib/confirm-donation";
import {
  AMOUNT_RANGE_ERROR,
  isValidDonationAmount,
  isValidEmail,
  type DonationFrequency,
} from "@/lib/donation";

interface PaymentSectionProps {
  amount: number | null;
  frequency: DonationFrequency;
}

/** Donor details + payment fields + submit. Must render inside <Elements>. */
export function PaymentSection({ amount, frequency }: PaymentSectionProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements || submitting) return;

    if (!amount || !isValidDonationAmount(amount)) {
      setError(AMOUNT_RANGE_ERROR);
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address so we can send your receipt.");
      return;
    }

    setSubmitting(true);
    setError(null);
    const result = await confirmDonation({
      stripe,
      elements,
      amount,
      frequency,
      email,
      name: name.trim() || undefined,
    });
    if (result.ok) {
      router.push(result.redirectUrl);
      return;
    }
    setSubmitting(false);
    if (result.error) setError(result.error);
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="donor-name">Name</Label>
            <Input
              id="donor-name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="donor-email">Email for your receipt</Label>
            <Input
              id="donor-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Email is collected by our field above, so the Payment Element's own
            email field is turned off and billing details are attached at
            confirm time instead. */}
        <PaymentElement
          options={{
            layout: "tabs",
            fields: { billingDetails: { email: "never" } },
          }}
        />
        <SecureBadge />

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <DonateButton amount={amount} frequency={frequency} pending={submitting} />
      </form>

      <ExpressCheckoutSection
        amount={amount}
        frequency={frequency}
        email={email}
        name={name.trim() || undefined}
        disabled={submitting}
        onError={setError}
      />
    </div>
  );
}
