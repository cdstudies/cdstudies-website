import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";

/**
 * Webhook endpoint for CDS's own Stripe account. Signatures are verified with
 * the account's webhook signing secret (STRIPE_WEBHOOK_SECRET).
 *
 * Register with: stripe listen --forward-to localhost:3000/api/webhooks/stripe
 */
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret not configured." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  // Raw body is required for signature verification — do not parse first.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      // One-time gifts (metadata.frequency is set by /api/donate); also fires
      // for each subscription invoice's underlying payment, without metadata.
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(
        `Donation succeeded: ${paymentIntent.amount} ${paymentIntent.currency} ` +
          `(${paymentIntent.metadata.frequency ?? "subscription invoice"})`,
      );
      break;
    }
    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(
        `New monthly donor: subscription ${subscription.id} (${subscription.status})`,
      );
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(
        `Recurring donation paid: ${invoice.amount_paid} ${invoice.currency}`,
      );
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(
        `Recurring donation FAILED: ${invoice.amount_due} ${invoice.currency} ` +
          `(invoice ${invoice.id})`,
      );
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
