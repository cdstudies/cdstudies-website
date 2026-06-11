import { MIN_DONATION, MAX_DONATION } from "@/lib/constants";

export type DonationFrequency = "monthly" | "one-time";

export interface DonationRequest {
  amountCents: number;
  frequency: DonationFrequency;
  email: string;
  name?: string;
}

export const AMOUNT_RANGE_ERROR = `Please enter an amount between $${MIN_DONATION} and $${MAX_DONATION.toLocaleString()}.`;

export function isValidDonationAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount >= MIN_DONATION && amount <= MAX_DONATION;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Parses and validates a donation request body. Shared by the API route so
 *  client and server enforce identical rules and error copy. */
export function parseDonationBody(
  body: unknown,
): { ok: true; data: DonationRequest } | { ok: false; error: string } {
  const b = (body ?? {}) as Record<string, unknown>;

  const amount = Number(b.amount);
  if (!isValidDonationAmount(amount)) {
    return { ok: false, error: AMOUNT_RANGE_ERROR };
  }

  const email = typeof b.email === "string" ? b.email.trim() : "";
  if (!isValidEmail(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const name =
    typeof b.name === "string" && b.name.trim() ? b.name.trim() : undefined;

  return {
    ok: true,
    data: {
      amountCents: Math.round(amount * 100),
      frequency: b.frequency === "monthly" ? "monthly" : "one-time",
      email,
      name,
    },
  };
}
