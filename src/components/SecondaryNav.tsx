"use client";

import { useTranslations } from "next-intl";
import { SearchIcon } from "./icons";

export function SecondaryNav() {
  const t = useTranslations("nav.secondary");

  const items: Array<{ key: string; label: string }> = [
    { key: "origins", label: t("origins") },
    { key: "roastery", label: t("roastery") },
    { key: "tools", label: t("tools") },
    { key: "subscription", label: t("subscription") },
    { key: "journal", label: t("journal") },
    { key: "wholesale", label: t("wholesale") },
  ];

  return (
    <div className="relative z-30 hidden border-t border-white/15 bg-transparent md:block">
      <div className="mx-auto flex max-w-[1600px] items-center justify-center gap-9 px-10 py-3 text-[0.7rem] tracking-display uppercase text-white/90">
        {items.map((it) => (
          <a
            key={it.key}
            href="#"
            className="transition-colors duration-300 hover:text-white"
          >
            {it.label}
          </a>
        ))}
        <div className="ms-4 inline-flex items-center text-white/70">
          <SearchIcon className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
}
