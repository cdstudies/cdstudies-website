"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/shared/animated-section";

export function CtaSection() {
  return (
    <section className="bg-primary px-4 py-16 text-primary-foreground md:py-24">
      <AnimatedSection>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 font-heading text-3xl md:text-4xl">
            Join us in protecting the future
          </h2>
          <p className="mb-8 text-primary-foreground/70">
            Your support funds the research, partnerships, and cultural initiatives
            that can reverse the depopulation crisis. Every contribution matters.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/donate">
                <Heart data-icon="inline-start" />
                Donate Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/about">
                Learn About Our Work
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
