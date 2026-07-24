import "server-only";

import pg from "pg";
import type { QueryResultRow } from "pg";
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

const productColumns = `
  "id", "sellerId", "shopId", "title", "slug", "brand", "category", "clothingSize",
  "shoeSize", "priceKopecks", "condition", "authenticityType", "city", "description",
  "status", "dealMethods", "popularityScore", "createdAt"
`;

async function queryRows<T extends QueryResultRow>(sql: string, params: unknown[] = []) {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required for runtime data access.");
  }

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5_000,
    query_timeout: 10_000,
  });

  client.on("error", () => {});

  try {
    await client.connect();
    const result = await client.query<T>(sql, params);
    return result.rows;
  } finally {
    await Promise.race([
      client.end().catch(() => {}),
      new Promise<void>((resolve) => {
        setTimeout(resolve, 250);
      }),
    ]);
  }
}

async function getActiveProducts(order: "fresh" | "popular", limit?: number) {
  return queryRows<DbProduct>(
    `
      SELECT ${productColumns}
      FROM "Product"
      WHERE "status" = 'ACTIVE'
      ORDER BY ${order === "popular" ? `"popularityScore" DESC, "createdAt" DESC` : `"createdAt" DESC`}
      ${limit ? "LIMIT $1" : ""}
    `,
    limit ? [limit] : [],
  );
}

export async function getCatalogProducts() {
  const products = await getActiveProducts("fresh");

  return products.map(mapProduct);
}

export async function getHomeData() {
  const [fresh, popular, shops] = await Promise.all([
    getActiveProducts("fresh", 15),
    getActiveProducts("popular", 10),
    getTopShops(3),
  ]);

  return {
    freshProducts: fresh.map(mapProduct),
    popularProducts: popular.map(mapProduct),
    popularShops: shops.map(mapShop),
  };
}

export async function getShops() {
  const shops = await getTopShops();

  return shops.map(mapShop);
}

export async function getProductPageData(idOrSlug: string) {
  const [product] = await queryRows<DbProduct>(
    `
      SELECT ${productColumns}
      FROM "Product"
      WHERE "status" = 'ACTIVE' AND ("id" = $1 OR "slug" = $1)
      LIMIT 1
    `,
    [idOrSlug],
  );

  if (!product) {
    return null;
  }

  const [productWithRelations] = await attachProductRelations([product]);
  const [reviews, related] = await Promise.all([
    product.shopId
      ? getPrisma().review.findMany({
          where: { targetShopId: product.shopId },
          orderBy: { createdAt: "desc" },
        })
      : getPrisma().review.findMany({
          where: { targetUserId: product.sellerId },
          orderBy: { createdAt: "desc" },
        }),
    queryRows<DbProduct>(
      `
        SELECT ${productColumns}
        FROM "Product"
        WHERE "id" <> $1 AND "status" = 'ACTIVE' AND ("brand" = $2 OR "category" = $3)
        ORDER BY "popularityScore" DESC, "createdAt" DESC
        LIMIT 4
      `,
      [product.id, product.brand, product.category],
    ),
  ]);

  return {
    product: mapProduct(productWithRelations),
    seller: makeSeller(productWithRelations),
    reviews: reviews.map(mapReview),
    related: (await attachProductRelations(related)).map(mapProduct),
  };
}

