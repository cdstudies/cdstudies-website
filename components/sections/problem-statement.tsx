"use client";

import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionWrapper } from "@/components/shared/section-wrapper";

const STATS = [
  { value: "50%", label: "of countries now below replacement fertility rate" },
  { value: "2.1", label: "births per woman needed — the global average is falling fast" },
  { value: "2100", label: "projected peak year for world population before decline begins" },
];

export function ProblemStatement() {
  return (
    <SectionWrapper id="problem" className="bg-muted">
      <AnimatedSection>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-heading text-3xl md:text-4xl">
            The world faces an underpopulation{" "}
            <span className="text-accent">crisis</span>
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            Birth rates are plummeting across the globe and children are increasingly
            seen as a burden, not a gift. This is not a political issue — it is a
            civilisational challenge that transcends borders, cultures, and ideologies.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <div className="grid gap-8 md:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.value} className="text-center">
              <div className="mb-2 font-heading text-4xl text-accent md:text-5xl">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </SectionWrapper>
  );
}
