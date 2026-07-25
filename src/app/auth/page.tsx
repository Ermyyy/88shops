import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthFlow } from "@/features/auth/auth-flow";
import { getCurrentUser, getSafeCallbackUrl } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Войти в 88Shops",
  description: "Вход в 88Shops через Telegram OpenID Connect.",
};

type AuthPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: "Не получилось открыть вход через Telegram. Попробуй ещё раз.",
  OAuthCallbackError: "Telegram не подтвердил вход. Попробуй ещё раз.",
  AccessDenied: "Доступ через Telegram не был подтверждён.",
  Configuration: "Вход через Telegram временно недоступен. Мы уже знаем, где смотреть настройки.",
  Callback: "Не получилось завершить вход через Telegram. Попробуй ещё раз.",
  CallbackRouteError: "Не получилось завершить вход через Telegram. Попробуй ещё раз.",
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const callbackUrl = getSafeCallbackUrl(getParam(params.callbackUrl));
  const user = await getCurrentUser();

  if (user?.onboardingCompleted) {
    redirect(callbackUrl);
  }

  if (user) {
    redirect(`/onboarding?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return (
    <AuthFlow
      callbackUrl={callbackUrl}
      initialError={getAuthError(getParam(params.error))}
    />
  );
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getAuthError(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  return AUTH_ERROR_MESSAGES[value] ?? "Не получилось войти. Попробуй ещё раз.";
}
