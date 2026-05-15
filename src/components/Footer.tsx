"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRightIcon } from "./icons";

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();

  const houseLinks = [
    t("footer.links.about"),
    t("footer.links.method"),
    t("footer.links.press"),
    t("footer.links.careers"),
  ];
  const clientLinks = [
    t("footer.clientLinks.contact"),
    t("footer.clientLinks.shipping"),
    t("footer.clientLinks.faq"),
    t("footer.clientLinks.terms"),
  ];
  const discoverLinks = [
    t("footer.discoverLinks.stores"),
    t("footer.discoverLinks.journal"),
    t("footer.discoverLinks.events"),
    t("footer.discoverLinks.newsletter"),
  ];

  return (
    <footer className="relative bg-(--color-coffee-espresso) text-(--color-coffee-crema)">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-28">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <div className="font-script text-5xl leading-none text-white md:text-6xl">
              {t("brand.wordmark")}
            </div>
            <p className="mt-4 font-display text-xl text-white/80 md:text-2xl">
              {t("brand.tagline")}
            </p>
            <div className="mt-10 max-w-md">
              <p className="tracking-display text-[0.7rem] uppercase text-white/70">
                {t("footer.newsletter.title")}
              </p>
              <p className="mt-3 text-sm text-white/60">
                {t("footer.newsletter.body")}
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-5 flex items-center border-b border-white/30 pb-2 focus-within:border-white"
              >
                <input
                  type="email"
                  required
                  placeholder={t("footer.newsletter.placeholder")}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                  dir={locale === "ar" ? "rtl" : "ltr"}
                />
                <button
                  type="submit"
                  aria-label={t("footer.newsletter.submit")}
                  className="inline-flex h-9 w-9 items-center justify-center text-white/80 transition hover:text-white"
                >
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          <FooterColumn title={t("footer.house")} items={houseLinks} />
          <FooterColumn title={t("footer.client")} items={clientLinks} />
          <FooterColumn title={t("footer.discover")} items={discoverLinks} />
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-white/15 pt-6 text-[0.7rem] tracking-display uppercase text-white/55 md:flex-row md:items-center">
          <div>{t("footer.legal", { year })}</div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="transition hover:text-white">
              {t("footer.legalLinks.privacy")}
            </a>
            <a href="#" className="transition hover:text-white">
              {t("footer.legalLinks.cookies")}
            </a>
            <a href="#" className="transition hover:text-white">
              {t("footer.legalLinks.legal")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="md:col-span-2">
      <h3 className="tracking-display text-[0.7rem] uppercase text-white/85">
        {title}
      </h3>
      <ul className="mt-5 space-y-3 text-sm text-white/65">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="transition hover:text-white">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
