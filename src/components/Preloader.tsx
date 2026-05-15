"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

type Props = {
  progress: number;
  visible: boolean;
};

export function Preloader({ progress, visible }: Props) {
  const t = useTranslations("preloader");
  const locale = useLocale();
  const pct = Math.round(progress * 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-(--color-coffee-void) text-(--color-coffee-crema)"
        >
          <div className="font-script text-6xl leading-none md:text-7xl">
            {t("title")}
          </div>
          <div className="mt-10 w-44 overflow-hidden">
            <div
              className="h-px bg-white/20"
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              <motion.div
                className="h-px bg-(--color-accent-caramel)"
                style={{ width: `${pct}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[0.65rem] tracking-display uppercase text-white/55">
              <span>{t("loading")}</span>
              <span className="font-mono-tab">{pct.toString().padStart(2, "0")}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
