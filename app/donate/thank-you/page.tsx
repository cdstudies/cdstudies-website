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

async function getGiftSummary(sessionId: string | undefined): Promise<GiftSummary | null> {
  if (!sessionId || !connectedAccountId) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(
      sessionId,
      {},
      { stripeAccount: connectedAccountId },
    );
    if (session.status !== "complete" || !session.amount_total) return null;
    return {
      amount: session.amount_total / 100,
      recurring: session.mode === "subscription",
    };
  } catch {
    // Bad or stale session id — fall back to the generic message.
    return null;
  }
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const gift = await getGiftSummary(session_id);

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
