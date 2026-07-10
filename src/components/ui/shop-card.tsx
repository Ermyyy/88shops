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
      className="group block overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.045] transition hover:-translate-y-1 hover:border-lime/35 hover:bg-white/[0.065]"
    >
      <div className="relative aspect-[16/8] overflow-hidden bg-graphite">
        <SafeImage
          src={shop.coverUrl}
          alt={`Обложка магазина ${shop.name}`}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      <div className="relative p-5 pt-0">
        <Avatar
          src={shop.avatarUrl}
          name={shop.name}
          size="lg"
          frame={shop.verified ? "lime" : "graphite"}
          className="-mt-8"
        />
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-cream">{shop.name}</h3>
              {shop.verified ? (
                <ShieldCheck aria-label="Verified" className="h-4 w-4 text-lime" />
              ) : null}
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-cream/55">
              {shop.description}
            </p>
          </div>
          {shop.verified ? <Badge variant="lime">Verified</Badge> : null}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-sm text-cream/62">
          <Rating value={shop.rating} />
          <span className="inline-flex items-center gap-1.5">
            <Package aria-hidden className="h-4 w-4 text-lime" />
            {shop.listingsCount}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShoppingBag aria-hidden className="h-4 w-4 text-lime" />
            {shop.salesCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
