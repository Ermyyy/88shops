import { BenefitsGrid } from "@/components/home/benefits-grid";
import { CategoryStrip } from "@/components/home/category-strip";
import { HeroSection } from "@/components/home/hero-section";
import { SellerCta } from "@/components/home/seller-cta";
import { LinkButton } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ShopCard } from "@/components/ui/shop-card";
import { products, shops } from "@/lib/mock-data";

export default function Home() {
  const freshProducts = products.slice(0, 8);
  const popularShops = [...shops]
    .sort((a, b) => b.rating + b.salesCount / 1000 - (a.rating + a.salesCount / 1000))
    .slice(0, 3);

  return (
    <>
      <HeroSection />
      <section className="page-shell py-16">
        <SectionHeading
          eyebrow="Категории"
          title="Популярные направления"
          description="Быстрый вход в fashion-каталог без универсальной доски объявлений."
        />
        <CategoryStrip />
      </section>

      <section className="page-shell py-16">
        <SectionHeading
          eyebrow="Недавно добавили"
          title="Свежие объявления"
          description="Живая витрина моковых товаров с разными брендами, городами и состояниями."
          action={
            <LinkButton href="/catalog" variant="secondary">
              Весь каталог
            </LinkButton>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {freshProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="page-shell py-16">
        <SectionHeading
          eyebrow="Магазины"
          title="Популярные магазины"
          description="Сортировка основана на mock rating/sales и не является реальным алгоритмом ранжирования."
          action={
            <LinkButton href="/shops" variant="secondary">
              Все магазины
            </LinkButton>
          }
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {popularShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      <section className="page-shell py-16">
        <SectionHeading
          eyebrow="Почему 88Shops"
          title="Fashion-first вместо шума"
          description="MVP показывает будущую архитектуру доверия, но не подключает оплату, escrow и настоящие чаты."
        />
        <BenefitsGrid />
      </section>

      <SellerCta />
    </>
  );
}
