import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getPrisma } from "@/lib/prisma";
import {
  verifyTelegramLoginWidgetData,
  verifyTelegramMiniAppInitData,
  type VerifiedTelegramUser,
} from "@/lib/telegram-auth";
import { makeDisplayName } from "@/lib/usernames";

function getAdapter() {
  if (!process.env.DATABASE_URL) {
    return undefined;
  }

  return PrismaAdapter(getPrisma() as never);
}

async function upsertTelegramUser(telegramUser: VerifiedTelegramUser) {
  const db = getPrisma();
  const displayName = makeDisplayName({
    firstName: telegramUser.firstName,
    lastName: telegramUser.lastName,
    username: telegramUser.username,
  });

  const user = await db.user.upsert({
    where: { telegramId: telegramUser.id },
    update: {
      telegramUsername: telegramUser.username,
      firstName: telegramUser.firstName,
      lastName: telegramUser.lastName,
      name: displayName,
      image: telegramUser.avatarUrl,
      avatarUrl: telegramUser.avatarUrl,
    },
    create: {
      telegramId: telegramUser.id,
      telegramUsername: telegramUser.username,
      firstName: telegramUser.firstName,
      lastName: telegramUser.lastName,
      name: displayName,
      image: telegramUser.avatarUrl,
      avatarUrl: telegramUser.avatarUrl,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
    },
  });

  await db.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: "telegram",
        providerAccountId: telegramUser.id,
      },
    },
    update: {
      userId: user.id,
    },
    create: {
      userId: user.id,
      type: "credentials",
      provider: "telegram",
      providerAccountId: telegramUser.id,
    },
  });

  return user;
}

function parseLoginWidgetPayload(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).map(([key, item]) => [key, item == null ? undefined : String(item)]),
    );
  } catch {
    return null;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(() => ({
  adapter: getAdapter(),
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  providers: [
    Credentials({
      id: "telegram",
      name: "Telegram",
      credentials: {
        initData: {},
        loginData: {},
      },
      async authorize(credentials) {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;

        if (!botToken || !process.env.DATABASE_URL) {
          return null;
        }

        const initData = typeof credentials.initData === "string" ? credentials.initData : "";
        const loginData = parseLoginWidgetPayload(credentials.loginData);
        const telegramUser = initData
          ? verifyTelegramMiniAppInitData(initData, botToken)
          : loginData
            ? verifyTelegramLoginWidgetData(loginData, botToken)
            : null;

        if (!telegramUser) {
          return null;
        }

        const user = await upsertTelegramUser(telegramUser);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async signIn() {
      if (!process.env.DATABASE_URL) {
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      const parsed = new URL(url);
      return parsed.origin === baseUrl ? url : baseUrl;
    },
  },
  logger: {
    error(error) {
      console.error("[auth]", error.name);
    },
  },
}));
