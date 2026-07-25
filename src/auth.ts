import NextAuth from "next-auth";
import type { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getPrisma } from "@/lib/prisma";
import { makeDisplayName } from "@/lib/usernames";

const TELEGRAM_ISSUER = "https://oauth.telegram.org";

type TelegramOidcProfile = {
  sub?: string;
  id?: string | number;
  name?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  picture?: string;
};

type TelegramAdapterUser = AdapterUser & {
  firstName?: string | null;
  lastName?: string | null;
  telegramId?: string | null;
  telegramUsername?: string | null;
  avatarUrl?: string | null;
};

const REDACTED_LOG_KEYS = new Set([
  "access_token",
  "client_secret",
  "code",
  "id_token",
  "password",
  "refresh_token",
]);

function getTelegramProfileId(profile: TelegramOidcProfile) {
  return String(profile.id ?? profile.sub ?? "");
}

function sanitizeForAuthLog(value: unknown, depth = 0): unknown {
  if (depth > 4) {
    return "[depth-limit]";
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
      cause: sanitizeForAuthLog(value.cause, depth + 1),
    };
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForAuthLog(item, depth + 1));
  }

  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        REDACTED_LOG_KEYS.has(key.toLowerCase())
          ? "[redacted]"
          : sanitizeForAuthLog(item, depth + 1),
      ]),
    );
  }

  return value;
}

function logAuthError(error: Error, metadata?: unknown) {
  console.error("[auth][error]", {
    error: sanitizeForAuthLog(error),
    name: error.name,
    message: error.message,
    stack: error.stack,
    cause: sanitizeForAuthLog(error.cause),
    metadata: sanitizeForAuthLog(metadata),
  });
}

function toPrismaAdapterAccount(data: AdapterAccount): AdapterAccount {
  return {
    access_token: data.access_token,
    expires_at: data.expires_at,
    id_token: data.id_token,
    provider: data.provider,
    providerAccountId: data.providerAccountId,
    refresh_token: data.refresh_token,
    scope: data.scope,
    session_state: data.session_state,
    token_type: data.token_type,
    type: data.type,
    userId: data.userId,
  };
}

function mapTelegramProfile(profile: TelegramOidcProfile) {
  const telegramId = getTelegramProfileId(profile);
  const firstName = profile.given_name ?? null;
  const lastName = profile.family_name ?? null;
  const username = profile.preferred_username ?? null;
  const name =
    profile.name ??
    makeDisplayName({
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
      username: username ?? undefined,
    });

  return {
    id: telegramId,
    name,
    image: profile.picture ?? null,
    firstName,
    lastName,
    telegramId,
    telegramUsername: username,
    avatarUrl: profile.picture ?? null,
  };
}

function getAdapter() {
  if (!process.env.DATABASE_URL) {
    return undefined;
  }

  const prisma = getPrisma();
  const adapter = PrismaAdapter(prisma as never) as Adapter;

  return {
    ...adapter,
    async createUser(user) {
      const telegramUser = user as TelegramAdapterUser;
      const telegramId = telegramUser.telegramId;

      if (telegramId) {
        const existing = await prisma.user.findUnique({
          where: { telegramId },
        });

        if (existing) {
          return prisma.user.update({
            where: { id: existing.id },
            data: {
              name: telegramUser.name ?? existing.name,
              image: telegramUser.image ?? existing.image,
              avatarUrl: telegramUser.avatarUrl ?? existing.avatarUrl,
              firstName: telegramUser.firstName ?? existing.firstName,
              lastName: telegramUser.lastName ?? existing.lastName,
              telegramUsername: telegramUser.telegramUsername ?? existing.telegramUsername,
            },
          }) as Promise<AdapterUser>;
        }
      }

      return adapter.createUser?.(user) as Promise<AdapterUser>;
    },
    linkAccount(account) {
      return adapter.linkAccount?.(toPrismaAdapterAccount(account));
    },
  } satisfies Adapter;
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
    {
      id: "telegram",
      name: "Telegram",
      type: "oidc",
      issuer: TELEGRAM_ISSUER,
      jwks_endpoint: `${TELEGRAM_ISSUER}/.well-known/jwks.json`,
      wellKnown: `${TELEGRAM_ISSUER}/.well-known/openid-configuration`,
      authorization: {
        url: `${TELEGRAM_ISSUER}/auth`,
        params: {
          scope: "openid profile telegram:bot_access",
          response_type: "code",
        },
      },
      token: `${TELEGRAM_ISSUER}/token`,
      checks: ["pkce"],
      idToken: true,
      clientId: process.env.TELEGRAM_CLIENT_ID,
      clientSecret: process.env.TELEGRAM_CLIENT_SECRET,
      profile(profile: TelegramOidcProfile) {
        return mapTelegramProfile(profile);
      },
    },
  ],
  events: {
    async signIn({ user, profile, account }) {
      try {
        if (account?.provider !== "telegram" || !profile || !user.id) {
          return;
        }

        const telegramProfile = profile as TelegramOidcProfile;
        const telegramId = getTelegramProfileId(telegramProfile);

        if (!telegramId) {
          return;
        }

        const firstName = telegramProfile.given_name ?? null;
        const lastName = telegramProfile.family_name ?? null;
        const telegramUsername = telegramProfile.preferred_username ?? null;
        const displayName =
          telegramProfile.name ??
          makeDisplayName({
            firstName: firstName ?? undefined,
            lastName: lastName ?? undefined,
            username: telegramUsername ?? undefined,
          });

        await getPrisma().user.update({
          where: { id: user.id },
          data: {
            telegramId,
            telegramUsername,
            firstName,
            lastName,
            name: displayName,
            image: telegramProfile.picture ?? null,
            avatarUrl: telegramProfile.picture ?? null,
          },
        });
      } catch (error) {
        logAuthError(error instanceof Error ? error : new Error(String(error)), {
          stage: "events.signIn",
          provider: account?.provider,
          userId: user.id,
        });
      }
    },
  },
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
      if (url.startsWith("/") && !url.startsWith("//")) {
        return `${baseUrl}${url}`;
      }

      try {
        const parsed = new URL(url);
        return parsed.origin === baseUrl ? url : `${baseUrl}/catalog`;
      } catch {
        return `${baseUrl}/catalog`;
      }
    },
  },
  logger: {
    error(error) {
      logAuthError(error);
    },
    debug(message, metadata) {
      if (process.env.AUTH_DEBUG === "true") {
        console.log("[auth][debug]", message, sanitizeForAuthLog(metadata));
      }
    },
  },
}));
