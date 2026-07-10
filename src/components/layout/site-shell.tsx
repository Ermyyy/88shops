import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { IntroAnimation } from "@/components/intro/intro-animation";
import { getCurrentUser } from "@/lib/auth";

export async function SiteShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const headerUser = user
    ? {
        username: user.username,
        displayName: `${user.firstName} ${user.lastName}`.trim() || user.username,
      }
    : null;

  return (
    <>
      <IntroAnimation />
      <Header user={headerUser} />
      <main className="min-h-screen flex-1">{children}</main>
      <Footer />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#111111",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#F4F0E8",
          },
        }}
      />
    </>
  );
}
