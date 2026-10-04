/**
 * URL construction — the single place that knows how a page maps to a path.
 *
 * URL SCHEME
 * ──────────
 *   French (default)   /                /clubs/        /cours/      /blog/<slug>/
 *   Arabic             /ar/             /ar/clubs/     /ar/cours/   /ar/blog/<slug>/
 *   English            /en/             /en/clubs/     /en/classes/ /en/blog/<slug>/
 *
 * The default locale sits at the root rather than at /fr/. A site's homepage
 * accumulates more links and more authority than any other page, and splitting
 * that between / and /fr/ wastes it. Google's x-default hreflang then points at
 * the root, which is exactly what it is designed for.
 *
 * Every path ends in a slash and is written to <path>/index.html, so the same
 * output works on Vercel, Netlify, GitHub Pages, Cloudflare Pages or Apache
 * without per-host rewrite rules.
 */

import { site, locales } from '../data/site.mjs';

/** Locale prefix: '' for the default locale, '/<code>' for the others. */
export const localePrefix = (localeCode) =>
  localeCode === site.defaultLocale ? '' : `/${localeCode}`;

/**
 * Builds a site-root-relative path.
 *
 * @param {string} localeCode
 * @param {object} content   The locale's content module (for `routes`).
 * @param {string} key       A key of content.routes, or 'club'/'article'.
 * @param {string} [param]   Slug, for 'club' and 'article'.
 */
export function path(localeCode, content, key, param) {
  const prefix = localePrefix(localeCode);
  const routes = content.routes;

  if (key === 'home') return `${prefix}/`;
  if (key === 'club') return `${prefix}/${routes.clubs}/${param}/`;
  if (key === 'article') return `${prefix}/${routes.blog}/${param}/`;

  const segment = routes[key];
  if (segment === undefined) {
    throw new Error(`Unknown route key "${key}" for locale "${localeCode}".`);
  }
  return `${prefix}/${segment}/`;
}

/** Absolute URL for canonicals, hreflang, sitemap, Open Graph and JSON-LD. */
export function absolute(pathname) {
  const origin = String(site.url).replace(/\/+$/, '');
  return `${origin}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

/**
 * Builds the hreflang alternates for one logical page across every locale.
 *
 * Returns entries for all three locales plus x-default. Google requires these
 * to be reciprocal: every page in the set must list every other page in the
 * set, including itself, or the whole cluster is ignored.
 *
 * @param {object} contents  { fr: module, ar: module, en: module }
 */
export function alternates(contents, key, paramByLocale = {}) {
  const list = locales.map((loc) => ({
    hreflang: loc.code === site.defaultLocale ? loc.htmlLang : loc.htmlLang,
    code: loc.code,
    href: absolute(path(loc.code, contents[loc.code], key, paramByLocale[loc.code] ?? paramByLocale.default)),
  }));

  const def = list.find((l) => l.code === site.defaultLocale);
  return [...list, { hreflang: 'x-default', code: 'x-default', href: def.href }];
}

/** Asset URL. Assets are copied to /assets/* verbatim, so this is a prefix. */
export const asset = (relative) => `/assets/${relative.replace(/^\/+/, '')}`;

/**
 * Rewrites the {{key}} placeholders used in article bodies into real localised
 * links. Writing {{pricing}} in content keeps internal links correct in every
 * language without the author tracking three sets of slugs by hand.
 *
 * Internal linking is one of the cheapest SEO wins there is: it spreads
 * authority from articles to the pages that actually convert, and gives Google
 * anchor text describing what the target page is about.
 */
export function expandLinks(html, localeCode, content) {
  const labels = {
    pricing: content.nav.pricing,
    clubs: content.nav.clubs,
    contact: content.nav.contact,
    disciplines: content.nav.disciplines,
    coach: content.nav.coach,
    gallery: content.nav.gallery,
    blog: content.nav.blog,
    home: content.nav.home,
  };

  return String(html).replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in labels)) {
      throw new Error(`Unknown link placeholder {{${key}}} in ${localeCode} content.`);
    }
    const href = path(localeCode, content, key);
    return `<a href="${href}">${labels[key]}</a>`;
  });
}
