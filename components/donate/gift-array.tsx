"use client";

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { GIFT_AMOUNTS } from "@/lib/constants";

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
        value={customMode ? ["custom"] : isPreset ? [String(value)] : []}
        onValueChange={(v) => handleToggle(v[0] != null ? String(v[0]) : "")}
        className="grid grid-cols-2 gap-2 sm:grid-cols-5"
      >
        {GIFT_AMOUNTS.map((amount) => (
          <ToggleGroupItem
            key={amount}
            value={String(amount)}
            className="h-12 text-base font-semibold aria-pressed:bg-accent aria-pressed:text-accent-foreground"
          >
            ${amount}
          </ToggleGroupItem>
        ))}
        <ToggleGroupItem
          value="custom"
          className="h-12 text-base font-semibold aria-pressed:bg-accent aria-pressed:text-accent-foreground"
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
            className="pl-7"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
