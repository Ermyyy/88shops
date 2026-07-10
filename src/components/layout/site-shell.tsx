import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { IntroAnimation } from "@/components/intro/intro-animation";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <IntroAnimation />
      <Header />
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
