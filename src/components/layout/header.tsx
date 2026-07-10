"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, UserRound, X } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { useFavoritesStore } from "@/store/favorites-store";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/catalog", label: "Каталог" },
  { href: "/shops", label: "Магазины" },
  { href: "/about", label: "О нас" },
];

export function Header() {
  const pathname = usePathname();
  const favoriteCount = useFavoritesStore((state) => state.favoriteIds.length);
  const mobileMenuOpen = useUiStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-night/78 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="group inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-lime/40 bg-lime text-sm font-black text-black">
              88
            </span>
            <span className="text-lg font-semibold tracking-tight text-cream transition group-hover:text-lime">
              88Shops
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Главная навигация">
            {navItems.map((item) => {
              const active =
                pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-[8px] px-4 py-2 text-sm font-semibold text-cream/58 transition hover:bg-white/[0.06] hover:text-cream",
                    active && "bg-white/[0.08] text-lime",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/catalog"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-white/10 text-cream/70 transition hover:border-lime/45 hover:text-lime"
            aria-label="Поиск в каталоге"
          >
            <Search aria-hidden className="h-5 w-5" />
          </Link>
          <LinkButton href="/sell" size="sm">
            Выложить объявление
          </LinkButton>
          <Link
            href="/favorites"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-white/10 text-cream/70 transition hover:border-lime/45 hover:text-lime"
            aria-label="Избранное"
          >
            <Heart aria-hidden className="h-5 w-5" />
            {favoriteCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-lime px-1 text-[10px] font-bold text-black">
                {favoriteCount}
              </span>
            ) : null}
          </Link>
          <Link
            href="/profile/alina.archive"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-cream/70 transition hover:border-lime/45 hover:text-lime"
            aria-label="Профиль"
          >
            <UserRound aria-hidden className="h-5 w-5" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-white/10 text-cream lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Открыть меню"
        >
          <Menu aria-hidden className="h-5 w-5" />
        </button>
      </div>

      <Drawer
        open={mobileMenuOpen}
        title="Навигация"
        onClose={() => setMobileMenuOpen(false)}
      >
        <div className="flex flex-col gap-2">
          {[...navItems, { href: "/premium", label: "Premium" }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-[8px] border border-white/10 px-4 py-3 text-sm font-semibold text-cream/75"
            >
              {item.label}
            </Link>
          ))}
          <LinkButton
            href="/sell"
            className="mt-3 w-full"
            onClick={() => setMobileMenuOpen(false)}
          >
            Выложить объявление
          </LinkButton>
          <Link
            href="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-white/10 text-sm font-semibold text-cream"
          >
            <Heart aria-hidden className="h-4 w-4" />
            Избранное
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] text-sm font-semibold text-cream/55"
          >
            <X aria-hidden className="h-4 w-4" />
            Закрыть
          </button>
        </div>
      </Drawer>
    </header>
  );
}
