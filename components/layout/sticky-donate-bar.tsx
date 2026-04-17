"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GIFT_AMOUNTS, DEFAULT_AMOUNT } from "@/lib/constants";

export function StickyDonateBar() {
  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState(String(DEFAULT_AMOUNT));

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border/50 bg-card/95 px-4 py-3 shadow-lg backdrop-blur-sm lg:bottom-4 lg:left-auto lg:right-4 lg:mx-auto lg:max-w-lg lg:rounded-xl lg:border"
        >
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <ToggleGroup
              type="single"
              value={amount}
              onValueChange={(v) => v && setAmount(v)}
              className="flex gap-1"
            >
              {GIFT_AMOUNTS.map((a) => (
                <ToggleGroupItem
                  key={a}
                  value={String(a)}
                  className="h-9 min-w-[3rem] text-xs font-semibold data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                >
                  ${a}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Button
              asChild
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href={`/donate?amount=${amount}`}>
                <Heart data-icon="inline-start" />
                Donate ${amount}
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
