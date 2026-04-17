import type { Metadata } from "next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Use",
};

export default function TermsPage() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 font-heading text-4xl">Terms of Use</h1>
        <div className="flex flex-col gap-4 text-muted-foreground">
          <p>
            Welcome to the {SITE_NAME} website. By accessing and using this
            website, you accept and agree to be bound by the terms and provisions
            of this agreement.
          </p>
          <p className="text-sm italic">
            Full terms of use content will be provided soon.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
