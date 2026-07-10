"use client";

import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { FilterPanel, emptyFilters } from "@/components/catalog/filter-panel";
import { Button, LinkButton } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/ui/product-card";
import { Select } from "@/components/ui/select";
import { normalizeSearch } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";
import type { CatalogFilters, CatalogSort, DealMethod, Product } from "@/types";

type CatalogClientProps = {
  products: Product[];
  initialFilters?: Partial<CatalogFilters>;
  initialSort?: CatalogSort;
};

export function CatalogClient({
  products,
  initialFilters,
  initialSort = "new",
}: CatalogClientProps) {
  const [filters, setFilters] = useState<CatalogFilters>({
    ...emptyFilters,
    ...initialFilters,
  });
  const [sort, setSort] = useState<CatalogSort>(initialSort);
  const filterDrawerOpen = useUiStore((state) => state.filterDrawerOpen);
  const setFilterDrawerOpen = useUiStore((state) => state.setFilterDrawerOpen);

  const filteredProducts = useMemo(() => {
    const query = normalizeSearch(filters.query);
    const priceFrom = Number(filters.priceFrom) || 0;
    const priceTo = Number(filters.priceTo) || Number.POSITIVE_INFINITY;

    return products
      .filter((product) => {
        const haystack = normalizeSearch(
          [
            product.title,
            product.brand,
            product.category,
            product.city,
            product.description,
          ].join(" "),
        );

        return (
          (!query || haystack.includes(query)) &&
          (!filters.brand || product.brand === filters.brand) &&
          (!filters.category || product.category === filters.category) &&
          product.priceKopecks / 100 >= priceFrom &&
          product.priceKopecks / 100 <= priceTo &&
          (!filters.clothingSize || product.clothingSize === filters.clothingSize) &&
          (!filters.shoeSize || product.shoeSize === filters.shoeSize) &&
          (!filters.condition || product.condition === filters.condition) &&
          (!filters.city || product.city === filters.city) &&
          (!filters.authenticityType ||
            product.authenticityType === filters.authenticityType) &&
          (!filters.dealMethod ||
            product.dealMethods.includes(filters.dealMethod as DealMethod))
        );
      })
      .sort((a, b) => {
        if (sort === "price-asc") {
          return a.priceKopecks - b.priceKopecks;
        }
        if (sort === "price-desc") {
          return b.priceKopecks - a.priceKopecks;
        }
        if (sort === "popular") {
          return b.popularityScore - a.popularityScore;
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [filters, products, sort]);

  const reset = () => setFilters(emptyFilters);

  return (
    <div className="page-shell py-10">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
            Каталог
          </p>
          <h1 className="mt-3 font-serif text-5xl text-cream md:text-7xl">
            Вещи без шума
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/58">
            Фильтры работают на моковых данных. URL-параметры используются как
            стартовые значения, чтобы не усложнять MVP.
          </p>
        </div>
        <LinkButton href="/sell">Выложить объявление</LinkButton>
      </div>

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto rounded-[8px] border border-white/10 bg-white/[0.04] p-5 lg:block">
          <FilterPanel filters={filters} onChange={setFilters} onReset={reset} />
        </aside>

        <section>
          <div className="mb-5 flex flex-col gap-3 rounded-[8px] border border-white/10 bg-white/[0.04] p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                className="lg:hidden"
                onClick={() => setFilterDrawerOpen(true)}
              >
                <SlidersHorizontal aria-hidden className="h-4 w-4" />
                Фильтры
              </Button>
              <p className="text-sm text-cream/60">
                Найдено: <span className="font-semibold text-cream">{filteredProducts.length}</span>
              </p>
            </div>
            <label className="flex items-center gap-3 text-sm text-cream/55">
              Сортировка
              <Select
                value={sort}
                onChange={(event) => setSort(event.target.value as CatalogSort)}
                className="min-w-56"
              >
                <option value="new">Новые</option>
                <option value="price-asc">Цена по возрастанию</option>
                <option value="price-desc">Цена по убыванию</option>
                <option value="popular">Популярные</option>
              </Select>
            </label>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Ничего не найдено"
              description="Попробуйте сбросить фильтры или изменить поисковый запрос."
              action={
                <Button type="button" variant="secondary" onClick={reset}>
                  Сбросить фильтры
                </Button>
              }
            />
          )}
        </section>
      </div>

      <Drawer
        open={filterDrawerOpen}
        title="Фильтры каталога"
        side="left"
        onClose={() => setFilterDrawerOpen(false)}
      >
        <FilterPanel filters={filters} onChange={setFilters} onReset={reset} />
      </Drawer>
    </div>
  );
}
