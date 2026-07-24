import "dotenv/config";
import pg from "pg";
import { deals, products, reviews, shops, users } from "../src/lib/mock-data.ts";

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL is required for Prisma seed.");
}

async function query(sql: string, params: unknown[] = []) {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20_000,
    query_timeout: 30_000,
  });

  client.on("error", () => {});

  try {
    await client.connect();
    return await client.query(sql, params);
  } finally {
    await client.end().catch(() => {});
  }
}

async function main() {
  console.log(
    `seed counts users=${users.length} shops=${shops.length} products=${products.length} reviews=${reviews.length} deals=${deals.length}`,
  );

  let index = 0;
  for (const user of users) {
    index += 1;
    console.log(`seed users ${index}/${users.length}`);
    await query(
      `
        INSERT INTO "User" (
          "id", "email", "username", "firstName", "lastName", "name", "bio", "city",
          "rating", "salesCount", "purchasesCount", "role", "onboardingCompleted", "createdAt", "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::"UserRole", true, $13, now())
        ON CONFLICT ("id") DO UPDATE SET
          "email" = EXCLUDED."email",
          "username" = EXCLUDED."username",
          "firstName" = EXCLUDED."firstName",
          "lastName" = EXCLUDED."lastName",
          "name" = EXCLUDED."name",
          "bio" = EXCLUDED."bio",
          "city" = EXCLUDED."city",
          "rating" = EXCLUDED."rating",
          "salesCount" = EXCLUDED."salesCount",
          "purchasesCount" = EXCLUDED."purchasesCount",
          "role" = EXCLUDED."role",
          "onboardingCompleted" = true,
          "updatedAt" = now()
      `,
      [
        user.id,
        user.email ?? null,
        user.username,
        user.firstName,
        user.lastName,
        user.displayName,
        user.bio ?? null,
        user.city ?? null,
        user.rating,
        user.salesCount,
        user.purchasesCount,
        user.roles.includes("SELLER") ? "SELLER" : "USER",
        new Date(user.createdAt),
      ],
    );

    await query(
      `
        INSERT INTO "UserCustomization" (
          "id", "userId", "nicknameColor", "emoji", "avatarFrame", "animatedCoverFuture", "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, now())
        ON CONFLICT ("userId") DO UPDATE SET
          "nicknameColor" = EXCLUDED."nicknameColor",
          "emoji" = EXCLUDED."emoji",
          "avatarFrame" = EXCLUDED."avatarFrame",
          "animatedCoverFuture" = EXCLUDED."animatedCoverFuture",
          "updatedAt" = now()
      `,
      [
        `customization-${user.id}`,
        user.id,
        user.customization.nicknameColor,
        user.customization.emoji,
        user.customization.avatarFrame,
        user.customization.coverStyle === "animated-coming-soon",
      ],
    );
  }

  index = 0;
  for (const shop of shops) {
    index += 1;
    console.log(`seed shops ${index}/${shops.length}`);
    await query(
      `
        INSERT INTO "Shop" (
          "id", "ownerId", "name", "slug", "description", "rating", "verified", "salesCount", "createdAt", "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now())
        ON CONFLICT ("slug") DO UPDATE SET
          "ownerId" = EXCLUDED."ownerId",
          "name" = EXCLUDED."name",
          "description" = EXCLUDED."description",
          "rating" = EXCLUDED."rating",
          "verified" = EXCLUDED."verified",
          "salesCount" = EXCLUDED."salesCount",
          "updatedAt" = now()
      `,
      [
        shop.id,
        shop.ownerId,
        shop.name,
        shop.slug,
        shop.description,
        shop.rating,
        shop.verified,
        shop.salesCount,
        new Date(shop.createdAt),
      ],
    );
  }

  index = 0;
  for (const product of products) {
    index += 1;
    console.log(`seed products ${index}/${products.length}`);
    await query(
      `
        INSERT INTO "Product" (
          "id", "sellerId", "shopId", "title", "slug", "brand", "category", "clothingSize", "shoeSize",
          "priceKopecks", "condition", "authenticityType", "city", "description", "status", "dealMethods",
          "popularityScore", "createdAt", "updatedAt"
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9,
          $10, $11::"ProductCondition", $12::"AuthenticityType", $13, $14, $15::"ProductStatus",
          $16::"DealMethod"[], $17, $18, now()
        )
        ON CONFLICT ("slug") DO UPDATE SET
          "sellerId" = EXCLUDED."sellerId",
          "shopId" = EXCLUDED."shopId",
          "title" = EXCLUDED."title",
          "brand" = EXCLUDED."brand",
          "category" = EXCLUDED."category",
          "clothingSize" = EXCLUDED."clothingSize",
          "shoeSize" = EXCLUDED."shoeSize",
          "priceKopecks" = EXCLUDED."priceKopecks",
          "condition" = EXCLUDED."condition",
          "authenticityType" = EXCLUDED."authenticityType",
          "city" = EXCLUDED."city",
          "description" = EXCLUDED."description",
          "status" = EXCLUDED."status",
          "dealMethods" = EXCLUDED."dealMethods",
          "popularityScore" = EXCLUDED."popularityScore",
          "updatedAt" = now()
      `,
      [
        product.id,
        product.sellerId,
        product.shopId ?? null,
        product.title,
        product.slug,
        product.brand,
        product.category,
        product.clothingSize ?? null,
        product.shoeSize ?? null,
        product.priceKopecks,
        product.condition,
        product.authenticityType,
        product.city,
        product.description,
        product.status,
        product.dealMethods,
        product.popularityScore,
        new Date(product.createdAt),
      ],
    );
  }

  index = 0;
  for (const review of reviews) {
    index += 1;
    console.log(`seed reviews ${index}/${reviews.length}`);
    await query(
      `
        INSERT INTO "Review" (
          "id", "authorId", "targetUserId", "targetShopId", "productId", "rating", "text", "createdAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT ("id") DO UPDATE SET
          "authorId" = EXCLUDED."authorId",
          "targetUserId" = EXCLUDED."targetUserId",
          "targetShopId" = EXCLUDED."targetShopId",
          "productId" = EXCLUDED."productId",
          "rating" = EXCLUDED."rating",
          "text" = EXCLUDED."text"
      `,
      [
        review.id,
        review.authorId,
        review.targetUserId ?? null,
        review.targetShopId ?? null,
        review.productId ?? null,
        review.rating,
        review.text,
        new Date(review.createdAt),
      ],
    );
  }

  index = 0;
  for (const deal of deals) {
    index += 1;
    console.log(`seed deals ${index}/${deals.length}`);
    await query(
      `
        INSERT INTO "Deal" (
          "id", "productId", "buyerId", "sellerId", "amountKopecks", "commissionPercent",
          "commissionAmountKopecks", "method", "status", "providerPaymentId", "createdAt", "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8::"DealMethod", $9::"DealStatus", $10, $11, $12)
        ON CONFLICT ("id") DO UPDATE SET
          "productId" = EXCLUDED."productId",
          "buyerId" = EXCLUDED."buyerId",
          "sellerId" = EXCLUDED."sellerId",
          "amountKopecks" = EXCLUDED."amountKopecks",
          "commissionPercent" = EXCLUDED."commissionPercent",
          "commissionAmountKopecks" = EXCLUDED."commissionAmountKopecks",
          "method" = EXCLUDED."method",
          "status" = EXCLUDED."status",
          "providerPaymentId" = EXCLUDED."providerPaymentId",
          "updatedAt" = EXCLUDED."updatedAt"
      `,
      [
        deal.id,
        deal.productId,
        deal.buyerId,
        deal.sellerId,
        deal.amountKopecks,
        deal.commissionPercent,
        deal.commissionAmountKopecks,
        deal.method,
        deal.status,
        deal.providerPaymentId ?? null,
        new Date(deal.createdAt),
        new Date(deal.updatedAt),
      ],
    );
  }
}

await main();
