"use client";

import { Shield, Globe, Users, FileText } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { StaggerContainer, StaggerItem } from "@/components/shared/animated-section";

const MARKERS = [
  {
    icon: Shield,
    label: "501(c)(3) Registered",
    detail: "Tax-deductible donations",
  },
  {
    icon: Globe,
    label: "Global Reach",
    detail: "Working across nations and cultures",
  },
  {
    icon: Users,
    label: "Cross-Sector Coalition",
    detail: "7 key sectors of society",
  },
  {
    icon: FileText,
    label: "Evidence-Based",
    detail: "Rigorous demographic research",
  },
];

export function CredibilityMarkers() {
  return (
    <SectionWrapper>
      <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {MARKERS.map((marker) => (
          <StaggerItem key={marker.label}>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <marker.icon className="size-6 text-primary" />
              </div>
              <h3 className="font-semibold">{marker.label}</h3>
              <p className="text-sm text-muted-foreground">{marker.detail}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  );
}
