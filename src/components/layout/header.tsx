"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LogOut, Menu, Search, UserRound, X } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { useFavoritesStore } from "@/store/favorites-store";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

export type HeaderUser = {
  username: string;
  displayName: string;
};

type HeaderProps = {
  user: HeaderUser | null;
};

const publicNavItems = [
  { href: "/catalog", label: "Каталог" },
  { href: "/shops", label: "Магазины" },
  { href: "/about", label: "О нас" },
];

const authenticatedNavItems = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/shops", label: "Магазины" },
  { href: "/deals", label: "Сделки" },
];

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const favoriteCount = useFavoritesStore((state) => state.favoriteIds.length);
  const mobileMenuOpen = useUiStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);
  const isAuthenticated = Boolean(user);
  const profileHref = user ? `/profile/${user.username}` : "/auth";
  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

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

          {isAuthenticated ? (
            <>
              <LinkButton href="/sell" size="sm">
                Выложить вещь
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
                href={profileHref}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-cream/70 transition hover:border-lime/45 hover:text-lime"
                aria-label="Мой профиль"
              >
                <UserRound aria-hidden className="h-5 w-5" />
                <span className="max-w-32 truncate">{user?.displayName}</span>
              </Link>
              <form action="/logout" method="post">
                <button
                  type="submit"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-white/10 text-cream/70 transition hover:border-lime/45 hover:text-lime"
                  aria-label="Выйти"
                >
                  <LogOut aria-hidden className="h-5 w-5" />
                </button>
              </form>
            </>
          ) : (
            <>
              <LinkButton href="/auth" variant="secondary" size="sm">
                Войти
              </LinkButton>
              <LinkButton href="/auth" size="sm">
                Создать аккаунт
              </LinkButton>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-white/10 text-cream lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? (
            <X aria-hidden className="h-5 w-5" />
          ) : (
            <Menu aria-hidden className="h-5 w-5" />
          )}
        </button>
      </div>

      <Drawer
        open={mobileMenuOpen}
        title="88Shops"
        onClose={() => setMobileMenuOpen(false)}
      >
        <div id="mobile-navigation" className="flex min-h-full flex-col gap-2">
          {(isAuthenticated
            ? [
                { href: "/", label: "Главная" },
                { href: "/catalog", label: "Каталог" },
                { href: "/shops", label: "Магазины" },
                { href: "/sell", label: "Выложить вещь" },
                { href: "/favorites", label: "Избранное" },
                { href: "/deals", label: "Сделки" },
                { href: profileHref, label: "Мой профиль" },
              ]
            : [
                { href: "/catalog", label: "Каталог" },
                { href: "/shops", label: "Магазины" },
                { href: "/about", label: "О нас" },
                { href: "/auth", label: "Войти" },
                { href: "/auth", label: "Создать аккаунт" },
              ]
          ).map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex min-h-12 items-center rounded-[8px] border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-cream/78 transition hover:border-lime/45 hover:text-lime",
                pathname === item.href && "border-lime/35 text-lime",
              )}
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <form action="/logout" method="post" className="mt-2">
              <button
                type="submit"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-cream/78 transition hover:border-lime/45 hover:text-lime"
              >
                <LogOut aria-hidden className="h-4 w-4" />
                Выйти
              </button>
            </form>
          ) : null}

          <div className="mt-auto rounded-[8px] border border-white/10 bg-black/24 p-4">
            <p className="text-sm font-semibold text-cream">88Shops</p>
            <p className="mt-2 text-sm leading-6 text-cream/58">
              Одежда, кроссовки и магазины в одном месте.
            </p>
          </div>
        </div>
      </Drawer>
    </header>
  );
}
