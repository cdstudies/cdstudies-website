"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-secondary/30" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23635A34' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative mx-auto max-w-6xl px-4 py-20">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent"
          >
            A 501(c)(3) Research Organisation
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 font-heading text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl"
          >
            Preventing the global depopulation crisis{" "}
            <span className="text-accent">before it&apos;s too late</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-10 max-w-xl text-lg text-muted-foreground md:text-xl"
          >
            The Centre for Demographic Studies is uniquely placed to work with
            global leaders to prevent this crisis — while there is still a chance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/donate">
                <Heart data-icon="inline-start" />
                Invest in the Future
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#problem">
                <ArrowDown data-icon="inline-start" />
                Learn More
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
