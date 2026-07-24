import { Suspense, type ReactNode } from "react";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/footer";
import { FlashToaster } from "@/components/layout/flash-toaster";
import { Header } from "@/components/layout/header";
import { getCurrentUser } from "@/lib/auth";

export async function SiteShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const headerUser = user?.username
    ? {
        username: user.username,
        displayName:
          user.name ?? (`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username),
      }
    : null;

  return (
    <>
      <Header user={headerUser} />
      <main className="min-h-screen flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </main>
      <Footer />
      <Suspense fallback={null}>
        <FlashToaster />
      </Suspense>
      <Toaster
        theme="light"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.1)",
            color: "#111111",
          },
        }}
      />
    </>
  );
}
