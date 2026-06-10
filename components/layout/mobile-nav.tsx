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
import { Logo } from "@/components/shared/logo";
import { NAV_LINKS } from "@/lib/constants";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetTitle render={<div />}>
          <Logo />
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
            render={<Link href="/donate" onClick={() => setOpen(false)} />}
            nativeButton={false}
            className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Heart data-icon="inline-start" />
            Donate
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
