import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Heart, Package, ShoppingBag, Star, Ticket } from "lucide-react";
import { ProfileCustomization } from "@/features/profile/profile-customization";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ui/product-card";
import { Rating } from "@/components/ui/rating";
import { SafeImage } from "@/components/ui/safe-image";
import { Tabs } from "@/components/ui/tabs";
import {
  getProductsBySeller,
  getReviewsForUser,
  getUserById,
  getUserByUsername,
  users,
} from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

export function generateStaticParams() {
  return users.map((user) => ({ username: user.username }));
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const user = getUserByUsername(username);

  if (!user) {
    return { title: "Профиль не найден" };
  }

  return {
    title: `${user.displayName} — профиль`,
    description: user.bio,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const user = getUserByUsername(username);

  if (!user) {
    notFound();
  }

  const listings = getProductsBySeller(user.id);
  const reviews = getReviewsForUser(user.id);

  return (
    <div className="pb-14">
      <section className="relative min-h-[26rem] overflow-hidden border-b border-white/10">
        <SafeImage
          src={user.coverUrl}
          alt={`Обложка ${user.displayName}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-black/25" />
        <div className="page-shell relative flex min-h-[26rem] items-end pb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <Avatar
              src={user.avatarUrl}
              name={user.displayName}
              size="xl"
              frame={user.customization.avatarFrame}
            />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1
                  className="font-serif text-5xl md:text-7xl"
                  style={{ color: user.customization.nicknameColor }}
                >
                  {user.customization.emoji} {user.displayName}
                </h1>
                {user.verified ? <Badge variant="lime">Verified</Badge> : null}
              </div>
              <p className="mt-3 text-sm text-cream/55">@{user.username}</p>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/65">{user.bio}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell -mt-5">
        <div className="grid gap-4 rounded-[8px] border border-white/10 bg-charcoal p-5 sm:grid-cols-2 lg:grid-cols-6">
          <Metric label="Рейтинг" icon={<Star className="h-4 w-4" />} value={<Rating value={user.rating} count={user.reviewsCount} />} />
          <Metric label="Покупки" icon={<ShoppingBag className="h-4 w-4" />} value={user.purchasesCount} />
          <Metric label="Продажи" icon={<Ticket className="h-4 w-4" />} value={user.salesCount} />
          <Metric label="Объявления" icon={<Package className="h-4 w-4" />} value={listings.length} />
          <Metric label="Избранное" icon={<Heart className="h-4 w-4" />} value={user.favoritesCount} />
          <Metric label="С нами" value={formatDate(user.createdAt)} />
        </div>

        <Tabs
          className="mt-8"
          items={[
            {
              id: "listings",
              label: "Объявления",
              content: (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {listings.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ),
            },
            {
              id: "reviews",
              label: "Отзывы",
              content: (
                <div className="grid gap-4 md:grid-cols-2">
                  {reviews.length > 0 ? (
                    reviews.map((review) => {
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
                    })
                  ) : (
                    <p className="text-sm text-cream/55">У пользователя пока нет отзывов.</p>
                  )}
                </div>
              ),
            },
            {
              id: "customization",
              label: "Кастомизация",
              content: <ProfileCustomization />,
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
