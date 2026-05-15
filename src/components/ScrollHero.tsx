"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Preloader } from "./Preloader";
import { SoundToggle } from "./SoundToggle";
import { useSound } from "./SoundContext";
import { ArrowDownIcon } from "./icons";

const FRAME_COUNT = 120;
const HERO_VH = 600;

const frameSrc = (i: number) =>
  `/sequence/frame_${i.toString().padStart(3, "0")}.webp`;

const beats = [
  { key: "intro", start: 0.0, end: 0.18 },
  { key: "origins", start: 0.22, end: 0.44 },
  { key: "roast", start: 0.48, end: 0.7 },
  { key: "cup", start: 0.74, end: 0.95 },
] as const;

type BeatKey = (typeof beats)[number]["key"];

export function ScrollHero() {
  const t = useTranslations();
  const locale = useLocale();
  const { registerSource } = useSound();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [framesAvailable, setFramesAvailable] = useState(true);

  // Preload sequence frames (graceful on 404 — page still renders with fallback bg)
  useEffect(() => {
    const images: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(
      null
    );
    let completed = 0;
    let anyLoaded = false;

    const advance = () => {
      completed += 1;
      setProgress(completed / FRAME_COUNT);
      if (completed >= FRAME_COUNT) {
        setFramesAvailable(anyLoaded);
        // Reveal after a tick to allow first paint
        requestAnimationFrame(() => setRevealed(true));
      }
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameSrc(i);
      img.onload = () => {
        anyLoaded = true;
        images[i] = img;
        advance();
      };
      img.onerror = () => {
        advance();
      };
    }
    imagesRef.current = images;

    // Safety: never let preloader hang forever
    const timeoutId = window.setTimeout(() => {
      if (completed < FRAME_COUNT) {
        completed = FRAME_COUNT;
        setProgress(1);
        setFramesAvailable(anyLoaded);
        requestAnimationFrame(() => setRevealed(true));
      }
    }, 8000);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.6,
  });

  // Draw current frame on scroll change
  useEffect(() => {
    if (!framesAvailable) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let pending = 0;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const findNearestImage = (idx: number): HTMLImageElement | null => {
      const target = Math.max(0, Math.min(FRAME_COUNT - 1, idx));
      const direct = imagesRef.current[target];
      if (direct && direct.complete) return direct;
      for (let r = 1; r < FRAME_COUNT; r++) {
        const before = imagesRef.current[Math.max(0, target - r)];
        if (before && before.complete) return before;
        const after = imagesRef.current[Math.min(FRAME_COUNT - 1, target + r)];
        if (after && after.complete) return after;
      }
      return null;
    };

    const draw = () => {
      raf = 0;
      const p = pending;
      const idx = Math.floor(p * (FRAME_COUNT - 1));
      const img = findNearestImage(idx);
      if (!img) return;

      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw || !ih) return;

      const scale = Math.max(cw / iw, ch / ih);
      const drawW = iw * scale;
      const drawH = ih * scale;
      const dx = (cw - drawW) / 2;
      const dy = (ch - drawH) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, drawW, drawH);
    };

    const schedule = (p: number) => {
      pending = p;
      if (raf) return;
      raf = requestAnimationFrame(draw);
    };

    sizeCanvas();
    schedule(smooth.get());

    const unsub = smooth.on("change", (p) => schedule(p));
    const onResize = () => {
      sizeCanvas();
      schedule(pending);
    };
    window.addEventListener("resize", onResize);

    return () => {
      unsub();
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [framesAvailable, smooth]);

  // Frame counter "01-04" style indicator
  const beatNumber = useTransform(smooth, (p) => {
    for (let i = beats.length - 1; i >= 0; i--) {
      if (p >= beats[i].start) return i + 1;
    }
    return 1;
  });
  const [currentBeat, setCurrentBeat] = useState(1);
  useEffect(() => beatNumber.on("change", (v) => setCurrentBeat(v)), [beatNumber]);

  return (
    <section
      ref={containerRef}
      className="relative bg-(--color-coffee-void) text-(--color-coffee-crema)"
      style={{ height: `${HERO_VH}vh` }}
    >
      <Preloader progress={progress} visible={!revealed} />

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Gradient fallback (always rendered behind canvas) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_30%,#3a2114_0%,#1a0e07_50%,#0a0604_100%)]"
        />

        {/* Image sequence canvas */}
        {framesAvailable && !reduced && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          />
        )}

        {/* Soft vignette */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_50%,transparent_55%,rgba(0,0,0,0.45)_100%)]"
        />

        {/* Sound toggle (top-left, beside locale) */}
        <div
          className={`absolute top-24 z-30 ${
            locale === "ar" ? "right-6 md:right-10" : "left-6 md:left-10"
          }`}
        >
          <SoundToggle variant="light" />
        </div>

        {/* Hidden audio source — wires up when MP4 / mp3 is present */}
        <audio
          ref={(el) => {
            registerSource(el);
          }}
          src="/audio/hero.mp3"
          loop
          preload="auto"
          playsInline
          aria-hidden="true"
          className="hidden"
        />

        {/* Chapter pip indicator (top-right or top-left based on locale) */}
        <div
          className={`absolute top-24 z-30 flex items-center gap-3 text-white/85 ${
            locale === "ar" ? "left-6 md:left-10" : "right-6 md:right-10"
          }`}
        >
          <span className="chapter-pip font-mono-tab">
            <span aria-hidden="true">
              {String(currentBeat).padStart(2, "0")}
              <span className="opacity-50">·{String(beats.length).padStart(2, "0")}</span>
            </span>
          </span>
        </div>

        {/* Text overlays per beat */}
        <BeatOverlay
          smooth={smooth}
          beatKey="intro"
          align="center"
          eyebrow={`${t("hero.chapter")} 01`}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          showWordmark={false}
        />
        <BeatOverlay
          smooth={smooth}
          beatKey="origins"
          align="start"
          eyebrow={t("scenes.origins.eyebrow")}
          title={t("scenes.origins.title")}
          subtitle={t("scenes.origins.body")}
        />
        <BeatOverlay
          smooth={smooth}
          beatKey="roast"
          align="end"
          eyebrow={t("scenes.roast.eyebrow")}
          title={t("scenes.roast.title")}
          subtitle={t("scenes.roast.body")}
        />
        <BeatOverlay
          smooth={smooth}
          beatKey="cup"
          align="center"
          eyebrow={t("scenes.cup.eyebrow")}
          title={t("scenes.cup.title")}
          subtitle={t("scenes.cup.body")}
          cta={t("cta.shop")}
        />

        {/* Scroll cue (fades out by 10%) */}
        <ScrollCue smooth={smooth} label={t("hero.scroll")} />

        {/* Reduced motion notice */}
        {reduced && (
          <div className="absolute bottom-6 inset-x-0 z-20 text-center text-[0.65rem] tracking-display uppercase text-white/55">
            {t("reducedMotion.notice")}
          </div>
        )}
      </div>
    </section>
  );
}

