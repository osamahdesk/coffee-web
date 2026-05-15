"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "./icons";

const items = [
  { id: "ethiopia", en: "Ethiopia · Single Origin", ar: "إثيوبيا · أصل واحد", hue: "#3a1d10" },
  { id: "yemen", en: "Yemen · Mountain Harvest", ar: "اليمن · حصاد الجبال", hue: "#2a1108" },
  { id: "rwanda", en: "Rwanda · Anaerobic", ar: "رواندا · لا هوائية", hue: "#4a2a18" },
  { id: "colombia", en: "Colombia · Honey Process", ar: "كولومبيا · معالجة العسل", hue: "#5a3520" },
] as const;

export function ProductsStrip() {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <section className="relative bg-(--color-coffee-paper) py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <span className="tracking-display text-[0.7rem] uppercase text-(--color-ink-muted)">
              {locale === "ar" ? "محاصيل الموسم" : "This Season's Harvest"}
            </span>
            <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-display md:text-6xl">
              {locale === "ar"
                ? "محاصيل مختارة، تُقاس بعناية."
                : "Harvests chosen, measured with care."}
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-3 self-start border-b border-(--color-ink-dark)/60 pb-1 tracking-display text-[0.7rem] uppercase text-(--color-ink-dark) transition hover:border-(--color-ink-dark)"
          >
            {t("cta.shop")}
            <ArrowRightIcon className="h-3 w-3" />
          </a>
        </header>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.a
              key={it.id}
              href="#"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
              className="group block"
            >
              <div
                className="relative aspect-[4/5] w-full overflow-hidden rounded-sm"
                style={{
                  background: `radial-gradient(120% 80% at 50% 35%, ${it.hue} 0%, #0e0805 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_70%,rgba(192,137,81,0.18),transparent_60%)]" />
                <div className="absolute inset-x-0 bottom-0 flex justify-center p-6">
                  <div className="font-script text-3xl text-white/90 md:text-4xl">
                    mqyas
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl leading-tight tracking-display md:text-2xl">
                  {locale === "ar" ? it.ar : it.en}
                </h3>
                <span className="tracking-display text-[0.65rem] uppercase text-(--color-ink-muted)">
                  250g
                </span>
              </div>
              <span className="mt-2 inline-block text-sm text-(--color-ink-muted)">
                {locale === "ar" ? "تحميص حسب الطلب" : "Roasted on demand"}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
