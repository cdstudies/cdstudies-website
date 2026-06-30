import { NextResponse, type NextRequest } from "next/server";
import { stripe, connectedAccountId } from "@/lib/stripe";
import { getSavedCardContext } from "@/lib/saved-card";
import { CURRENCY, PLATFORM_FEE_PERCENT } from "@/lib/constants";

/**
 * One-click "make it monthly" upgrade, called from the thank-you page after a
 * successful one-time gift. The donor's card was saved off-session on the
 * original PaymentIntent (see app/api/donate/route.ts), so we can start a
 * recurring subscription without the donor re-entering payment details.
 *
 * Everything (amount, customer, payment method) is derived server-side from the
 * PaymentIntent — the client only hands us its id, never an amount.
 */
export async function POST(request: NextRequest) {
  if (!connectedAccountId) {
    return NextResponse.json(
      { error: "Donations are not configured yet. Please try again later." },
      { status: 500 },
    );
  }

  const productId = process.env.STRIPE_DONATION_PRODUCT_ID;
  if (!productId) {
    console.error("STRIPE_DONATION_PRODUCT_ID is not set");
    return NextResponse.json(
      { error: "Monthly giving is not configured yet. Please try again later." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const paymentIntentId = (body as Record<string, unknown>)?.paymentIntentId;
  if (typeof paymentIntentId !== "string" || !paymentIntentId) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const context = await getSavedCardContext(paymentIntentId);

    // Only upgrade a genuine, settled one-time gift that saved its card.
    if (
      !context ||
      context.paymentIntent.status !== "succeeded" ||
      context.paymentIntent.metadata?.frequency !== "one-time"
    ) {
      return NextResponse.json(
        { error: "This gift can't be upgraded automatically." },
        { status: 422 },
      );
    }
    const { paymentIntent, customerId, paymentMethodId } = context;

    // Idempotency / abuse guard: never create a second subscription for a
    // customer who already has one (also see "Limit customers to one
    // subscription" in theo-stripe-recommendations.md).
    const existing = await stripe.subscriptions.list(
      { customer: customerId, status: "all", limit: 1 },
      { stripeAccount: connectedAccountId },
    );
    if (existing.data.length > 0) {
      return NextResponse.json({ ok: true, alreadyMonthly: true });
    }

    await stripe.subscriptions.create(
      {
        customer: customerId,
        default_payment_method: paymentMethodId,
        items: [
          {
            quantity: 1,
            price_data: {
              currency: CURRENCY,
              unit_amount: paymentIntent.amount,
              recurring: { interval: "month" },
              product: productId,
            },
          },
        ],
        // The gift made today covers this month; start charging the recurring
        // amount next month so the donor isn't billed twice right now.
        trial_period_days: 30,
        payment_settings: { payment_method_types: ["card"] },
        // Application fee on every recurring invoice → Gathered's balance.
        application_fee_percent: PLATFORM_FEE_PERCENT,
        metadata: { source: "thank-you-upgrade", upgraded_from: paymentIntent.id },
      },
      { stripeAccount: connectedAccountId },
    );

    return NextResponse.json({ ok: true, amount: paymentIntent.amount / 100 });
  } catch (err) {
    console.error("Stripe upgrade error:", err);
    return NextResponse.json(
      { error: "We couldn't set up your monthly gift. Please try again." },
      { status: 500 },
    );
  }
}
