import type Stripe from "stripe";
import { stripe, connectedAccountId } from "@/lib/stripe";

export interface SavedCardContext {
  /** The retrieved source PaymentIntent — callers reuse it for amount, status,
   *  and metadata rather than retrieving it a second time. */
  paymentIntent: Stripe.PaymentIntent;
  customerId: string;
  paymentMethodId: string;
  /** For the Stripe receipt on a follow-up off-session charge. */
  email: string | null;
}

/**
 * Resolves the saved-card context for a PaymentIntent so a follow-up charge can
 * reuse the card the donor already gave with (the one-click monthly upgrade and
 * the one-time top-up both build on this). Returns null when the PaymentIntent
 * can't be read or has no saved customer + payment method.
 */
export async function getSavedCardContext(
  paymentIntentId: string,
): Promise<SavedCardContext | null> {
  if (!connectedAccountId) return null;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      { expand: ["customer"] },
      { stripeAccount: connectedAccountId },
    );

    const customer = paymentIntent.customer;
    const customerId =
      typeof customer === "string" ? customer : customer?.id;
    const paymentMethodId =
      typeof paymentIntent.payment_method === "string"
        ? paymentIntent.payment_method
        : paymentIntent.payment_method?.id;

    if (!customerId || !paymentMethodId) return null;

    const email =
      customer && typeof customer !== "string" && !customer.deleted
        ? customer.email
        : paymentIntent.receipt_email;

    return { paymentIntent, customerId, paymentMethodId, email: email ?? null };
  } catch {
    return null;
  }
}