export async function getShopPageData(slug: string) {
  const shop = await getPrisma().shop.findUnique({
    where: { slug },
  });

  if (!shop) {
    return null;
  }

  const [products, reviews] = await Promise.all([
    queryRows<DbProduct>(
      `
        SELECT ${productColumns}
        FROM "Product"
        WHERE "shopId" = $1 AND "status" = 'ACTIVE'
        ORDER BY "createdAt" DESC
      `,
      [shop.id],
    ),
    getPrisma().review.findMany({
      where: { targetShopId: shop.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    shop: mapShop(shop),
    products: (await attachProductRelations(products)).map(mapProduct),
    reviews: reviews.map(mapReview),
  };
}

export async function getProfilePageData(username: string) {
  const user = await getPrisma().user.findUnique({
    where: { username },
    include: {
      customization: true,
    },
  });

  if (!user) {
    return null;
  }

  const [products, reviews] = await Promise.all([
    queryRows<DbProduct>(
      `
        SELECT ${productColumns}
        FROM "Product"
        WHERE "sellerId" = $1 AND "status" = 'ACTIVE'
        ORDER BY "createdAt" DESC
      `,
      [user.id],
    ),
    getPrisma().review.findMany({
      where: { targetUserId: user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    user: mapUser(user),
    listings: (await attachProductRelations(products)).map(mapProduct),
    reviews: reviews.map(mapReview),
  };
}

export async function getDeals() {
  const deals = await getPrisma().deal.findMany({
    orderBy: { createdAt: "desc" },
  });
  const products = await getProductsByIds(deals.map((deal) => deal.productId));
  const users = await getUsersByIds([...deals.map((deal) => deal.buyerId), ...deals.map((deal) => deal.sellerId)]);

  return deals.map((deal) => ({
    deal: mapDeal(deal),
    productTitle: products.get(deal.productId)?.title ?? "88Shops",
    buyerName: users.get(deal.buyerId) ? getDisplayName(users.get(deal.buyerId)!) : "88Shops",
    sellerName: users.get(deal.sellerId) ? getDisplayName(users.get(deal.sellerId)!) : "88Shops",
  }));
}

export async function getDealPageData(id: string) {
  const deal = await getPrisma().deal.findUnique({
    where: { id },
  });

  if (!deal) {
    return null;
  }

  const products = await getProductsByIds([deal.productId]);
  const users = await getUsersByIds([deal.buyerId, deal.sellerId]);
  const product = products.get(deal.productId);
  const buyer = users.get(deal.buyerId);
  const seller = users.get(deal.sellerId);

  return {
    deal: mapDeal(deal),
    product: product
      ? mapProduct({
          ...product,
          seller,
          shop: null,
        })
      : undefined,
    buyerName: buyer ? getDisplayName(buyer) : "88Shops",
    sellerName: seller ? getDisplayName(seller) : "88Shops",
  };
}

export async function getFavoriteProducts(userId: string) {
  const favorites = await getPrisma().favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  const products = await getProductsByIds(favorites.map((favorite) => favorite.productId));
  const hydrated = await attachProductRelations(
    favorites.flatMap((favorite) => {
      const product = products.get(favorite.productId);
      return product ? [product] : [];
    }),
  );

  return hydrated.map(mapProduct);
}

async function attachProductRelations<T extends DbProduct>(products: T[]) {
  if (products.length === 0) {
    return products;
  }

  const [sellers, shops] = await Promise.all([
    getUsersByIds(products.map((product) => product.sellerId)),
    getShopsByIds(products.flatMap((product) => (product.shopId ? [product.shopId] : []))),
  ]);

  return products.map((product) => ({
    ...product,
    seller: sellers.get(product.sellerId),
    shop: product.shopId ? (shops.get(product.shopId) ?? null) : null,
  }));
}

async function getUsersByIds(ids: string[]) {
  const uniqueIds = [...new Set(ids)];

  if (uniqueIds.length === 0) {
    return new Map<string, DbUser>();
  }

  const users = await queryRows<DbUser>(
    `
      SELECT
        "id", "email", "username", "firstName", "lastName", "name", "avatarUrl", "coverUrl",
        "bio", "city", "rating", "salesCount", "purchasesCount", "role", "createdAt"
      FROM "User"
      WHERE "id" = ANY($1::text[])
    `,
    [uniqueIds],
  );

  return new Map(users.map((user) => [user.id, user]));
}

async function getShopsByIds(ids: string[]) {
  const uniqueIds = [...new Set(ids)];

  if (uniqueIds.length === 0) {
    return new Map<string, DbShop>();
  }

  const shops = await queryRows<DbShop>(
    `
      SELECT
        "id", "ownerId", "name", "slug", "avatarUrl", "coverUrl", "description",
        "rating", "verified", "salesCount", "createdAt"
      FROM "Shop"
      WHERE "id" = ANY($1::text[])
    `,
    [uniqueIds],
  );

  return new Map(shops.map((shop) => [shop.id, shop]));
}

async function getTopShops(limit?: number) {
  return queryRows<DbShop>(
    `
      SELECT
        "id", "ownerId", "name", "slug", "avatarUrl", "coverUrl", "description",
        "rating", "verified", "salesCount", "createdAt"
      FROM "Shop"
      ORDER BY "rating" DESC, "salesCount" DESC
      ${limit ? "LIMIT $1" : ""}
    `,
    limit ? [limit] : [],
  );
}

async function getProductsByIds(ids: string[]) {
  const uniqueIds = [...new Set(ids)];

  if (uniqueIds.length === 0) {
    return new Map<string, DbProduct>();
  }

  const products = await queryRows<DbProduct>(
    `
      SELECT
        "id", "sellerId", "shopId", "title", "slug", "brand", "category", "clothingSize",
        "shoeSize", "priceKopecks", "condition", "authenticityType", "city", "description",
        "status", "dealMethods", "popularityScore", "createdAt"
      FROM "Product"
      WHERE "id" = ANY($1::text[])
    `,
    [uniqueIds],
  );

  return new Map(products.map((product) => [product.id, product]));
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
