"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";

export function CraftSection() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="relative bg-(--color-coffee-espresso) text-(--color-coffee-crema)">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-6 py-28 md:grid-cols-12 md:gap-10 md:px-12 md:py-36">
        <div className="md:col-span-5">
          <span className="tracking-display text-[0.7rem] uppercase text-white/55">
            {isAr ? "حِرفة" : "Craft"}
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-3 font-display text-4xl leading-[1.05] tracking-display md:text-6xl"
          >
            {isAr ? (
              <>
                صبرٌ هادئ
                <br />
                ودرجةٌ واحدة.
              </>
            ) : (
              <>
                Quiet patience,
                <br />
                a single degree.
              </>
            )}
          </motion.h2>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
            className="font-display text-2xl leading-[1.4] text-white/85 md:text-3xl"
          >
            {isAr
              ? "كل بروفايل تحميص يولد من حوار طويل بين الحبّة وبين الدرجة. نُصغي، نُقيس، ثم نُحرّك."
              : "Every roast profile is born from a long dialogue between the bean and the dial. We listen, we measure, and only then we move."}
          </motion.p>
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/15 pt-8 text-white/70 md:gap-10">
            {[
              {
                k: "01",
                en: "Cupped weekly across origins",
                ar: "تذوّق أسبوعي عبر المحاصيل",
              },
              {
                k: "02",
                en: "Roast curves logged & calibrated",
                ar: "منحنيات تحميص موثقة ومُعايَرة",
              },
              {
                k: "03",
                en: "Bagged within 24 hours of roast",
                ar: "تُعبَّأ خلال 24 ساعة من التحميص",
              },
            ].map((m) => (
              <div key={m.k} className="flex flex-col gap-2">
                <span className="font-mono-tab text-xs tracking-display text-(--color-accent-caramel)">
                  {m.k}
                </span>
                <span className="text-sm text-white/85">
                  {isAr ? m.ar : m.en}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
