import "server-only";

import { getPrisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getCurrentUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

function getDisplayName(user: {
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  id: string;
}) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return user.name ?? (fullName || user.username) ?? "Пользователь 88Shops";
}

export async function getConversationList(userId: string) {
  const conversations = await getPrisma().conversation.findMany({
    where: {
      OR: [{ buyerId: userId }, { sellerId: userId }],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      buyer: true,
      seller: true,
      product: {
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: {
        select: {
          messages: {
            where: {
              senderId: { not: userId },
              readAt: null,
              deletedAt: null,
            },
          },
        },
      },
    },
  });

  return conversations.map((conversation) => {
    const companion = conversation.buyerId === userId ? conversation.seller : conversation.buyer;
    const lastMessage = conversation.messages[0];

    return {
      id: conversation.id,
      productId: conversation.productId,
      productTitle: conversation.product.title,
      productImageAlt: conversation.product.images[0]?.alt ?? conversation.product.title,
      companionName: getDisplayName(companion),
      lastMessageText: lastMessage?.deletedAt ? "Сообщение удалено" : lastMessage?.text ?? "Диалог создан",
      lastMessageAt: (lastMessage?.createdAt ?? conversation.updatedAt).toISOString(),
      unreadCount: conversation._count.messages,
    };
  });
}

export async function getConversationPageData(conversationId: string, userId: string) {
  const conversation = await getPrisma().conversation.findUnique({
    where: { id: conversationId },
    include: {
      buyer: true,
      seller: true,
      product: {
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
        },
      },
      messages: {
        where: { deletedAt: null },
        orderBy: { createdAt: "asc" },
        include: { sender: true },
      },
    },
  });

  if (!conversation || (conversation.buyerId !== userId && conversation.sellerId !== userId)) {
    return null;
  }

  await getPrisma().message.updateMany({
    where: {
      conversationId: conversation.id,
      senderId: { not: userId },
      readAt: null,
      deletedAt: null,
    },
    data: { readAt: new Date() },
  });

  const companion = conversation.buyerId === userId ? conversation.seller : conversation.buyer;

  return {
    id: conversation.id,
    product: {
      id: conversation.product.id,
      title: conversation.product.title,
      priceKopecks: conversation.product.priceKopecks,
      imageAlt: conversation.product.images[0]?.alt ?? conversation.product.title,
    },
    companion: {
      id: companion.id,
      name: getDisplayName(companion),
      username: companion.username ?? companion.id,
    },
    messages: conversation.messages.map((message) => ({
      id: message.id,
      text: message.text,
      senderId: message.senderId,
      senderName: getDisplayName(message.sender),
      createdAt: message.createdAt.toISOString(),
      readAt: message.readAt?.toISOString(),
      own: message.senderId === userId,
    })),
  };
}
