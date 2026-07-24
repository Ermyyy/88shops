-- OAuth providers create a user before the user finishes the 88Shops profile.
-- Keep passwordHash for legacy compatibility; only relax profile fields and add provider metadata.
ALTER TABLE "User"
ADD COLUMN "emailVerified" TIMESTAMP(3),
ADD COLUMN "name" TEXT,
ADD COLUMN "image" TEXT,
ADD COLUMN "telegramUsername" TEXT;

ALTER TABLE "User"
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL;
