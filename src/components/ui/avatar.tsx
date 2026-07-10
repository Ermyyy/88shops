import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/utils";

type AvatarProps = {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  frame?: "none" | "graphite" | "lime" | "silver";
  className?: string;
};

const sizeClasses = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-16 w-16",
  xl: "h-28 w-28",
};

const frameClasses = {
  none: "ring-white/10",
  graphite: "ring-graphite",
  lime: "ring-lime/80",
  silver: "ring-cream/55",
};

export function Avatar({
  src,
  name,
  size = "md",
  frame = "none",
  className,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-white/[0.06] ring-2",
        sizeClasses[size],
        frameClasses[frame],
        className,
      )}
    >
      <SafeImage src={src} alt={name} fill sizes="128px" className="object-cover" />
    </div>
  );
}
