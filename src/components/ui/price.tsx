import { cn, formatPrice } from "@/lib/utils";

type PriceProps = {
  value: number;
  className?: string;
};

export function Price({ value, className }: PriceProps) {
  return <span className={cn("font-semibold text-cream", className)}>{formatPrice(value)}</span>;
}
