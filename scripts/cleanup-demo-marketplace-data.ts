import "dotenv/config";
import pg from "pg";

const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;
const mode = process.argv.includes("--execute") ? "execute" : "dry-run";

if (!connectionString) {
  throw new Error("DIRECT_URL or DATABASE_URL is required.");
}

const demoUserIds = [
  "user-alina",
  "user-mark",
  "user-lera",
  "user-roma",
  "user-daniil",
];

const demoUsernames = [
  "alina.archive",
  "mark.layers",
  "lera.vault",
  "roma.sizes",
  "daniil.scan",
];

function getSafeDatabaseInfo() {
  const url = new URL(connectionString!);

  return {
    hostname: url.hostname,
    endpoint: url.hostname.includes("-pooler") ? "pooler" : "direct",
    database: url.pathname.replace("/", "") || "unknown",
    sslmode: url.searchParams.get("sslmode") ?? "not-set",
    length: connectionString!.length,
  };
}

async function main() {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20_000,
    query_timeout: 120_000,
  });

  client.on("error", (error) => {
    console.error("database connection error", { name: error.name, message: error.message });
  });

  await client.connect();

  try {
    const info = getSafeDatabaseInfo();
    console.log(
      `cleanup target host=${info.hostname} endpoint=${info.endpoint} database=${info.database} sslmode=${info.sslmode} length=${info.length}`,
    );
    console.log(`cleanup mode=${mode}`);

    const candidates = await client.query<{ id: string; username: string | null }>(
      `
        SELECT u."id", u."username"
        FROM "User" u
        WHERE
          (u."id" = ANY($1::text[]) OR u."username" = ANY($2::text[]) OR u."email" LIKE '%@example.test')
          AND u."telegramId" IS NULL
          AND NOT EXISTS (
            SELECT 1
            FROM "Account" a
            WHERE a."userId" = u."id" AND a."provider" = 'telegram'
          )
        ORDER BY u."createdAt" ASC
      `,
      [demoUserIds, demoUsernames],
    );

    const userIds = candidates.rows.map((user) => user.id);

    if (userIds.length === 0) {
      console.log("demo users without Telegram account: 0");
      return;
    }

    const targetProducts = await client.query<{ id: string }>(
      `SELECT "id" FROM "Product" WHERE "sellerId" = ANY($1::text[])`,
      [userIds],
    );
    const productIds = targetProducts.rows.map((product) => product.id);

    const targetShops = await client.query<{ id: string }>(
      `SELECT "id" FROM "Shop" WHERE "ownerId" = ANY($1::text[])`,
      [userIds],
    );
    const shopIds = targetShops.rows.map((shop) => shop.id);

    const targetConversations = await client.query<{ id: string }>(
      `
        SELECT "id"
        FROM "Conversation"
        WHERE
          "buyerId" = ANY($1::text[])
          OR "sellerId" = ANY($1::text[])
          OR "productId" = ANY($2::text[])
      `,
      [userIds, productIds],
    );
    const conversationIds = targetConversations.rows.map((conversation) => conversation.id);

    const userIdSet = new Set(userIds);
    const productIdSet = new Set(productIds);

    const allDeals = await client.query<{
      id: string;
      buyerId: string;
      sellerId: string;
      productId: string;
    }>(`SELECT "id", "buyerId", "sellerId", "productId" FROM "Deal"`);
    const dealIds = allDeals.rows
      .filter(
        (deal) =>
          userIdSet.has(deal.buyerId) ||
          userIdSet.has(deal.sellerId) ||
          productIdSet.has(deal.productId),
      )
      .map((deal) => deal.id);

    const reviewIds: string[] = [];
    const favoriteIds: string[] = [];

    const counts = {
      users: String(userIds.length),
      shops: String(shopIds.length),
      products: String(productIds.length),
      deals: String(dealIds.length),
      conversations: String(conversationIds.length),
      product_images: "cascade",
      favorites: "cascade",
      reviews: "cascade",
      messages: "cascade",
    };

    console.log("matched demo users:", candidates.rows.map((user) => user.username ?? user.id).join(", "));
    console.table(counts);

    if (mode !== "execute") {
      console.log("dry-run only. Re-run with --execute to delete matched demo data.");
      return;
    }

    async function deleteStep(label: string, ids: string[], sql: string) {
      if (ids.length === 0) {
        console.log(`${label}: skipped 0`);
        return;
      }

      const result = await client.query(sql, [ids]);
      console.log(`${label}: deleted ${result.rowCount ?? 0}`);
    }

    await deleteStep(
      "messages",
      conversationIds,
      `
          DELETE FROM "Message"
          WHERE "conversationId" = ANY($1::text[])
        `,
    );
    await deleteStep(
      "conversations",
      conversationIds,
      `
          DELETE FROM "Conversation"
          WHERE "id" = ANY($1::text[])
        `,
    );
    await deleteStep(
      "deals",
      dealIds,
      `
          DELETE FROM "Deal"
          WHERE "id" = ANY($1::text[])
        `,
    );
    await deleteStep(
      "reviews",
      reviewIds,
      `
          DELETE FROM "Review"
          WHERE "id" = ANY($1::text[])
        `,
    );
    await deleteStep(
      "favorites",
      favoriteIds,
      `
          DELETE FROM "Favorite"
          WHERE "id" = ANY($1::text[])
        `,
    );
    console.log("product images: cascade");
    await deleteStep(
      "products",
      productIds,
      `
          DELETE FROM "Product"
          WHERE "id" = ANY($1::text[])
        `,
    );
    await deleteStep(
      "shops",
      shopIds,
      `
          DELETE FROM "Shop"
          WHERE "id" = ANY($1::text[])
        `,
    );
    await deleteStep(
      "customization",
      userIds,
      `
          DELETE FROM "UserCustomization"
          WHERE "userId" = ANY($1::text[])
        `,
    );
    await deleteStep(
      "sessions",
      userIds,
      `
          DELETE FROM "Session"
          WHERE "userId" = ANY($1::text[])
        `,
    );
    await deleteStep(
      "accounts",
      userIds,
      `
          DELETE FROM "Account"
          WHERE "userId" = ANY($1::text[])
        `,
    );
    await deleteStep(
      "badges",
      userIds,
      `
          DELETE FROM "UserBadge"
          WHERE "userId" = ANY($1::text[])
        `,
    );
    await deleteStep(
      "users",
      userIds,
      `
          DELETE FROM "User"
          WHERE "id" = ANY($1::text[]) AND "telegramId" IS NULL
        `,
    );

    console.log("demo marketplace data deleted.");
  } finally {
    await client.end().catch(() => {});
  }
}

await main();
