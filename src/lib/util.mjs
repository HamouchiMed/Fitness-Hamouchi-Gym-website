/**
 * Small helpers shared by every template. No dependencies — this file and the
 * rest of the build run on plain Node with nothing installed.
 */

/**
 * Escapes text for insertion into HTML body content or a quoted attribute.
 * Everything that reaches the page from the content files goes through here,
 * so an apostrophe in "l'entraînement" or an ampersand in a club name can
 * never break the markup.
 */
export function esc(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escapes a string for use inside a JSON-LD <script> block. */
export function jsonLd(data) {
  // Strip undefined values so unverified fields vanish instead of serialising
  // as null, which some validators flag.
  const clean = JSON.parse(JSON.stringify(data, (_, v) => (v === undefined ? undefined : v)));
  // `</script>` inside a JSON string would close the block early; escaping the
  // forward slash is the standard, spec-safe fix.
  return JSON.stringify(clean, null, 2).replace(/</g, '\\u003c');
}

/** Joins truthy class names. */
export const cx = (...parts) => parts.filter(Boolean).join(' ');

/** Renders an attribute only when the value is non-empty. */
export const attr = (name, value) =>
  value == null || value === '' || value === false ? '' : ` ${name}="${esc(value)}"`;

/** Joins template fragments, dropping null/undefined/false entries. */
export const join = (list, sep = '\n') => list.filter(Boolean).join(sep);

/** Maps an array into HTML and joins it. */
export const each = (list, fn, sep = '\n') => (list || []).map(fn).join(sep);

/** URL/file-safe slug. Strips accents so "séance" becomes "seance". */
export function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Estimates reading time in minutes from HTML, for the article meta line and
 * `timeRequired` in Article structured data.
 */
export function readingTime(html) {
  const words = String(html).replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Strips tags and collapses whitespace — used to build meta descriptions. */
export const stripTags = (html) => String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Formats a YYYY-MM-DD date for display in the given locale.
 * Node ships full ICU, so Arabic and French month names come out correctly.
 */
export function formatDate(iso, localeCode) {
  const map = { fr: 'fr-MA', ar: 'ar-MA', en: 'en-GB' };
  try {
    return new Intl.DateTimeFormat(map[localeCode] || 'en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      // Western digits in Arabic too: Moroccan sites use 1/2/3, not ١/٢/٣.
      numberingSystem: 'latn',
    }).format(new Date(`${iso}T12:00:00Z`));
  } catch {
    return iso;
  }
}

/** Groups consecutive opening-hours entries into display lines. */
export function formatHours(hours, ui) {
  return hours.map((slot) => {
    const names = slot.days.map((d) => ui.daysShort[d] || d);
    const label =
      slot.days.length > 2
        ? `${names[0]} – ${names[names.length - 1]}`
        : names.join(', ');
    return { label, time: `${slot.opens} – ${slot.closes}` };
  });
}

/**
 * Converts the hours array into schema.org openingHoursSpecification.
 */
export function hoursSchema(hours) {
  const FULL = {
    Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday',
    Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday',
  };
  return hours.map((slot) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: slot.days.map((d) => `https://schema.org/${FULL[d]}`),
    opens: slot.opens,
    closes: slot.closes,
  }));
}

/** Indents a block of HTML — purely cosmetic, keeps View Source readable. */
export const indent = (html, spaces = 2) =>
  String(html)
    .split('\n')
    .map((line) => (line.trim() ? ' '.repeat(spaces) + line : line))
    .join('\n');
