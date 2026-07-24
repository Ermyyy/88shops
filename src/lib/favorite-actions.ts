"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";

export async function toggleFavoriteAction(productId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { ok: false, error: "AUTH_REQUIRED" as const };
  }

  const db = getPrisma();
  const existing = await db.favorite.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    select: { id: true },
  });

  if (existing) {
    await db.favorite.delete({
      where: { id: existing.id },
    });
    revalidatePath("/favorites");
    return { ok: true, active: false };
  }

  await db.favorite.create({
    data: {
      userId,
      productId,
    },
  });
  revalidatePath("/favorites");
  return { ok: true, active: true };
}
