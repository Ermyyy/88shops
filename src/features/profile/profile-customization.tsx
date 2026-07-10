"use client";

import { useState } from "react";
import { Gift, Palette, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const colors = ["#D9FF43", "#F4F0E8", "#9DD8FF", "#FFD166"];
const emojis = ["✦", "◆", "●", "◇", "✶"];
const frames = ["graphite", "lime", "silver"] as const;

export function ProfileCustomization() {
  const [color, setColor] = useState(colors[0]);
  const [emoji, setEmoji] = useState(emojis[0]);
  const [frame, setFrame] = useState<(typeof frames)[number]>("lime");
  const [rewardClaimed, setRewardClaimed] = useState(false);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
      <section className="rounded-[8px] border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-6 flex items-center gap-3">
          <Palette aria-hidden className="h-5 w-5 text-lime" />
          <h2 className="text-2xl font-semibold text-cream">Demo кастомизация</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-cream/42">
              Цвет ника
            </p>
            <div className="flex gap-2">
              {colors.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setColor(item)}
                  className="h-11 w-11 rounded-full border border-white/15"
                  style={{ backgroundColor: item, outline: color === item ? "2px solid #fff" : "none" }}
                  aria-label={`Цвет ${item}`}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-cream/42">
              Эмодзи
            </p>
            <div className="flex gap-2">
              {emojis.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setEmoji(item)}
                  className="h-11 w-11 rounded-[8px] border border-white/10 bg-white/[0.05] text-xl text-cream transition hover:border-lime/45"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-cream/42">
              Рамка
            </p>
            <div className="grid gap-2">
              {frames.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFrame(item)}
                  className="min-h-11 rounded-[8px] border border-white/10 px-3 text-left text-sm text-cream/70 transition hover:border-lime/45"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[8px] border border-white/10 bg-black/24 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/42">
            Preview
          </p>
          <p className="mt-3 text-3xl font-semibold" style={{ color }}>
            {emoji} demo.user
          </p>
          <p className="mt-2 text-sm text-cream/52">Аватарная рамка: {frame}</p>
          <p className="mt-2 text-sm text-cream/52">
            Анимированная рамка и обложка отмечены как future feature.
          </p>
        </div>
      </section>

      <aside className="rounded-[8px] border border-lime/20 bg-lime/10 p-6">
        <Gift aria-hidden className="h-7 w-7 text-lime" />
        <h2 className="mt-4 text-xl font-semibold text-cream">88 Coins demo</h2>
        <p className="mt-3 text-sm leading-6 text-cream/60">
          Это demo cosmetic points для интерфейса кастомизации, не финансовый
          баланс и не пополнение кошелька.
        </p>
        <p className="mt-5 text-4xl font-semibold text-lime">880</p>
        <Button
          type="button"
          className="mt-6 w-full"
          disabled={rewardClaimed}
          onClick={() => {
            setRewardClaimed(true);
            toast("Demo-награда показана. Реального баланса нет.");
          }}
        >
          <Sparkles aria-hidden className="h-4 w-4" />
          {rewardClaimed ? "Награда показана" : "Показать demo-награду"}
        </Button>
      </aside>
    </div>
  );
}
