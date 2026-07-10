import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { CalendarDays, MessageCircle, Package, ShieldCheck, ShoppingBag } from "lucide-react";
import { ShopActions } from "@/components/shops/shop-actions";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ui/product-card";
import { Rating } from "@/components/ui/rating";
import { SafeImage } from "@/components/ui/safe-image";
import { Tabs } from "@/components/ui/tabs";
import {
  getProductsByShop,
  getReviewsForShop,
  getShopBySlug,
  getUserById,
  shops,
} from "@/lib/mock-data";
import { hasSessionCookie } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

type ShopPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return shops.map((shop) => ({ slug: shop.slug }));
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { slug } = await params;
  const shop = getShopBySlug(slug);

  if (!shop) {
    return { title: "Магазин не найден" };
  }

  return {
    title: shop.name,
    description: shop.description,
    openGraph: {
      title: shop.name,
      description: shop.description,
      images: [{ url: shop.coverUrl }],
    },
  };
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = await params;
  const shop = getShopBySlug(slug);

  if (!shop) {
    notFound();
  }

  const products = getProductsByShop(shop.id);
  const reviews = getReviewsForShop(shop.id);
  const isAuthenticated = await hasSessionCookie();

  return (
    <div className="pb-14">
      <section className="relative min-h-[28rem] overflow-hidden border-b border-white/10">
        <SafeImage
          src={shop.coverUrl}
          alt={`Обложка ${shop.name}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/68 to-black/35" />
        <div className="page-shell relative flex min-h-[28rem] items-end pb-8">
          <div className="grid w-full gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <Avatar
                src={shop.avatarUrl}
                name={shop.name}
                size="xl"
                frame={shop.verified ? "lime" : "graphite"}
              />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-serif text-5xl text-cream md:text-7xl">
                    {shop.name}
                  </h1>
                  {shop.verified ? (
                    <Badge variant="lime">
                      <ShieldCheck aria-hidden className="h-3.5 w-3.5" />
                      Verified
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/65">
                  {shop.description}
                </p>
              </div>
            </div>
            <ShopActions isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </section>

      <div className="page-shell -mt-5">
        <div className="grid gap-4 rounded-[8px] border border-white/10 bg-charcoal p-5 md:grid-cols-5">
          <Metric label="Рейтинг" value={<Rating value={shop.rating} count={shop.reviewsCount} />} />
          <Metric icon={<ShoppingBag className="h-4 w-4" />} label="Продажи" value={shop.salesCount} />
          <Metric icon={<Package className="h-4 w-4" />} label="Товары" value={products.length} />
          <Metric icon={<CalendarDays className="h-4 w-4" />} label="На платформе" value={formatDate(shop.createdAt)} />
          <Metric icon={<MessageCircle className="h-4 w-4" />} label="Контакт" value="Чат скоро" />
        </div>

        <Tabs
          className="mt-8"
          items={[
            {
              id: "products",
              label: "Товары",
              content: (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                </div>
              ),
            },
            {
              id: "reviews",
              label: "Отзывы",
              content: (
                <div className="grid gap-4 md:grid-cols-2">
                  {reviews.map((review) => {
                    const author = getUserById(review.authorId);

                    return (
                      <article
                        key={review.id}
                        className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5"
                      >
                        <div className="mb-4 flex items-center gap-3">
                          <Avatar src={author?.avatarUrl} name={author?.displayName ?? "Покупатель"} />
                          <div>
                            <p className="font-semibold text-cream">
                              {author?.displayName ?? "Покупатель"}
                            </p>
                            <Rating value={review.rating} />
                          </div>
                        </div>
                        <p className="text-sm leading-6 text-cream/60">{review.text}</p>
                      </article>
                    );
                  })}
                </div>
              ),
            },
            {
              id: "about",
              label: "О магазине",
              content: (
                <div className="max-w-3xl rounded-[8px] border border-white/10 bg-white/[0.04] p-6">
                  <h2 className="text-2xl font-semibold text-cream">Профиль магазина</h2>
                  <p className="mt-4 text-sm leading-7 text-cream/60">
                    {shop.description} Скоро здесь появятся контакты, правила возврата
                    и расширенная информация о магазине.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-[8px] bg-white/[0.04] p-4">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-cream/38">
        {icon}
        {label}
      </p>
      <div className="text-sm font-semibold text-cream">{value}</div>
    </div>
  );
}
