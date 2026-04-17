import type { Metadata } from "next";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ContactForm } from "@/components/forms/contact-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Centre for Demographic Studies.",
};

export default function ContactPage() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-xl">
        <div className="mb-10 text-center">
          <h1 className="mb-4 font-heading text-4xl md:text-5xl">
            Get in Touch
          </h1>
          <p className="text-muted-foreground">
            Have a question or want to learn more about our work? We&apos;d
            love to hear from you.
          </p>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8">
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}
