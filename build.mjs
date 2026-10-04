#!/usr/bin/env node
/**
 * ============================================================================
 *  Static site generator
 * ============================================================================
 *
 *  Reads the data and content modules, renders every page in every locale, and
 *  writes a plain static site to dist/. No dependencies — `node build.mjs` is
 *  the whole toolchain.
 *
 *  Beyond the pages it also produces everything search engines and browsers
 *  expect at well-known paths: sitemap.xml with hreflang alternates, robots.txt,
 *  a per-locale RSS feed, the web manifest, favicons and a 404 page.
 *
 *  At the end it runs a set of checks (duplicate titles, over-long meta
 *  descriptions, missing images, unverified business data) and prints them as a
 *  launch checklist. The build fails on anything that would produce a broken
 *  page, and warns on anything that would merely rank badly.
 * ============================================================================
 */

import { mkdir, writeFile, readdir, copyFile, stat as fsStat, rm, access } from 'node:fs/promises';
import { dirname, join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, locales, locations, localeCodes, todos, verified } from './src/data/site.mjs';
import { images, WIDTHS, FALLBACK_WIDTH } from './src/data/media.mjs';
import { path as urlPath, absolute, alternates, asset, localePrefix } from './src/lib/urls.mjs';
import { esc, readingTime, stripTags } from './src/lib/util.mjs';
import * as S from './src/lib/schema.mjs';
import { layout } from './src/templates/layout.mjs';

import homePage from './src/templates/pages/home.mjs';
import { clubsIndexPage, clubPage } from './src/templates/pages/clubs.mjs';
import { disciplinesPage, pricingPage, coachPage, galleryPage } from './src/templates/pages/catalog.mjs';
import { contactPage, notFoundPage } from './src/templates/pages/contact.mjs';
import { blogIndexPage, articlePage } from './src/templates/pages/blog.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const PUBLIC = join(ROOT, 'public');

// Collected during the run and reported at the end.
const warnings = [];
const errors = [];
const written = [];
const seenTitles = new Map();
const seenDescriptions = new Map();

const warn = (msg) => warnings.push(msg);
const fail = (msg) => errors.push(msg);

// ─────────────────────────────────────────────────────────────────────────────
// Content loading
// ─────────────────────────────────────────────────────────────────────────────

/** Loads every locale's content module up front, keyed by locale code. */
async function loadContent() {
  const entries = await Promise.all(
    localeCodes.map(async (code) => {
      const mod = await import(`./src/content/${code}.mjs`);
      return [code, mod.default];
    })
  );
  return Object.fromEntries(entries);
}

/**
 * Checks that every locale defines the same shape, so a missing Arabic key
 * fails the build instead of rendering "undefined" on a live page.
 */
