import { loadStripe } from "@stripe/stripe-js";

// Module-level so the Stripe.js instance survives re-mounts.
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);
