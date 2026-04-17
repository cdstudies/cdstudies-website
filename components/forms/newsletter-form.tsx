"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NewsletterFormProps {
  variant?: "light" | "dark";
}

export function NewsletterForm({ variant = "light" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    console.log("Newsletter signup:", email);
    setStatus("success");
    setEmail("");
  }

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2"
        >
          <Check className="size-5 text-cds-sage" />
          <span
            className={
              variant === "dark" ? "text-primary-foreground/80" : "text-muted-foreground"
            }
          >
            Thanks! You&apos;re on the list.
          </span>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 sm:flex-row sm:gap-0"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            aria-label="Email address"
            aria-invalid={status === "error" || undefined}
            className={`rounded-md sm:rounded-r-none ${
              variant === "dark"
                ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
                : ""
            } ${status === "error" ? "border-destructive" : ""}`}
          />
          <Button
            type="submit"
            className={`sm:rounded-l-none ${
              variant === "dark"
                ? "bg-accent text-accent-foreground hover:bg-accent/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            Get Updates
            <ArrowRight data-icon="inline-end" />
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
