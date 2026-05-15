import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Inter,
  Italianno,
  Amiri,
  Tajawal,
} from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getDir } from "@/lib/locale";
import { LenisProvider } from "@/components/LenisProvider";
import { SoundProvider } from "@/components/SoundContext";
import "../globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const script = Italianno({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

const arabicDisplay = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic-display",
  display: "swap",
});

const arabicSans = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1a0e07",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: LayoutProps<"/[locale]">
): Promise<Metadata> {
  const { locale } = await props.params;
  const isAr = locale === "ar";
  return {
    title: isAr
      ? "مقياس — قهوة مختصة بدقة"
      : "mqyas — Specialty coffee, measured.",
    description: isAr
      ? "تجربة سينمائية لمحمصة قهوة مختصة. دقة في كل فنجان."
      : "A cinematic experience for a specialty coffee roastery. Precision in every cup.",
  };
}

export default async function LocaleLayout(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const dir = getDir(locale);
  const fontClasses = [
    display.variable,
    sans.variable,
    script.variable,
    arabicDisplay.variable,
    arabicSans.variable,
  ].join(" ");

  return (
    <html lang={locale} dir={dir} className={fontClasses}>
      <body className="min-h-screen bg-(--color-coffee-paper) text-(--color-ink-dark) antialiased">
        <NextIntlClientProvider>
          <SoundProvider>
            <LenisProvider>{props.children}</LenisProvider>
          </SoundProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
