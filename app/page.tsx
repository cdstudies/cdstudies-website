import { Hero } from "@/components/sections/hero";
import { ProblemStatement } from "@/components/sections/problem-statement";
import { AreasOfWork } from "@/components/sections/areas-of-work";
import { VisionSection } from "@/components/sections/vision-section";
import { CredibilityMarkers } from "@/components/sections/credibility-markers";
import { CtaSection } from "@/components/sections/cta-section";
import { StickyDonateBar } from "@/components/layout/sticky-donate-bar";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemStatement />
      <AreasOfWork />
      <VisionSection />
      <CredibilityMarkers />
      <CtaSection />
      <StickyDonateBar />
    </>
  );
}
