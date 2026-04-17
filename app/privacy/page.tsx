import type { Metadata } from "next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 font-heading text-4xl">Privacy Policy</h1>
        <div className="flex flex-col gap-4 text-muted-foreground">
          <p>
            The {SITE_NAME} is committed to protecting your privacy. This
            privacy policy explains how we collect, use, and safeguard your
            information.
          </p>
          <p className="text-sm italic">
            Full privacy policy content will be provided soon.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
