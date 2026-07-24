# PROJECT_STRUCTURE.md

Документация составлена после чтения структуры проекта 88Shops без изменения исходного кода. Проект сейчас выглядит как frontend-first MVP fashion resale marketplace на Next.js App Router: основной пользовательский UX работает на моковых данных, а слой авторизации, Prisma-схема и заготовки платежей уже заложены для подключения настоящего backend.

## 1. Краткая карта проекта

- `src/app` - маршруты Next.js App Router, страницы, route handlers, глобальные layout/error/loading/not-found.
- `src/components` - переиспользуемые UI, layout, home, catalog, product, shop-компоненты.
- `src/features` - более крупные клиентские фичи: auth/onboarding, catalog, favorites, profile customization, payment abstraction.
- `src/lib` - серверные и общие утилиты: Auth.js/NextAuth helper-слой, Prisma client, Telegram verification, username logic, mock-data, constants, validations.
- `src/store` - Zustand-хранилища для UI drawer/menu и избранного в `localStorage`.
- `src/types` - TypeScript-типы домена и расширение NextAuth session.
- `prisma` - Prisma schema, миграции и конфигурация генерации клиента.
- `rules` - внутренние правила проекта по auth/security/payments/frontend/database/git/ui.
- `public` - стандартные статические SVG-ассеты.
- корневые config-файлы - Next, TypeScript, ESLint, PostCSS/Tailwind, Prisma, Docker Compose, env example.

## 2. Стек и ключевые зависимости

- Framework: `next@16.2.10`, React `19.2.4`, App Router.
- Styling: Tailwind CSS 4 через `postcss.config.mjs` и `src/app/globals.css`.
- Auth: `next-auth@5 beta`, `@auth/prisma-adapter`, Google provider, custom Telegram credentials provider.
- Database: Prisma 7, generated client in `src/generated/prisma`, PostgreSQL через `pg` и `@prisma/adapter-pg`.
- Forms/validation: `react-hook-form`, `@hookform/resolvers`, `zod`.
- Client state: `zustand`.
- UI support: `lucide-react`, `sonner`, `tailwind-merge`, `clsx`, `react-dropzone`.

## 3. Маршруты страниц

