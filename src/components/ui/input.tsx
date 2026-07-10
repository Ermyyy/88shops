import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "min-h-11 w-full rounded-[8px] border border-white/10 bg-white/[0.055] px-4 py-2 text-sm text-cream outline-none transition placeholder:text-cream/38 focus:border-lime/70 focus:bg-white/[0.075]",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
