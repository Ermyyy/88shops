import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Heart, Package, ShoppingBag, Star, Ticket } from "lucide-react";
import { ProfileCustomization } from "@/features/profile/profile-customization";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/ui/product-card";
import { Rating } from "@/components/ui/rating";
import { SafeImage } from "@/components/ui/safe-image";
import { Tabs } from "@/components/ui/tabs";
import { getProfilePageData } from "@/lib/market-data";
import { formatDate } from "@/lib/utils";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const data = await getProfilePageData(username);
  const user = data?.user;

  if (!user) {
    return { title: "Профиль не найден" };
  }

  return {
    title: `${user.displayName} - профиль`,
    description: user.bio,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const data = await getProfilePageData(username);

  if (!data) {
    notFound();
  }

  const { user, listings, reviews } = data;

  return (
    <div className="page-shell py-6 md:py-8">
      <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white">
        <div className="relative min-h-44 md:min-h-56">
          <SafeImage
            alt={`Обложка ${user.displayName}`}
            fill
            priority
            sizes="(min-width: 768px) 86rem, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/12 to-transparent" />
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-[auto_1fr] md:items-end">
          <Avatar
            name={user.displayName}
            size="xl"
            frame={user.customization.avatarFrame}
            className="-mt-16 ring-4 ring-white"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1
                className="truncate text-2xl font-semibold md:text-3xl"
                style={{ color: user.customization.nicknameColor }}
              >
                {user.customization.emoji} {user.displayName}
              </h1>
              {user.verified ? <Badge variant="lime">Verified</Badge> : null}
            </div>
            <p className="mt-1 text-sm text-black/55">@{user.username}</p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-black/62">{user.bio}</p>
          </div>
        </div>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <Metric
          label="Рейтинг"
          icon={<Star className="h-4 w-4" />}
          value={<Rating value={user.rating} count={user.reviewsCount} />}
        />
        <Metric
          label="Покупки"
          icon={<ShoppingBag className="h-4 w-4" />}
          value={user.purchasesCount}
        />
        <Metric
          label="Продажи"
          icon={<Ticket className="h-4 w-4" />}
          value={user.salesCount}
        />
        <Metric
          label="Объявления"
          icon={<Package className="h-4 w-4" />}
          value={listings.length}
        />
        <Metric
          label="Избранное"
          icon={<Heart className="h-4 w-4" />}
          value={user.favoritesCount}
        />
        <Metric label="С нами" value={formatDate(user.createdAt)} />
      </div>

      <Tabs
        className="mt-6"
        items={[
          {
            id: "listings",
            label: "Объявления",
            content:
              listings.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                  {listings.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Здесь пока пусто"
                  description="Первое объявление поможет покупателям найти продавца."
                  action={<LinkButton href="/sell">Разместить вещь</LinkButton>}
                />
              ),
          },
          {
            id: "reviews",
            label: "Отзывы",
            content: (
              <div className="grid gap-3 md:grid-cols-2">
                {reviews.length > 0 ? (
                  reviews.map((review) => {
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
                  })
                ) : (
                  <p className="text-sm text-black/55">
                    У пользователя пока нет отзывов.
                  </p>
                )}
              </div>
            ),
          },
          {
            id: "customization",
            label: "Оформление",
            content: <ProfileCustomization />,
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
