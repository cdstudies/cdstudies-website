import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      <span className="font-heading text-[18px] tracking-tight text-primary sm:text-[22px]">Centre</span>
      <span className="text-[18px] text-accent/50 sm:text-[22px]">/</span>
      <span className="font-heading text-[18px] tracking-tight text-primary sm:text-[22px]">Demographic</span>
      <span className="text-[18px] text-accent/50 sm:text-[22px]">/</span>
      <span className="font-heading text-[18px] tracking-tight text-primary sm:text-[22px]">Studies</span>
    </div>
  );
}
