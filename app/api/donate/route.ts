import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe, connectedAccountId, platformFeeCents } from "@/lib/stripe";
import { parseDonationBody } from "@/lib/donation";
import { CURRENCY, PLATFORM_FEE_PERCENT, SITE_NAME } from "@/lib/constants";

/**
 * Creates the payment for the on-page Payment Element as a DIRECT CHARGE on
 * CDS's connected account: CDS is merchant of record, the donor's gift lands
 * with CDS, and Gathered's cut is collected as a Connect application fee. The
 * whole flow keeps Gathered out of the money path so donations stay
 * tax-deductible.
 *
 * Called at submit time (deferred-intent flow): the client renders the
 * Payment Element first, then exchanges { amount, frequency, email, name }
 * for a client secret and confirms it with stripe.confirmPayment.
 */
export async function POST(request: NextRequest) {
  if (!connectedAccountId) {
    return NextResponse.json(
      { error: "Donations are not configured yet. Please try again later." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseDonationBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { amountCents, frequency, email, name } = parsed.data;

  try {
    if (frequency === "monthly") {
      // Subscription prices need a real Product id (no inline product_data
      // outside Checkout). Created once on the connected account:
      //   stripe products create --name "Monthly donation" --stripe-account acct_…
      const productId = process.env.STRIPE_DONATION_PRODUCT_ID;
      if (!productId) {
        console.error("STRIPE_DONATION_PRODUCT_ID is not set");
        return NextResponse.json(
          { error: "Monthly giving is not configured yet. Please try again later." },
          { status: 500 },
        );
      }

      const customer = await stripe.customers.create(
        { email, name },
        { stripeAccount: connectedAccountId },
      );

      const subscription = await stripe.subscriptions.create(
        {
          customer: customer.id,
          items: [
            {
              quantity: 1,
              price_data: {
                currency: CURRENCY,
                unit_amount: amountCents,
                recurring: { interval: "month" },
                product: productId,
              },
            },
          ],
          payment_behavior: "default_incomplete",
          payment_settings: {
            save_default_payment_method: "on_subscription",
            // Must match the Elements paymentMethodTypes (card covers the
            // Apple/Google Pay wallets too) or confirmPayment is rejected.
            payment_method_types: ["card"],
          },
          // Application fee on every recurring invoice → Gathered's balance.
          application_fee_percent: PLATFORM_FEE_PERCENT,
          expand: ["latest_invoice.confirmation_secret"],
          metadata: { source: "donate-page" },
        },
        { stripeAccount: connectedAccountId },
      );

      const invoice = subscription.latest_invoice as Stripe.Invoice | null;
      const clientSecret = invoice?.confirmation_secret?.client_secret;
      if (!clientSecret) {
        throw new Error("Subscription created without a confirmation secret");
      }
      return NextResponse.json({ clientSecret });
    }

    // Attach a customer and save the card so the gift can be upgraded to
    // monthly in one click on the thank-you page (off-session subscription).
    const customer = await stripe.customers.create(
      { email, name },
      { stripeAccount: connectedAccountId },
    );

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountCents,
        currency: CURRENCY,
        description: `Donation to ${SITE_NAME}`,
        customer: customer.id,
        // Save the payment method to the customer for reuse without the donor
        // present — powers the one-click "make it monthly" upgrade.
        setup_future_usage: "off_session",
        // Forces a Stripe receipt email in live mode, independent of the
        // connected account's dashboard email settings.
        receipt_email: email,
        // Fixed application fee on the one-time charge → Gathered's balance.
        application_fee_amount: platformFeeCents(amountCents),
        // Must match the Elements paymentMethodTypes (card covers the
        // Apple/Google Pay wallets too) or confirmPayment is rejected.
        payment_method_types: ["card"],
        metadata: { frequency: "one-time", donor_name: name ?? "" },
      },
      { stripeAccount: connectedAccountId },
    );
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe donation error:", err);
    return NextResponse.json(
      { error: "Could not process your donation. Please try again." },
      { status: 500 },
    );
  }
}
