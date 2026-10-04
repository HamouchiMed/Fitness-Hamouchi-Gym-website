/**
 * ============================================================================
 *  MEDIA MANIFEST — where your real photos and videos go
 * ============================================================================
 *
 *  Every image on the site is referenced by the `name` keys below, never by a
 *  file path in a template. To put your own photos on the site you replace
 *  files in `src/assets/img/` and change nothing else.
 *
 *  ──────────────────────────────────────────────────────────────────────────
 *  HOW TO ADD YOUR REAL PHOTOS
 *  ──────────────────────────────────────────────────────────────────────────
 *  1. Pick the best photo you have for an entry below (your Instagram and
 *     Facebook posts are the obvious source — download the originals, not the
 *     compressed versions the apps re-serve).
 *
 *  2. Drop it in `src/assets/img/source/` named exactly after the `name` key,
 *     with any extension:   hero-main.jpg   discipline-boxe.png   ...
 *
 *  3. Run `npm run media`. That crops each photo to the ratio below, generates
 *     every responsive size in WebP and JPEG, and strips EXIF data (which
 *     otherwise leaks the GPS coordinates of wherever the photo was taken).
 *
 *  4. Run `npm run build`. Done — the whole site updates.
 *
 *  Any entry with no source photo falls back to a generated placeholder, so
 *  the site is never broken while you collect images. `npm run media` prints
 *  which entries are still placeholders.
 *
 *  ──────────────────────────────────────────────────────────────────────────
 *  WHY THE RATIOS MATTER
 *  ──────────────────────────────────────────────────────────────────────────
 *  Each entry declares its aspect ratio, and the templates write explicit
 *  width/height attributes from it. That reserves the right space before the
 *  image loads, which keeps Cumulative Layout Shift at zero — one of the three
 *  Core Web Vitals Google ranks on. Change a ratio here and the layout follows.
 * ============================================================================
 */

/**
 * Responsive widths generated for every image. The browser picks one from the
 * srcset based on the viewport and the device pixel ratio.
 *
 * 420 covers phones at 1x, 1600 covers a desktop hero, 2200 covers a retina
 * laptop. Going beyond that wastes bandwidth for no visible gain.
 */
export const WIDTHS = [420, 760, 1100, 1600, 2200];

/** The width used for the JPEG fallback and for Open Graph images. */
export const FALLBACK_WIDTH = 1200;

/**
 * Default cap on generated width.
 *
 * Most images never render wider than about half the viewport — a discipline
 * card is roughly 400 CSS pixels even on a large screen, so 1100px already
 * covers it at 2x device pixel ratio. Generating 2200px versions of those would
 * triple the repository size and the deploy payload for pixels no one sees.
 *
 * Entries that genuinely go full-bleed (the hero, article covers) override this
 * with their own `maxWidth`.
 */
export const DEFAULT_MAX_WIDTH = 1600;

/** The widths actually generated for one entry. */
export function widthsFor(name) {
  const entry = images[name];
  const cap = entry?.maxWidth ?? DEFAULT_MAX_WIDTH;
  const list = WIDTHS.filter((w) => w <= cap);
  return list.length ? list : [WIDTHS[0]];
}

/**
 * `tone` only affects the generated placeholder artwork, so the site looks
 * deliberate before your photos arrive. It is ignored once a real photo exists.
 */
