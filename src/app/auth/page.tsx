import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthFlow } from "@/features/auth/auth-flow";
import { getCurrentUser, getSafeCallbackUrl } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Войти в 88Shops",
  description: "Вход в 88Shops через Telegram.",
};

type AuthPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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
      telegramBotUsername={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}
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

  if (["AccessDenied", "Configuration", "CallbackRouteError"].includes(value)) {
    return "Не получилось войти через Telegram. Проверь настройки бота и попробуй еще раз.";
  }

  return "Не получилось войти. Попробуй еще раз.";
}
