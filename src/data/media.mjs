/**
 * ============================================================================
 *  MEDIA MANIFEST — every image slot on the site
 * ============================================================================
 *
 *  Images are referenced by the `name` keys below, never by a file path in a
 *  template. To change a photo you replace a file in `src/assets/img/source/`
 *  and change nothing else.
 *
 *  ──────────────────────────────────────────────────────────────────────────
 *  REPLACING A PHOTO
 *  ──────────────────────────────────────────────────────────────────────────
 *  1. Put the photo in `src/assets/img/source/` named exactly after the slot
 *     key, with any extension:  hero-main.jpg   discipline-kickboxing.png
 *  2. Run `npm run media`. It crops to the ratio below, generates every
 *     responsive size in WebP and JPEG, and strips EXIF metadata — which
 *     matters, because phone photos carry GPS coordinates.
 *  3. Run `npm run build`.
 *
 *  `npm run media` reports which slots are still placeholders and which files
 *  in source/ matched no slot.
 *
 *  ──────────────────────────────────────────────────────────────────────────
 *  WHY THE RATIOS MATTER
 *  ──────────────────────────────────────────────────────────────────────────
 *  Each entry declares an aspect ratio, and the templates write explicit
 *  width/height from it. That reserves the right space before the image loads,
 *  holding Cumulative Layout Shift at zero — one of the three Core Web Vitals
 *  Google ranks on.
 *
 *  Ratios are matched to the source photographs: landscape room shots stay
 *  landscape, portrait action shots stay portrait. Forcing a 3:2 room shot
 *  into a 3:4 card would throw away half the room.
 * ============================================================================
 */

/**
 * Responsive widths generated for every image. The browser picks one using the
 * srcset and the `sizes` hint.
 */
export const WIDTHS = [420, 760, 1100, 1600, 2200];

/** The width used for the JPEG fallback and for Open Graph images. */
export const FALLBACK_WIDTH = 1200;

/**
 * Default cap on generated width.
 *
 * Most images never render wider than about half the viewport — a discipline
 * card is roughly 400 CSS pixels even on a large screen, so 1100px covers it
 * at 2x device pixel ratio. Generating 2200px versions of those would triple
 * the repository size for pixels nobody sees. Full-bleed entries override it.
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
 * `tone` only affects generated placeholder artwork, for slots with no photo
 * yet. It is ignored once a real photo exists.
 */
