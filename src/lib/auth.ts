import "server-only";

import { redirect } from "next/navigation";
import { signIn, signOut, auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";
import { onboardingProfileSchema } from "@/lib/validations";
import type { AuthActionState, OnboardingActionState } from "@/lib/auth-types";
import { isValidUsername, makeUniqueUsername, normalizeUsername } from "@/lib/usernames";

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

    if (parsed.pathname.startsWith("/auth") || parsed.pathname.startsWith("/onboarding")) {
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

export async function getCurrentUser() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || !process.env.DATABASE_URL) {
    return null;
  }

  try {
    return await getPrisma().user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        name: true,
        telegramId: true,
        telegramUsername: true,
        avatarUrl: true,
        bio: true,
        city: true,
        onboardingCompleted: true,
        skippedOnboarding: true,
        preferredAuthenticity: true,
        clothingSize: true,
        shoeSize: true,
        favoriteBrands: true,
        interestTags: true,
        dealPreferences: true,
        rating: true,
        salesCount: true,
        purchasesCount: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error("[auth] failed to load current user", error instanceof Error ? error.name : "unknown");
    return null;
  }
}

export async function hasSessionCookie() {
  const session = await auth();
  return Boolean(session?.user?.id);
}

export async function signInWithGoogleAction(formData: FormData): Promise<AuthActionState> {
  const callbackUrl = getSafeCallbackUrl(formData.get("callbackUrl"));

  try {
    await signIn("google", {
      redirectTo: `/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    });
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error;
    }

    console.error("[auth] google sign-in failed", error instanceof Error ? error.name : "unknown");
    return { error: "Не получилось войти через Google. Попробуй ещё раз." };
  }

  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: "/auth" });
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

  const parsed = onboardingProfileSchema.safeParse({
    username: formData.get("username"),
    city: formData.get("city"),
    avatar: formData.get("avatar"),
    bio: formData.get("bio"),
    intent: formData.get("intent"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверь профиль" };
  }

  const username = normalizeUsername(parsed.data.username);

  if (!isValidUsername(username)) {
    return { error: "Этот ник нельзя использовать" };
  }

  const existing = await getPrisma().user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (existing && existing.id !== user.id) {
    return { error: "Этот ник уже занят" };
  }

  await getPrisma().user.update({
    where: { id: user.id },
    data: {
      username,
      city: parsed.data.city || null,
      avatarUrl: parsed.data.avatar || user.avatarUrl,
      image: parsed.data.avatar || user.avatarUrl,
      bio: parsed.data.bio || null,
      role: parsed.data.intent === "BUY" ? "USER" : "SELLER",
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

  const username =
    user.username ??
    (await makeUniqueUsername(
      user.telegramId ? `tg.${user.telegramId}` : user.email?.split("@")[0] ?? user.id,
    ));

  await getPrisma().user.update({
    where: { id: user.id },
    data: {
      username,
      onboardingCompleted: true,
      skippedOnboarding: true,
    },
  });

  redirect(callbackUrl);
}

function isNextRedirect(error: unknown) {
  return error instanceof Error && error.message === "NEXT_REDIRECT";
}
