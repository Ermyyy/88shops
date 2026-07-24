"use client";

import { useState } from "react";
import { Gift, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const colors = ["#D9FF43", "#111111", "#2563eb", "#c2410c"];
const marks = ["*", "+", "#", "88"];
const frames = ["graphite", "lime", "silver"] as const;

export function ProfileCustomization() {
  const [color, setColor] = useState(colors[0]);
  const [mark, setMark] = useState(marks[0]);
  const [frame, setFrame] = useState<(typeof frames)[number]>("lime");

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
      <section className="rounded-[8px] border border-black/10 bg-white p-4">
        <div className="mb-5 flex items-center gap-3">
          <Palette aria-hidden className="h-5 w-5 text-black" />
          <h2 className="text-lg font-semibold text-black">Кастомизация профиля</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <p className="mb-3 text-xs font-semibold text-black/42">Цвет ника</p>
            <div className="flex gap-2">
              {colors.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setColor(item)}
                  className="h-11 w-11 rounded-full border border-black/12"
                  style={{
                    backgroundColor: item,
                    outline: color === item ? "2px solid #111" : "none",
                  }}
                  aria-label={`Цвет ${item}`}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold text-black/42">Метка</p>
            <div className="flex gap-2">
              {marks.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMark(item)}
                  className="h-11 w-11 rounded-[8px] border border-black/10 bg-white text-xl text-black transition hover:border-black/20"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold text-black/42">Рамка</p>
            <div className="grid gap-2">
              {frames.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFrame(item)}
                  className="min-h-11 rounded-[8px] border border-black/10 px-3 text-left text-sm text-black/70 transition hover:border-black/20"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[8px] border border-black/10 bg-[#f6f6f4] p-4">
          <p className="text-xs font-semibold text-black/42">Preview</p>
          <p className="mt-3 text-2xl font-semibold" style={{ color }}>
            {mark} alina.archive
          </p>
          <p className="mt-2 text-sm text-black/52">Аватарная рамка: {frame}</p>
          <p className="mt-2 text-sm text-black/52">
            Анимированные рамки и обложки появятся позже.
          </p>
        </div>
      </section>

      <aside className="rounded-[8px] border border-lime/40 bg-lime/15 p-4">
        <Gift aria-hidden className="h-7 w-7 text-black" />
        <h2 className="mt-3 text-lg font-semibold text-black">88 Coins</h2>
        <p className="mt-2 text-sm leading-6 text-black/60">
          88 Coins - будущие баллы для оформления профиля и продвижения
          объявлений.
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
