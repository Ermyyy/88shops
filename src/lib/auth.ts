import "server-only";

import { randomBytes, createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import {
  authFormSchema,
  loginFormSchema,
  onboardingInterestsSchema,
  onboardingProfileSchema,
} from "@/lib/validations";
import type { AuthActionState, OnboardingActionState } from "@/lib/auth-types";

const SESSION_DAYS = 30;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 8;

type Attempt = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, Attempt>();

export function getSafeCallbackUrl(value: FormDataEntryValue | string | null | undefined) {
  const raw = typeof value === "string" ? value : "";

  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/";
  }

  try {
    const parsed = new URL(raw, "https://88shops.local");

    if (parsed.origin !== "https://88shops.local") {
      return "/";
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/";
  }
}

export function withFlash(url: string, key: string, value: string) {
  const parsed = new URL(getSafeCallbackUrl(url), "https://88shops.local");
  parsed.searchParams.set(key, value);
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return false;
  }

  current.count += 1;
  return true;
}

function getRole(intent: "BUY" | "SELL" | "BOTH") {
  return intent === "BUY" ? "USER" : "SELLER";
}

async function setSession(userId: string) {
  const db = getPrisma();
  const token = randomBytes(32).toString("base64url");
  const sessionToken = hashSessionToken(token);
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await db.session.create({
    data: {
      userId,
      sessionToken,
      expires,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await getPrisma().session.deleteMany({
      where: {
        sessionToken: hashSessionToken(token),
      },
    });
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await getPrisma().session.findUnique({
    where: {
      sessionToken: hashSessionToken(token),
    },
    include: {
      user: true,
    },
  });

  if (!session || session.expires <= new Date()) {
    await clearSession();
    return null;
  }

  const { passwordHash: _passwordHash, ...safeUser } = session.user;
  void _passwordHash;
  return safeUser;
}

export async function hasSessionCookie() {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const callbackUrl = getSafeCallbackUrl(formData.get("callbackUrl"));
  const parsed = authFormSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    intent: formData.get("intent"),
    accepted: formData.get("accepted") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Не получилось создать аккаунт" };
  }

  const data = parsed.data;
  const email = data.email.trim().toLowerCase();
  const username = data.username.trim().toLowerCase();
  const rateKey = `register:${email}`;

  if (!checkRateLimit(rateKey)) {
    return { error: "Слишком много попыток. Попробуй позже" };
  }

  const db = getPrisma();
  const existing = await db.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
    select: {
      email: true,
      username: true,
    },
  });

  if (existing?.username === username) {
    return { error: "Этот ник уже занят" };
  }

  if (existing?.email === email) {
    return { error: "Этот email уже используется" };
  }

  try {
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await db.user.create({
      data: {
        email,
        username,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        passwordHash,
        role: getRole(data.intent),
      },
      select: {
        id: true,
      },
    });

    await setSession(user.id);
  } catch {
    return { error: "Не получилось создать аккаунт" };
  }

  redirect(`/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`);
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const callbackUrl = getSafeCallbackUrl(formData.get("callbackUrl"));
  const parsed = loginFormSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Не получилось войти. Проверь данные и попробуй ещё раз" };
  }

  const identifier = parsed.data.identifier.trim().toLowerCase();

  if (!checkRateLimit(`login:${identifier}`)) {
    return { error: "Слишком много попыток. Попробуй позже" };
  }

  const user = await getPrisma().user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
    select: {
      id: true,
      passwordHash: true,
      onboardingCompleted: true,
    },
  });

  const valid =
    Boolean(user?.passwordHash) &&
    (await bcrypt.compare(parsed.data.password, user?.passwordHash ?? ""));

  if (!user || !valid) {
    return { error: "Не получилось войти. Проверь данные и попробуй ещё раз" };
  }

  await setSession(user.id);

  if (!user.onboardingCompleted) {
    redirect(`/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  redirect(callbackUrl);
}

export async function logoutAction() {
  await clearSession();
  redirect("/auth");
}

export async function completeOnboardingAction(
  _prevState: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  const user = await getCurrentUser();
  const callbackUrl = getSafeCallbackUrl(formData.get("callbackUrl"));

  if (!user) {
    redirect(`/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const profile = onboardingProfileSchema.safeParse({
    avatar: formData.get("avatar"),
    cover: formData.get("cover"),
    city: formData.get("city"),
    bio: formData.get("bio"),
    categories: formData.getAll("categories"),
    authenticityPreference: formData.get("authenticityPreference"),
  });

  const interests = onboardingInterestsSchema.safeParse({
    brands: formData.getAll("brands"),
    clothingSize: formData.get("clothingSize"),
    shoeSize: formData.get("shoeSize"),
    city: formData.get("dealCity"),
    dealMethods: formData.getAll("dealMethods"),
  });

  if (!profile.success) {
    return { error: profile.error.issues[0]?.message ?? "Проверь профиль" };
  }

  if (!interests.success) {
    return { error: interests.error.issues[0]?.message ?? "Проверь настройки каталога" };
  }

  await getPrisma().user.update({
    where: { id: user.id },
    data: {
      avatarUrl: profile.data.avatar || null,
      coverUrl: profile.data.cover || null,
      city: profile.data.city,
      bio: profile.data.bio || null,
      interestTags: profile.data.categories,
      preferredAuthenticity: profile.data.authenticityPreference,
      favoriteBrands: interests.data.brands,
      clothingSize: interests.data.clothingSize,
      shoeSize: interests.data.shoeSize,
      dealPreferences: interests.data.dealMethods,
      onboardingCompleted: true,
      skippedOnboarding: false,
    },
  });

  redirect(withFlash(callbackUrl, "profile", "ready"));
}

export async function skipOnboardingAction(formData: FormData) {
  const user = await getCurrentUser();
  const callbackUrl = getSafeCallbackUrl(formData.get("callbackUrl"));

  if (!user) {
    redirect(`/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  await getPrisma().user.update({
    where: { id: user.id },
    data: {
      onboardingCompleted: true,
      skippedOnboarding: true,
    },
  });

  redirect(callbackUrl);
}