function verifyContentParity(contents) {
  const reference = contents[site.defaultLocale];

  const walk = (ref, candidate, trail, code) => {
    for (const key of Object.keys(ref)) {
      const here = trail ? `${trail}.${key}` : key;
      if (!(key in candidate)) {
        fail(`Locale "${code}" is missing content key: ${here}`);
        continue;
      }
      const a = ref[key];
      const b = candidate[key];
      // `targets` is the per-market keyword brief, not rendered content — the
      // French and Arabic keyword sets are deliberately different sizes.
      if (key === 'targets') continue;
      if (Array.isArray(a)) {
        if (!Array.isArray(b)) {
          fail(`Locale "${code}": ${here} should be an array.`);
        } else if (a.length !== b.length) {
          warn(`Locale "${code}": ${here} has ${b.length} items, "${site.defaultLocale}" has ${a.length}.`);
        }
      } else if (a && typeof a === 'object') {
        if (b && typeof b === 'object') walk(a, b, here, code);
        else fail(`Locale "${code}": ${here} should be an object.`);
      }
    }
  };

  for (const code of localeCodes) {
    if (code === site.defaultLocale) continue;
    walk(reference, contents[code], '', code);
  }

  // Articles must exist under the same slugs in every locale, or the hreflang
  // cluster for a post would point at a 404 in the other languages.
  const refSlugs = reference.articles.map((a) => a.slug).sort();
  for (const code of localeCodes) {
    if (code === site.defaultLocale) continue;
    const slugs = contents[code].articles.map((a) => a.slug).sort();
    if (slugs.join('|') !== refSlugs.join('|')) {
      fail(
        `Article slugs differ between "${site.defaultLocale}" [${refSlugs}] and "${code}" [${slugs}]. ` +
          `Translations must share a slug so hreflang can pair them.`
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SEO checks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Title and description quality gates.
 *
 * Duplicate titles across pages are the single most common technical SEO fault
 * on small sites: Google picks one page and drops the rest as near-duplicates.
 * Length limits are soft — exceeding them means truncation in results, not an
 * error — so they warn rather than fail.
 */
function checkMeta({ title, description, pathname, localeCode }) {
  // Must match layout.js exactly, or the reported length is not the length
  // that will actually appear in search results.
  const fullTitle = title.includes(site.brand) ? title : `${title} | ${site.brand}`;

  // Duplicates are only a problem WITHIN a locale. The same title in French
  // and English is expected — that is what the hreflang cluster is for, and
  // Google treats those as translations rather than as competing duplicates.
  const titleKey = `${localeCode}::${fullTitle}`;
  if (seenTitles.has(titleKey)) {
    warn(`Duplicate <title> on ${pathname} and ${seenTitles.get(titleKey)} — make them distinct.`);
  } else {
    seenTitles.set(titleKey, pathname);
  }

  const descKey = `${localeCode}::${description}`;
  if (seenDescriptions.has(descKey)) {
    warn(`Duplicate meta description on ${pathname} and ${seenDescriptions.get(descKey)}.`);
  } else {
    seenDescriptions.set(descKey, pathname);
  }

  // Arabic renders wider per character in search results, so allow a little
  // less before warning.
  const titleLimit = localeCode === 'ar' ? 58 : 62;
  if (fullTitle.length > titleLimit) {
    warn(`Title is ${fullTitle.length} chars (over ~${titleLimit}) and will be truncated: ${pathname}`);
  }
  if (description.length > 165) {
    warn(`Meta description is ${description.length} chars (over ~160): ${pathname}`);
  }
  if (description.length < 70) {
    warn(`Meta description is only ${description.length} chars — too short to be useful: ${pathname}`);
  }
}

/** Flags image references that have no generated files behind them. */
async function checkImage(name) {
  const file = join(SRC, 'assets', 'img', `${name}-${FALLBACK_WIDTH}.jpg`);
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Page writing
// ─────────────────────────────────────────────────────────────────────────────

async function writePage(pathname, html) {
  // "/clubs/" → dist/clubs/index.html ; "/" → dist/index.html
  const rel = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  const dir = rel ? join(DIST, rel) : DIST;
  await mkdir(dir, { recursive: true });
  const file = join(dir, 'index.html');
  await writeFile(file, html, 'utf8');
  written.push(pathname);
}

/**
 * Builds the shared entity nodes present on every page: the organisation, the
 * website, the founder, and both clubs. Repeating them per page with stable
 * @ids is what lets a crawler resolve a reference from any entry point.
 */
function baseNodes({ localeCode, content }) {
  const logoUrl = absolute(asset(`img/og-default-${FALLBACK_WIDTH}.jpg`));
  const coachUrl = absolute(asset(`img/${site.owner.photo}-${FALLBACK_WIDTH}.jpg`));

  return [
    S.organizationSchema({ localeCode, content, logoUrl }),
    S.websiteSchema({ localeCode, content }),
    S.personSchema({ localeCode, imageUrl: coachUrl }),
    ...locations.map((loc) =>
      S.clubSchema(loc, {
        localeCode,
        content,
        imageUrls: loc.images.map((n) => absolute(asset(`img/${n}-${FALLBACK_WIDTH}.jpg`))),
      })
    ),
  ];
}

/** Breadcrumb trail builder. */
function crumbsFor(localeCode, content, trail) {
  return [
    { name: content.ui.breadcrumbHome, path: urlPath(localeCode, content, 'home') },
    ...trail,
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-locale render
// ─────────────────────────────────────────────────────────────────────────────

async function renderLocale({ localeCode, content, contents }) {
  const pages = [];

  /** Renders one page through the layout and records it for the sitemap. */
  const emit = async ({
    key,
    param,
    title,
    description,
    body,
    extraNodes = [],
    activeKey = '',
    ogImage = '',
    ogType = 'website',
    article = null,
    changefreq = 'monthly',
    priority = 0.7,
  }) => {
    const pathname = urlPath(localeCode, content, key, param);
    const alts = alternates(contents, key, { default: param });

    checkMeta({ title, description, pathname, localeCode });

    const breadcrumbNodes = extraNodes.filter((n) => n && n['@type'] === 'BreadcrumbList');
    const schema = S.graph([
      ...baseNodes({ localeCode, content }),
      S.webPageSchema({
        pathname,
        title,
        description,
        localeCode,
        imageUrl: ogImage ? absolute(asset(`img/${ogImage}-${FALLBACK_WIDTH}.jpg`)) : undefined,
        breadcrumbId: breadcrumbNodes[0]?.['@id'],
      }),
      ...extraNodes,
    ]);

    const html = layout({
      localeCode,
      content,
      title,
      description,
      pathname,
      alts,
      schema,
      body,
      activeKey,
      ogImage,
      ogType,
      article,
    });

    await writePage(pathname, html);
    pages.push({ pathname, alts, changefreq, priority, lastmod: article?.updated || article?.date });
  };

  // ── Home ──────────────────────────────────────────────────────────────────
  await emit({
    key: 'home',
    title: content.home.seo.title,
    description: content.home.seo.description,
    body: homePage({ localeCode, content }),
    // FAQPage lives on the home page only — the same questions marked up on
    // several pages is redundant and can be treated as duplication.
    extraNodes: [S.faqSchema(content.faq, urlPath(localeCode, content, 'home'))],
    activeKey: 'home',
    ogImage: 'og-default',
    changefreq: 'weekly',
    priority: 1.0,
  });

  // ── Clubs index ───────────────────────────────────────────────────────────
  {
    const pathname = urlPath(localeCode, content, 'clubs');
    const crumbs = crumbsFor(localeCode, content, [{ name: content.nav.clubs, path: pathname }]);
    await emit({
      key: 'clubs',
      title: content.pages.clubs.seo.title,
      description: content.pages.clubs.seo.description,
      body: clubsIndexPage({ localeCode, content, crumbs }),
      extraNodes: [S.breadcrumbSchema(crumbs, pathname)],
      activeKey: 'clubs',
      ogImage: locations[0].images[0],
      priority: 0.9,
    });
  }

  // ── One page per club ─────────────────────────────────────────────────────
  for (const loc of locations) {
    const pathname = urlPath(localeCode, content, 'club', loc.slug);
    const crumbs = crumbsFor(localeCode, content, [
      { name: content.nav.clubs, path: urlPath(localeCode, content, 'clubs') },
      { name: loc.name, path: pathname },
    ]);
    // Title and description come from localised patterns in the content files
    // so each club reads naturally in each language and no two pages in the
    // same locale share a title. The short name keeps the title inside the
    // ~60-character budget once the brand is appended.
    const fill = (pattern) =>
      String(pattern).replace('{name}', loc.shortName).replace('{city}', loc.locality);

    await emit({
      key: 'club',
      param: loc.slug,
      title: fill(content.pages.clubs.titlePattern),
      description: fill(content.pages.clubs.descPattern),
      body: clubPage({ localeCode, content, location: loc, crumbs }),
      extraNodes: [S.breadcrumbSchema(crumbs, pathname)],
      activeKey: 'clubs',
      ogImage: loc.images[0],
      priority: 0.9,
    });
  }

  // ── Disciplines ───────────────────────────────────────────────────────────
  {
    const pathname = urlPath(localeCode, content, 'disciplines');
    const crumbs = crumbsFor(localeCode, content, [{ name: content.nav.disciplines, path: pathname }]);
    await emit({
      key: 'disciplines',
      title: content.pages.disciplines.seo.title,
      description: content.pages.disciplines.seo.description,
      body: disciplinesPage({ localeCode, content, crumbs }),
      extraNodes: [S.breadcrumbSchema(crumbs, pathname)],
      activeKey: 'disciplines',
      ogImage: content.disciplines[0].image,
      priority: 0.8,
    });
  }

  // ── Pricing ───────────────────────────────────────────────────────────────
  {
    const pathname = urlPath(localeCode, content, 'pricing');
    const crumbs = crumbsFor(localeCode, content, [{ name: content.nav.pricing, path: pathname }]);
    await emit({
      key: 'pricing',
      title: content.pages.pricing.seo.title,
      description: content.pages.pricing.seo.description,
      body: pricingPage({ localeCode, content, crumbs }),
      extraNodes: [
        S.breadcrumbSchema(crumbs, pathname),
        S.offerCatalogSchema({ content, pathname }),
      ],
      activeKey: 'pricing',
      ogImage: 'og-default',
      priority: 0.9,
    });
  }

  // ── Coach ─────────────────────────────────────────────────────────────────
  {
    const pathname = urlPath(localeCode, content, 'coach');
    const crumbs = crumbsFor(localeCode, content, [{ name: content.nav.coach, path: pathname }]);
    await emit({
      key: 'coach',
      title: content.pages.coach.seo.title,
      description: content.pages.coach.seo.description,
      body: coachPage({ localeCode, content, crumbs }),
      extraNodes: [S.breadcrumbSchema(crumbs, pathname)],
      activeKey: 'coach',
      ogImage: site.owner.photo,
      priority: 0.7,
    });
  }

  // ── Gallery ───────────────────────────────────────────────────────────────
  {
    const pathname = urlPath(localeCode, content, 'gallery');
    const crumbs = crumbsFor(localeCode, content, [{ name: content.nav.gallery, path: pathname }]);
    await emit({
      key: 'gallery',
      title: content.pages.gallery.seo.title,
      description: content.pages.gallery.seo.description,
      body: galleryPage({ localeCode, content, crumbs }),
      extraNodes: [S.breadcrumbSchema(crumbs, pathname)],
      activeKey: 'gallery',
      ogImage: 'gallery-1',
      priority: 0.6,
    });
  }

  // ── Contact ───────────────────────────────────────────────────────────────
  {
    const pathname = urlPath(localeCode, content, 'contact');
    const crumbs = crumbsFor(localeCode, content, [{ name: content.nav.contact, path: pathname }]);
    await emit({
      key: 'contact',
      title: content.pages.contact.seo.title,
      description: content.pages.contact.seo.description,
      body: contactPage({ localeCode, content, crumbs }),
      extraNodes: [S.breadcrumbSchema(crumbs, pathname)],
      activeKey: 'contact',
      ogImage: 'og-default',
      priority: 0.8,
    });
  }

  // ── Blog index ────────────────────────────────────────────────────────────
  {
    const pathname = urlPath(localeCode, content, 'blog');
    const crumbs = crumbsFor(localeCode, content, [{ name: content.nav.blog, path: pathname }]);
    await emit({
      key: 'blog',
      title: content.pages.blog.seo.title,
      description: content.pages.blog.seo.description,
      body: blogIndexPage({ localeCode, content, crumbs }),
      extraNodes: [
        S.breadcrumbSchema(crumbs, pathname),
        S.blogIndexSchema({
          content,
          localeCode,
          pathname,
          articleUrls: content.articles.map((a) => absolute(urlPath(localeCode, content, 'article', a.slug))),
        }),
      ],
      activeKey: 'blog',
      ogImage: content.articles[0]?.image || 'og-default',
      changefreq: 'weekly',
      priority: 0.7,
    });
  }

  // ── Articles ──────────────────────────────────────────────────────────────
  for (const article of content.articles) {
    const pathname = urlPath(localeCode, content, 'article', article.slug);
    const crumbs = crumbsFor(localeCode, content, [
      { name: content.nav.blog, path: urlPath(localeCode, content, 'blog') },
      { name: article.title, path: pathname },
    ]);
    await emit({
      key: 'article',
      param: article.slug,
      // The <title> is the short form; the H1 and the structured-data headline
      // keep the full one.
      title: article.seoTitle || article.title,
      description: article.description,
      body: articlePage({ localeCode, content, article, crumbs }),
      extraNodes: [
        S.breadcrumbSchema(crumbs, pathname),
        S.articleSchema({
          article,
          pathname,
          localeCode,
          imageUrl: absolute(asset(`img/${article.image}-${FALLBACK_WIDTH}.jpg`)),
          minutes: readingTime(article.body),
        }),
      ],
      activeKey: 'blog',
      ogImage: article.image,
      ogType: 'article',
      article,
      priority: 0.6,
    });
  }

  // ── 404 ───────────────────────────────────────────────────────────────────
  // Not in the sitemap, and noindex: an indexed error page competes with real
  // pages and looks broken in results.
  {
    const pathname = `${localePrefix(localeCode)}/404.html`;
    const html = layout({
      localeCode,
      content,
      title: content.pages.notFound.seo.title,
      description: content.pages.notFound.seo.description,
      pathname,
      alts: alternates(contents, 'home'),
      schema: S.graph(baseNodes({ localeCode, content })),
      body: notFoundPage({ localeCode, content }),
      noindex: true,
    });
    const dir = localeCode === site.defaultLocale ? DIST : join(DIST, localeCode);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, '404.html'), html, 'utf8');
    written.push(pathname);
  }

  // ── Per-locale RSS ────────────────────────────────────────────────────────
  await writeRss({ localeCode, content });

  return pages;
}

// ─────────────────────────────────────────────────────────────────────────────
// sitemap.xml
// ─────────────────────────────────────────────────────────────────────────────

/**
 * One sitemap covering every locale, with xhtml:link alternates per URL.
 *
 * Declaring the alternates inside the sitemap as well as in the page head gives
 * Google a second, cheaper way to discover the language cluster — useful when a
 * page is slow to be recrawled.
 */
async function writeSitemap(allPages) {
  const today = new Date().toISOString().slice(0, 10);

  const urls = allPages
    .map((page) => {
      const alts = page.alts
        .filter((a) => a.code !== 'x-default')
        .map(
          (a) =>
            `    <xhtml:link rel="alternate" hreflang="${esc(a.hreflang)}" href="${esc(a.href)}"/>`
        )
        .join('\n');

      return `  <url>
    <loc>${esc(absolute(page.pathname))}</loc>
    <lastmod>${esc(page.lastmod || today)}</lastmod>
    <changefreq>${esc(page.changefreq)}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
${alts}
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
  await writeFile(join(DIST, 'sitemap.xml'), xml, 'utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// robots.txt
// ─────────────────────────────────────────────────────────────────────────────

async function writeRobots() {
  const origin = String(site.url).replace(/\/+$/, '');
  const txt = `# robots.txt — ${site.legalName}
# Everything is public; there is nothing on this site to hide from crawlers.

User-agent: *
Allow: /

# Keep the 404 page out of the index.
Disallow: /404.html

Sitemap: ${origin}/sitemap.xml
`;
  await writeFile(join(DIST, 'robots.txt'), txt, 'utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// RSS
// ─────────────────────────────────────────────────────────────────────────────

async function writeRss({ localeCode, content }) {
  const items = [...content.articles]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((a) => {
      const url = absolute(urlPath(localeCode, content, 'article', a.slug));
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${new Date(`${a.date}T09:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(a.description)}</description>
    </item>`;
    })
    .join('\n');

  const feedPath = `${localePrefix(localeCode)}/rss.xml`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.brand)} — ${esc(content.nav.blog)}</title>
    <link>${esc(absolute(urlPath(localeCode, content, 'blog')))}</link>
    <description>${esc(content.pages.blog.seo.description)}</description>
    <language>${esc(localeCode)}</language>
    <atom:link href="${esc(absolute(feedPath))}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
  const dir = localeCode === site.defaultLocale ? DIST : join(DIST, localeCode);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'rss.xml'), xml, 'utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// Web manifest
// ─────────────────────────────────────────────────────────────────────────────

async function writeManifest(contents) {
  const content = contents[site.defaultLocale];
  const manifest = {
    name: site.legalName,
    short_name: site.brand,
    description: content.home.seo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#08080b',
    theme_color: '#08080b',
    lang: site.defaultLocale,
    dir: 'ltr',
    categories: ['fitness', 'health', 'sports'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  await writeFile(join(DIST, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2), 'utf8');
}


/**
 * Redirect stubs for the /fr/ prefix.
 *
 * French is served at the root, but /fr/... is a natural thing for someone to
 * type or to have linked previously. A canonical + meta refresh keeps those
 * URLs working without a server config, and tells Google which URL is real.
 * vercel.json additionally does this as a proper 308 where the host supports it.
 */
async function writeDefaultLocaleRedirects(contents) {
  const content = contents[site.defaultLocale];
  const keys = ['home', 'clubs', 'disciplines', 'pricing', 'coach', 'gallery', 'contact', 'blog'];
  const targets = keys.map((k) => urlPath(site.defaultLocale, content, k));
  for (const loc of locations) targets.push(urlPath(site.defaultLocale, content, 'club', loc.slug));
  for (const a of content.articles) targets.push(urlPath(site.defaultLocale, content, 'article', a.slug));

  for (const target of targets) {
    const pathname = `/${site.defaultLocale}${target}`;
    const html = `<!doctype html>
<html lang="${site.defaultLocale}">
<head>
<meta charset="utf-8">
<title>${esc(site.brand)}</title>
<link rel="canonical" href="${esc(absolute(target))}">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=${esc(target)}">
</head>
<body><p>→ <a href="${esc(target)}">${esc(absolute(target))}</a></p></body>
</html>
`;
    await writePage(pathname, html);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Static asset copying
// ─────────────────────────────────────────────────────────────────────────────

async function copyTree(from, to) {
  let entries;
  try {
    entries = await readdir(from, { withFileTypes: true });
  } catch {
    return 0;
  }
  await mkdir(to, { recursive: true });
  let count = 0;
  for (const entry of entries) {
    const src = join(from, entry.name);
    const dest = join(to, entry.name);
    if (entry.isDirectory()) {
      count += await copyTree(src, dest);
    } else {
      await copyFile(src, dest);
      count += 1;
    }
  }
  return count;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reporting
// ─────────────────────────────────────────────────────────────────────────────

function report() {
  const B = (s) => `\u001b[1m${s}\u001b[0m`;
  const dim = (s) => `\u001b[2m${s}\u001b[0m`;
  const red = (s) => `\u001b[31m${s}\u001b[0m`;
  const yellow = (s) => `\u001b[33m${s}\u001b[0m`;
  const green = (s) => `\u001b[32m${s}\u001b[0m`;
  const cyan = (s) => `\u001b[36m${s}\u001b[0m`;

  console.log('');
  console.log(B(`  Built ${written.length} pages across ${locales.length} locales → dist/`));

  if (errors.length) {
    console.log('');
    console.log(red(B(`  ${errors.length} error${errors.length > 1 ? 's' : ''}`)));
    for (const e of errors) console.log(red(`    ✗ ${e}`));
  }

  if (warnings.length) {
    console.log('');
    console.log(yellow(B(`  ${warnings.length} warning${warnings.length > 1 ? 's' : ''}`)));
    for (const w of warnings) console.log(yellow(`    ! ${w}`));
  }

  // The launch checklist: everything still wrapped in TODO() in data/site.mjs.
  if (todos.length) {
    const unique = [];
    const seen = new Set();
    for (const t of todos) {
      const k = `${t.note}`;
      if (t.note && !seen.has(k)) {
        seen.add(k);
        unique.push(t);
      }
    }
    console.log('');
    console.log(cyan(B(`  Launch checklist — ${unique.length} unverified value${unique.length > 1 ? 's' : ''}`)));
    console.log(dim('  These render on the page but are withheld from structured data.'));
    console.log(dim('  Edit src/data/site.mjs: replace TODO(\'x\') with \'x\'.'));
    console.log('');
    for (const t of unique) {
      console.log(`    ${cyan('□')} ${t.note}`);
      console.log(dim(`      currently: ${JSON.stringify(t.value)}`));
    }
  } else {
    console.log('');
    console.log(green('  ✓ No unverified business data — structured data is complete.'));
  }

  console.log('');
  if (errors.length) {
    console.log(red(B('  Build failed.')));
    process.exitCode = 1;
  } else {
    console.log(green(B('  Build OK.')));
    console.log(dim(`  Preview with: npm start`));
  }
  console.log('');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const contents = await loadContent();
  verifyContentParity(contents);

  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  // Pages
  const allPages = [];
  for (const loc of locales) {
    const pages = await renderLocale({
      localeCode: loc.code,
      content: contents[loc.code],
      contents,
    });
    allPages.push(...pages);
  }

  await writeDefaultLocaleRedirects(contents);

  // Well-known files
  await writeSitemap(allPages);
  await writeRobots();
  await writeManifest(contents);

  // Assets
  const assetCount = await copyTree(join(SRC, 'assets'), join(DIST, 'assets'));
  const publicCount = await copyTree(PUBLIC, DIST);
  if (assetCount === 0) warn('No files copied from src/assets — did you run `npm run media`?');

  // Image integrity: every referenced media key must have generated files.
  for (const name of Object.keys(images)) {
    if (!(await checkImage(name))) {
      warn(`Image "${name}" has no generated files. Run \`npm run media\`.`);
    }
  }

  // Root 404 for hosts that look for dist/404.html (Vercel, Netlify, GH Pages).
  report();
}

main().catch((err) => {
  console.error('\n\u001b[31mBuild crashed:\u001b[0m', err);
  process.exitCode = 1;
});
