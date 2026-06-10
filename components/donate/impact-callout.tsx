interface ImpactCalloutProps {
  amount: number | null;
  frequency: "monthly" | "one-time";
}

function impactCopy(amount: number): string {
  if (amount >= 250) {
    return "underwrites original demographic research that shapes pro-family policy";
  }
  if (amount >= 100) {
    return "equips leaders in government, healthcare, and education with the case for family";
  }
  if (amount >= 50) {
    return "funds a month of research briefings for policymakers and the press";
  }
  return "helps change the cultural narrative around children and family life";
}

export function ImpactCallout({ amount, frequency }: ImpactCalloutProps) {
  if (!amount) return null;

  return (
    <div className="rounded-lg border border-cds-sage/30 bg-muted px-4 py-3 text-center text-sm">
      {frequency === "monthly" ? (
        <p>
          <span className="font-semibold text-cds-sage">
            ${amount}/month = ${Math.round(amount * 12)}/year
          </span>{" "}
          of sustained support that {impactCopy(amount)}.
        </p>
      ) : (
        <p>
          Your <span className="font-semibold text-cds-sage">${amount}</span>{" "}
          gift {impactCopy(amount)}.
        </p>
      )}
    </div>
  );
}
