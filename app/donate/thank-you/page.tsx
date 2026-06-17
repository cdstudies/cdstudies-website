import type { Metadata } from "next";
import Link from "next/link";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { UpgradeToMonthly } from "@/components/donate/upgrade-to-monthly";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  /** Present only when the gift can be upgraded to monthly (one-time, settled,
   *  card saved). */
  upgradePaymentIntentId: string | null;
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
    // The PaymentIntent doesn't reference its subscription on this API version;
    // frequency is encoded in the return_url we build instead.
    const recurring = frequency === "monthly";
    const hasSavedCard = Boolean(paymentIntent.customer && paymentIntent.payment_method);
    return {
      amount: paymentIntent.amount / 100,
      recurring,
      // Offer the one-click upgrade only for a settled one-time gift whose card
      // we saved off-session.
      upgradePaymentIntentId:
        !recurring && paymentIntent.status === "succeeded" && hasSavedCard
          ? paymentIntent.id
          : null,
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
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <h1 className="mb-4 font-heading text-4xl md:text-5xl">Thank you.</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          {gift ? (
            <>
              Your{" "}
              <span className="font-semibold text-foreground">
                ${gift.amount.toLocaleString()}
                {gift.recurring ? "/month" : ""}
              </span>{" "}
              gift to the {SITE_NAME} is helping protect pro-child, pro-family
              cultures. A receipt is on its way to your inbox.
            </>
          ) : (
            <>
              Your gift to the {SITE_NAME} is helping protect pro-child,
              pro-family cultures. A receipt is on its way to your inbox.
            </>
          )}
        </p>

        {/* One-time donor: invite a one-click upgrade to monthly — the highest
            lever in the data once the first gift is already banked. */}
        {gift?.upgradePaymentIntentId && (
          <div className="mb-8 w-full">
            <UpgradeToMonthly
              amount={gift.amount}
              paymentIntentId={gift.upgradePaymentIntentId}
            />
          </div>
        )}

        {/* Monthly donor: can't be upsold to monthly, so invite a one-time
            top-up on top of their recurring commitment. */}
        {gift?.recurring && (
          <Card className="mb-8 w-full text-left">
            <CardHeader>
              <CardTitle>Want to do a little extra today?</CardTitle>
              <CardDescription>
                Your monthly support is already at work. A one-time gift on top
                goes straight to the cause.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                asChild
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/donate?frequency=one-time">Add a one-time gift</Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        <Button asChild variant="ghost">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}
