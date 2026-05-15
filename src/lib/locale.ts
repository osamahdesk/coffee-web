import type { AppLocale } from "@/i18n/routing";

export function getDir(locale: AppLocale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function otherLocale(locale: AppLocale): AppLocale {
  return locale === "ar" ? "en" : "ar";
}
