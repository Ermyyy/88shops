import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { Price } from "@/components/ui/price";
import { SafeImage } from "@/components/ui/safe-image";
import { AUTHENTICITY_LABELS } from "@/lib/constants";
import { getProductSize } from "@/lib/utils";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  isAuthenticated?: boolean;
};

export function ProductCard({ product, isAuthenticated = true }: ProductCardProps) {
  const seller = product.seller ?? {
    name: "Продавец 88Shops",
    verified: false,
  };

  return (
    <article className="group overflow-hidden rounded-[12px] border border-black/10 bg-white transition hover:border-black/18 hover:shadow-sm">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#eeeeee]">
          <SafeImage
            alt={product.images[0]?.alt ?? product.title}
            fill
            sizes="(min-width: 1536px) 20vw, (min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition duration-200 group-hover:scale-[1.025]"
          />
          <div className="absolute left-2 top-2 flex max-w-[calc(100%-3.5rem)] flex-wrap gap-1">
            <Badge variant={product.authenticityType === "ORIGINAL" ? "lime" : "warning"}>
              {AUTHENTICITY_LABELS[product.authenticityType]}
            </Badge>
            {seller.verified ? (
              <Badge variant="neutral" className="bg-white/90">
                <ShieldCheck aria-hidden className="h-3 w-3" />
              </Badge>
            ) : null}
          </div>
          <FavoriteButton
            productId={product.id}
            isAuthenticated={isAuthenticated}
            className="absolute right-2 top-2 h-9 min-h-9 w-9 rounded-full px-0"
          />
        </div>

        <div className="grid gap-1.5 p-2.5 sm:p-3">
          <Price value={product.priceKopecks} className="text-base leading-tight sm:text-lg" />
          <h3 className="line-clamp-2 min-h-9 text-sm font-semibold leading-[1.25] text-cream">
            {product.title}
          </h3>
          <p className="truncate text-xs text-black/55">
            {product.brand} · {getProductSize(product)}
          </p>
          <div className="flex min-w-0 items-center justify-between gap-2 text-xs text-black/45">
            <span className="truncate">{seller.name}</span>
            <span className="inline-flex min-w-0 shrink-0 items-center gap-1">
              <MapPin aria-hidden className="h-3.5 w-3.5" />
              <span className="max-w-16 truncate">{product.city}</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
