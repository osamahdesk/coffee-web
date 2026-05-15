#!/usr/bin/env node
/**
 * Generates 120 placeholder WebP frames for the scroll-linked hero canvas.
 * Each frame is a warm coffee-toned radial gradient that drifts subtly
 * across the sequence, so the scroll experience is demoable before the
 * real MP4 has been processed through `scripts/extract-frames.sh`.
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const OUT = resolve("public/sequence");
mkdirSync(OUT, { recursive: true });

const W = 1920;
const H = 1080;
const N = 120;

// Coffee palette ramp (start → end)
const A_DARK = [0x0a, 0x06, 0x04]; // espresso void
const A_LIGHT = [0x2e, 0x1a, 0x10]; // coffee roast (early)
const B_DARK = [0x4a, 0x2d, 0x1a]; // mocha
const B_LIGHT = [0xc8, 0x90, 0x60]; // caramel cream (late)

function blend(a, b, t) {
  return a.map((ac, i) => Math.round(ac * (1 - t) + b[i] * t));
}

function pseudoRandom(seed) {
  // Simple linear-congruential generator for reproducibility
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function grain(t, count, seed) {
  const rand = pseudoRandom(seed);
  const parts = [];
  for (let i = 0; i < count; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const r = 80 + rand() * 380;
    const alpha = 0.025 + rand() * 0.045;
    parts.push(
      `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(
        0
      )}" r="${r.toFixed(0)}" fill="rgba(70,40,20,${alpha.toFixed(3)})"/>`
    );
  }
  return parts.join("");
}

async function main() {
  console.log(`Generating ${N} stub frames into ${OUT}`);
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    // Ease-in-out for more dramatic shift mid-sequence
    const e = t * t * (3 - 2 * t);
    const inner = blend(A_LIGHT, B_LIGHT, e);
    const outer = blend(A_DARK, B_DARK, e);
    const cx = 50 + Math.sin(t * Math.PI * 2) * 8;
    const cy = 30 + e * 25;
    const radius = 60 + e * 30;
    const seed = 1000 + i * 17;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="g" cx="${cx.toFixed(2)}%" cy="${cy.toFixed(
      2
    )}%" r="${radius.toFixed(2)}%">
      <stop offset="0%" stop-color="rgb(${inner.join(",")})"/>
      <stop offset="55%" stop-color="rgb(${outer.join(",")})"/>
      <stop offset="100%" stop-color="rgb(${A_DARK.join(",")})"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <g opacity="0.65">${grain(t, 80, seed)}</g>
  <rect width="${W}" height="${H}" fill="rgba(0,0,0,${(0.25 - e * 0.18).toFixed(
      3
    )})"/>
</svg>`;

    const filename = `frame_${String(i).padStart(3, "0")}.webp`;
    await sharp(Buffer.from(svg))
      .webp({ quality: 72, effort: 4 })
      .toFile(join(OUT, filename));
    if (i % 20 === 0) {
      console.log(`  → ${filename}`);
    }
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
