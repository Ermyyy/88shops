import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] px-5 py-2.5 text-sm font-semibold transition duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary:
          "bg-lime text-black shadow-[0_0_0_1px_rgba(217,255,67,0.35)] hover:bg-lime/90",
        secondary:
          "border border-white/12 bg-white/[0.06] text-cream hover:border-lime/60 hover:bg-white/[0.09]",
        ghost: "text-cream hover:bg-white/[0.07]",
        dark: "border border-black/20 bg-black text-cream hover:bg-black/85",
        danger:
          "border border-red-400/30 bg-red-500/10 text-red-100 hover:bg-red-500/15",
      },
      size: {
        sm: "min-h-10 px-4 text-xs",
        md: "min-h-11 px-5 text-sm",
        lg: "min-h-12 px-6 text-base",
        icon: "h-11 w-11 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonOwnProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children: ReactNode;
};

type ButtonProps = ButtonOwnProps & ComponentPropsWithoutRef<"button">;

type LinkButtonProps = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children">;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export function LinkButton({
  className,
  variant,
  size,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
