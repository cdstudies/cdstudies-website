import { Suspense } from "react";
import type { Metadata } from "next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { DonationForm } from "@/components/forms/donation-form";
import { Endorsement } from "@/components/donate/endorsement";
import { Card, CardContent } from "@/components/ui/card";
import { TAX_ID, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Donate",
  description: `Invest in children. Invest in the future. Support the ${SITE_NAME} — a registered 501(c)(3) nonprofit.`,
};

export default function DonatePage() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-xl">
        <div className="mb-10 text-center">
          <h1 className="mb-4 font-heading text-4xl md:text-5xl">
            Invest in children.
            <br />
            <span className="text-accent">Invest in the future.</span>
          </h1>
          <p className="mb-4 text-lg text-muted-foreground">
            Birth rates are collapsing across the developed world — and almost
            no one is working on it. Your gift funds the research, policy
            work, and cultural initiatives that make the case for children
            and family, before it&apos;s too late.
          </p>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8">
            <Suspense>
              <DonationForm />
            </Suspense>
          </CardContent>
        </Card>

        <Endorsement />

        <p className="mt-6 text-center text-xs text-muted-foreground">
          The {SITE_NAME} is a registered 501(c)(3) non-profit
          organization. All donations are 100% tax-deductible.
          <br />
          Tax ID: {TAX_ID}
        </p>
      </div>
    </SectionWrapper>
  );
}
