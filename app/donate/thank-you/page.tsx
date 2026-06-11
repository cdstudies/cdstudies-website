import type { Metadata } from "next";
import Link from "next/link";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Button } from "@/components/ui/button";
import { stripe, connectedAccountId } from "@/lib/stripe";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Thank you",
  description: `Thank you for supporting the ${SITE_NAME}.`,
};

interface GiftSummary {
  amount: number;
  recurring: boolean;
}

async function getGiftSummary(
  paymentIntentId: string | undefined,
  frequency: string | undefined,
): Promise<GiftSummary | null> {
  if (!paymentIntentId || !connectedAccountId) return null;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      {},
      { stripeAccount: connectedAccountId },
    );
    // "processing" covers slower methods (e.g. bank debits) that confirmed
    // but haven't settled yet — the gift is still on its way.
    if (
      paymentIntent.status !== "succeeded" &&
      paymentIntent.status !== "processing"
    ) {
      return null;
    }
    return {
      amount: paymentIntent.amount / 100,
      // The PaymentIntent doesn't reference its subscription on this API
      // version; frequency is encoded in the return_url we build instead.
      recurring: frequency === "monthly",
    };
  } catch {
    // Bad or stale payment intent id — fall back to the generic message.
    return null;
  }
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent?: string; frequency?: string }>;
}) {
  const { payment_intent, frequency } = await searchParams;
  const gift = await getGiftSummary(payment_intent, frequency);

  return (
    <SectionWrapper>
      <div className="mx-auto max-w-xl text-center">
        <h1 className="mb-4 font-heading text-4xl md:text-5xl">
          Thank you.
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {gift ? (
            <>
              Your{" "}
              <span className="font-semibold text-foreground">
                ${gift.amount.toLocaleString()}
                {gift.recurring ? "/month" : ""}
              </span>{" "}
              gift to the {SITE_NAME} is helping protect pro-child,
              pro-family cultures. A receipt is on its way to your inbox.
            </>
          ) : (
            <>
              Your gift to the {SITE_NAME} is helping protect pro-child,
              pro-family cultures. A receipt is on its way to your inbox.
            </>
          )}
        </p>
        <Button
          asChild
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}