| Route | Файл | Назначение | Данные/зависимости | Auth/права |
|---|---|---|---|---|
| `/` | `src/app/page.tsx` | Главная витрина: hero, категории, свежие и популярные товары, магазины, CTA продажи. | `products`, `shops` из `src/lib/mock-data.ts`; `HeroSection`, `CategoryStrip`, `ProductCard`, `ShopCard`. | Публичная. |
| `/catalog` | `src/app/catalog/page.tsx` + `src/features/catalog/catalog-client.tsx` | Каталог товаров с фильтрами, сортировкой, mobile drawer. | `products`, `hasSessionCookie`, `FilterPanel`, `ProductCard`, Zustand UI store. | Публичная по middleware; наличие cookie передается для действий избранного. |
| `/product/[id]` | `src/app/product/[id]/page.tsx` | Карточка товара: галерея, цена, продавец/магазин, способы сделки, отзывы, похожие товары. | `mock-data` selectors, `ProductGallery`, `ProductActions`, `DealMethodCard`, `Rating`, `ProductCard`. | Публичная; действия сообщения/избранного редиректят на `/auth`, если нет session cookie. |
| `/sell` | `src/app/sell/page.tsx` | Форма размещения объявления. | `SellForm`, `sellFormSchema`, `react-dropzone`, `react-hook-form`. | Защищена middleware, так как не входит в public prefixes. Реального сохранения в БД нет. |
| `/favorites` | `src/app/favorites/page.tsx` | Избранные товары пользователя. | `FavoritesClient`, `useFavoritesStore`, `products`. | Защищена middleware. Данные локальные в браузере. |
| `/messages` | `src/app/messages/page.tsx` | Заглушка будущих сообщений. | UI-компоненты, `LinkButton`. | Защищена middleware. Backend сообщений отсутствует. |
| `/deals` | `src/app/deals/page.tsx` | Список сделок, демонстрация будущей структуры safe deal. | `deals`, `getProductById`, `getUserById`, `StatusBadge`, `Price`. | Защищена middleware. Данные моковые. |
| `/deals/[id]` | `src/app/deals/[id]/page.tsx` | Детальная страница сделки с timeline статусов и участниками. | `getDealById`, `DEAL_STATUSES`, `StatusBadge`, `SafeImage`. | Защищена middleware. Оплата отключена. |
| `/shops` | `src/app/shops/page.tsx` | Директория магазинов. | `ShopsDirectory`, `shops`. | Публичная. |
| `/shops/[slug]` | `src/app/shops/[slug]/page.tsx` | Витрина магазина: cover, товары, отзывы, about. | `getShopBySlug`, `getProductsByShop`, `ShopActions`, `Tabs`, `ProductCard`. | Публичная; follow/message требуют auth на клиенте. |
| `/profile/[username]` | `src/app/profile/[username]/page.tsx` | Публичный профиль пользователя: витрина, отзывы, кастомизация. | `getUserByUsername`, `getProductsBySeller`, `ProfileCustomization`, `Tabs`. | Защищена middleware сейчас, потому что `/profile` не public prefix. По UX выглядит как публичный профиль. |
| `/auth` | `src/app/auth/page.tsx` | Страница входа через Telegram или Google. | `getCurrentUser`, `getSafeCallbackUrl`, `AuthFlow`, env `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`. | Публичная. Уже авторизованный пользователь уходит на onboarding или callback. |
| `/onboarding` | `src/app/onboarding/page.tsx` | Дозаполнение профиля после входа. | `getCurrentUser`, `OnboardingFlow`, server actions. | Требует текущего пользователя, иначе redirect на `/auth`. |
| `/logout` | `src/app/logout/route.ts` | POST logout endpoint. | `logoutAction`. | Серверный logout через Auth.js. |
| `/legit-check` | `src/app/legit-check/page.tsx` | Заготовка проверки вещи. | `LegitCheckForm`, `legitCheckSchema`. | Защищена middleware. Отправка отключена. |
| `/premium` | `src/app/premium/page.tsx` | Заготовка premium-планов. | Static UI. | Защищена middleware. |
| `/about` | `src/app/about/page.tsx` | Описание сервиса и будущих возможностей. | Static UI, `Badge`, icons. | Публичная. |

Системные страницы:

- `src/app/layout.tsx` - root layout, metadata, шрифты, подключает `SiteShell`.
- `src/app/globals.css` - Tailwind 4 import, CSS variables, базовая тема и utility-классы (`page-shell`, `market-card`, `surface`, line-clamp).
- `src/app/loading.tsx` - глобальный loading UI.
- `src/app/error.tsx` - client error boundary.
- `src/app/not-found.tsx` - 404.
- `src/app/favicon.ico` - favicon.

## 4. API и route handlers

| API route | Файл | Назначение | Зависимости |
|---|---|---|---|
| `/api/auth/[...nextauth]` | `src/app/api/auth/[...nextauth]/route.ts` | Делегирует GET/POST в Auth.js config. | `GET`, `POST` из `src/auth.ts`. |
| `/api/auth/telegram` | `src/app/api/auth/telegram/route.ts` | Custom Telegram login endpoint: POST для Mini App/Login Widget, GET для widget callback. | `signIn` из `@/auth`, `getSafeCallbackUrl`, Telegram payload, in-memory rate limit по IP. |
| `/logout` | `src/app/logout/route.ts` | POST route для выхода. | `logoutAction` из `src/lib/auth-actions.ts`. |

Полноценных CRUD API для товаров, магазинов, сделок, сообщений, избранного и платежей пока нет. Эти сценарии либо моковые, либо клиентские, либо помечены как будущие.

## 5. Авторизация

Главная конфигурация авторизации находится в `src/auth.ts`.

Что делает:

- настраивает NextAuth/Auth.js v5;
- подключает `PrismaAdapter` только если есть `DATABASE_URL`;
- подключает Google provider через `AUTH_GOOGLE_ID` и `AUTH_GOOGLE_SECRET`;
- подключает credentials provider `telegram`;
- использует JWT session strategy;
- синхронизирует Google-профиль в Prisma;
- создает/обновляет Telegram-пользователя и `Account`;
- прокидывает `session.user.id` из JWT `sub`;
- ограничивает redirect внутренними URL.

Связанные файлы:

