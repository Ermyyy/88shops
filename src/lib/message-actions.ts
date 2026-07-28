"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";
import { assertModeratedText } from "@/lib/moderation/text-moderation";

export type SendMessageState = {
  error?: string;
};

const MESSAGE_MIN_LENGTH = 1;
const MESSAGE_MAX_LENGTH = 3000;
const RATE_LIMIT_WINDOW_MS = 30_000;
const RATE_LIMIT_MAX_MESSAGES = 5;

const globalForMessageRateLimit = globalThis as typeof globalThis & {
  messageRateLimit?: Map<string, number[]>;
};

function getRateLimitStore() {
  if (!globalForMessageRateLimit.messageRateLimit) {
    globalForMessageRateLimit.messageRateLimit = new Map();
  }

  return globalForMessageRateLimit.messageRateLimit;
}

function checkRateLimit(userId: string) {
  const now = Date.now();
  const store = getRateLimitStore();
  const recent = (store.get(userId) ?? []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_MESSAGES) {
    store.set(userId, recent);
    return false;
  }

  store.set(userId, [...recent, now]);
  return true;
}

function normalizeMessageText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function validateMessageText(text: string) {
  if (text.length < MESSAGE_MIN_LENGTH) {
    return "Напиши сообщение.";
  }

  if (text.length > MESSAGE_MAX_LENGTH) {
    return "Сообщение должно быть до 3000 символов.";
  }

  return assertModeratedText(text);
}

export async function startConversationAction(formData: FormData) {
  const session = await auth();
  const buyerId = session?.user?.id;
  const productId = normalizeMessageText(formData.get("productId"));

  if (!buyerId) {
    redirect(`/auth?callbackUrl=${encodeURIComponent(`/product/${productId}`)}`);
  }

  const product = await getPrisma().product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      sellerId: true,
      status: true,
    },
  });

  if (!product || product.status !== "ACTIVE") {
    redirect("/catalog");
  }

  if (product.sellerId === buyerId) {
    redirect(`/product/${product.id}?message=self`);
  }

  const conversation = await getPrisma().conversation.upsert({
    where: {
      productId_buyerId_sellerId: {
        productId: product.id,
        buyerId,
        sellerId: product.sellerId,
      },
    },
    create: {
      productId: product.id,
      buyerId,
      sellerId: product.sellerId,
    },
    update: {},
    select: { id: true },
  });

  redirect(`/messages/${conversation.id}`);
}

export async function sendMessageAction(
  _prevState: SendMessageState,
  formData: FormData,
): Promise<SendMessageState> {
  const session = await auth();
  const senderId = session?.user?.id;
  const conversationId = normalizeMessageText(formData.get("conversationId"));
  const text = normalizeMessageText(formData.get("text"));

  if (!senderId) {
    return { error: "Войди, чтобы отправить сообщение." };
  }

  const validationError = validateMessageText(text);

  if (validationError) {
    return { error: validationError };
  }

  if (!checkRateLimit(senderId)) {
    return { error: "Слишком много сообщений. Подожди немного." };
  }

  const conversation = await getPrisma().conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      buyerId: true,
      sellerId: true,
    },
  });

  if (!conversation || (conversation.buyerId !== senderId && conversation.sellerId !== senderId)) {
    return { error: "Диалог недоступен." };
  }

  await getPrisma().message.create({
    data: {
      conversationId: conversation.id,
      senderId,
      text,
    },
  });

  await getPrisma().conversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() },
  });

  revalidatePath("/messages");
  revalidatePath(`/messages/${conversation.id}`);

  return {};
}
