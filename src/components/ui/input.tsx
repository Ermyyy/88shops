import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "min-h-10 w-full rounded-[10px] border border-black/10 bg-white px-3 py-2 text-sm text-cream outline-none transition placeholder:text-black/35 focus:border-black/30 focus:bg-white",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
