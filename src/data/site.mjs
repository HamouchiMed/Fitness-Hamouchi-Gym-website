/**
 * ============================================================================
 *  SOURCE OF TRUTH — business data for Fitness Hamouchi Gym
 * ============================================================================
 *
 *  Everything factual about the business lives here, once. Pages, structured
 *  data (JSON-LD), sitemaps and meta tags all read from this file, so a change
 *  here propagates to every page in every language.
 *
 *  ──────────────────────────────────────────────────────────────────────────
 *  ABOUT THE `TODO(...)` WRAPPER  —  read this before you launch
 *  ──────────────────────────────────────────────────────────────────────────
 *  Values wrapped in TODO() are placeholders that could NOT be verified when
 *  the site was built. They behave like normal strings on the page, but:
 *
 *    1. `npm run build` prints every one of them as a launch checklist.
 *    2. They are OMITTED from JSON-LD structured data.
 *
 *  Reason for (2): Google cross-checks the name/address/phone ("NAP") in your
 *  structured data against your Google Business Profile and third-party
 *  directories. A placeholder phone number or a guessed address is worse than
 *  no value at all — inconsistent NAP is one of the fastest ways to lose local
 *  pack rankings. So an unverified field simply doesn't get claimed.
 *
 *  TO GO LIVE: replace `TODO('+212 ...')` with `'+212 ...'` — drop the
 *  wrapper, keep the quotes. The build checklist shrinks as you go. When it
 *  reports zero remaining, your structured data is complete.
 * ============================================================================
 */

/** Collects unverified values so the build can report them. */
export const todos = [];

/**
 * Marks a value as unverified. Renders on the page, but is withheld from
 * structured data and reported by the build.
 * @param {string} value   Placeholder shown on the page.
 * @param {string} [note]  What you need to find out.
 */
export function TODO(value, note = '') {
  const box = new String(value);
  box.__todo = true;
  box.__note = note;
  todos.push({ value, note });
  return box;
}

/** True when a value came from TODO() and must stay out of JSON-LD. */
export const isTodo = (v) => Boolean(v && v.__todo);

/** Returns the value for JSON-LD, or undefined if unverified. */
export const verified = (v) => (isTodo(v) || v == null || v === '' ? undefined : String(v));

// ─────────────────────────────────────────────────────────────────────────────
// Site-wide
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Works out the canonical origin at build time.
 *
 * Order of preference:
 *   1. SITE_URL, if you set it yourself (any host, any CI).
 *   2. The URL the hosting platform injects — Vercel sets
 *      VERCEL_PROJECT_PRODUCTION_URL (the stable production domain) and
 *      VERCEL_URL (this specific deployment). Netlify sets URL.
 *   3. The placeholder below, flagged on the build checklist.
 *
 * Why this matters: every canonical tag, every hreflang alternate and every
 * sitemap entry is absolute and built from this value. If it names a domain
 * you do not actually own, you are telling Google "the real version of this
 * page lives somewhere else" — and it will decline to index the site it is
 * actually looking at. Resolving it from the platform means a first deploy is
 * correctly self-canonical before you have bought a domain at all.
 *
 * Preview deployments are unaffected: Vercel already serves those with
 * `x-robots-tag: noindex`, so they stay out of the index regardless.
 */
function resolveOrigin() {
  const fromEnv =
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    process.env.URL; // Netlify

  if (fromEnv) {
    const origin = `https://${String(fromEnv)
      .replace(/^https?:\/\//, '')
      .replace(/\/+$/, '')}`;

    // Still worth flagging: a *.vercel.app address works, but a real domain is
    // what you want on business cards and in your Google Business Profile.
    todos.push({
      value: origin,
      note:
        'Using the deployment URL the host provided. Once you own a domain, set site.url to it ' +
        '(or set a SITE_URL environment variable) and redeploy.',
    });
    return origin;
  }

  return TODO(
    'https://fitnesshamouchi.ma',
    'Buy the domain, then set the real origin here (no trailing slash). A deploy on Vercel or Netlify fills this in automatically.'
  );
}

