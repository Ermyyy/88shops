import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthFlow } from "@/features/auth/auth-flow";
import { getCurrentUser, getSafeCallbackUrl } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Аккаунт",
  description: "Вход и регистрация в 88Shops.",
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

  return <AuthFlow callbackUrl={callbackUrl} showOnboarding={Boolean(user)} />;
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
