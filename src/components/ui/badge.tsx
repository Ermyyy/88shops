import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[6px] border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
  {
    variants: {
      variant: {
        neutral: "border-white/10 bg-white/[0.06] text-cream/72",
        lime: "border-lime/30 bg-lime/12 text-lime",
        dark: "border-black/30 bg-black/40 text-cream",
        warning: "border-amber-300/30 bg-amber-300/10 text-amber-100",
        danger: "border-red-300/30 bg-red-400/10 text-red-100",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

type BadgeProps = ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
