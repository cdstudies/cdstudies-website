import type { Metadata } from "next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about the ${SITE_NAME} and our mission to prevent the global depopulation crisis.`,
};

export default function AboutPage() {
  return (
    <>
      <SectionWrapper>
        <div className="mx-auto max-w-3xl">
          <AnimatedSection>
            <Badge variant="secondary" className="mb-4">
              About Us
            </Badge>
            <h1 className="mb-6 font-heading text-4xl md:text-5xl">
              About the{" "}
              <span className="text-accent">{SITE_NAME}</span>
            </h1>
            <div className="flex flex-col gap-6 text-lg text-muted-foreground">
              <p>
                The {SITE_NAME} was founded with a singular conviction: that the
                global decline in birth rates represents one of the most
                consequential — yet under-discussed — challenges of our time.
              </p>
              <p>
                While much of the world focuses on overpopulation narratives, the
                data tells a different story. Country after country is falling below
                replacement-level fertility, threatening economic stability, social
                cohesion, and the very fabric of civilisation.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-muted">
        <div className="mx-auto max-w-3xl">
          <AnimatedSection>
            <h2 className="mb-6 font-heading text-3xl">Our Mission</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              We exist to prevent the global depopulation agenda before it&apos;s
              too late. Through rigorous research, strategic partnerships, and
              cultural engagement, we work to create a world where children are
              valued as humanity&apos;s greatest asset.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Research",
                  description:
                    "Producing world-class demographic studies that inform policy and public discourse.",
                },
                {
                  title: "Partnership",
                  description:
                    "Building coalitions across government, healthcare, education, media, faith, and academia.",
                },
                {
                  title: "Culture",
                  description:
                    "Shifting the narrative so that children are seen as a gift, not a burden.",
                },
              ].map((pillar) => (
                <Card key={pillar.title}>
                  <CardContent className="p-6">
                    <h3 className="mb-2 font-heading text-lg">{pillar.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="mx-auto max-w-3xl">
          <AnimatedSection>
            <h2 className="mb-6 font-heading text-3xl">Our Vision</h2>
            <blockquote className="border-l-4 border-accent pl-6 text-lg italic text-muted-foreground">
              A world where every society celebrates family formation, where
              policies support parents, and where children are honoured as the
              foundation of a thriving civilisation.
            </blockquote>
            <Separator className="my-8" />
            <p className="text-sm text-muted-foreground">
              This page will be updated with more details about our team,
              advisory board, and research initiatives as they are finalised.
            </p>
          </AnimatedSection>
        </div>
      </SectionWrapper>
    </>
  );
}
