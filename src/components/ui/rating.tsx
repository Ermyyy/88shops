import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type RatingProps = {
  value: number;
  count?: number;
  className?: string;
};

export function Rating({ value, count, className }: RatingProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm text-cream/72", className)}>
      <Star aria-hidden className="h-4 w-4 fill-lime text-black" />
      <span className="font-semibold text-cream">{value.toFixed(1)}</span>
      {typeof count === "number" ? <span>{count} отзывов</span> : null}
    </span>
  );
}
