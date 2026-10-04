#!/usr/bin/env node
/**
 * ============================================================================
 *  Media pipeline
 * ============================================================================
 *
 *  Turns whatever is in `src/assets/img/source/` into every responsive size the
 *  site needs, and fills any gap with generated placeholder artwork so the
 *  layout is never broken while photos are still being collected.
 *
 *  USAGE
 *    npm run media              process everything
 *    npm run media -- hero-main process one entry
 *    npm run media -- --force   rebuild even if outputs look current
 *
 *  FOR EACH ENTRY in src/data/media.mjs it looks for
 *      src/assets/img/source/<name>.{jpg,jpeg,png,webp,heic,avif}
 *  and, if found:
 *      • crops to the declared aspect ratio from the centre
 *      • resizes to every width in WIDTHS
 *      • writes WebP (quality 82) and JPEG (quality 84, progressive)
 *      • strips ALL metadata
 *
 *  That last point matters: photos taken on a phone carry EXIF GPS coordinates,
 *  and publishing them would leak the exact location of wherever each photo was
 *  shot — including people's homes, if any of the shots were taken off-site.
 *
 *  If no source photo exists, it generates placeholder artwork at the same
 *  sizes, so you can build and deploy immediately and swap images in later with
 *  no code change.
 *
 *  REQUIREMENTS: ImageMagick (`convert`) and, for the hero video, ffmpeg.
 * ============================================================================
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readdir, access, stat, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { images, WIDTHS, FALLBACK_WIDTH, heroVideo, widthsFor } from '../src/data/media.mjs';

const run = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'src', 'assets', 'img');
const SOURCE = join(IMG, 'source');
const VIDEO = join(ROOT, 'src', 'assets', 'video');
const PUBLIC = join(ROOT, 'public');
const BRAND = join(ROOT, 'brand');

/**
 * The logo master: the supplied artwork with its white background removed and
 * trimmed, kept transparent. `brand/logo-original.jpg` beside it is the
 * untouched file as delivered, so this can always be regenerated.
 */
const LOGO_MASTER = join(BRAND, 'logo-full.png');

/** Widths generated for the logo. It renders at ~46px in the header, ~110px
 *  in the footer and ~200px in the preloader, so 640 covers every case at 3x. */
const LOGO_WIDTHS = [160, 320, 640];

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const only = args.filter((a) => !a.startsWith('--'));

const SOURCE_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'avif', 'JPG', 'JPEG', 'PNG'];

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Placeholder artwork
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tone palettes. Each is a light source colour plus a near-black base, which
 * is what gives the placeholders a cinematic, deliberately-designed look rather
 * than a grey box with a cross through it.
 */
const TONES = {
  // Sampled from the logo's own gold gradient (#FAC60E → #A87703), so the
  // placeholders sit in the same family as the brand instead of fighting it.
  ember: { glow: '#f0ac10', mid: '#7a5406', base: '#0b0906' },
  dark: { glow: '#8a8f99', mid: '#23262c', base: '#07080a' },
  sand: { glow: '#d8b887', mid: '#6b5533', base: '#0b0906' },
};

/**
 * Builds the ImageMagick argument list for one placeholder.
 *
 * Composition order: off-centre radial glow → darken and desaturate → film
 * grain → dumbbell glyph → vignette → label. All from primitives, because this
 * environment has no SVG rasteriser.
 *
 * The label is annotated LAST, after the vignette, so the vignette cannot dim
 * it and the active gravity cannot shift it off the canvas.
 */
