/*
  Warnings:

  - You are about to drop the column `cosmeticPointsDemo` on the `UserCustomization` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AuthenticityPreference" AS ENUM ('ORIGINAL', 'REPLICA', 'BOTH');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clothingSize" TEXT,
ADD COLUMN     "dealPreferences" "DealMethod"[] DEFAULT ARRAY[]::"DealMethod"[],
ADD COLUMN     "favoriteBrands" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "interestTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "preferredAuthenticity" "AuthenticityPreference" NOT NULL DEFAULT 'BOTH',
ADD COLUMN     "shoeSize" TEXT,
ADD COLUMN     "skippedOnboarding" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserCustomization" DROP COLUMN "cosmeticPointsDemo",
ADD COLUMN     "cosmeticPoints" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "emoji" SET DEFAULT 'star';
