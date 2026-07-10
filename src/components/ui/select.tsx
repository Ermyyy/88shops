import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, ComponentPropsWithoutRef<"select">>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "min-h-11 w-full rounded-[8px] border border-white/10 bg-charcoal px-4 py-2 text-sm text-cream outline-none transition focus:border-lime/70",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);

Select.displayName = "Select";
