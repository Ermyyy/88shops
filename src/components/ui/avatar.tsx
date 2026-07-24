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
  none: "ring-black/10",
  graphite: "ring-black/18",
  lime: "ring-lime/80",
  silver: "ring-black/28",
};

export function Avatar({
  name,
  size = "md",
  frame = "none",
  className,
}: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/[0.04] text-sm font-bold uppercase text-black/45 ring-2",
        sizeClasses[size],
        frameClasses[frame],
        size === "xl" && "text-2xl",
        size === "sm" && "text-xs",
        className,
      )}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return initials || "88";
}
