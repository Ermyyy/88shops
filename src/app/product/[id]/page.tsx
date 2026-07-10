import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, PackageCheck, ShieldAlert } from "lucide-react";
import { ProductActions } from "@/components/product/product-actions";
import { ProductGallery } from "@/components/product/product-gallery";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DealMethodCard } from "@/components/ui/deal-method-card";
import { Price } from "@/components/ui/price";
import { ProductCard } from "@/components/ui/product-card";
import { Rating } from "@/components/ui/rating";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  AUTHENTICITY_LABELS,
  CONDITION_LABELS,
  DEAL_METHOD_LABELS,
} from "@/lib/constants";
import { hasSessionCookie } from "@/lib/auth";
import {
  getProductById,
  getRelatedProducts,
  getReviewsForShop,
  getReviewsForUser,
  getSellerForProduct,
  getShopById,
  getUserById,
  products,
} from "@/lib/mock-data";
import { formatDate, formatPrice, getProductSize } from "@/lib/utils";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: "Товар не найден",
    };
  }

  return {
    title: product.title,
    description: `${product.brand}, ${formatPrice(product.priceKopecks)}, ${product.city}. ${product.description}`,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const seller = getSellerForProduct(product);
  const shop = getShopById(product.shopId);
  const reviews = shop ? getReviewsForShop(shop.id) : getReviewsForUser(product.sellerId);
  const related = getRelatedProducts(product);
  const isAuthenticated = await hasSessionCookie();

  return (
    <div className="page-shell py-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_26rem]">
        <ProductGallery images={product.images} title={product.title} />

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
            <div className="flex flex-wrap gap-2">
              <Badge variant={product.authenticityType === "ORIGINAL" ? "lime" : "warning"}>
                {AUTHENTICITY_LABELS[product.authenticityType]}
              </Badge>
              <Badge>{CONDITION_LABELS[product.condition]}</Badge>
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-lime">
              {product.brand}
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-cream">
              {product.title}
            </h1>
            <div className="mt-5">
              <Price value={product.priceKopecks} className="text-3xl" />
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 border-y border-white/10 py-5 text-sm">
              <div>
                <dt className="text-cream/42">Размер</dt>
                <dd className="mt-1 font-semibold text-cream">{getProductSize(product)}</dd>
              </div>
              <div>
                <dt className="text-cream/42">Город</dt>
                <dd className="mt-1 font-semibold text-cream">{product.city}</dd>
              </div>
              <div>
                <dt className="text-cream/42">Категория</dt>
                <dd className="mt-1 font-semibold capitalize text-cream">
                  {product.category}
                </dd>
              </div>
              <div>
                <dt className="text-cream/42">Добавлено</dt>
                <dd className="mt-1 font-semibold text-cream">
                  {formatDate(product.createdAt)}
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-sm leading-6 text-cream/62">{product.description}</p>

            <div className="mt-6 rounded-[8px] border border-white/10 bg-black/24 p-4">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-cream/42">
                О продавце
              </p>
              <Link
                href={seller.href}
                className="flex items-center gap-4 transition hover:text-lime"
              >
                <Avatar src={seller.avatarUrl} name={seller.name} frame={seller.verified ? "lime" : "none"} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-cream">{seller.name}</p>
                    {seller.verified ? <Badge variant="lime">Verified</Badge> : null}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-cream/52">
                    <Rating value={seller.rating} />
                    <span>{seller.salesCount} продаж</span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-6">
              <ProductActions productId={product.id} isAuthenticated={isAuthenticated} />
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_26rem]">
        <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 flex items-center gap-3">
            <PackageCheck aria-hidden className="h-5 w-5 text-lime" />
            <h2 className="text-2xl font-semibold text-cream">Как купить</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {product.dealMethods.map((method) => (
              <DealMethodCard
                key={method}
                method={method}
                active={method === "PERSONAL_MEETING"}
                disabled={method === "SAFE_DEAL"}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[8px] border border-amber-300/25 bg-amber-300/10 p-6">
          <div className="flex items-start gap-3">
            <ShieldAlert aria-hidden className="mt-1 h-5 w-5 shrink-0 text-amber-200" />
            <div>
              <h2 className="font-semibold text-amber-100">Безопасная сделка скоро</h2>
              <p className="mt-2 text-sm leading-6 text-amber-50/70">
                {DEAL_METHOD_LABELS.SAFE_DEAL}: готовим защищённый сценарий оплаты и доставки.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 rounded-[8px] border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-6 flex items-center gap-3">
          <AlertTriangle aria-hidden className="h-5 w-5 text-lime" />
          <h2 className="text-2xl font-semibold text-cream">Отзывы</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.length > 0 ? (
            reviews.map((review) => {
              const author = getUserById(review.authorId);

              return (
                <article key={review.id} className="rounded-[8px] border border-white/10 p-4">
                  <div className="mb-3 flex items-center gap-3">
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
            })
          ) : (
            <p className="text-sm text-cream/55">Для этого продавца пока нет отзывов.</p>
          )}
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-16">
          <SectionHeading title="Похожие товары" eyebrow="Еще в подборке" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
