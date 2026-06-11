import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/cds-logoc.svg"
      alt={SITE_NAME}
      width={261}
      height={100}
      priority
      className={cn("h-16 w-auto", className)}
    />
  );
}
