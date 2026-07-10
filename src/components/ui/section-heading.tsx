import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-lime">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-serif text-4xl text-cream md:text-5xl">{title}</h2>
        {description ? (
          <p className="mt-4 text-sm leading-6 text-cream/58 md:text-base">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
