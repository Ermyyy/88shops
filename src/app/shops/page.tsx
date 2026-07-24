import type { Metadata } from "next";
import { ShopsDirectory } from "@/components/shops/shops-directory";
import { getShops } from "@/lib/market-data";

export const metadata: Metadata = {
  title: "Магазины",
  description: "Магазины и продавцы 88Shops с собственным каталогом.",
};

export const dynamic = "force-dynamic";

export default async function ShopsPage() {
  const shops = await getShops();

  return (
    <div className="page-shell py-6 md:py-8">
      <div className="mb-5">
        <p className="text-sm text-black/55">88Shops</p>
        <h1 className="text-2xl font-semibold text-black md:text-3xl">Магазины</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/58">
          Подборка продавцов и локальных магазинов с собственными витринами.
        </p>
      </div>
      <ShopsDirectory shops={shops} />
    </div>
  );
}
