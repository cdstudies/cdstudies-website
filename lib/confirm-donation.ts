import type { Stripe, StripeElements } from "@stripe/stripe-js";
import type { DonationFrequency } from "@/lib/donation";

interface ConfirmDonationOptions {
  stripe: Stripe;
  elements: StripeElements;
  amount: number;
  frequency: DonationFrequency;
  email: string;
  name?: string;
}

export type ConfirmDonationResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; error: string };

/**
 * Shared deferred-intent confirmation used by both the card form and the
 * express checkout (wallet) buttons: validate the mounted element, exchange
 * the donation details for a client secret, then confirm on-page. Redirect
 * methods (3DS challenges, bank redirects) go through return_url instead —
 * the thank-you page handles both arrival paths.
 */
export async function confirmDonation({
  stripe,
  elements,
  amount,
  frequency,
  email,
  name,
}: ConfirmDonationOptions): Promise<ConfirmDonationResult> {
  const { error: submitError } = await elements.submit();
  if (submitError) {
    // The Payment Element renders field-level validation itself; the message
    // here is a fallback for anything it can't show inline.
    return { ok: false, error: submitError.message ?? "" };
  }

  const res = await fetch("/api/donate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, frequency, email, name }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.clientSecret) {
    return {
      ok: false,
      error: data.error ?? "Could not process your donation. Please try again.",
    };
  }

  const returnUrl = `${window.location.origin}/donate/thank-you?frequency=${frequency}`;
  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    clientSecret: data.clientSecret as string,
    confirmParams: {
      return_url: returnUrl,
      // Email is collected by our own field (the Payment Element's is turned
      // off), so it must be attached to the payment method here.
      payment_method_data: { billing_details: { email, name } },
    },
    redirect: "if_required",
  });

  if (error) {
    return {
      ok: false,
      error: error.message ?? "Payment failed. Please try again.",
    };
  }
  if (
    paymentIntent &&
    (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")
  ) {
    return {
      ok: true,
      redirectUrl: `${returnUrl}&payment_intent=${paymentIntent.id}`,
    };
  }
  return { ok: false, error: "Payment was not completed. Please try again." };
}