export const images = {
  // ── Hero ────────────────────────────────────────────────────────────────
  'hero-main': {
    ratio: [16, 9],
    maxWidth: 2200,
    tone: 'ember',
    label: 'Plateau musculation',
    note: 'The single most important photo on the site. Wide shot of the busiest, best-looking part of your main club, ideally with people training. Shoot in landscape.',
  },
  'hero-poster': {
    ratio: [16, 9],
    maxWidth: 2200,
    tone: 'ember',
    label: 'Poster vidéo',
    note: 'First frame of the hero video. Should match the video so there is no visible jump when it starts playing.',
  },

  // ── Clubs ───────────────────────────────────────────────────────────────
  'club-fitness-hamouchi-1': { ratio: [4, 3], maxWidth: 1600, tone: 'ember', label: 'Fitness Hamouchi — plateau', note: 'Main weights floor at Fitness Hamouchi Gym.' },
  'club-fitness-hamouchi-2': { ratio: [4, 3], maxWidth: 1600, tone: 'dark', label: 'Fitness Hamouchi — cardio', note: 'Cardio zone at Fitness Hamouchi Gym.' },
  'club-fitness-hamouchi-3': { ratio: [4, 3], maxWidth: 1600, tone: 'sand', label: 'Fitness Hamouchi — espace', note: 'Any third angle: entrance, cross training area, changing rooms.' },
  'club-nour-1': { ratio: [4, 3], maxWidth: 1600, tone: 'ember', label: 'Club Nour — plateau', note: 'Main weights floor at Club Nour.' },
  'club-nour-2': { ratio: [4, 3], maxWidth: 1600, tone: 'dark', label: 'Club Nour — cardio', note: 'Cardio zone at Club Nour.' },
  'club-nour-3': { ratio: [4, 3], maxWidth: 1600, tone: 'sand', label: 'Club Nour — espace', note: 'Any third angle at Club Nour.' },

  // ── Disciplines ─────────────────────────────────────────────────────────
  'discipline-musculation': { ratio: [3, 4], maxWidth: 1100, tone: 'ember', label: 'Musculation', note: 'Someone lifting — squat rack or bench. Portrait orientation.' },
  'discipline-cross-training': { ratio: [3, 4], maxWidth: 1100, tone: 'dark', label: 'Cross training', note: 'Kettlebells, ropes or a circuit in progress. Portrait.' },
  'discipline-cardio': { ratio: [3, 4], maxWidth: 1100, tone: 'sand', label: 'Cardio', note: 'Treadmills or rowers in use. Portrait.' },
  'discipline-boxe': { ratio: [3, 4], maxWidth: 1100, tone: 'ember', label: 'Boxe', note: 'Bag work or pads. Portrait.' },
  'discipline-fitness-femmes': { ratio: [3, 4], maxWidth: 1100, tone: 'sand', label: 'Fitness femmes', note: 'The women\'s area or a women\'s class. Portrait. Get permission before publishing photos of members.' },
  'discipline-aerobic': { ratio: [3, 4], maxWidth: 1100, tone: 'dark', label: 'Aérobic', note: 'A group class mid-session. Portrait.' },
  'discipline-coaching': { ratio: [3, 4], maxWidth: 1100, tone: 'ember', label: 'Coaching personnel', note: 'A coach correcting someone\'s form. Portrait.' },

  // ── People ──────────────────────────────────────────────────────────────
  'coach-khalid-hamouchi': {
    ratio: [1, 1],
    maxWidth: 1100,
    tone: 'dark',
    label: 'Khalid Hamouchi',
    note: 'Portrait of Khalid. Square crop. A real face raises trust and conversion more than any other single image.',
  },

  // ── Gallery ─────────────────────────────────────────────────────────────
  'gallery-1': { ratio: [4, 5], maxWidth: 1100, tone: 'ember', label: 'Galerie 1', note: 'Free gallery slot — your best training photos.' },
  'gallery-2': { ratio: [4, 5], maxWidth: 1100, tone: 'dark', label: 'Galerie 2', note: 'Free gallery slot.' },
  'gallery-3': { ratio: [4, 5], maxWidth: 1100, tone: 'sand', label: 'Galerie 3', note: 'Free gallery slot.' },
  'gallery-4': { ratio: [4, 5], maxWidth: 1100, tone: 'ember', label: 'Galerie 4', note: 'Free gallery slot.' },
  'gallery-5': { ratio: [4, 5], maxWidth: 1100, tone: 'dark', label: 'Galerie 5', note: 'Free gallery slot.' },
  'gallery-6': { ratio: [4, 5], maxWidth: 1100, tone: 'sand', label: 'Galerie 6', note: 'Free gallery slot.' },

  // ── Blog ────────────────────────────────────────────────────────────────
  'article-choisir-salle': { ratio: [16, 9], maxWidth: 1600, tone: 'dark', label: 'Choisir sa salle', note: 'Cover image for the "how to choose a gym" article.' },
  'article-programme-debutant': { ratio: [16, 9], maxWidth: 1600, tone: 'ember', label: 'Programme débutant', note: 'Cover image for the beginner programme article.' },
  'article-prix-salle': { ratio: [16, 9], maxWidth: 1600, tone: 'sand', label: 'Prix des salles', note: 'Cover image for the gym pricing article.' },

  // ── Social / sharing ────────────────────────────────────────────────────
  'og-default': {
    ratio: [1200, 630],
    maxWidth: 1200,
    tone: 'ember',
    label: 'Fitness Hamouchi Gym',
    // The only placeholder that renders its label: a share card with no text
    // on it tells a WhatsApp recipient nothing. Every other slot stays
    // abstract so baked-in text cannot collide with the real headings that
    // components overlay on top of their images.
    showLabel: true,
    note: 'The image shown when a link is shared on WhatsApp, Facebook or Instagram DMs. Must be exactly 1200×630. Keep text large and centred — it gets cropped on some apps.',
  },
};

/**
 * The hero video. A real video of the gym in motion converts far better than a
 * still, and WhatsApp previews it too.
 *
 * Replace `src/assets/video/hero.mp4` with your own footage, then run
 * `npm run media` to regenerate the poster frame and a compressed WebM.
 *
 * Keep it SHORT and SILENT: 6–12 seconds, no audio track, under about 3 MB.
 * It autoplays muted, so sound would be stripped anyway, and a heavy video
 * directly damages Largest Contentful Paint — which Google ranks on.
 */
export const heroVideo = {
  name: 'hero',
  poster: 'hero-poster',
  maxSeconds: 12,
  targetBytes: 3_000_000,
};

/** Resolves an entry, throwing on a typo rather than emitting a broken image. */
export function image(name) {
  const entry = images[name];
  if (!entry) {
    throw new Error(
      `Unknown image "${name}". Add it to src/data/media.mjs or fix the reference.`
    );
  }
  return entry;
}

/** Intrinsic height for a given rendered width, from the declared ratio. */
export function heightFor(name, width) {
  const [w, h] = image(name).ratio;
  return Math.round((width * h) / w);
}
