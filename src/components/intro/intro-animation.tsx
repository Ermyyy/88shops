"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const SESSION_KEY = "88shops:intro-seen";

export function IntroAnimation() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(SESSION_KEY);

      if (seen || reduceMotion) {
        sessionStorage.setItem(SESSION_KEY, "true");
        return;
      }

      const revealTimer = window.setTimeout(() => setVisible(true), 0);
      const timer = window.setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, "true");
        setVisible(false);
      }, 2750);

      return () => {
        window.clearTimeout(revealTimer);
        window.clearTimeout(timer);
      };
    } catch {
      return;
    }
  }, [reduceMotion]);

  const skip = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // ignore storage failures in private or embedded contexts
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-black text-cream"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 wet-fabric" />
          <div className="absolute inset-0 intro-droplets" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
            <motion.p
              className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-lime/80"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              Original things. No noise.
            </motion.p>
            <motion.h1
              className="font-serif text-6xl text-cream sm:text-8xl"
              initial={{ opacity: 0, filter: "blur(12px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.75, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              88Shops
            </motion.h1>
            <motion.div
              className="mt-8 h-px w-48 bg-gradient-to-r from-transparent via-lime to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            />
          </div>
          <button
            type="button"
            onClick={skip}
            className="absolute bottom-6 right-6 z-20 min-h-11 rounded-[8px] border border-white/12 px-4 text-sm font-semibold text-cream/70 transition hover:border-lime/60 hover:text-lime"
          >
            Пропустить
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
