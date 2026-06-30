"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2Icon, HandHeartIcon, TriangleAlertIcon } from "lucide-react";
import { GiftArray } from "@/components/donate/gift-array";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { isValidDonationAmount } from "@/lib/donation";

interface GiveAgainProps {
  paymentIntentId: string;
  defaultAmount: number;
}

type Status = "idle" | "pending" | "success" | "error";

/**
 * One-click one-time top-up for a donor who just set up monthly giving. We
 * already hold their saved card, so they pick an amount and tap once — no form,
 * no re-entry. The charge happens off-session server-side; if the card needs
 * authentication (SCA) we fall back to the full form.
 */
export function GiveAgain({ paymentIntentId, defaultAmount }: GiveAgainProps) {
  const [amount, setAmount] = useState<number | null>(defaultAmount);
  const [charged, setCharged] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const canGive = amount !== null && isValidDonationAmount(amount);

  async function give() {
    if (!canGive) return;
    setStatus("pending");
    try {
      const res = await fetch("/api/donate/give-again", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId, amount }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setCharged(amount);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Card className="text-left">
        <CardHeader className="flex flex-row items-center gap-2">
          <CheckCircle2Icon className="size-5 text-cds-sage" />
          <CardTitle>Your ${charged?.toLocaleString()} gift is on its way.</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            A receipt is heading to your inbox. Thank you for going further.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Alert variant="destructive" className="text-left">
        <TriangleAlertIcon />
        <AlertTitle>We couldn&apos;t complete that automatically.</AlertTitle>
        <AlertDescription>
          Your monthly gift is unaffected.{" "}
          <Link href="/donate?frequency=one-time">
            Add a one-time gift with your card here.
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="text-left">
      <CardHeader>
        <CardTitle>Want to do a little extra today?</CardTitle>
        <CardDescription>
          One tap — we&apos;ll use the card you just gave with. Your monthly gift
          stays as is.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GiftArray value={amount} onChange={setAmount} />
      </CardContent>
      <CardFooter>
        <Button
          onClick={give}
          disabled={!canGive || status === "pending"}
          size="lg"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {status === "pending" ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <HandHeartIcon data-icon="inline-start" />
          )}
          {canGive ? `Give $${amount.toLocaleString()} now` : "Choose an amount"}
        </Button>
      </CardFooter>
    </Card>
  );
}
