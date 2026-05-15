"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { routing } from "@/i18n/routing";

type AppLocale = (typeof routing.locales)[number];

function swapLocaleInPath(pathname: string, next: AppLocale) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${next}`;
  if (routing.locales.includes(parts[0] as AppLocale)) {
    parts[0] = next;
  } else {
    parts.unshift(next);
  }
  return "/" + parts.join("/");
}

type Variant = "light" | "dark";

export function LocaleToggle({ variant = "dark" }: { variant?: Variant }) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next: AppLocale = locale === "ar" ? "en" : "ar";
  const label = next === "ar" ? "العربية" : "English";

  const klass =
    variant === "light"
      ? "text-white/85 hover:text-white"
      : "text-(--color-ink-dark) hover:text-(--color-accent-copper)";

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(() => router.push(swapLocaleInPath(pathname, next)))
      }
      disabled={pending}
      className={`tracking-display text-[0.65rem] uppercase transition-colors duration-300 ${klass}`}
      aria-label={`Switch to ${label}`}
    >
      <span aria-hidden="true">{next.toUpperCase()}</span>
    </button>
  );
}
