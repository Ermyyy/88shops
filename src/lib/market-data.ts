import "server-only";

import { getPrisma } from "@/lib/prisma";
import type { Deal, Product, Review, Shop, User } from "@/types";

type DbUser = {
  id: string;
  email: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  bio: string | null;
  city: string | null;
  rating: number;
  salesCount: number;
  purchasesCount: number;
  role: string;
  createdAt: Date;
  customization?: {
    nicknameColor: string;
    avatarFrame: string;
    emoji: string;
    animatedCoverFuture: boolean;
  } | null;
  _count?: {
    products?: number;
    favorites?: number;
    reviewsTarget?: number;
  };
};

type DbShop = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  description: string;
  rating: number;
  verified: boolean;
  salesCount: number;
  createdAt: Date;
  _count?: {
    products?: number;
    reviews?: number;
  };
};

type DbProduct = {
  id: string;
  sellerId: string;
  shopId: string | null;
  title: string;
  slug: string;
  brand: string;
  category: string;
  clothingSize: string | null;
  shoeSize: string | null;
  priceKopecks: number;
  condition: Product["condition"];
  authenticityType: Product["authenticityType"];
  city: string;
  description: string;
  status: Product["status"];
  dealMethods: Product["dealMethods"];
  popularityScore: number;
  createdAt: Date;
  seller?: DbUser;
  shop?: DbShop | null;
};

const productInclude = {
  seller: {
    include: {
      _count: {
        select: {
          reviewsTarget: true,
        },
      },
    },
  },
  shop: {
    include: {
      _count: {
        select: {
          products: true,
          reviews: true,
        },
      },
    },
  },
} as const;

export async function getCatalogProducts() {
  const products = await getPrisma().product.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    include: productInclude,
  });

  return products.map(mapProduct);
}

export async function getHomeData() {
  const [fresh, popular, shops] = await Promise.all([
    getPrisma().product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 15,
      include: productInclude,
    }),
    getPrisma().product.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ popularityScore: "desc" }, { createdAt: "desc" }],
      take: 10,
      include: productInclude,
    }),
    getPrisma().shop.findMany({
      orderBy: [{ rating: "desc" }, { salesCount: "desc" }],
      take: 3,
      include: {
        _count: {
          select: {
            products: true,
            reviews: true,
          },
        },
      },
    }),
  ]);

  return {
    freshProducts: fresh.map(mapProduct),
    popularProducts: popular.map(mapProduct),
    popularShops: shops.map(mapShop),
  };
}

export async function getShops() {
  const shops = await getPrisma().shop.findMany({
    orderBy: [{ rating: "desc" }, { salesCount: "desc" }],
    include: {
      _count: {
        select: {
          products: true,
          reviews: true,
        },
      },
    },
  });

  return shops.map(mapShop);
}

export async function getProductPageData(idOrSlug: string) {
  const product = await getPrisma().product.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      status: "ACTIVE",
    },
    include: productInclude,
  });

  if (!product) {
    return null;
  }

  const [reviews, related] = await Promise.all([
    product.shopId
      ? getPrisma().review.findMany({
          where: { targetShopId: product.shopId },
          orderBy: { createdAt: "desc" },
          include: { author: true },
        })
      : getPrisma().review.findMany({
          where: { targetUserId: product.sellerId },
          orderBy: { createdAt: "desc" },
          include: { author: true },
        }),
    getPrisma().product.findMany({
      where: {
        id: { not: product.id },
        status: "ACTIVE",
        OR: [{ brand: product.brand }, { category: product.category }],
      },
      take: 4,
      orderBy: [{ popularityScore: "desc" }, { createdAt: "desc" }],
      include: productInclude,
    }),
  ]);

  return {
    product: mapProduct(product),
    seller: makeSeller(product),
    reviews: reviews.map(mapReview),
    related: related.map(mapProduct),
  };
}

export async function getShopPageData(slug: string) {
  const shop = await getPrisma().shop.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          products: true,
          reviews: true,
        },
      },
      products: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        include: productInclude,
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
    },
  });

  if (!shop) {
    return null;
  }

  return {
    shop: mapShop(shop),
    products: shop.products.map(mapProduct),
    reviews: shop.reviews.map(mapReview),
  };
}

export async function getProfilePageData(username: string) {
  const user = await getPrisma().user.findUnique({
    where: { username },
    include: {
      customization: true,
      products: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        include: productInclude,
      },
      reviewsTarget: {
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
      _count: {
        select: {
          products: true,
          favorites: true,
          reviewsTarget: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    user: mapUser(user),
    listings: user.products.map(mapProduct),
    reviews: user.reviewsTarget.map(mapReview),
  };
}

export async function getDeals() {
  const deals = await getPrisma().deal.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: true,
      buyer: true,
      seller: true,
    },
  });

  return deals.map((deal) => ({
    deal: mapDeal(deal),
    productTitle: deal.product.title,
    buyerName: getDisplayName(deal.buyer),
    sellerName: getDisplayName(deal.seller),
  }));
}

export async function getDealPageData(id: string) {
  const deal = await getPrisma().deal.findUnique({
    where: { id },
    include: {
      product: true,
      buyer: true,
      seller: true,
    },
  });

  if (!deal) {
    return null;
  }

  return {
    deal: mapDeal(deal),
    product: mapProduct({
      ...deal.product,
      seller: deal.seller,
      shop: null,
    }),
    buyerName: getDisplayName(deal.buyer),
    sellerName: getDisplayName(deal.seller),
  };
}

export async function getFavoriteProducts(userId: string) {
  const favorites = await getPrisma().favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        include: productInclude,
      },
    },
  });

  return favorites.map((favorite) => mapProduct(favorite.product));
}

