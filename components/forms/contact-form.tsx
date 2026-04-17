"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log("Contact form:", Object.fromEntries(data));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <h3 className="mb-2 font-heading text-2xl">Message Sent</h3>
        <p className="text-muted-foreground">
          Thank you for reaching out. We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-sm font-medium">
          Subject
        </label>
        <Input id="subject" name="subject" required placeholder="How can we help?" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Tell us more..."
          rows={5}
        />
      </div>
      <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Send data-icon="inline-start" />
        Send Message
      </Button>
    </form>
  );
}
