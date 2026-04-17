interface AnnualImpactProps {
  amount: number | null;
  frequency: "monthly" | "one-time";
}

export function AnnualImpact({ amount, frequency }: AnnualImpactProps) {
  if (frequency !== "monthly" || !amount) return null;

  const annual = Math.round(amount * 12);

  return (
    <p className="text-center text-sm text-muted-foreground">
      ${amount}/month ={" "}
      <span className="font-semibold text-cds-sage">${annual}/year</span>{" "}
      helping protect future generations
    </p>
  );
}
