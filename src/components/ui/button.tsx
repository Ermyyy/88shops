import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] px-4 py-2 text-sm font-semibold transition duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary:
          "bg-lime text-black shadow-[0_0_0_1px_rgba(0,0,0,0.08)] hover:bg-[#bdea28]",
        secondary:
          "border border-black/10 bg-white text-cream hover:border-black/18 hover:bg-[#f1f1f1]",
        ghost: "text-cream hover:bg-black/[0.04]",
        dark: "border border-black/20 bg-black text-white hover:bg-black/85",
        danger:
          "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
      },
      size: {
        sm: "min-h-9 px-3 text-xs",
        md: "min-h-10 px-4 text-sm",
        lg: "min-h-11 px-5 text-sm",
        icon: "h-10 w-10 px-0",
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
