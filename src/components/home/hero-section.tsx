import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

const quickSearches = ["Stone Island", "кроссовки 43", "куртка", "Rick Owens", "сумка"];

export function HeroSection() {
  return (
    <section className="border-b border-black/10 bg-white">
      <div className="page-shell py-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="text-2xl font-bold text-black md:text-3xl">
              Купить и продать одежду, обувь и аксессуары
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">
              Объявления от частных продавцов и магазинов 88Shops. Ищи по
              бренду, размеру, городу или модели.
            </p>
          </div>
          <LinkButton href="/sell" size="sm">
            Разместить объявление
          </LinkButton>
        </div>

        <form action="/catalog" className="mt-5 grid gap-2 md:grid-cols-[1fr_auto_auto]">
          <label className="flex min-h-12 min-w-0 items-center gap-3 rounded-[8px] border border-black/12 bg-[#f6f6f4] px-4 focus-within:border-black/30">
            <Search aria-hidden className="h-5 w-5 shrink-0 text-black/45" />
            <span className="sr-only">Поиск</span>
            <input
              name="q"
              className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-black/35"
              placeholder="Бренд, вещь или размер"
            />
          </label>
          <label className="flex min-h-12 items-center gap-2 rounded-[8px] border border-black/12 bg-[#f6f6f4] px-4 md:w-48">
            <MapPin aria-hidden className="h-4 w-4 text-black/45" />
            <span className="sr-only">Город</span>
            <input
              name="city"
              className="min-w-0 flex-1 bg-transparent text-sm text-black outline-none placeholder:text-black/35"
              placeholder="Город"
            />
          </label>
          <button
            type="submit"
            className="min-h-12 rounded-[8px] bg-lime px-7 text-sm font-bold text-black transition hover:bg-[#bdea28]"
          >
            Найти
          </button>
        </form>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {quickSearches.map((item) => (
            <Link
              key={item}
              href={`/catalog?q=${encodeURIComponent(item)}`}
              className="shrink-0 rounded-[8px] border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black/60 transition hover:bg-black/[0.04]"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
