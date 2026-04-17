import Link from "next/link";
import { SITE_NAME, TAX_ID, FOOTER_LINKS } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-16">
          <div>
            <h3 className="mb-4 font-heading text-xl">Get Our Updates</h3>
            <p className="mb-4 text-sm text-primary-foreground/70">
              Stay informed about our work to protect the future.
            </p>
            <NewsletterForm variant="dark" />
          </div>

          <div>
            <h3 className="mb-4 font-heading text-xl">{SITE_NAME}</h3>
            <p className="text-sm leading-relaxed text-primary-foreground/70">
              The {SITE_NAME} is a registered 501(c)(3) dedicated to preventing
              the global depopulation crisis.
            </p>
            <p className="mt-2 text-sm text-primary-foreground/50">
              Tax ID: {TAX_ID}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-xl">Links</h3>
            <nav className="flex flex-col gap-2">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/15" />

        <p className="text-center text-xs text-primary-foreground/50">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
