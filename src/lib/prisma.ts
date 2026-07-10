import { PrismaClient } from "@/generated/prisma/client";

type PrismaClientConstructorOptions = ConstructorParameters<typeof PrismaClient>[0];

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function createPrismaClient(options: PrismaClientConstructorOptions) {
  const client = globalForPrisma.prisma ?? new PrismaClient(options);

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

export type DbClient = ReturnType<typeof createPrismaClient>;