export const images = {
  // ── Hero ────────────────────────────────────────────────────────────────
  'hero-main': {
    ratio: [16, 9],
    maxWidth: 2200,
    tone: 'ember',
    label: 'Plateau musculation',
    note: 'The most important photo on the site. Wide shot of the main training floor.',
  },
  'hero-poster': {
    ratio: [16, 9],
    maxWidth: 2200,
    tone: 'ember',
    label: 'Poster vidéo',
    note: 'First frame of the hero video. Should match the video so there is no jump when it starts.',
  },

  // ── The club ────────────────────────────────────────────────────────────
  // Landscape, because these are room shots.
  'club-1': { ratio: [4, 3], maxWidth: 1600, tone: 'ember', label: 'Plateau', note: 'Main weights floor, wide.' },
  'club-2': { ratio: [4, 3], maxWidth: 1600, tone: 'dark', label: 'Cardio', note: 'Cardio zone — treadmills, bikes.' },
  'club-3': { ratio: [4, 3], maxWidth: 1600, tone: 'sand', label: 'Haltères', note: 'Dumbbell and free-weight area.' },
  'club-4': { ratio: [4, 3], maxWidth: 1600, tone: 'ember', label: 'Accueil', note: 'Entrance, reception or shop area.' },

  // ── Disciplines ─────────────────────────────────────────────────────────
  // Portrait, because these are the tall cards on the home page and the
  // disciplines list, and because the source shots are people in action.
  'discipline-musculation': { ratio: [3, 4], maxWidth: 1100, tone: 'ember', label: 'Musculation', note: 'Someone lifting. Portrait.' },
  'discipline-cardio': { ratio: [3, 4], maxWidth: 1100, tone: 'dark', label: 'Cardio', note: 'Treadmills or bikes in use. Portrait.' },
  'discipline-kickboxing': { ratio: [3, 4], maxWidth: 1100, tone: 'ember', label: 'Kickboxing', note: 'Kickboxing training. Portrait.' },
  'discipline-kickboxing-enfants': { ratio: [3, 4], maxWidth: 1100, tone: 'sand', label: 'Kickboxing enfants', note: 'The children\'s class. Portrait. The child currently shown is the owner\'s brother, cleared by the family. Any REPLACEMENT showing a different, identifiable child needs that child\'s parents\' permission first.' },
  'discipline-coaching': { ratio: [3, 4], maxWidth: 1100, tone: 'ember', label: 'Coaching', note: 'A coach working with a member. Portrait.' },

  // ── People ──────────────────────────────────────────────────────────────
  'coach-khalid-hamouchi': {
    ratio: [1, 1],
    maxWidth: 1100,
    tone: 'dark',
    label: 'Coach',
    note: 'Khalid Hamouchi, square crop. Confirmed by the owner. A real face raises trust more than any other single image.',
  },

  // ── Gallery ─────────────────────────────────────────────────────────────
  // Mixed ratios on purpose: the gallery is a masonry layout, and uniform
  // tiles there read as a spreadsheet rather than a gallery.
  'gallery-1': { ratio: [4, 3], maxWidth: 1100, tone: 'ember', label: 'Galerie 1', note: 'Free gallery slot.' },
  'gallery-2': { ratio: [4, 3], maxWidth: 1100, tone: 'dark', label: 'Galerie 2', note: 'Free gallery slot.' },
  'gallery-3': { ratio: [4, 3], maxWidth: 1100, tone: 'sand', label: 'Galerie 3', note: 'Free gallery slot.' },
  'gallery-4': { ratio: [3, 4], maxWidth: 1100, tone: 'ember', label: 'Galerie 4', note: 'Free gallery slot, portrait.' },
  'gallery-5': { ratio: [4, 3], maxWidth: 1100, tone: 'dark', label: 'Galerie 5', note: 'Free gallery slot.' },
  'gallery-6': { ratio: [4, 3], maxWidth: 1100, tone: 'sand', label: 'Galerie 6', note: 'Free gallery slot.' },
  'gallery-7': { ratio: [1, 1], maxWidth: 1100, tone: 'ember', label: 'Galerie 7', note: 'Free gallery slot, square.' },
  'gallery-8': { ratio: [4, 3], maxWidth: 1100, tone: 'dark', label: 'Galerie 8', note: 'Free gallery slot.' },

  // ── Blog ────────────────────────────────────────────────────────────────
  'article-choisir-salle': { ratio: [16, 9], maxWidth: 1600, tone: 'dark', label: 'Choisir sa salle', note: 'Cover for the "how to choose a gym" article.' },
  'article-programme-debutant': { ratio: [16, 9], maxWidth: 1600, tone: 'ember', label: 'Programme débutant', note: 'Cover for the beginner programme article.' },
  'article-prix-salle': { ratio: [16, 9], maxWidth: 1600, tone: 'sand', label: 'Prix des salles', note: 'Cover for the gym pricing article.' },

  // ── Social / sharing ────────────────────────────────────────────────────
  'og-default': {
    ratio: [1200, 630],
    maxWidth: 1200,
    tone: 'ember',
    label: 'Fitness Hamouchi Gym',
    // Regenerated from the logo by makeOgCard in scripts/media.mjs — a share
    // card with no text tells a WhatsApp recipient nothing. Every other slot
    // stays abstract so baked-in text cannot collide with the real headings
    // that components overlay on their images.
    showLabel: true,
    note: 'Shown when the link is shared on WhatsApp or Facebook. Exactly 1200×630.',
  },
};

/**
 * The hero video.
 *
 * Replace `src/assets/video/hero.source.mp4` with real footage, then run
 * `npm run media` to regenerate the poster frame and a compressed WebM.
 *
 * Keep it SHORT and SILENT: 6–12 seconds, no audio, under about 3 MB. It
 * autoplays muted so audio is stripped anyway, and a heavy video directly
 * damages Largest Contentful Paint, which Google ranks on.
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
    throw new Error(`Unknown image "${name}". Add it to src/data/media.mjs or fix the reference.`);
  }
  return entry;
}

/** Intrinsic height for a given rendered width, from the declared ratio. */
export function heightFor(name, width) {
  const [w, h] = image(name).ratio;
  return Math.round((width * h) / w);
}
