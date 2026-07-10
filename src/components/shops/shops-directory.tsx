"use client";

import { useMemo, useState } from "react";
import { Select } from "@/components/ui/select";
import { ShopCard } from "@/components/ui/shop-card";
import type { Shop, ShopSort } from "@/types";

export function ShopsDirectory({ shops }: { shops: Shop[] }) {
  const [sort, setSort] = useState<ShopSort>("popular");

  const sortedShops = useMemo(() => {
    return [...shops].sort((a, b) => {
      if (sort === "new") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sort === "rating") {
        return b.rating - a.rating;
      }
      if (sort === "sales") {
        return b.salesCount - a.salesCount;
      }

      return b.rating + b.salesCount / 1000 - (a.rating + a.salesCount / 1000);
    });
  }, [shops, sort]);

  return (
    <section>
      <div className="mb-6 flex flex-col gap-3 rounded-[8px] border border-white/10 bg-white/[0.04] p-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-cream/60">
          Магазинов: <span className="font-semibold text-cream">{sortedShops.length}</span>
        </p>
        <label className="flex items-center gap-3 text-sm text-cream/55">
          Сортировка
          <Select
            value={sort}
            onChange={(event) => setSort(event.target.value as ShopSort)}
            className="min-w-52"
          >
            <option value="popular">Популярные</option>
            <option value="new">Новые</option>
            <option value="rating">По рейтингу</option>
            <option value="sales">По продажам</option>
          </Select>
        </label>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sortedShops.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
    </section>
  );
}
