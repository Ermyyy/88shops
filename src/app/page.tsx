import { CategoryStrip } from "@/components/home/category-strip";
import { HeroSection } from "@/components/home/hero-section";
import { LinkButton } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ShopCard } from "@/components/ui/shop-card";
import { products, shops } from "@/lib/mock-data";

export default function Home() {
  const freshProducts = products.slice(0, 15);
  const popularProducts = [...products]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 10);
  const popularShops = [...shops]
    .sort((a, b) => b.rating + b.salesCount / 1000 - (a.rating + a.salesCount / 1000))
    .slice(0, 3);

  return (
    <>
      <HeroSection />

      <section className="page-shell py-5">
        <SectionHeading title="Категории" description="Быстрый вход в частые разделы." />
        <CategoryStrip />
      </section>

      <section className="page-shell py-5">
        <SectionHeading
          title="Свежие объявления"
          description="Новые вещи от продавцов и магазинов."
          action={
            <LinkButton href="/catalog" variant="secondary" size="sm">
              Все объявления
            </LinkButton>
          }
        />
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {freshProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="page-shell py-5">
        <SectionHeading
          title="Популярное сейчас"
          description="Объявления, которые чаще открывают и сохраняют."
        />
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="page-shell py-5">
        <SectionHeading
          title="Магазины"
          description="Подборки продавцов с собственным ассортиментом."
          action={
            <LinkButton href="/shops" variant="secondary" size="sm">
              Все магазины
            </LinkButton>
          }
        />
        <div className="grid gap-3 lg:grid-cols-3">
          {popularShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      <section className="page-shell py-6">
        <div className="grid gap-4 rounded-[8px] border border-black/10 bg-white p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-xl font-bold text-black">Продай вещь за пару минут</h2>
            <p className="mt-1 text-sm leading-6 text-black/55">
              Добавь фото, цену, город и способы сделки. Сейчас форма проверяет
              данные, а сохранение объявления подключается отдельно.
            </p>
          </div>
          <LinkButton href="/sell">Разместить объявление</LinkButton>
        </div>
      </section>
    </>
  );
}
