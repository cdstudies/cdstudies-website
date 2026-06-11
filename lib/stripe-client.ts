import { loadStripe } from "@stripe/stripe-js";

// Module-level so the Stripe.js instance survives re-mounts. The connected
// account id scopes Stripe.js to CDS's account — required because intents are
// created as direct charges, so their client_secrets live on that account.
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  { stripeAccount: process.env.NEXT_PUBLIC_STRIPE_CONNECTED_ACCOUNT_ID! },
);
