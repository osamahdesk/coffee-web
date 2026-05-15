# mqyas — cinematic landing

A premium, scroll-linked image-sequence landing page for the specialty coffee
roastery **mqyas** (محمصة مقياس), built in the visual rhythm of editorial
fashion houses — pinned scenes, slow reveals, and a warm coffee palette.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** (CSS-first design tokens in `globals.css`)
- **Framer Motion** for scroll-linked spring smoothing and beat overlays
- **Lenis** for buttery smooth scroll on supporting devices
- **next-intl** for bilingual AR ↔ EN with RTL/LTR layout switching
- **HTML5 Canvas** drawing a 120-frame WebP sequence preloaded at boot

## Core mechanic

The hero is a `600vh` tall section. A sticky 100vh canvas inside it draws the
current frame of the sequence (`/public/sequence/frame_000.webp …
frame_119.webp`) based on smoothed scroll progress (`useSpring` over
`useScroll`). Four text "beats" fade in/out across the scroll range to mirror
the rhythm of the reference cinematic site.

Graceful fallbacks:

- `prefers-reduced-motion: reduce` → static gradient, no canvas, notice shown
- Frames missing / 404 → still renders the radial coffee gradient backdrop
- Cached image loads → safety timeout always reveals the page after 8 s

## Asset pipeline

### Real video (production assets)

When the brand video arrives, drop it anywhere on disk and run:

```bash
scripts/extract-frames.sh path/to/hero.mp4
```

This will:

1. Extract exactly **120 WebP frames** at 1920px wide into
   `public/sequence/frame_000.webp … frame_119.webp` (Lanczos scaled,
   quality 72).
2. Extract the audio track (if any) to `public/audio/hero.mp3` for the
   `SoundToggle` component.

### Placeholder frames

`scripts/gen-stub-frames.mjs` generates 120 warm-coffee gradient WebPs so the
scroll experience is demoable without the real video.

```bash
node scripts/gen-stub-frames.mjs
```

## Localization

Strings live in `messages/en.json` and `messages/ar.json`. The locale segment
`[locale]` is required in every URL (e.g. `/en`, `/ar`). The toggle in
`TopBar` swaps locales while preserving the rest of the path; the document
`dir` and `lang` attributes are flipped accordingly.

## Brand palette (placeholder)

Defined in `src/app/globals.css` via Tailwind v4's `@theme inline`:

| Token | Hex | Role |
| --- | --- | --- |
| `coffee-void` | `#0a0604` | Deepest backdrop |
| `coffee-espresso` | `#1a0e07` | Dark surface |
| `coffee-roast` | `#2e1a10` | Mid-tone surface |
| `coffee-mocha` | `#4a2d1a` | Accent surface |
| `coffee-crema` | `#f4ead8` | Light text on dark |
| `coffee-paper` | `#faf5ec` | Page background |
| `accent-caramel` | `#c08951` | Primary accent / underline |
| `accent-copper` | `#b08660` | Hover accent |

Swap these for the brand's official tokens once available.

## Local development

```bash
pnpm install
pnpm dev      # next dev (Turbopack)
pnpm build    # next build
pnpm lint
```

## File layout

```
src/
  app/
    [locale]/
      layout.tsx        # html/body, fonts, providers, locale gate
      page.tsx          # Home assembly
    globals.css         # Tailwind + design tokens
  components/
    ScrollHero.tsx      # Sticky canvas + 4 beats + preloader + reduced-motion
    TopBar.tsx
    SecondaryNav.tsx
    CraftSection.tsx
    ProductsStrip.tsx
    Footer.tsx
    LenisProvider.tsx
    SoundContext.tsx
    SoundToggle.tsx
    LocaleToggle.tsx
    Preloader.tsx
    icons.tsx
  i18n/
    routing.ts          # next-intl locales
    request.ts          # message loader
  lib/
    locale.ts           # direction + helpers
  proxy.ts              # next-intl middleware (Next 16 → proxy.ts)
messages/
  en.json
  ar.json
public/
  sequence/             # frame_000.webp .. frame_119.webp
  audio/                # hero.mp3 (after extract-frames.sh)
scripts/
  extract-frames.sh     # ffmpeg 120-frame extraction from MP4
  gen-stub-frames.mjs   # placeholder coffee-gradient frames
```