- `src/lib/auth.ts` - server-only helper layer: `getCurrentUser`, `hasSessionCookie`, Google sign-in action, logout, complete/skip onboarding, safe callback URL.
- `src/lib/auth-actions.ts` - `"use server"` wrappers, которые можно импортировать в client components.
- `src/lib/auth-types.ts` - типы состояний server actions.
- `src/types/next-auth.d.ts` - расширяет `Session.user.id`.
- `src/app/auth/page.tsx` и `src/features/auth/auth-flow.tsx` - UI входа.
- `src/app/onboarding/page.tsx` и `src/features/auth/onboarding-flow.tsx` - UI завершения профиля.
- `middleware.ts` - edge-level защита приватных маршрутов по наличию auth cookie.

Где хранится логика пользователя:

- persistent user model - `User` в `prisma/schema.prisma`;
- чтение текущего пользователя - `getCurrentUser()` в `src/lib/auth.ts`;
- onboarding/profile update - `completeOnboardingAction()` и `skipOnboardingAction()` в `src/lib/auth.ts`;
- username validation/uniqueness - `src/lib/usernames.ts`;
- mock user profiles для frontend-first страниц - `users` в `src/lib/mock-data.ts`;
- профильная кастомизация UI - `src/features/profile/profile-customization.tsx` и модели `Badge`, `UserBadge`, `UserCustomization` в Prisma.

## 6. Проверка прав доступа

Сейчас права проверяются на нескольких уровнях:

- `middleware.ts` - базовая защита приватных маршрутов по cookie. Публичные prefix: `/auth`, `/catalog`, `/product`, `/shops`, `/about`. Также пропускаются `_next`, `api`, static assets и пути с точкой.
- `src/app/onboarding/page.tsx` - серверно требует `getCurrentUser()`, иначе redirect на `/auth`.
- `src/app/auth/page.tsx` - серверно перенаправляет уже вошедших пользователей.
- `src/components/product/product-actions.tsx` и `src/components/shops/shop-actions.tsx` - клиентские guard-действия: если нет auth, отправляют на `/auth?callbackUrl=...`.
- `src/lib/auth.ts` - server actions повторно проверяют текущего пользователя перед изменением onboarding-полей.

Важно: middleware сейчас проверяет только наличие cookie, а не валидность сессии в БД. Для критичных действий нужна серверная проверка через `auth()`/`getCurrentUser()` внутри action/API.

## 7. Prisma и база данных

Prisma находится здесь:

- `prisma/schema.prisma` - главная схема моделей и enum.
- `prisma/migrations/*` - SQL-миграции.
- `prisma.config.ts` - путь к schema/migrations и `DATABASE_URL`.
- `src/lib/prisma.ts` - ленивое создание Prisma client через `PrismaPg` adapter; в dev кешируется в `globalThis.prisma`.
- `src/generated/prisma` - сгенерированный клиент, указан в schema как output. Папка generated не входит в основной исходный список, но используется импортами.

Модели БД:

- Auth.js compatible: `User`, `Account`, `Session`.
- Marketplace: `Shop`, `Product`, `ProductImage`, `Favorite`, `Review`, `Deal`.
- Геймификация/кастомизация: `Badge`, `UserBadge`, `UserCustomization`.

Enums:

- `AuthenticityType` - `ORIGINAL`, `REPLICA`.
- `ProductCondition` - состояния товара.
- `ProductStatus` - draft/active/reserved/sold/archived.
- `DealMethod` - personal meeting/direct/safe deal.
- `DealStatus` - lifecycle сделки.
- `UserRole` - user/seller/shop owner/admin.
- `AuthenticityPreference` - preference для пользователя.

Docker:

- `compose.yaml` поднимает PostgreSQL 16 на host-порту `5433`, БД `shops88`, user/pass `shops88`/`shops88_password`.

## 8. Env-переменные

Пример находится в `.env.example`:

- `DATABASE_URL` - PostgreSQL connection string для Prisma/Auth adapter. Без нее `getPrisma()` бросит ошибку, а Auth adapter не подключится.
- `AUTH_SECRET` - секрет Auth.js.
- `AUTH_GOOGLE_ID` - Google OAuth client id.
- `AUTH_GOOGLE_SECRET` - Google OAuth client secret.
- `TELEGRAM_BOT_TOKEN` - токен Telegram bot для проверки подписи.
- `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` - публичный username Telegram bot для Login Widget.

