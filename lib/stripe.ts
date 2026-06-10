import Stripe from "stripe";
import { PLATFORM_FEE_PERCENT } from "@/lib/constants";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

// Gathered's (the platform's) secret key. Acts on CDS's connected account via
// the { stripeAccount } request option — we never hold CDS's secret key.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CDS's connected account id (acct_…). The only thing we need from CDS; not a
// credential. May be undefined until set — callers must guard.
export const connectedAccountId = process.env.STRIPE_CONNECTED_ACCOUNT_ID;

/** Gathered's cut, in cents, for a one-time charge of `amountCents`. */
export function platformFeeCents(amountCents: number): number {
  return Math.round((amountCents * PLATFORM_FEE_PERCENT) / 100);
}
