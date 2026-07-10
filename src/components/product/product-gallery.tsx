"use client";

import { useState } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";

export function ProductGallery({ images, title }: { images: ProductImage[]; title: string }) {
  const [activeId, setActiveId] = useState(images[0]?.id);
  const active = images.find((image) => image.id === activeId) ?? images[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] border border-white/10 bg-graphite">
        <SafeImage
          src={active?.url}
          alt={active?.alt ?? title}
          fill
          priority
          sizes="(min-width: 1024px) 48vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="grid grid-cols-5 gap-3">
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveId(image.id)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-[8px] border border-white/10 bg-graphite transition",
              active?.id === image.id && "border-lime",
            )}
            aria-label={`Открыть фото ${image.alt}`}
          >
            <SafeImage
              src={image.url}
              alt={image.alt}
              fill
              sizes="120px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