function placeholderArgs({ width, height, tone, label, out }) {
  const t = TONES[tone] || TONES.ember;

  // A radial gradient is always centred, so render at double size and crop an
  // off-centre window to move the light source away from dead centre.
  const bigW = width * 2;
  const bigH = height * 2;
  const offX = Math.round(width * 0.12);
  const offY = Math.round(height * 0.05);

  const unit = Math.min(width, height);
  const cx = Math.round(width * 0.5);
  const cy = Math.round(height * 0.5);
  const barLen = Math.round(unit * 0.30);
  const barW = Math.max(3, Math.round(unit * 0.030));
  const plateH = Math.round(unit * 0.18);
  const plateW = Math.max(3, Math.round(unit * 0.040));
  const outerH = Math.round(plateH * 0.66);

  const pointsize = Math.max(12, Math.round(unit * 0.052));
  const pad = Math.round(unit * 0.07);

  return [
    // 1. Off-centre glow
    '-size', `${bigW}x${bigH}`,
    `radial-gradient:${t.glow}-${t.base}`,
    '-gravity', 'NorthWest',
    '-crop', `${width}x${height}+${offX}+${offY}`,
    '+repage',

    // 2. Darken and desaturate into cinematic territory. A bright, saturated
    //    gradient reads as "unfinished CSS"; a dark one reads as a photograph.
    '-modulate', '72,88',

    // 3. Film grain, overlaid. This is what sells it as a photographic surface.
    '(', '-size', `${width}x${height}`, 'xc:gray50',
    '-attenuate', '0.85', '+noise', 'Gaussian', '-colorspace', 'Gray', ')',
    '-compose', 'overlay', '-composite',

    // 4. Faint dumbbell glyph: bar, inner plates, outer plates.
    '-fill', 'rgba(255,255,255,0.09)', '-stroke', 'none',
    '-draw', `roundrectangle ${cx - barLen},${cy - barW / 2} ${cx + barLen},${cy + barW / 2} ${barW / 2},${barW / 2}`,
    '-draw', `roundrectangle ${cx - barLen - plateW},${cy - plateH} ${cx - barLen},${cy + plateH} 4,4`,
    '-draw', `roundrectangle ${cx + barLen},${cy - plateH} ${cx + barLen + plateW},${cy + plateH} 4,4`,
    '-draw', `roundrectangle ${cx - barLen - plateW * 2},${cy - outerH} ${cx - barLen - plateW},${cy + outerH} 4,4`,
    '-draw', `roundrectangle ${cx + barLen + plateW},${cy - outerH} ${cx + barLen + plateW * 2},${cy + outerH} 4,4`,

    // 5. Vignette, so the edges fall off like a real lens.
    '(', '-size', `${width}x${height}`, 'radial-gradient:white-gray38', ')',
    '-compose', 'multiply', '-composite',

    // 6. Label last, so nothing dims or displaces it.
    //
    //    Only entries that ask for it get text. Most placeholders stay purely
    //    abstract: several components (the discipline cards especially) pull
    //    their own title up over the bottom of the image, so baked-in text
    //    collides with real text and makes a finished layout look broken. The
    //    `npm run media` output already lists every slot and what belongs in
    //    it, which is the better place for that hint.
    ...(label
      ? [
          '-font', 'DejaVu-Sans-Bold',
          '-pointsize', String(pointsize),
          '-kerning', String(Math.max(1, Math.round(pointsize * 0.12))),
          '-fill', 'rgba(255,255,255,0.72)',
          '-gravity', 'SouthWest',
          '-annotate', `+${pad}+${pad}`, label.toUpperCase(),
        ]
      : []),

    '-strip',
    out,
  ];
}

