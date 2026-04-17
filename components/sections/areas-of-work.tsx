"use client";

import {
  Landmark,
  Heart,
  GraduationCap,
  Tv,
  Church,
  BookOpen,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/animated-section";
import { AREAS_OF_WORK } from "@/lib/constants";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Landmark,
  Heart,
  GraduationCap,
  Tv,
  Church,
  BookOpen,
  Star,
};

export function AreasOfWork() {
  return (
    <SectionWrapper>
      <AnimatedSection>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 font-heading text-3xl md:text-4xl">
            We work with leaders across society
          </h2>
          <p className="text-muted-foreground">
            The depopulation crisis requires a coordinated response across every
            sector. We bring together the people who can make a difference.
          </p>
        </div>
      </AnimatedSection>

      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AREAS_OF_WORK.map((area) => {
          const Icon = ICON_MAP[area.icon];
          return (
            <StaggerItem key={area.title}>
              <Card className="h-full border-border/50 bg-card transition-colors hover:border-accent/30 hover:shadow-sm">
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                    {Icon && <Icon className="size-5 text-accent" />}
                  </div>
                  <h3 className="font-heading text-lg">{area.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {area.description}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </SectionWrapper>
  );
}