Где используются:

- `DATABASE_URL` - `src/lib/prisma.ts`, `src/auth.ts`, `src/lib/auth.ts`, `prisma.config.ts`.
- `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` - `src/auth.ts`.
- `TELEGRAM_BOT_TOKEN` - `src/lib/telegram-auth.ts`.
- `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` - `src/app/auth/page.tsx` -> `AuthFlow`.

## 9. Telegram Auth

Telegram-логика находится в:

- `src/lib/telegram-auth.ts` - проверяет Telegram Mini App `initData` и Login Widget payload через HMAC SHA-256, max age 24 часа, `timingSafeEqual`.
- `src/app/api/auth/telegram/route.ts` - принимает POST/GET, валидирует callback URL, вызывает `signIn("telegram")`, возвращает redirect URL или ошибку.
- `src/auth.ts` - credentials provider `telegram`, парсинг login widget, upsert пользователя и account.
- `src/features/auth/auth-flow.tsx` - client UI: Telegram WebApp `initData`, fallback на Telegram Login Widget script.

Идентификатор Telegram для постоянной связки - `telegramId`, не `telegramUsername`.

## 10. Google Auth

Google OAuth находится в:

- `src/auth.ts` - `Google(...)` provider, credentials берутся из env.
- `src/lib/auth.ts` - `signInWithGoogleAction()` вызывает `signIn("google")`.
- `src/features/auth/auth-flow.tsx` - форма с server action для Google.

После входа `syncGoogleProfile()` обновляет имя, avatar/image, emailVerified и частично first/last name пользователя в Prisma.

## 11. Платежи и безопасная сделка

Платежная интеграция не подключена.

Где это видно:

- `src/features/deals/payment-provider.ts` - только TypeScript-интерфейс `PaymentProvider` и типы результата/статуса. В комментариях явно указано, что финансовые статусы должен менять только сервер после webhook/signature/access/rate-limit проверок.
- `src/app/deals/page.tsx` и `src/app/deals/[id]/page.tsx` - показывают mock-сделки и disabled payment buttons.
- `src/app/product/[id]/page.tsx` - safe deal показывается как будущий сценарий.
- `rules/payments.md` - запрещает подключать реальные платежи, QR, СБП, хранение карт и клиентское подтверждение оплаты до настоящей интеграции.

## 12. Данные и mock layer

`src/lib/mock-data.ts` сейчас является основным data source для frontend страниц.

Содержит:

- `users`, `shops`, `products`, `reviews`, `deals`;
- helper-функции `getUserById`, `getUserByUsername`, `getShopById`, `getShopBySlug`, `getProductById`, `getDealById`, `getProductsByShop`, `getProductsBySeller`, `getRelatedProducts`, `getReviewsForShop`, `getReviewsForUser`, `getSellerForProduct`.

Кто использует:

- главная, каталог, карточки товара, магазины, профили, сделки, избранное.

Важно: mock layer по типам близок к `src/types/index.ts`, но не является Prisma-запросами. При backend-интеграции эти selectors нужно заменить server-side репозиториями/API.

## 13. Папки и важные файлы

### Корень проекта

- `package.json` - scripts, runtime/dev dependencies. Build запускает `prisma generate && next build`.
- `package-lock.json` - lockfile npm.
- `next.config.ts` - Turbopack root и remote pattern для Unsplash images.
- `tsconfig.json` - strict TypeScript, alias `@/* -> ./src/*`, Next plugin.
- `eslint.config.mjs` - ESLint configuration.
- `postcss.config.mjs` - PostCSS/Tailwind config.
- `prisma.config.ts` - Prisma CLI config.
- `compose.yaml` - локальный PostgreSQL.
- `.env.example` - список обязательных env.
- `README.md` - стандартный README от create-next-app, пока не отражает реальную архитектуру 88Shops.
- `AGENTS.md` - локальная инструкция читать docs Next.js из `node_modules/next/dist/docs`.
- `CLAUDE.md` - дополнительный проектный контекст/инструкции, если используется внешним агентом.
- `PROJECT_STRUCTURE.md` - этот документ.

