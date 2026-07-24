"use client";

import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/ui/product-card";
import type { Product } from "@/types";

export function FavoritesClient({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="Здесь будут объявления, которые ты сохранил"
        description="Нажимай на сердечко в карточках, чтобы быстро вернуться к вещам."
        action={<LinkButton href="/catalog">Перейти в каталог</LinkButton>}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
