"use client";

import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Badge } from "@/components/ui/badge";

export function VisionSection() {
  return (
    <SectionWrapper className="bg-muted">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <AnimatedSection>
          <Badge variant="secondary" className="mb-4">
            Our Vision
          </Badge>
          <h2 className="mb-6 font-heading text-3xl md:text-4xl">
            A world where children are seen as{" "}
            <span className="text-accent">humanity&apos;s greatest gift</span>
          </h2>
          <div className="flex flex-col gap-4 text-muted-foreground">
            <p>
              We envision a future where every society celebrates family formation,
              where policies support parents, and where the cultural narrative
              honours children as the foundation of a thriving civilisation.
            </p>
            <p>
              Through rigorous demographic research, strategic partnerships, and
              cultural engagement, we are working to reverse the trends before they
              become irreversible.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="rounded-2xl bg-card p-8 shadow-sm">
            <h3 className="mb-6 font-heading text-xl">Our Approach</h3>
            <div className="flex flex-col gap-6">
              {[
                {
                  step: "01",
                  title: "Research & Intelligence",
                  desc: "Producing world-class demographic studies and data analysis.",
                },
                {
                  step: "02",
                  title: "Strategic Partnerships",
                  desc: "Working with leaders who shape policy, culture, and institutions.",
                },
                {
                  step: "03",
                  title: "Cultural Transformation",
                  desc: "Shifting the narrative from burden to gift, from crisis to opportunity.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <span className="font-heading text-2xl text-accent/40">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="mb-1 font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  );
}
