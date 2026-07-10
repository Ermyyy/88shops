import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

export function CategoryStrip() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {CATEGORIES.map((category, index) => (
        <Link
          key={category}
          href={`/catalog?category=${encodeURIComponent(category)}`}
          className="group min-h-36 rounded-[8px] border border-white/10 bg-white/[0.045] p-5 transition hover:border-lime/40 hover:bg-white/[0.07]"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/36">
              0{index + 1}
            </span>
            <ArrowUpRight
              aria-hidden
              className="h-5 w-5 text-cream/38 transition group-hover:text-lime"
            />
          </div>
          <h3 className="mt-12 text-2xl font-semibold capitalize text-cream">
            {category}
          </h3>
        </Link>
      ))}
    </div>
  );
}
