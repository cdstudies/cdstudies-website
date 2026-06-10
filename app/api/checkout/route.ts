import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe, connectedAccountId, platformFeeCents } from "@/lib/stripe";
import {
  CURRENCY,
  PLATFORM_FEE_PERCENT,
  MIN_DONATION,
  MAX_DONATION,
  SITE_NAME,
} from "@/lib/constants";

/**
 * Creates a Stripe Checkout Session as a DIRECT CHARGE on CDS's connected
 * account: CDS is merchant of record, donor's gift lands with CDS, and
 * Gathered's cut is collected as a Connect application fee. The whole flow
 * keeps Gathered out of the money path so donations stay tax-deductible.
 */
export async function POST(request: NextRequest) {
  if (!connectedAccountId) {
    return NextResponse.json(
      { error: "Donations are not configured yet. Please try again later." },
      { status: 500 },
    );
  }

  let body: { amount?: unknown; frequency?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const amount = Number(body.amount);
  const frequency = body.frequency === "monthly" ? "monthly" : "one-time";

  if (!Number.isFinite(amount) || amount < MIN_DONATION || amount > MAX_DONATION) {
    return NextResponse.json(
      { error: `Please enter an amount between $${MIN_DONATION} and $${MAX_DONATION.toLocaleString()}.` },
      { status: 400 },
    );
  }

  const amountCents = Math.round(amount * 100);
  const origin =
    request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";

  // Embedded checkout: Stripe redirects here itself when payment completes
  // (cancel_url is not allowed in this mode — abandoning just leaves the page).
  const return_url = `${origin}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`;

  const params: Stripe.Checkout.SessionCreateParams =
    frequency === "monthly"
      ? {
          ui_mode: "embedded_page",
          mode: "subscription",
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: CURRENCY,
                unit_amount: amountCents,
                recurring: { interval: "month" },
                product_data: { name: `Monthly donation to ${SITE_NAME}` },
              },
            },
          ],
          // Application fee on every recurring invoice → Gathered's balance.
          subscription_data: { application_fee_percent: PLATFORM_FEE_PERCENT },
          return_url,
        }
      : {
          ui_mode: "embedded_page",
          mode: "payment",
          submit_type: "donate",
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: CURRENCY,
                unit_amount: amountCents,
                product_data: { name: `Donation to ${SITE_NAME}` },
              },
            },
          ],
          // Fixed application fee on the one-time charge → Gathered's balance.
          payment_intent_data: {
            application_fee_amount: platformFeeCents(amountCents),
          },
          return_url,
        };

  try {
    const session = await stripe.checkout.sessions.create(params, {
      // Direct charge on CDS's account (SDK equivalent of the Stripe-Account header).
      stripeAccount: connectedAccountId,
    });
    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
