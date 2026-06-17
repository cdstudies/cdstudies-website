"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2Icon, HeartIcon, TriangleAlertIcon } from "lucide-react";
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

interface UpgradeToMonthlyProps {
  amount: number;
  paymentIntentId: string;
}

type Status = "idle" | "pending" | "success" | "error";

/**
 * Post-gift, one-click upgrade from a one-time gift to a monthly one. Converting
 * one-time donors to recurring is the strongest lever in the NextAfter data
 * (+93% to +217% recurring lifts) — and it works precisely because the ask comes
 * *after* the transaction is complete, not as an interrupting pop-up (−89.5%).
 */
export function UpgradeToMonthly({ amount, paymentIntentId }: UpgradeToMonthlyProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function upgrade() {
    setStatus("pending");
    try {
      const res = await fetch("/api/donate/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId }),
      });
      const data = await res.json().catch(() => ({}));
      setStatus(res.ok && data.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Card className="text-left">
        <CardHeader className="flex flex-row items-center gap-2">
          <CheckCircle2Icon className="size-5 text-cds-sage" />
          <CardTitle>You&apos;re a monthly supporter now.</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Your ${amount}/month begins next month — steady support all year
            long. Thank you for going further.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Alert variant="destructive" className="text-left">
        <TriangleAlertIcon />
        <AlertTitle>We couldn&apos;t set that up automatically.</AlertTitle>
        <AlertDescription>
          No charge was made.{" "}
          <Link href={`/donate?frequency=monthly&amount=${amount}`}>
            Set up your monthly gift here instead.
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="text-left">
      <CardHeader>
        <CardTitle>Could you make it monthly?</CardTitle>
        <CardDescription>
          One tap — we&apos;ll use the card you just gave with.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <figure className="border-l-2 border-cds-sage py-1 pl-4 text-sm text-foreground/80">
          <span className="font-heading text-base text-cds-sage">
            ${amount}/month becomes ${Math.round(amount * 12).toLocaleString()} a year
          </span>{" "}
          — and your gift today covers this month, so the first monthly charge is
          next month.
        </figure>
      </CardContent>
      <CardFooter>
        <Button
          onClick={upgrade}
          disabled={status === "pending"}
          size="lg"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {status === "pending" ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <HeartIcon data-icon="inline-start" />
          )}
          Make it ${amount}/month
        </Button>
      </CardFooter>
    </Card>
  );
}