export const site = {
  /**
   * Canonical origin, no trailing slash. Every absolute URL, the sitemap and
   * every canonical tag derive from this. See resolveOrigin above.
   */
  url: resolveOrigin(),

  /** Short brand used in nav, logo and the tail of every <title>. */
  brand: 'Fitness Hamouchi',

  /** Full legal/organisation name used in Organization structured data. */
  legalName: 'Fitness Hamouchi Gym',

  /** Default language. Served at the site root, and the hreflang x-default. */
  defaultLocale: 'fr',

  /** Year the business started training people — used in "since" copy. */
  founded: TODO('2015', 'Which year did the first club open? Drives "depuis ____" copy and foundingDate in schema.'),

  /** Owner / head coach. Gets a Person schema and an author byline on articles. */
  owner: {
    name: 'Khalid Hamouchi',
    role: { fr: 'Fondateur & Coach principal', ar: 'المؤسس والمدرب الرئيسي', en: 'Founder & Head Coach' },
    facebook: 'https://www.facebook.com/khalid.hamouchi.2025',
    photo: 'coach-khalid-hamouchi',
  },

  /**
   * Primary contact, used in the header CTA and the WhatsApp button.
   * `tel` must be E.164 (+212...) for click-to-call to work on every phone.
   * `whatsapp` is digits only, no + and no spaces.
   */
  contact: {
    tel: TODO('+212600000000', 'Main phone number in E.164 format, e.g. +212612345678.'),
    whatsapp: TODO('212600000000', 'WhatsApp number, digits only, no + and no spaces.'),
    email: TODO('contact@fitnesshamouchi.ma', 'Public contact email. A real mailbox you check.'),
  },

  /** Social profiles. Fed to Organization.sameAs, which helps knowledge-panel linking. */
  social: {
    instagram: 'https://www.instagram.com/fitness_hamouchi_gym',
    facebook: 'https://www.facebook.com/ClubNourBerrechid',
    tiktok: TODO('', 'TikTok URL if you have one — leave empty to hide the icon.'),
    youtube: TODO('', 'YouTube URL if you have one — leave empty to hide the icon.'),
  },

  /** Analytics. Leave empty and no tracking script is emitted at all. */
  analytics: {
    plausibleDomain: '', // e.g. 'fitnesshamouchi.ma' — privacy-friendly, no cookie banner needed
    gaMeasurementId: '', // e.g. 'G-XXXXXXXXXX' — needs a cookie banner under GDPR-style rules
  },

  /** Verification tokens from Search Console / Bing. Empty = tag omitted. */
  verification: {
    google: '',
    bing: '',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Opening hours
// ─────────────────────────────────────────────────────────────────────────────
// `days` uses schema.org DayOfWeek shorthand understood by the generator:
//   Mo Tu We Th Fr Sa Su
// Times are 24h "HH:MM". A club closed on a day simply omits that day.

const STANDARD_HOURS = [
  { days: ['Mo', 'Tu', 'We', 'Th', 'Fr'], opens: '06:00', closes: '23:00' },
  { days: ['Sa'], opens: '08:00', closes: '22:00' },
  { days: ['Su'], opens: '09:00', closes: '14:00' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Locations
// ─────────────────────────────────────────────────────────────────────────────
// Each entry becomes:
//   • a page at /<locale>/clubs/<slug>/
//   • one HealthClub JSON-LD block with its own address, geo, hours and phone
//   • an entry in the sitemap and the clubs index
//
// Two clubs that are genuinely separate premises should stay separate entries:
// Google treats each physical location as its own local entity, and one page
// per location is what lets both appear in the local pack.

export const locations = [
  {
    slug: 'fitness-hamouchi-gym',
    /** Set exactly one location as primary — it supplies the Organization address. */
    primary: true,
    name: 'Fitness Hamouchi Gym',
    /** Short label for nav, chips and breadcrumbs. */
    shortName: 'Fitness Hamouchi',
    /**
     * Former names of the SAME premises.
     *
     * The gym traded as "Club Nour" before rebranding, and that name still has
     * a Facebook page, printed references and years of word of mouth behind
     * it. People in Berrechid will go on searching for it for a long time.
     *
     * These feed `alternateName` in the structured data and a line of visible
     * copy, so a search for the old name still resolves to this business
     * instead of to nothing. Removing them would throw away real search
     * traffic that costs nothing to keep.
     */
    formerNames: ['Club Nour', 'Club Nour Berrechid'],
    /** Appears after the name in titles: "Fitness Hamouchi Gym — Berrechid". */
    locality: 'Berrechid',
    region: 'Casablanca-Settat',
    country: 'MA',
    countryName: { fr: 'Maroc', ar: 'المغرب', en: 'Morocco' },
    street: TODO('Adresse à compléter', 'Street address exactly as it appears on your Google Business Profile.'),
    postalCode: TODO('26100', 'Postal code (Berrechid is 26100 — confirm).'),
    tel: TODO('+212600000000', 'Phone number, E.164.'),
    /** Decimal degrees. Right-click the pin in Google Maps to copy them. */
    geo: { lat: TODO('33.2655', 'Latitude of the gym.'), lon: TODO('-7.5856', 'Longitude of the gym.') },
    /** Paste the "share" link from your Google Business Profile. */
    mapsUrl: TODO('', 'Google Maps share link.'),
    /** Paste the src of the Google Maps "embed a map" iframe. Empty = static fallback shown. */
    mapsEmbed: TODO('', 'Google Maps embed URL.'),
    hours: STANDARD_HOURS,
    /** Hero/gallery image basenames, resolved from src/assets/img. */
    images: ['club-1', 'club-2', 'club-3', 'club-4'],
    /** Which amenity keys from content.amenities the gym has. */
    amenities: ['musculation', 'cardio', 'kickboxing', 'coaching', 'vestiaires', 'douches'],
    /** Which discipline slugs are taught here. */
    disciplines: ['musculation', 'cardio', 'kickboxing', 'kickboxing-enfants', 'coaching-personnel'],
    audience: 'mixed', // 'mixed' | 'women' | 'men'
  },
];

export const primaryLocation = locations.find((l) => l.primary) || locations[0];

// ─────────────────────────────────────────────────────────────────────────────
// Membership plans
// ─────────────────────────────────────────────────────────────────────────────
// Prices drive both the pricing table and Offer structured data. Google shows
// price ranges for local businesses, and accurate numbers reduce the "how much
// is it?" messages you have to answer by hand.
//
// `price` is a bare number as a string, in the currency below. Set a plan's
// `price` to null to show "sur demande" / "on request" instead.
//
// NOTE: unlike every other TODO() value, an unverified price does NOT render.
// The card shows "on request" until you put the real number here. A wrong
// price on a website is a broken promise at the front desk, so the site would
// rather say nothing than guess.

export const currency = 'MAD';

export const plans = [
  {
    id: 'seance',
    price: TODO('50', 'Price of a single drop-in session, in MAD.'),
    period: 'session',
    featured: false,
  },
  {
    id: 'mensuel',
    price: TODO('250', 'Monthly membership price, in MAD.'),
    period: 'month',
    featured: true, // highlighted card
  },
  {
    id: 'trimestriel',
    price: TODO('650', 'Quarterly membership price, in MAD.'),
    period: 'quarter',
    featured: false,
  },
  {
    id: 'annuel',
    price: TODO('2200', 'Annual membership price, in MAD.'),
    period: 'year',
    featured: false,
  },
  {
    id: 'coaching',
    price: TODO('', 'Personal-training rate, in MAD. Leave empty to show "on request".'),
    period: 'month',
    featured: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Social proof
// ─────────────────────────────────────────────────────────────────────────────
// Headline numbers shown in the stats band. Keep them honest and verifiable —
// a visitor who walks in and sees a quarter of what you claimed is a lost sale.
//
// These DO render while unverified, because a stats band with blanks in it
// looks broken. That makes them the most important item on the build
// checklist: the figures below are placeholders, and publishing them unchanged
// means publishing claims about your business that you have not checked.

export const stats = {
  members: TODO('500', 'Roughly how many active members does the gym have?'),
  years: TODO('10', 'Years in business. Should agree with site.founded.'),
  coaches: TODO('6', 'How many coaches on the team?'),
  surface: TODO('800', 'Total training surface in m².'),
};

/**
 * Real reviews only. Each needs a name and the text; `role` and `source` are
 * optional. An empty array hides the testimonials section entirely.
 *
 * Do NOT invent these. Review structured data built on fabricated reviews is a
 * documented manual-action trigger, and the honest version converts better
 * anyway. Collect them from your Google Business Profile or ask members
 * directly, then paste them in.
 */
export const testimonials = [
  // {
  //   name: 'Youssef B.',
  //   role: { fr: 'Membre depuis 2 ans', ar: 'عضو منذ سنتين', en: 'Member for 2 years' },
  //   source: 'google',
  //   quote: {
  //     fr: '…',
  //     ar: '…',
  //     en: '…',
  //   },
  // },
];

// ─────────────────────────────────────────────────────────────────────────────
// Locales
// ─────────────────────────────────────────────────────────────────────────────
// `code` is the hreflang value, `htmlLang` the <html lang>, `dir` the text
// direction. Order sets the order of the language switcher.

export const locales = [
  { code: 'fr', htmlLang: 'fr-MA', dir: 'ltr', label: 'Français', shortLabel: 'FR', ogLocale: 'fr_MA' },
  { code: 'ar', htmlLang: 'ar-MA', dir: 'rtl', label: 'العربية', shortLabel: 'AR', ogLocale: 'ar_MA' },
  { code: 'en', htmlLang: 'en', dir: 'ltr', label: 'English', shortLabel: 'EN', ogLocale: 'en_US' },
];

export const localeCodes = locales.map((l) => l.code);
export const getLocale = (code) => locales.find((l) => l.code === code);
