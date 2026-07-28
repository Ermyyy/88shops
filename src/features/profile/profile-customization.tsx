"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Gift, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfileAppearanceAction, type ProfileAppearanceState } from "@/lib/profile-actions";

const colors = ["#111111", "#2F3437", "#2563EB", "#7C3AED", "#C2410C", "#D9FF43"];
const backgrounds = ["#F6F6F4", "#F4F0E8", "#E8EEF4", "#EEF4E8", "#F4ECE8"];

type ProfileCustomizationProps = {
  displayName: string;
  username: string;
  nicknameColor: string;
  profileBackgroundColor: string;
  avatarUrl?: string;
  coverUrl?: string;
};

const initialState: ProfileAppearanceState = {};

export function ProfileCustomization({
  displayName,
  username,
  nicknameColor,
  profileBackgroundColor,
  avatarUrl,
  coverUrl,
}: ProfileCustomizationProps) {
  const [state, formAction] = useActionState(updateProfileAppearanceAction, initialState);
  const [name, setName] = useState(displayName);
  const [color, setColor] = useState(nicknameColor);
  const [background, setBackground] = useState(profileBackgroundColor);

  const previewStyle = useMemo(
    () => ({
      color,
      backgroundColor: background,
    }),
    [background, color],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
      <section className="rounded-[8px] border border-black/10 bg-white p-4">
        <div className="mb-5 flex items-center gap-3">
          <Palette aria-hidden className="h-5 w-5 text-black" />
          <h2 className="text-lg font-semibold text-black">Оформление профиля</h2>
        </div>

        <form action={formAction} className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-black/60">
              Отображаемое имя
              <Input
                name="displayName"
                value={name}
                minLength={2}
                maxLength={80}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-black/60">
              Аватар HTTPS URL
              <Input name="avatarUrl" type="url" defaultValue={avatarUrl ?? ""} placeholder="Скоро будет загрузка файлов" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-black/60 md:col-span-2">
              Обложка HTTPS URL
              <Input name="coverUrl" type="url" defaultValue={coverUrl ?? ""} placeholder="Скоро будет загрузка файлов" />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <ColorPicker
              label="Цвет ника"
              name="nicknameColor"
              colors={colors}
              value={color}
              onChange={setColor}
            />
            <ColorPicker
              label="Цвет обложки"
              name="profileBackgroundColor"
              colors={backgrounds}
              value={background}
              onChange={setBackground}
            />
          </div>

          <div className="rounded-[8px] border border-black/10 p-4" style={previewStyle}>
            <p className="text-xs font-semibold text-black/42">Предпросмотр</p>
            <p className="mt-3 text-2xl font-semibold">{name || displayName}</p>
            <p className="mt-2 text-sm text-black/52">@{username}</p>
          </div>

          {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
          {state.success ? <p className="text-sm text-green-700">{state.success}</p> : null}

          <SubmitButton />
        </form>
      </section>

      <aside className="rounded-[8px] border border-lime/40 bg-lime/15 p-4">
        <Gift aria-hidden className="h-7 w-7 text-black" />
        <h2 className="mt-3 text-lg font-semibold text-black">88 Coins</h2>
        <p className="mt-2 text-sm leading-6 text-black/60">
          Бонусы для оформления профиля появятся позже.
        </p>
        <p className="mt-4 inline-flex rounded-[8px] border border-lime/40 px-3 py-2 text-sm font-semibold text-black">
          Скоро
        </p>
        <Button type="button" className="mt-5 w-full" disabled>
          <Sparkles aria-hidden className="h-4 w-4" />
          Скоро
        </Button>
      </aside>
    </div>
  );
}

function ColorPicker({
  label,
  name,
  colors,
  value,
  onChange,
}: {
  label: string;
  name: string;
  colors: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold text-black/42">{label}</p>
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-wrap gap-2">
        {colors.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className="h-11 w-11 rounded-full border border-black/12"
            style={{
              backgroundColor: item,
              outline: value === item ? "2px solid #111" : "none",
            }}
            aria-label={`${label} ${item}`}
          />
        ))}
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? "Сохраняем..." : "Сохранить профиль"}
    </Button>
  );
}
