"use server";

import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";
import { assertModeratedText } from "@/lib/moderation/text-moderation";
import { sellFormSchema, type SellFormValues } from "@/lib/validations";

export async function createProductAction(values: Omit<SellFormValues, "photos">) {
  const session = await auth();
  const sellerId = session?.user?.id;

  if (!sellerId) {
    return { ok: false, error: "AUTH_REQUIRED" as const };
  }

  const parsed = sellFormSchema.safeParse({
    ...values,
    photos: [],
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Проверь объявление",
    };
  }

  const moderationError =
    assertModeratedText(parsed.data.title) ?? assertModeratedText(parsed.data.description);

  if (moderationError) {
    return { ok: false, error: moderationError };
  }

  const product = await getPrisma().product.create({
    data: {
      sellerId,
      title: parsed.data.title,
      slug: await makeUniqueProductSlug(parsed.data.title),
      brand: parsed.data.brand,
      category: parsed.data.category,
      clothingSize: parsed.data.clothingSize || null,
      shoeSize: parsed.data.shoeSize || null,
      priceKopecks: Math.round(parsed.data.price * 100),
      condition: parsed.data.condition,
      authenticityType: parsed.data.authenticityType,
      city: parsed.data.city,
      description: parsed.data.description,
      dealMethods: parsed.data.dealMethods,
      status: "ACTIVE",
    },
    select: { id: true },
  });

  return { ok: true, productId: product.id };
}

async function makeUniqueProductSlug(title: string) {
  const base =
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9а-яё]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "product";
  let slug = base;
  let suffix = 2;

  while (await getPrisma().product.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}