export function mapProduct(product: DbProduct): Product {
  return {
    id: product.id,
    sellerId: product.sellerId,
    shopId: product.shopId ?? undefined,
    title: product.title,
    slug: product.slug,
    brand: product.brand,
    category: product.category,
    clothingSize: product.clothingSize ?? undefined,
    shoeSize: product.shoeSize ?? undefined,
    priceKopecks: product.priceKopecks,
    condition: product.condition,
    authenticityType: product.authenticityType,
    city: product.city,
    description: product.description,
    status: product.status,
    dealMethods: product.dealMethods.length > 0 ? product.dealMethods : ["DIRECT"],
    images: [{ id: `${product.id}-placeholder`, alt: product.title }],
    popularityScore: product.popularityScore,
    createdAt: product.createdAt.toISOString(),
    seller: product.seller ? makeSeller(product) : undefined,
  };
}

function mapShop(shop: DbShop): Shop {
  return {
    id: shop.id,
    ownerId: shop.ownerId,
    name: shop.name,
    slug: shop.slug,
    avatarUrl: shop.avatarUrl ?? undefined,
    coverUrl: shop.coverUrl ?? undefined,
    description: shop.description,
    rating: shop.rating,
    reviewsCount: shop._count?.reviews ?? 0,
    verified: shop.verified,
    salesCount: shop.salesCount,
    listingsCount: shop._count?.products ?? 0,
    createdAt: shop.createdAt.toISOString(),
  };
}

function mapUser(user: DbUser): User {
  const firstName = user.firstName ?? "";
  const lastName = user.lastName ?? "";

  return {
    id: user.id,
    email: user.email ?? undefined,
    username: user.username ?? user.id,
    firstName,
    lastName,
    displayName: getDisplayName(user),
    emoji: user.customization?.emoji ?? "*",
    avatarUrl: user.avatarUrl ?? undefined,
    coverUrl: user.coverUrl ?? undefined,
    bio: user.bio ?? "",
    city: user.city ?? undefined,
    rating: user.rating,
    reviewsCount: user._count?.reviewsTarget ?? 0,
    salesCount: user.salesCount,
    purchasesCount: user.purchasesCount,
    listingsCount: user._count?.products ?? 0,
    favoritesCount: user._count?.favorites ?? 0,
    verified: user.role === "SELLER" || user.role === "SHOP_OWNER" || user.role === "ADMIN",
    roles: [user.role as User["roles"][number]],
    createdAt: user.createdAt.toISOString(),
    customization: {
      nicknameColor: user.customization?.nicknameColor ?? "#111111",
      avatarFrame: normalizeAvatarFrame(user.customization?.avatarFrame),
      emoji: user.customization?.emoji ?? "*",
      coverStyle: user.customization?.animatedCoverFuture ? "animated-coming-soon" : "static",
    },
  };
}

function mapReview(
  review: {
    id: string;
    authorId: string;
    targetUserId: string | null;
    targetShopId: string | null;
    productId: string | null;
    rating: number;
    text: string;
    createdAt: Date;
    author?: DbUser;
  },
): Review & { authorName?: string } {
  return {
    id: review.id,
    authorId: review.authorId,
    targetUserId: review.targetUserId ?? undefined,
    targetShopId: review.targetShopId ?? undefined,
    productId: review.productId ?? undefined,
    rating: review.rating,
    text: review.text,
    createdAt: review.createdAt.toISOString(),
    authorName: review.author ? getDisplayName(review.author) : undefined,
  };
}

function mapDeal(
  deal: {
    id: string;
    productId: string;
    buyerId: string;
    sellerId: string;
    amountKopecks: number;
    commissionPercent: unknown;
    commissionAmountKopecks: number;
    method: Deal["method"];
    status: Deal["status"];
    providerPaymentId: string | null;
    createdAt: Date;
    updatedAt: Date;
  },
): Deal {
  return {
    id: deal.id,
    productId: deal.productId,
    buyerId: deal.buyerId,
    sellerId: deal.sellerId,
    amountKopecks: deal.amountKopecks,
    commissionPercent: Number(deal.commissionPercent),
    commissionAmountKopecks: deal.commissionAmountKopecks,
    method: deal.method,
    status: deal.status,
    providerPaymentId: deal.providerPaymentId ?? undefined,
    createdAt: deal.createdAt.toISOString(),
    updatedAt: deal.updatedAt.toISOString(),
  };
}

function makeSeller(product: DbProduct) {
  const shop = product.shop;
  const user = product.seller;

  return {
    id: shop?.id ?? user?.id ?? product.sellerId,
    name: shop?.name ?? (user ? getDisplayName(user) : "Продавец 88Shops"),
    href: shop?.slug ? `/shops/${shop.slug}` : `/profile/${user?.username ?? product.sellerId}`,
    verified: shop?.verified ?? user?.role === "SELLER",
    rating: shop?.rating ?? user?.rating ?? 0,
    reviewsCount: shop?._count?.reviews ?? user?._count?.reviewsTarget ?? 0,
    salesCount: shop?.salesCount ?? user?.salesCount ?? 0,
  };
}

function getDisplayName(user: { name: string | null; firstName: string | null; lastName: string | null; username?: string | null; id: string }) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return user.name ?? fullName ?? user.username ?? "Пользователь 88Shops";
}

function normalizeAvatarFrame(value?: string | null) {
  if (value === "graphite" || value === "lime" || value === "silver") {
    return value;
  }

  return "none";
}
