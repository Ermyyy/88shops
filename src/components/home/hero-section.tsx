import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";

const quickSearches = ["Stone Island L", "LV Trainer 43", "Rick Owens", "куртка до 20 000 ₽"];

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden border-b border-white/10">
      <SafeImage
        src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1800&q=84"
        alt="Одежда и аксессуары для fashion resale"
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-night via-night/72 to-night/15" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />

      <div className="page-shell relative flex min-h-[calc(100vh-4rem)] items-center py-16">
        <div className="max-w-4xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-[8px] border border-lime/25 bg-black/34 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-lime backdrop-blur">
            <Sparkles aria-hidden className="h-3.5 w-3.5" />
            FASHION RESALE MARKETPLACE
          </p>
          <h1 className="max-w-4xl font-serif text-6xl leading-none text-cream sm:text-7xl lg:text-8xl">
            Найди вещь, которую давно искал
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-cream/72 sm:text-lg sm:leading-8">
            Одежда, кроссовки и аксессуары от частных продавцов и магазинов.
          </p>

          <form
            action="/catalog"
            className="mt-9 flex max-w-2xl flex-col gap-3 rounded-[8px] border border-white/12 bg-black/45 p-2 backdrop-blur sm:flex-row"
          >
            <label className="flex min-h-12 flex-1 items-center gap-3 px-3">
              <Search aria-hidden className="h-5 w-5 text-lime" />
              <span className="sr-only">Поиск</span>
              <input
                name="q"
                placeholder="Бренд, модель, размер..."
                className="w-full bg-transparent text-sm text-cream outline-none placeholder:text-cream/42"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-lime px-5 text-sm font-bold text-black transition hover:bg-lime/90"
            >
              Найти
              <ArrowRight aria-hidden className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickSearches.map((item) => (
              <Link
                key={item}
                href={`/catalog?q=${encodeURIComponent(item)}`}
                className="rounded-[8px] border border-white/12 bg-black/30 px-3 py-2 text-xs font-semibold text-cream/72 backdrop-blur transition hover:border-lime/45 hover:text-lime"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/catalog" size="lg">
              Смотреть каталог
            </LinkButton>
            <LinkButton href="/sell" variant="secondary" size="lg">
              Выложить вещь
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
