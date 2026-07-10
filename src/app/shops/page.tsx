import type { Metadata } from "next";
import { ShopsDirectory } from "@/components/shops/shops-directory";
import { shops } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Магазины",
  description:
    "Магазины и продавцы 88Shops с собственным каталогом.",
};

export default function ShopsPage() {
  return (
    <div className="page-shell py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
          88Shops
        </p>
        <h1 className="mt-3 font-serif text-5xl text-cream md:text-7xl">
          88Shops
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/58">
          Магазины и продавцы с собственным каталогом.
        </p>
      </div>
      <ShopsDirectory shops={shops} />
    </div>
  );
}
