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

/**
 * Editorial pull-quote framing of the gift's impact. Highlighting the monthly
 * impact is one of the strongest recurring-giving lifts in the NextAfter data
 * (+125.2%, exp. #721976; monthly callout +114%, exp. #723976). The one-time
 * variant adds a soft monthly nudge — soft prompts work where interrupting
 * pop-ups test badly (−89.5%, exp. #52040).
 */
export function ImpactCallout({ amount, frequency }: ImpactCalloutProps) {
  if (!amount) return null;

  return (
    <figure className="border-l-2 border-cds-sage py-1 pl-4 text-sm">
      {frequency === "monthly" ? (
        <p className="text-foreground/80">
          <span className="font-heading text-base text-cds-sage">
            ${amount}/month becomes ${Math.round(amount * 12).toLocaleString()} a year
          </span>{" "}
          — steady support that {impactCopy(amount)}.
        </p>
      ) : (
        <p className="text-foreground/80">
          Your <span className="font-heading text-base text-cds-sage">${amount}</span>{" "}
          gift {impactCopy(amount)}.{" "}
          <span className="text-muted-foreground">
            Monthly gifts sustain this work all year long.
          </span>
        </p>
      )}
    </figure>
  );
}
