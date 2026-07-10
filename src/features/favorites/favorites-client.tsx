"use client";

import { useMemo } from "react";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/ui/product-card";
import { useFavoritesStore } from "@/store/favorites-store";
import type { Product } from "@/types";

export function FavoritesClient({ products }: { products: Product[] }) {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);

  const favoriteProducts = useMemo(
    () => products.filter((product) => favoriteIds.includes(product.id)),
    [favoriteIds, products],
  );

  if (favoriteProducts.length === 0) {
    return (
      <EmptyState
        title="Избранное пусто"
        description="Сохраняй вещи через сердечко в каталоге."
        action={<LinkButton href="/catalog">Открыть каталог</LinkButton>}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {favoriteProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
