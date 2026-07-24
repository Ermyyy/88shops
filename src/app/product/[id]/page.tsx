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
    return { title: "Товар не найден" };
  }

  return {
    title: product.title,
    description: `${product.brand}, ${formatPrice(product.priceKopecks)}, ${product.city}. ${product.description}`,
    openGraph: {
      title: product.title,
      description: product.description,
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
    <div className="page-shell py-5 md:py-7">
      <nav className="mb-4 flex items-center gap-2 text-sm text-black/50">
        <Link href="/catalog" className="hover:text-black">
          Каталог
        </Link>
        <span>/</span>
        <span className="truncate text-black/70">{product.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <ProductGallery images={product.images} title={product.title} />

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[8px] border border-black/10 bg-white p-4 shadow-sm shadow-black/5">
            <div className="flex flex-wrap gap-2">
              <Badge variant={product.authenticityType === "ORIGINAL" ? "lime" : "warning"}>
                {AUTHENTICITY_LABELS[product.authenticityType]}
              </Badge>
              <Badge>{CONDITION_LABELS[product.condition]}</Badge>
            </div>

            <p className="mt-4 text-sm font-semibold text-black/55">{product.brand}</p>
            <h1 className="mt-1 text-2xl font-semibold leading-tight text-black md:text-3xl">
              {product.title}
            </h1>
            <Price value={product.priceKopecks} className="mt-4 text-3xl" />

            <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-black/10 py-4 text-sm">
              <Spec label="Размер" value={getProductSize(product)} />
              <Spec label="Город" value={product.city} />
              <Spec label="Категория" value={product.category} />
              <Spec label="Добавлено" value={formatDate(product.createdAt)} />
            </dl>

            <p className="mt-4 text-sm leading-6 text-black/62">{product.description}</p>

            <Link
              href={seller.href}
              className="mt-5 flex items-center gap-3 rounded-[8px] border border-black/10 bg-[#f6f6f4] p-3 transition hover:border-black/20"
            >
              <Avatar
                name={seller.name}
                frame={seller.verified ? "lime" : "none"}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold text-black">{seller.name}</p>
                  {seller.verified ? <Badge variant="lime">Verified</Badge> : null}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-black/55">
                  <Rating value={seller.rating} />
                  <span>{seller.salesCount} продаж</span>
                </div>
              </div>
            </Link>

            <div className="mt-4">
              <ProductActions productId={product.id} isAuthenticated={isAuthenticated} />
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_24rem]">
        <div className="rounded-[8px] border border-black/10 bg-white p-4">
          <div className="mb-4 flex items-center gap-2">
            <PackageCheck aria-hidden className="h-5 w-5 text-black" />
            <h2 className="text-lg font-semibold text-black">Как купить</h2>
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

        <div className="rounded-[8px] border border-amber-300/45 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
            <div>
              <h2 className="font-semibold text-black">Безопасная сделка скоро</h2>
              <p className="mt-1 text-sm leading-6 text-black/62">
                {DEAL_METHOD_LABELS.SAFE_DEAL}: готовим защищенный сценарий
                оплаты и доставки.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[8px] border border-black/10 bg-white p-4">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle aria-hidden className="h-5 w-5 text-black" />
          <h2 className="text-lg font-semibold text-black">Отзывы</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {reviews.length > 0 ? (
            reviews.map((review) => {
              const author = getUserById(review.authorId);

              return (
                <article key={review.id} className="rounded-[8px] border border-black/10 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <Avatar
                      name={author?.displayName ?? "Покупатель"}
                    />
                    <div>
                      <p className="font-semibold text-black">
                        {author?.displayName ?? "Покупатель"}
                      </p>
                      <Rating value={review.rating} />
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-black/60">{review.text}</p>
                </article>
              );
            })
          ) : (
            <p className="text-sm text-black/55">У этого продавца пока нет отзывов.</p>
          )}
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-10">
          <SectionHeading title="Похожие товары" eyebrow="Еще в подборке" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
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

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-black/45">{label}</dt>
      <dd className="mt-0.5 truncate font-semibold text-black">{value}</dd>
    </div>
  );
}
