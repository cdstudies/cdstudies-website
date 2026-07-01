import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

// CDS's own Stripe account secret key. Donations are charged directly on this
// account — CDS is the merchant of record and no platform fee is taken.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
