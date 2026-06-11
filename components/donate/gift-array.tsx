"use client";

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { GIFT_AMOUNTS, MOST_POPULAR_AMOUNT } from "@/lib/constants";

interface GiftArrayProps {
  value: number | null;
  onChange: (amount: number | null) => void;
}

export function GiftArray({ value, onChange }: GiftArrayProps) {
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const isPreset = value !== null && GIFT_AMOUNTS.includes(value as typeof GIFT_AMOUNTS[number]);

  function handleToggle(val: string) {
    if (val === "custom") {
      setCustomMode(true);
      onChange(customValue ? Number(customValue) : null);
    } else if (val) {
      setCustomMode(false);
      setCustomValue("");
      onChange(Number(val));
    }
  }

  function handleCustomChange(input: string) {
    const cleaned = input.replace(/[^0-9.]/g, "");
    setCustomValue(cleaned);
    const num = parseFloat(cleaned);
    onChange(num > 0 ? num : null);
  }

  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup
        type="single"
        value={customMode ? "custom" : isPreset ? String(value) : ""}
        onValueChange={handleToggle}
        className="grid w-full grid-cols-2 gap-2 pt-2 sm:grid-cols-5"
      >
        {GIFT_AMOUNTS.map((amount) => (
          <ToggleGroupItem
            key={amount}
            value={String(amount)}
            className="relative h-13 w-full overflow-visible rounded-lg border border-border bg-white text-base font-semibold shadow-xs transition-all hover:border-accent/50 hover:text-accent data-[state=on]:border-accent data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:shadow-md"
          >
            ${amount}
            {amount === MOST_POPULAR_AMOUNT ? (
              // Social-proof callout: "most popular" on the gift array lifted
              // donations +27.5% in the NextAfter data (exp. #55676).
              <span
                aria-hidden
                className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-cds-sage px-2 py-0.5 text-[10px] font-bold tracking-wide whitespace-nowrap text-white uppercase ring-2 ring-white"
              >
                Most popular
              </span>
            ) : null}
          </ToggleGroupItem>
        ))}
        <ToggleGroupItem
          value="custom"
          className="col-span-2 h-13 w-full rounded-lg border border-border bg-white text-base font-semibold shadow-xs transition-all hover:border-accent/50 hover:text-accent data-[state=on]:border-accent data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:shadow-md sm:col-span-1"
        >
          Other
        </ToggleGroupItem>
      </ToggleGroup>

      {customMode && (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            type="text"
            inputMode="decimal"
            placeholder="Enter amount"
            value={customValue}
            onChange={(e) => handleCustomChange(e.target.value)}
            className="h-12 pl-7 text-base"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