/** Renders the master placeholder for one entry at the largest needed width. */
async function makePlaceholderMaster(name, entry) {
  const [rw, rh] = entry.ratio;
  // Render the master at the largest size this entry will ever need, so every
  // derivative is a downscale rather than an upscale.
  const width = Math.max(FALLBACK_WIDTH, ...widthsFor(name));
  const height = Math.round((width * rh) / rw);
  const out = join(IMG, `.master-${name}.png`);
  await run(
    'convert',
    placeholderArgs({
      width,
      height,
      tone: entry.tone,
      // Only `showLabel` entries render text — see placeholderArgs.
      label: entry.showLabel ? entry.label : '',
      out,
    })
  );
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Derivatives
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crops to the declared ratio and writes every responsive size.
 *
 * `-resize` with `^` plus a centred crop is the "cover" behaviour: fill the box
 * and trim the overflow, so a portrait photo in a landscape slot is cropped
 * rather than letterboxed.
 */
async function makeDerivatives(name, entry, master) {
  const [rw, rh] = entry.ratio;
  const widths = widthsFor(name);

  for (const width of widths) {
    const height = Math.round((width * rh) / rw);
    const common = [
      master,
      '-auto-orient',
      '-resize', `${width}x${height}^`,
      '-gravity', 'center',
      '-extent', `${width}x${height}`,
      // Mild sharpening recovers the detail lost on downscale.
      '-unsharp', '0x0.6+0.6+0.02',
      '-strip',
      '-interlace', 'none',
    ];

    await run('convert', [...common, '-quality', '82', '-define', 'webp:method=6', join(IMG, `${name}-${width}.webp`)]);
    await run('convert', [...common, '-quality', '84', '-interlace', 'Plane', '-sampling-factor', '4:2:0', join(IMG, `${name}-${width}.jpg`)]);
  }

  // The fallback width must exist as a JPEG: it is the <img src>, the Open Graph
  // image and the URL used in structured data.
  if (!widths.includes(FALLBACK_WIDTH)) {
    const height = Math.round((FALLBACK_WIDTH * rh) / rw);
    await run('convert', [
      master, '-auto-orient',
      '-resize', `${FALLBACK_WIDTH}x${height}^`,
      '-gravity', 'center', '-extent', `${FALLBACK_WIDTH}x${height}`,
      '-unsharp', '0x0.6+0.6+0.02', '-strip',
      '-quality', '84', '-interlace', 'Plane',
      join(IMG, `${name}-${FALLBACK_WIDTH}.jpg`),
    ]);
  }
}

/** Finds a source photo for an entry, if the user has added one. */
async function findSource(name) {
  for (const ext of SOURCE_EXTS) {
    const p = join(SOURCE, `${name}.${ext}`);
    if (await exists(p)) return p;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// App icons
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Responsive logo files.
 *
 * The logo deliberately bypasses the photo pipeline above. That pipeline
 * crops to a fixed aspect ratio and emits a JPEG fallback — both of which are
 * wrong here: cropping would clip the barbell, and JPEG has no alpha channel,
 * so the transparent background would come out as a white box on a near-black
 * header.
 *
 * So: PNG and WebP only, no crop, alpha preserved.
 */
async function makeLogo() {
  if (!(await exists(LOGO_MASTER))) {
    console.log(`  ! ${LOGO_MASTER.replace(ROOT + '/', '')} not found — skipping logo.`);
    return 0;
  }

  for (const width of LOGO_WIDTHS) {
    const common = [LOGO_MASTER, '-resize', `${width}x`, '-strip'];
    // -background none keeps the alpha channel through the resize.
    await run('convert', [...common, '-background', 'none', join(IMG, `logo-${width}.png`)]);
    await run('convert', [
      ...common,
      '-background', 'none',
      '-define', 'webp:lossless=false',
      '-quality', '90',
      join(IMG, `logo-${width}.webp`),
    ]);
  }
  return LOGO_WIDTHS.length;
}

/**
 * The Open Graph share card: the logo centred on the brand background.
 *
 * Built at exactly 1200×630 because WhatsApp, Facebook and Messenger all crop
 * anything else unpredictably, and WhatsApp is how most of this audience will
 * share the link.
 */
async function makeOgCard() {
  if (!(await exists(LOGO_MASTER))) return false;

  const W = 1200;
  const H = 630;
  await run('convert', [
    '-size', `${W}x${H}`,
    'radial-gradient:#1c1a16-#08080b',
    // A warm floor glow picked from the logo's own gold, so the card reads as
    // one object rather than a logo pasted onto a dark rectangle.
    '(', '-size', `${W}x${H}`, 'xc:none',
    '-fill', 'rgba(250,198,14,0.16)', '-draw', `ellipse ${W / 2},${H + 60} ${W * 0.45},180 0,360`,
    '-blur', '0x55', ')',
    '-compose', 'over', '-composite',
    '(', LOGO_MASTER, '-resize', `x${Math.round(H * 0.74)}`, ')',
    '-gravity', 'center', '-compose', 'over', '-composite',
    '-strip', '-quality', '88',
    join(IMG, `og-default-${FALLBACK_WIDTH}.jpg`),
  ]);

  // The responsive widths the template may also reference.
  for (const width of widthsFor('og-default')) {
    await run('convert', [
      join(IMG, `og-default-${FALLBACK_WIDTH}.jpg`),
      '-resize', `${width}x`, '-strip', '-quality', '86',
      join(IMG, `og-default-${width}.jpg`),
    ]);
    await run('convert', [
      join(IMG, `og-default-${FALLBACK_WIDTH}.jpg`),
      '-resize', `${width}x`, '-strip', '-quality', '84',
      join(IMG, `og-default-${width}.webp`),
    ]);
  }
  return true;
}

/**
 * Generates the favicon and PWA icons from the logo.
 *
 * The logo is detailed, so it is placed on the brand background with padding
 * rather than cropped — a tight crop of a mascot illustration turns to mush
 * below about 48px, while the full badge still reads as a distinct gold shape.
 *
 * The maskable variant keeps the artwork inside the inner 80% safe zone,
 * because Android crops maskable icons to a circle on some launchers.
 */
async function makeIcons() {
  await mkdir(PUBLIC, { recursive: true });

  if (await exists(LOGO_MASTER)) {
    const fromLogo = async ({ size, out, maskable = false, radiusRatio = 0.22 }) => {
      const r = Math.round(size * (maskable ? 0.5 : radiusRatio));
      // Maskable icons need the artwork well inside the safe zone; standard
      // icons can sit closer to the edge.
      const artScale = maskable ? 0.58 : 0.82;

      await run('convert', [
        '-size', `${size}x${size}`, 'xc:none',
        // Rounded brand-dark tile
        '(', '-size', `${size}x${size}`, 'xc:#0c0b09',
        '(', '-size', `${size}x${size}`, 'xc:black', '-fill', 'white', '-stroke', 'none',
        '-draw', `roundrectangle 0,0 ${size - 1},${size - 1} ${r},${r}`, ')',
        '-alpha', 'off', '-compose', 'copy_opacity', '-composite', ')',
        '-gravity', 'center', '-compose', 'over', '-composite',
        // Logo on top
        '(', LOGO_MASTER, '-resize', `${Math.round(size * artScale)}x${Math.round(size * artScale)}`, ')',
        '-gravity', 'center', '-compose', 'over', '-composite',
        '-strip', out,
      ]);
    };

    await fromLogo({ size: 512, out: join(PUBLIC, 'icon-512.png') });
    await fromLogo({ size: 192, out: join(PUBLIC, 'icon-192.png') });
    await fromLogo({ size: 512, out: join(PUBLIC, 'icon-maskable-512.png'), maskable: true });
    await fromLogo({ size: 180, out: join(PUBLIC, 'apple-touch-icon.png') });
    await fromLogo({ size: 64, out: join(PUBLIC, '.ico-64.png') });
    await fromLogo({ size: 32, out: join(PUBLIC, '.ico-32.png') });
    await fromLogo({ size: 16, out: join(PUBLIC, '.ico-16.png') });
    await run('convert', [
      join(PUBLIC, '.ico-16.png'), join(PUBLIC, '.ico-32.png'), join(PUBLIC, '.ico-64.png'),
      join(PUBLIC, 'favicon.ico'),
    ]);
    return 4;
  }

  // Fallback, used only if the logo master is missing.

  /**
   * One icon: a rounded square filled with the brand gradient, with the
   * dumbbell knocked out in near-black.
   *
   * The fill is a radial gradient rendered at exactly the tile size. An earlier
   * version rotated a linear gradient for a diagonal sweep, but `-rotate`
   * expands the canvas, and the re-crop left a clipped corner where the tile
   * and the alpha mask disagreed. No rotation means nothing to resynchronise.
   *
   * `maskable` insets the artwork into the middle 80%, because Android crops
   * maskable icons to a circle (or squircle) on some launchers and anything
   * outside that safe zone is lost.
   */
  const draw = async ({ size, out, maskable = false, radiusRatio = 0.22 }) => {
    const inset = maskable ? Math.round(size * 0.1) : 0;
    const s = size - inset * 2;
    const r = Math.round(s * (maskable ? 0.28 : radiusRatio));

    const cx = Math.round(size / 2);
    const cy = Math.round(size / 2);
    const barLen = Math.round(s * 0.24);
    const barW = Math.max(2, Math.round(s * 0.08));
    const plateH = Math.round(s * 0.21);
    const plateW = Math.max(2, Math.round(s * 0.072));

    await run('convert', [
      // Transparent canvas at the final size.
      '-size', `${size}x${size}`, 'xc:none',

      // Gradient tile, masked into a rounded square.
      '(',
      '-size', `${s}x${s}`, 'radial-gradient:#ff8a4d-#d42626',
      '(',
      '-size', `${s}x${s}`, 'xc:black', '-fill', 'white', '-stroke', 'none',
      '-draw', `roundrectangle 0,0 ${s - 1},${s - 1} ${r},${r}`,
      ')',
      '-alpha', 'off', '-compose', 'copy_opacity', '-composite',
      ')',
      '-gravity', 'center', '-compose', 'over', '-composite',

      // Dumbbell knocked out.
      '-fill', '#0a0a0c', '-stroke', 'none',
      '-draw', `roundrectangle ${cx - barLen},${cy - Math.round(barW / 2)} ${cx + barLen},${cy + Math.round(barW / 2)} ${Math.round(barW / 2)},${Math.round(barW / 2)}`,
      '-draw', `roundrectangle ${cx - barLen - plateW},${cy - plateH} ${cx - barLen},${cy + plateH} ${Math.round(plateW / 2)},${Math.round(plateW / 2)}`,
      '-draw', `roundrectangle ${cx + barLen},${cy - plateH} ${cx + barLen + plateW},${cy + plateH} ${Math.round(plateW / 2)},${Math.round(plateW / 2)}`,

      '-strip', out,
    ]);
  };

  await draw({ size: 512, out: join(PUBLIC, 'icon-512.png') });
  await draw({ size: 192, out: join(PUBLIC, 'icon-192.png') });
  await draw({ size: 512, out: join(PUBLIC, 'icon-maskable-512.png'), maskable: true });
  await draw({ size: 180, out: join(PUBLIC, 'apple-touch-icon.png') });

  // Multi-resolution .ico for legacy browsers and bookmark bars.
  await draw({ size: 64, out: join(PUBLIC, '.ico-64.png') });
  await draw({ size: 32, out: join(PUBLIC, '.ico-32.png') });
  await draw({ size: 16, out: join(PUBLIC, '.ico-16.png') });
  await run('convert', [
    join(PUBLIC, '.ico-16.png'), join(PUBLIC, '.ico-32.png'), join(PUBLIC, '.ico-64.png'),
    join(PUBLIC, 'favicon.ico'),
  ]);

  return 4;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero video
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Processes the hero video, or synthesises one from the poster image.
 *
 * With your own footage at src/assets/video/hero.source.mp4 this re-encodes it
 * to a web-safe MP4 and WebM, strips the audio track, and extracts a matching
 * poster frame. Without it, a slow zoom over the poster image stands in — which
 * reads as intentional motion design rather than a missing asset.
 */
async function makeHeroVideo() {
  await mkdir(VIDEO, { recursive: true });

  let ffmpegOk = true;
  try {
    await run('ffmpeg', ['-version']);
  } catch {
    ffmpegOk = false;
  }
  if (!ffmpegOk) {
    console.log('  ! ffmpeg not found — skipping hero video. The hero falls back to the poster image.');
    return false;
  }

  const sourceCandidates = ['hero.source.mp4', 'hero.source.mov', 'hero.source.webm', 'hero.source.MP4'];
  let source = null;
  for (const c of sourceCandidates) {
    const p = join(VIDEO, c);
    if (await exists(p)) { source = p; break; }
  }

  const mp4 = join(VIDEO, `${heroVideo.name}.mp4`);
  const webm = join(VIDEO, `${heroVideo.name}.webm`);
  const W = 1600;
  const H = 900;

  if (source) {
    // Real footage: trim, scale, crop to 16:9, drop audio.
    const vf = `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},fps=25`;
    await run('ffmpeg', [
      '-y', '-i', source, '-t', String(heroVideo.maxSeconds),
      '-an', '-vf', vf,
      '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
      '-crf', '26', '-preset', 'slow', '-movflags', '+faststart',
      mp4,
    ]);
    try {
      await run('ffmpeg', [
        '-y', '-i', source, '-t', String(heroVideo.maxSeconds),
        '-an', '-vf', vf,
        '-c:v', 'libvpx-vp9', '-crf', '38', '-b:v', '0', '-row-mt', '1',
        webm,
      ]);
    } catch {
      console.log('  ! WebM encode failed (no libvpx-vp9?) — MP4 only, which every browser supports.');
    }
    // Poster frame from the video, so there is no jump when playback starts.
    await run('ffmpeg', ['-y', '-i', mp4, '-vframes', '1', '-q:v', '2', join(SOURCE, 'hero-poster.jpg')]);
    return true;
  }

  // No footage: synthesise a slow push-in over the poster so the hero still moves.
  const poster = join(IMG, `hero-poster-${Math.max(...WIDTHS)}.jpg`);
  if (!(await exists(poster))) return false;

  const seconds = 8;
  const frames = seconds * 25;
  const vf = `zoompan=z='min(1+0.0009*on,1.18)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${W}x${H}:fps=25,` +
    `format=yuv420p`;

  await run('ffmpeg', [
    '-y', '-loop', '1', '-i', poster, '-frames:v', String(frames),
    '-an', '-vf', vf,
    '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-crf', '28', '-preset', 'slow', '-movflags', '+faststart',
    mp4,
  ]);
  try {
    await run('ffmpeg', [
      '-y', '-loop', '1', '-i', poster, '-frames:v', String(frames),
      '-an', '-vf', vf,
      '-c:v', 'libvpx-vp9', '-crf', '40', '-b:v', '0', '-row-mt', '1',
      webm,
    ]);
  } catch {
    /* MP4 alone is enough — every target browser plays it. */
  }
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  await mkdir(IMG, { recursive: true });
  await mkdir(SOURCE, { recursive: true });

  // A note in the source folder, so the next person to open the repo knows
  // exactly what to drop there.
  await writeFile(
    join(SOURCE, 'README.txt'),
    `Drop your real photos here, named after the keys in src/data/media.mjs.

  hero-main.jpg
  club-fitness-hamouchi-1.jpg
  discipline-boxe.jpg
  coach-khalid-hamouchi.jpg
  ...

Any of .jpg .jpeg .png .webp .heic .avif works. Then run:

  npm run media && npm run build

Files in this folder are the originals and are never served directly: the
pipeline crops, resizes, converts and strips metadata into ../  Keep the
originals here (or in your own backup) so you can regenerate at any time.

Use the largest version you have. Instagram and Facebook re-compress what they
serve, so download the original from your phone or camera rather than saving the
image from the app.
`,
    'utf8'
  );

  const names = only.length ? only : Object.keys(images);
  const unknown = names.filter((n) => !images[n]);
  if (unknown.length) {
    console.error(`Unknown image name(s): ${unknown.join(', ')}`);
    process.exitCode = 1;
    return;
  }

  let real = 0;
  let placeholder = 0;
  const stillPlaceholder = [];

  for (const name of names) {
    const entry = images[name];
    const source = await findSource(name);

    // Skip when outputs are newer than the source, unless --force.
    if (!FORCE && source) {
      const out = join(IMG, `${name}-${FALLBACK_WIDTH}.jpg`);
      if (await exists(out)) {
        const [a, b] = await Promise.all([stat(source), stat(out)]);
        if (b.mtimeMs > a.mtimeMs) {
          real += 1;
          continue;
        }
      }
    }

    if (source) {
      await makeDerivatives(name, entry, source);
      real += 1;
      console.log(`  ✓ ${name}  ← ${source.replace(ROOT + '/', '')}`);
    } else {
      const master = await makePlaceholderMaster(name, entry);
      await makeDerivatives(name, entry, master);
      await run('rm', ['-f', master]);
      placeholder += 1;
      stillPlaceholder.push(name);
    }
  }

  // The logo runs after the placeholders on purpose: makeOgCard overwrites the
  // generated og-default placeholder with the real branded share card.
  const logos = await makeLogo();
  const ogCard = await makeOgCard();
  const icons = await makeIcons();
  const video = await makeHeroVideo();

  // Files sitting in source/ that match no slot. Without this, dropping in a
  // folder of camera files (IMG_2847.jpg) appears to do nothing at all — the
  // pipeline matches on filename, so an unrecognised name is silently skipped
  // and you are left wondering why the site still shows placeholders.
  const strays = [];
  try {
    for (const entry of await readdir(SOURCE, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const base = entry.name.replace(/\.[^.]+$/, '');
      const ext = entry.name.slice(base.length + 1);
      if (entry.name === 'README.txt') continue;
      if (!SOURCE_EXTS.includes(ext)) continue;
      if (!images[base]) strays.push(entry.name);
    }
  } catch {
    /* source/ may not exist yet */
  }

  const dim = (s) => `\u001b[2m${s}\u001b[0m`;
  const cyan = (s) => `\u001b[36m${s}\u001b[0m`;
  const green = (s) => `\u001b[32m${s}\u001b[0m`;

  console.log('');
  console.log(`  ${green(`${real} real photo${real === 1 ? '' : 's'}`)}, ${cyan(
    `${placeholder} placeholder${placeholder === 1 ? '' : 's'}`
  )}, ${logos} logo sizes, ${icons} icon sizes${ogCard ? ', share card' : ''}${video ? ', hero video' : ''}`);

  if (strays.length) {
    const yellow = (s) => `\u001b[33m${s}\u001b[0m`;
    console.log('');
    console.log(yellow(`  ${strays.length} file(s) in source/ match no image slot and were ignored:`));
    for (const f of strays.slice(0, 20)) console.log(yellow(`    ! ${f}`));
    if (strays.length > 20) console.log(dim(`    … and ${strays.length - 20} more`));
    console.log(dim('    Rename each to one of the slot names listed below (keep the extension).'));
  }

  if (stillPlaceholder.length) {
    console.log('');
    console.log(cyan(`  Still placeholders — drop a photo in src/assets/img/source/ to replace:`));
    for (const name of stillPlaceholder) {
      const e = images[name];
      console.log(`    ${cyan('□')} ${name}.jpg  ${dim(`${e.ratio[0]}:${e.ratio[1]}`)}`);
      if (e.note) console.log(dim(`        ${e.note}`));
    }
  }
  console.log('');
}

main().catch((err) => {
  console.error('\nMedia pipeline failed:', err.stderr || err.message || err);
  process.exitCode = 1;
});
