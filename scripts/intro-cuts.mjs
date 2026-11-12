/**
 * Prepares the pictures of the opening montage (features/preloader).
 *
 *   node scripts/intro-cuts.mjs
 *
 * Reads every image in assets/intro/ (alphabetical order = order on screen) and writes
 * public/intro/01.webp, 02.webp, … in black and white, from ink to paper, so a colour painting
 * and an archive photograph read as one reel. Also writes the film-grain tile laid over them.
 */
import { mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const SOURCE = "assets/intro";
const OUTPUT = "public/intro";
const LONG_SIDE = 1600;

/** Black is the site's ink and white its paper, so the reel sits inside the palette. */
const INK = [14, 14, 12];
const PAPER = [242, 240, 235];
const LOOKUP = Array.from({ length: 256 }, (_, value) =>
  INK.map((channel, i) => Math.round(channel + ((PAPER[i] - channel) * value) / 255)),
);

const files = (await readdir(SOURCE)).filter((name) => /\.(jpe?g|png|webp|avif|heic|tiff?)$/i.test(name)).sort();
if (files.length === 0) {
  console.error(`No images in ${SOURCE}/. Drop the pictures there and run again.`);
  process.exit(1);
}

await rm(OUTPUT, { recursive: true, force: true });
await mkdir(OUTPUT, { recursive: true });

for (const [index, name] of files.entries()) {
  const { data, info } = await sharp(join(SOURCE, name))
    .rotate()
    .resize({ width: LONG_SIDE, height: LONG_SIDE, fit: "inside", withoutEnlargement: true })
    .grayscale()
    .normalise({ lower: 1, upper: 99 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.alloc(info.width * info.height * 3);
  for (let i = 0; i < info.width * info.height; i++) {
    const [r, g, b] = LOOKUP[data[i * info.channels]];
    pixels[i * 3] = r;
    pixels[i * 3 + 1] = g;
    pixels[i * 3 + 2] = b;
  }

  const target = join(OUTPUT, `${String(index + 1).padStart(2, "0")}.webp`);
  const out = await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 3 } })
    .webp({ quality: 64, effort: 6 })
    .toFile(target);
  console.log(`${name} → ${target} (${info.width}×${info.height}, ${Math.round(out.size / 1024)} kB)`);
}

// Film grain: a small tile of noise around mid grey, blended over the pictures with `overlay`.
const TILE = 256;
const grain = Buffer.alloc(TILE * TILE);
for (let i = 0; i < grain.length; i++) {
  // Sum of three uniforms: close enough to a bell curve, centred on 128.
  const noise = (Math.random() + Math.random() + Math.random()) / 3 - 0.5;
  grain[i] = Math.max(0, Math.min(255, Math.round(128 + noise * 230)));
}
await sharp(grain, { raw: { width: TILE, height: TILE, channels: 1 } })
  .webp({ quality: 70 })
  .toFile(join(OUTPUT, "grain.webp"));
console.log(`grain → ${join(OUTPUT, "grain.webp")}`);