### `src/app`

Отвечает за маршрутизацию App Router. Все `page.tsx` являются route entrypoints. В Next 16 `params` и `searchParams` используются как Promise, что уже соблюдается в динамических страницах и страницах с query.

Важные файлы описаны в разделе маршрутов. Главные зависимости: `src/components`, `src/features`, `src/lib/mock-data.ts`, `src/lib/auth.ts`.

### `src/app/api`

API route handlers:

- `auth/[...nextauth]/route.ts` - Auth.js catch-all.
- `auth/telegram/route.ts` - Telegram login endpoint.

### `src/components/layout`

- `site-shell.tsx` - server wrapper вокруг всего приложения: получает текущего пользователя и рендерит Header/Footer/Toaster.
- `header.tsx` - client header, desktop/mobile navigation, auth-aware ссылки, mobile drawer, bottom nav.
- `footer.tsx` - footer с навигационными колонками.
- `flash-toaster.tsx` - client toast по query param `profile=ready`.

Используется root layout. Зависимости: `getCurrentUser`, Zustand stores, UI buttons/drawer/avatar.

### `src/components/home`

- `hero-section.tsx` - поисковый hero с query/city формой.
- `category-strip.tsx` - быстрые ссылки по категориям.
- `benefits-grid.tsx` - преимущества сервиса.
- `seller-cta.tsx` - CTA для продавцов.

Используется на `/`.

### `src/components/catalog`

- `filter-panel.tsx` - controlled filter UI и `emptyFilters`.

Используется `CatalogClient`. Зависимости: constants, Input, Select, Button, типы `CatalogFilters`.

### `src/components/product`

- `sell-form.tsx` - client form размещения объявления, react-hook-form + Zod + dropzone, без backend save.
- `product-gallery.tsx` - client image gallery для карточки товара.
- `product-actions.tsx` - client actions "написать" и "в избранное", auth-aware redirect.
- `legit-check-form.tsx` - client form будущей проверки вещи, Zod + dropzone, отправка disabled.

### `src/components/shops`

- `shops-directory.tsx` - client сортировка магазинов.
- `shop-actions.tsx` - client follow/message actions, redirect на auth если нет session.

### `src/components/ui`

Локальный UI-kit:

- `avatar.tsx` - avatar with frames.
- `badge.tsx` - статусные/акцентные бейджи.
- `button.tsx` - `Button` и `LinkButton`.
- `deal-method-card.tsx` - карточка способа сделки.
- `drawer.tsx` - mobile drawer.
- `empty-state.tsx` - пустые состояния.
- `favorite-button.tsx` - кнопка избранного, использует `useFavoritesStore`.
- `input.tsx` - styled input.
- `modal-dialog.tsx` - modal dialog.
- `price.tsx` - форматированный price display.
- `product-card.tsx` - карточка товара для сеток.
- `rating.tsx` - рейтинг.
- `safe-image.tsx` - wrapper над `next/image` с fallback/error state.
- `section-heading.tsx` - заголовки секций.
- `select.tsx` - styled select.
- `shop-card.tsx` - карточка магазина.
- `skeleton.tsx` - skeleton.
- `status-badge.tsx` - badge по `DealStatus`.
- `tabs.tsx` - client tabs.

### `src/features/auth`

- `auth-flow.tsx` - client UI входа: Telegram Mini App/Login Widget и Google form action.
- `onboarding-flow.tsx` - client UI завершения профиля, вызывает server actions.

Используется `/auth` и `/onboarding`.

### `src/features/catalog`

- `catalog-client.tsx` - client фильтрация и сортировка моковых товаров; управляет responsive layout и filter drawer.

Используется `/catalog`.

### `src/features/favorites`

- `favorites-client.tsx` - client список избранного по persisted Zustand ids.

Используется `/favorites`.

### `src/features/profile`

- `profile-customization.tsx` - client preview будущей кастомизации профиля/88 Coins. Состояние локальное, сохранения нет.

Используется tab "Оформление" на `/profile/[username]`.

### `src/features/deals`

- `payment-provider.ts` - контракт будущей платежной интеграции. Не используется как реальная интеграция.

### `src/lib`

