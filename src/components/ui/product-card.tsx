import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { Price } from "@/components/ui/price";
import { SafeImage } from "@/components/ui/safe-image";
import { AUTHENTICITY_LABELS, CONDITION_LABELS } from "@/lib/constants";
import { getSellerForProduct } from "@/lib/mock-data";
import { getProductSize } from "@/lib/utils";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  isAuthenticated?: boolean;
};

export function ProductCard({ product, isAuthenticated = true }: ProductCardProps) {
  const seller = getSellerForProduct(product);

  return (
    <article className="group overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.045] transition duration-200 hover:-translate-y-1 hover:border-lime/35 hover:bg-white/[0.065]">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
          <SafeImage
            src={product.images[0]?.url}
            alt={product.images[0]?.alt ?? product.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.045]"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <Badge variant={product.authenticityType === "ORIGINAL" ? "lime" : "warning"}>
              {AUTHENTICITY_LABELS[product.authenticityType]}
            </Badge>
            {seller.verified ? <Badge variant="dark">Verified</Badge> : null}
          </div>
          <FavoriteButton
            productId={product.id}
            isAuthenticated={isAuthenticated}
            className="absolute right-3 top-3 h-11 w-11 px-0"
          />
        </div>
        <div className="space-y-3 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime">
              {product.brand}
            </p>
            <h3 className="mt-2 line-clamp-2 min-h-12 text-base font-semibold text-cream">
              {product.title}
            </h3>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Price value={product.priceKopecks} className="text-lg" />
            <span className="rounded-[6px] bg-white/[0.06] px-2 py-1 text-xs text-cream/65">
              {getProductSize(product)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs text-cream/52">
            <span>{CONDITION_LABELS[product.condition]}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden className="h-3.5 w-3.5" />
              {product.city}
            </span>
          </div>
          <p className="truncate text-xs text-cream/42">{seller.name}</p>
        </div>
      </Link>
    </article>
  );
}
