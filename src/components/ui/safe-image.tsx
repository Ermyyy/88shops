"use client";

import { cn } from "@/lib/utils";

type SafeImageProps = {
  src?: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  fallbackClassName?: string;
  className?: string;
};

export function SafeImage({
  alt,
  className,
  fallbackClassName,
  fill,
}: SafeImageProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-black/[0.04] px-3 text-center text-sm font-medium text-black/35",
        fill && "absolute inset-0",
        className,
        fallbackClassName,
      )}
      aria-label={alt}
    >
      Фото скоро появится
    </div>
  );
}
