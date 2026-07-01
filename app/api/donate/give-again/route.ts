import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getSavedCardContext } from "@/lib/saved-card";
import { isValidDonationAmount } from "@/lib/donation";
import { CURRENCY, SITE_NAME } from "@/lib/constants";

/**
 * One-click one-time top-up, called from the thank-you page after a monthly
 * gift. We already hold the donor's customer + saved card (from the
 * subscription's first invoice PaymentIntent), so we charge a fresh one-time
 * gift off-session — no form, no re-entry. The amount is the only thing the
 * client supplies, and it's re-validated here.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const paymentIntentId = b.paymentIntentId;
  const amount = Number(b.amount);
  if (typeof paymentIntentId !== "string" || !paymentIntentId) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!isValidDonationAmount(amount)) {
    return NextResponse.json(
      { error: "Please choose a valid amount." },
      { status: 400 },
    );
  }
  const amountCents = Math.round(amount * 100);

  const context = await getSavedCardContext(paymentIntentId);
  if (!context) {
    return NextResponse.json(
      { error: "We couldn't find a saved card for this gift." },
      { status: 422 },
    );
  }
  const { customerId, paymentMethodId, email } = context;

  try {
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountCents,
        currency: CURRENCY,
        description: `Donation to ${SITE_NAME}`,
        customer: customerId,
        payment_method: paymentMethodId,
        // Charge the stored card without the donor present.
        off_session: true,
        confirm: true,
        ...(email ? { receipt_email: email } : {}),
        payment_method_types: ["card"],
        metadata: { frequency: "one-time", source: "thank-you-give-again" },
      },
    );

    if (
      paymentIntent.status === "succeeded" ||
      paymentIntent.status === "processing"
    ) {
      return NextResponse.json({ ok: true, amount });
    }
    // Anything else (e.g. requires_action that we can't complete off-session)
    // routes the donor to the full form.
    return NextResponse.json({ ok: false, requiresAuth: true });
  } catch (err) {
    // A saved card may still demand authentication (SCA); when it does, fall
    // back to the on-page form rather than surfacing a hard error.
    if (
      err instanceof Stripe.errors.StripeCardError &&
      err.code === "authentication_required"
    ) {
      return NextResponse.json({ ok: false, requiresAuth: true });
    }
    console.error("Stripe give-again error:", err);
    return NextResponse.json(
      { error: "We couldn't process your gift. Please try again." },
      { status: 500 },
    );
  }
}
