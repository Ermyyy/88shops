import Link from "next/link";
import { Package, ShieldCheck, ShoppingBag } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { SafeImage } from "@/components/ui/safe-image";
import type { Shop } from "@/types";

export function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link
      href={`/shops/${shop.slug}`}
      className="group grid overflow-hidden rounded-[12px] border border-black/10 bg-white transition hover:border-black/18 hover:shadow-sm"
    >
      <div className="relative aspect-[16/7] overflow-hidden bg-[#eeeeee]">
        <SafeImage
          alt={`Обложка магазина ${shop.name}`}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition duration-200 group-hover:scale-[1.02]"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Avatar name={shop.name} frame={shop.verified ? "lime" : "graphite"} />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="truncate text-base font-bold text-cream">{shop.name}</h3>
              {shop.verified ? <ShieldCheck aria-label="Verified" className="h-4 w-4 shrink-0 text-black/55" /> : null}
            </div>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-black/55">{shop.description}</p>
          </div>
          {shop.verified ? <Badge variant="lime">Проверен</Badge> : null}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-black/60">
          <span className="inline-flex items-center gap-1.5">
            <Rating value={shop.rating} />
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Package aria-hidden className="h-4 w-4 text-black/45" />
            {shop.listingsCount}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShoppingBag aria-hidden className="h-4 w-4 text-black/45" />
            {shop.salesCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
