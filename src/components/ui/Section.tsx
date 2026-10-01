import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Optional eyebrow label rendered above the content. */
  eyebrow?: string;
  title?: string;
  description?: string;
};

/** Consistent vertical rhythm + optional heading block for page sections. */
export function Section({
  children,
  className,
  id,
  eyebrow,
  title,
  description,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)}>
      <div className="container-page">
        {(eyebrow || title || description) && (
          <div className="mb-12 max-w-2xl">
            {eyebrow && (
              <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-accent">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base text-muted-foreground sm:text-lg">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