function BeatOverlay({
  smooth,
  beatKey,
  align,
  eyebrow,
  title,
  subtitle,
  cta,
  showWordmark,
}: {
  smooth: ReturnType<typeof useSpring>;
  beatKey: BeatKey;
  align: "start" | "center" | "end";
  eyebrow: string;
  title: string;
  subtitle?: string;
  cta?: string;
  showWordmark?: boolean;
}) {
  const beat = useMemo(() => beats.find((b) => b.key === beatKey)!, [beatKey]);

  const opacity = useTransform(
    smooth,
    [beat.start, beat.start + 0.06, beat.end - 0.06, beat.end],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    smooth,
    [beat.start, beat.start + 0.06, beat.end - 0.06, beat.end],
    [24, 0, 0, -24]
  );

  const alignClass =
    align === "start"
      ? "items-start text-start"
      : align === "end"
      ? "items-end text-end"
      : "items-center text-center";

  const locale = useLocale();
  const containerSide =
    align === "start"
      ? locale === "ar"
        ? "right-6 md:right-16"
        : "left-6 md:left-16"
      : align === "end"
      ? locale === "ar"
        ? "left-6 md:left-16"
        : "right-6 md:right-16"
      : "left-1/2 -translate-x-1/2";

  return (
    <motion.div
      style={{ opacity, y }}
      className={`pointer-events-none absolute z-20 ${containerSide} bottom-[14vh] flex max-w-xl flex-col gap-5 px-4 md:bottom-[18vh] ${alignClass}`}
    >
      <span className="tracking-display text-[0.7rem] uppercase text-white/70">
        {eyebrow}
      </span>
      {showWordmark !== false && beatKey === "intro" && (
        <span className="font-script text-7xl leading-[0.95] text-white md:text-[8.5rem]">
          mqyas
        </span>
      )}
      <h1 className="font-display text-4xl leading-[1.05] text-white md:text-6xl lg:text-7xl tracking-display">
        {title}
      </h1>
      {subtitle && (
        <p className="max-w-md font-display text-lg text-white/75 md:text-xl tracking-cinematic">
          {subtitle}
        </p>
      )}
      {cta && (
        <div className="pointer-events-auto pt-2">
          <a
            href="#"
            className="inline-flex items-center gap-3 border-b border-white/60 pb-1 tracking-display text-[0.7rem] uppercase text-white transition hover:border-white"
          >
            {cta}
            <ArrowDownIcon className="h-3 w-3 -rotate-90" />
          </a>
        </div>
      )}
    </motion.div>
  );
}

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

function ScrollCue({
  smooth,
  label,
}: {
  smooth: ReturnType<typeof useSpring>;
  label: string;
}) {
  const opacity = useTransform(smooth, [0, 0.05, 0.1], [1, 0.7, 0]);
  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-white/70"
    >
      <span className="tracking-display text-[0.65rem] uppercase">{label}</span>
      <ArrowDownIcon className="h-4 w-4 animate-[fade-in_1s_ease-in-out_infinite_alternate]" />
    </motion.div>
  );
}
