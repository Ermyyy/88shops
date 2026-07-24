import type { Metadata } from "next";
import { CatalogClient } from "@/features/catalog/catalog-client";
import { hasSessionCookie } from "@/lib/auth";
import { getCatalogProducts } from "@/lib/market-data";
import type { CatalogFilters } from "@/types";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Каталог fashion resale товаров 88Shops.",
};

export const dynamic = "force-dynamic";

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const isAuthenticated = await hasSessionCookie();
  const products = await getCatalogProducts();
  const initialFilters: Partial<CatalogFilters> = {
    query: getParam(params.q),
    brand: getParam(params.brand),
    category: getParam(params.category),
    city: getParam(params.city),
    authenticityType: getParam(params.authenticityType),
  };

  return (
    <CatalogClient
      products={products}
      initialFilters={initialFilters}
      isAuthenticated={isAuthenticated}
    />
  );
}

function getParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}
