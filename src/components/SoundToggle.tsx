"use client";

import { useTranslations } from "next-intl";
import { useSound } from "./SoundContext";
import { SoundOnIcon, SoundOffIcon } from "./icons";

type Variant = "light" | "dark";

export function SoundToggle({ variant = "light" }: { variant?: Variant }) {
  const { muted, toggle } = useSound();
  const t = useTranslations("nav");

  const klass =
    variant === "light"
      ? "text-white/80 hover:text-white"
      : "text-(--color-ink-dark) hover:text-(--color-accent-copper)";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`group inline-flex items-center gap-2 tracking-display text-[0.65rem] uppercase transition-colors duration-300 ${klass}`}
      aria-pressed={!muted}
      aria-label={muted ? t("sound") : t("muted")}
    >
      {muted ? (
        <SoundOffIcon className="h-3.5 w-3.5" />
      ) : (
        <SoundOnIcon className="h-3.5 w-3.5" />
      )}
      <span>{muted ? t("sound") : t("muted")}</span>
    </button>
  );
}
