"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LocaleToggle } from "./LocaleToggle";
import { AccountIcon, BagIcon, HeartIcon, PinIcon } from "./icons";

export function TopBar() {
  const t = useTranslations();
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 30);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const wordmark = t("brand.wordmark");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        scrolled
          ? "bg-(--color-coffee-paper)/95 backdrop-blur-md text-(--color-ink-dark)"
          : "bg-transparent text-white"
      }`}
    >
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-3 items-center px-6 py-5 md:px-10">
        <div className="flex items-center gap-6 text-[0.65rem] tracking-display uppercase">
          <span className="hidden md:inline">
            {locale === "ar" ? "المملكة" : "ARABIA"}
          </span>
          <LocaleToggle variant={scrolled ? "dark" : "light"} />
        </div>

        <div className="flex flex-col items-center">
          <a
            href={`/${locale}`}
            className={`font-script text-3xl leading-none transition-colors duration-500 md:text-4xl ${
              scrolled ? "text-(--color-ink-dark)" : "text-white"
            }`}
            aria-label={wordmark}
          >
            {wordmark}
          </a>
        </div>

        <nav
          className="flex items-center justify-end gap-5"
          aria-label="account"
        >
          <button
            type="button"
            aria-label={t("nav.contact")}
            className="hidden text-current/85 transition hover:text-current md:inline-flex"
          >
            <AccountIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={t("nav.stores")}
            className="hidden text-current/85 transition hover:text-current md:inline-flex"
          >
            <PinIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="favourites"
            className="hidden text-current/85 transition hover:text-current md:inline-flex"
          >
            <HeartIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={t("nav.shop")}
            className="text-current/85 transition hover:text-current"
          >
            <BagIcon className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </header>
  );
}
