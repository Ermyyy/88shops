# Auth Rules

- Email/password работает через server actions, bcrypt и Prisma-сессии.
- Telegram и Google показывать только со статусом "Скоро", пока OAuth не подключен.
- Пароль не сохранять в localStorage или sessionStorage.
- Приватные действия требуют серверной сессии.
- Не доверять username как постоянному идентификатору Telegram, использовать `telegramId`.
