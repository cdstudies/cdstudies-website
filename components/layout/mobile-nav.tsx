"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetTitle className="font-heading text-xl text-primary">
          {SITE_NAME}
        </SheetTitle>
        <Separator className="my-4" />
        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
          <Separator className="my-2" />
          <Button
            asChild
            className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/donate" onClick={() => setOpen(false)}>
              <Heart data-icon="inline-start" />
              Donate
            </Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
