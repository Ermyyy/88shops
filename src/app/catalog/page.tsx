import type { Metadata } from "next";
import { CatalogClient } from "@/features/catalog/catalog-client";
import { products } from "@/lib/mock-data";
import type { CatalogFilters } from "@/types";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Каталог fashion resale товаров 88Shops с рабочими demo-фильтрами.",
};

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const initialFilters: Partial<CatalogFilters> = {
    query: getParam(params.q),
    brand: getParam(params.brand),
    category: getParam(params.category),
    city: getParam(params.city),
    authenticityType: getParam(params.authenticityType),
  };

  return <CatalogClient products={products} initialFilters={initialFilters} />;
}

function getParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}
