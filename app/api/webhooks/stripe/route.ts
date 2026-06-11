import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";

/**
 * Single Connect-scoped webhook endpoint. For direct charges, events from CDS's
 * account arrive here with `event.account` set to CDS's acct_… id. Signatures
 * are verified with Gathered's (the platform's) webhook secret.
 *
 * Register with: stripe listen --forward-connect-to localhost:3000/api/webhooks/stripe
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
        `Donation succeeded on account ${event.account}: ` +
          `${paymentIntent.amount} ${paymentIntent.currency} ` +
          `(${paymentIntent.metadata.frequency ?? "subscription invoice"})`,
      );
      // Receipts remain CDS's responsibility as merchant of record.
      break;
    }
    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(
        `New monthly donor on account ${event.account}: ` +
          `subscription ${subscription.id} (${subscription.status})`,
      );
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(
        `Recurring donation paid on account ${event.account}: ` +
          `${invoice.amount_paid} ${invoice.currency}`,
      );
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(
        `Recurring donation FAILED on account ${event.account}: ` +
          `${invoice.amount_due} ${invoice.currency} (invoice ${invoice.id})`,
      );
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
