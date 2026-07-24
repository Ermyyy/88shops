import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/features/auth/onboarding-flow";
import { getCurrentUser, getSafeCallbackUrl } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Настрой профиль",
  description: "Короткое оформление профиля 88Shops.",
};

type OnboardingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const params = await searchParams;
  const callbackUrl = getSafeCallbackUrl(getParam(params.callbackUrl));
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  if (user.onboardingCompleted) {
    redirect(callbackUrl);
  }

  return (
    <OnboardingFlow
      callbackUrl={callbackUrl}
      defaultAvatar={user.avatarUrl}
      defaultUsername={user.username ?? user.telegramUsername ?? undefined}
      defaultCity={user.city}
      defaultBio={user.bio}
    />
  );
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
