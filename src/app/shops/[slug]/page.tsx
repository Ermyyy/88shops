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
import { getShopPageData } from "@/lib/market-data";
import { hasSessionCookie } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

type ShopPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getShopPageData(slug);
  const shop = data?.shop;

  if (!shop) {
    return { title: "Магазин не найден" };
  }

  return {
    title: shop.name,
    description: shop.description,
    openGraph: {
      title: shop.name,
      description: shop.description,
    },
  };
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = await params;
  const data = await getShopPageData(slug);

  if (!data) {
    notFound();
  }

  const { shop, products, reviews } = data;
  const isAuthenticated = await hasSessionCookie();

  return (
    <div className="page-shell py-6 md:py-8">
      <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white">
        <div className="relative min-h-44 md:min-h-56">
          <SafeImage
            alt={`Обложка ${shop.name}`}
            fill
            priority
            sizes="(min-width: 768px) 86rem, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/12 to-transparent" />
        </div>
        <div className="grid gap-4 p-4 lg:grid-cols-[auto_1fr_auto] lg:items-end">
          <Avatar
            name={shop.name}
            size="xl"
            frame={shop.verified ? "lime" : "graphite"}
            className="-mt-16 ring-4 ring-white"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-semibold text-black md:text-3xl">
                {shop.name}
              </h1>
              {shop.verified ? (
                <Badge variant="lime">
                  <ShieldCheck aria-hidden className="h-3.5 w-3.5" />
                  Verified
                </Badge>
              ) : null}
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-black/62">
              {shop.description}
            </p>
          </div>
          <ShopActions isAuthenticated={isAuthenticated} />
        </div>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label="Рейтинг" value={<Rating value={shop.rating} count={shop.reviewsCount} />} />
        <Metric
          icon={<ShoppingBag className="h-4 w-4" />}
          label="Продажи"
          value={shop.salesCount}
        />
        <Metric
          icon={<Package className="h-4 w-4" />}
          label="Товары"
          value={products.length}
        />
        <Metric
          icon={<CalendarDays className="h-4 w-4" />}
          label="На платформе"
          value={formatDate(shop.createdAt)}
        />
        <Metric
          icon={<MessageCircle className="h-4 w-4" />}
          label="Контакт"
          value="Сообщения скоро"
        />
      </div>

      <Tabs
        className="mt-6"
        items={[
          {
            id: "products",
            label: "Товары",
            content: (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
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
              <div className="grid gap-3 md:grid-cols-2">
                {reviews.map((review) => {
                  return (
                    <article
                      key={review.id}
                      className="rounded-[8px] border border-black/10 bg-white p-4"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <Avatar
                          name={review.authorName ?? "Покупатель"}
                        />
                        <div>
                          <p className="font-semibold text-black">
                            {review.authorName ?? "Покупатель"}
                          </p>
                          <Rating value={review.rating} />
                        </div>
                      </div>
                      <p className="text-sm leading-6 text-black/60">{review.text}</p>
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
              <div className="max-w-3xl rounded-[8px] border border-black/10 bg-white p-4">
                <h2 className="text-lg font-semibold text-black">Профиль магазина</h2>
                <p className="mt-2 text-sm leading-6 text-black/60">
                  {shop.description} Контакты, правила возврата и расширенная
                  информация появятся после подключения кабинета магазина.
                </p>
              </div>
            ),
          },
        ]}
      />
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
    <div className="rounded-[8px] border border-black/10 bg-white p-3">
      <p className="mb-1 flex items-center gap-2 text-xs font-semibold text-black/45">
        {icon}
        {label}
      </p>
      <div className="text-sm font-semibold text-black">{value}</div>
    </div>
  );
}
