import Link from "next/link";
import { Shirt, ShoppingBag, Watch } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const icons = [Shirt, Shirt, Shirt, Shirt, ShoppingBag, ShoppingBag, Watch];

export function CategoryStrip() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
      {CATEGORIES.map((category, index) => {
        const Icon = icons[index] ?? ShoppingBag;
        return (
          <Link
            key={category}
            href={`/catalog?category=${encodeURIComponent(category)}`}
            className="flex min-h-16 items-center gap-3 rounded-[8px] border border-black/10 bg-white p-3 text-sm font-bold capitalize text-black transition hover:border-black/18 hover:bg-black/[0.03]"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-lime/55">
              <Icon aria-hidden className="h-4 w-4" />
            </span>
            <span className="min-w-0 truncate">{category}</span>
          </Link>
        );
      })}
    </div>
  );
}
