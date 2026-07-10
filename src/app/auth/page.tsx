import type { Metadata } from "next";
import { AuthFlow } from "@/features/auth/auth-flow";

export const metadata: Metadata = {
  title: "Аккаунт",
  description:
    "Demo-интерфейс регистрации и onboarding 88Shops без production auth и внешних редиректов.",
};

export default function AuthPage() {
  return <AuthFlow />;
}