- `auth.ts` - server-only auth helpers/actions и user onboarding logic.
- `auth-actions.ts` - server action exports для client imports.
- `auth-types.ts` - типы состояний actions.
- `prisma.ts` - Prisma client factory/cache.
- `telegram-auth.ts` - Telegram signature verification.
- `usernames.ts` - username normalize/validate/reserved/unique generation.
- `validations.ts` - Zod-схемы форм продажи, onboarding, interests, legit check.
- `constants.ts` - бренды, категории, города, размеры, labels, deal statuses.
- `mock-data.ts` - моковые данные и selectors.
- `utils.ts` - `cn`, format price/date, size formatting, safe deal commission, search normalization.

### `src/store`

- `ui-store.ts` - Zustand state для mobile menu и catalog filter drawer.
- `favorites-store.ts` - Zustand persisted state `88shops:favorites` в `localStorage`.

### `src/types`

- `index.ts` - доменные TypeScript-типы, используемые mock layer и UI.
- `next-auth.d.ts` - module augmentation для `Session.user.id`.

### `prisma`

- `schema.prisma` - модели/enum/generator/datasource.
- `migrations/20260710143011_init/migration.sql` - начальная marketplace-схема.
- `migrations/20260710152708_auth_and_onboarding/migration.sql` - auth/onboarding изменения.
- `migrations/20260721120000_oauth_and_telegram_auth/migration.sql` - OAuth/Telegram изменения.
- `migrations/migration_lock.toml` - lock provider.

### `rules`

- `main.md` - общие правила: название 88Shops, читать текущую реализацию, маленькие изменения, UTF-8, проверки после изменений.
- `auth.md` - правила auth, server sessions, Telegram ID, запрет хранения паролей на клиенте.
- `security.md` - Zod, server-side access checks, secrets, uploads, rate limiting.
- `payments.md` - платежи только как "скоро", без реальной финансовой интеграции.
- `frontend.md`, `ui.md`, `database.md`, `git.md` - дополнительные правила по соответствующим областям.

### `public`

Стандартные SVG-иконки Next/Vercel (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`). Бизнес-ассеты 88Shops пока берутся через Unsplash URLs в mock-data.

## 14. Основные потоки данных

Главная/каталог:

1. `src/app/page.tsx` или `src/app/catalog/page.tsx`.
2. Данные из `src/lib/mock-data.ts`.
3. UI cards из `src/components/ui`.
4. Client filters/sort в `CatalogClient`.

Товар:

1. `/product/[id]` получает `id`.
2. `getProductById()` ищет моковый товар.
3. `getSellerForProduct()` выбирает магазин или пользователя.
4. Страница собирает галерею, seller card, deal methods, reviews, related.
5. `ProductActions` проверяет `isAuthenticated` и либо показывает toast/избранное, либо редиректит на auth.

Auth:

1. `/auth` получает safe `callbackUrl`.
2. `AuthFlow` запускает Telegram или Google.
3. Telegram идет через `/api/auth/telegram` -> `signIn("telegram")` -> `src/auth.ts`.
4. Google идет через server action -> `signIn("google")` -> callbacks in `src/auth.ts`.
5. Пользователь без completed onboarding перенаправляется на `/onboarding`.

Onboarding:

1. `/onboarding` требует `getCurrentUser()`.
2. `OnboardingFlow` вызывает `completeOnboardingAction` или `skipOnboardingAction`.
3. `src/lib/auth.ts` валидирует Zod, проверяет username и обновляет `User` в Prisma.

Избранное:

1. `FavoriteButton` toggles id в `useFavoritesStore`.
2. Store persist хранит `favoriteIds` в `localStorage`.
3. `/favorites` фильтрует моковые `products` по этим id.

## 15. Текущие ограничения MVP

- Товары, магазины, отзывы и сделки пока не читаются из БД, а берутся из `mock-data.ts`.
- Форма продажи валидирует данные на клиенте, но не сохраняет объявление и не загружает фото.
- Legit check и messages являются честными заглушками будущего backend.
- Safe deal/payment UI есть, но оплата отключена.
- Middleware защищает по cookie, но критичные операции должны проверять server session отдельно.
- `/profile/[username]` выглядит как публичный профиль, но сейчас не входит в public prefixes middleware.
- README пока стандартный от Next.js и не описывает реальный 88Shops.

