"use client";

import { Heart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FrequencyToggleProps {
  value: "monthly" | "one-time";
  onChange: (value: "monthly" | "one-time") => void;
}

export function FrequencyToggle({ value, onChange }: FrequencyToggleProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as "monthly" | "one-time")}>
      {/* h must carry the same variant prefix as the base's
          group-data-horizontal/tabs:h-8 or tailwind-merge keeps both and the
          triggers overflow the track. */}
      <TabsList className="grid w-full grid-cols-2 rounded-lg bg-muted p-1 group-data-horizontal/tabs:h-12">
        <TabsTrigger
          value="monthly"
          className="gap-1.5 rounded-md text-base data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-sm"
        >
          <Heart className="size-4" aria-hidden />
          Monthly
        </TabsTrigger>
        <TabsTrigger value="one-time" className="rounded-md text-base">
          One-Time
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
