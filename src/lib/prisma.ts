import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required for Prisma runtime access.");
  }

  const adapter = new PrismaPg({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
  const client = new PrismaClient({ adapter });
  globalForPrisma.prisma = client;
  return client;
}

export function getPrisma() {
  return globalForPrisma.prisma ?? createPrismaClient();
}

export type DbClient = ReturnType<typeof createPrismaClient>;
