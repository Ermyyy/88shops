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
  isAuthenticated?: boolean;
};

export function CatalogClient({
  products,
  initialFilters,
  initialSort = "new",
  isAuthenticated = false,
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
    <div className="page-shell py-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cream">Каталог</h1>
          <p className="mt-1 text-sm text-black/55">
            {filteredProducts.length} объявлений в 88Shops
          </p>
        </div>
        <LinkButton href="/sell" size="sm">
          Разместить объявление
        </LinkButton>
      </div>

      <div className="grid gap-5 lg:grid-cols-[17rem_1fr]">
        <aside className="sticky top-20 hidden max-h-[calc(100vh-6rem)] overflow-y-auto rounded-[12px] border border-black/10 bg-white p-4 lg:block">
          <FilterPanel filters={filters} onChange={setFilters} onReset={reset} />
        </aside>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3 rounded-[12px] border border-black/10 bg-white p-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="lg:hidden"
                onClick={() => setFilterDrawerOpen(true)}
              >
                <SlidersHorizontal aria-hidden className="h-4 w-4" />
                Фильтры
              </Button>
              <p className="hidden text-sm text-black/55 sm:block">
                Показано <span className="font-semibold text-cream">{filteredProducts.length}</span>
              </p>
            </div>
            <label className="flex min-w-0 items-center gap-2 text-sm text-black/55">
              <span className="hidden sm:inline">Сортировка</span>
              <Select
                value={sort}
                onChange={(event) => setSort(event.target.value as CatalogSort)}
                className="w-40 sm:w-52"
              >
                <option value="new">Новые</option>
                <option value="price-asc">Сначала дешевле</option>
                <option value="price-desc">Сначала дороже</option>
                <option value="popular">Популярные</option>
              </Select>
            </label>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Ничего не найдено"
              description="Измени фильтры или попробуй другой запрос."
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
        title="Фильтры"
        side="left"
        onClose={() => setFilterDrawerOpen(false)}
      >
        <FilterPanel filters={filters} onChange={setFilters} onReset={reset} />
      </Drawer>
    </div>
  );
}
