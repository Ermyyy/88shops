"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getPrisma } from "@/lib/prisma";
import { assertModeratedText } from "@/lib/moderation/text-moderation";

export type ProfileAppearanceState = {
  error?: string;
  success?: string;
};

const SAFE_COLORS = new Set([
  "#111111",
  "#2F3437",
  "#2563EB",
  "#7C3AED",
  "#C2410C",
  "#D9FF43",
  "#F6F6F4",
  "#F4F0E8",
]);

function readString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function readColor(value: FormDataEntryValue | null, fallback: string) {
  const color = readString(value).toUpperCase();
  return SAFE_COLORS.has(color) ? color : fallback;
}

function readOptionalUrl(value: FormDataEntryValue | null) {
  const raw = readString(value);

  if (!raw) {
    return null;
  }

  try {
    const url = new URL(raw);

    if (url.protocol !== "https:") {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export async function updateProfileAppearanceAction(
  _prevState: ProfileAppearanceState,
  formData: FormData,
): Promise<ProfileAppearanceState> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Войди, чтобы изменить профиль." };
  }

  const displayName = readString(formData.get("displayName")).slice(0, 80);
  const avatarUrl = readOptionalUrl(formData.get("avatarUrl"));
  const coverUrl = readOptionalUrl(formData.get("coverUrl"));
  const nicknameColor = readColor(formData.get("nicknameColor"), "#111111");
  const profileBackgroundColor = readColor(formData.get("profileBackgroundColor"), "#F6F6F4");

  if (displayName.length < 2) {
    return { error: "Укажи имя от 2 символов." };
  }

  const moderationError = assertModeratedText(displayName);

  if (moderationError) {
    return { error: moderationError };
  }

  const user = await getPrisma().user.update({
    where: { id: userId },
    data: {
      name: displayName,
      avatarUrl,
      image: avatarUrl,
      coverUrl,
      customization: {
        upsert: {
          create: {
            nicknameColor,
            profileBackgroundColor,
          },
          update: {
            nicknameColor,
            profileBackgroundColor,
          },
        },
      },
    },
    select: { username: true },
  });

  revalidatePath(`/profile/${user.username ?? userId}`);

  return { success: "Профиль сохранён." };
}
