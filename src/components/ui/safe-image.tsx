"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SafeImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string;
  alt: string;
  fallbackClassName?: string;
};

export function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#171717,#2a2a2a_52%,#0b0b0b)] text-cream/40",
          fallbackClassName,
        )}
        aria-label={alt}
      >
        <ImageIcon aria-hidden className="h-7 w-7" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
