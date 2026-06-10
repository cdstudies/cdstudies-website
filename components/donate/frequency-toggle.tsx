"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FrequencyToggleProps {
  value: "monthly" | "one-time";
  onChange: (value: "monthly" | "one-time") => void;
}

export function FrequencyToggle({ value, onChange }: FrequencyToggleProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as "monthly" | "one-time")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="monthly" className="data-active:bg-accent data-active:text-accent-foreground">
          Monthly
        </TabsTrigger>
        <TabsTrigger value="one-time">
          One-Time
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
