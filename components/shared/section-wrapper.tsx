import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className, id }: SectionWrapperProps) {
  return (
    <section id={id} className={cn("px-4 py-16 md:py-24 lg:py-32", className)}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
