import { cn, formatPrice } from "@/lib/utils";

type PriceProps = {
  value: number;
  className?: string;
};

export function Price({ value, className }: PriceProps) {
  return <span className={cn("font-bold text-cream", className)}>{formatPrice(value)}</span>;
}
