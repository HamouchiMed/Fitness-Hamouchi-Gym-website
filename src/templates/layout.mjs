/**
 * The document shell: <head>, header, footer, and the script tags.
 *
 * Every page is rendered through `layout()`, so the SEO head block, the
 * navigation and the structured data are defined once and are impossible to
 * forget on a new page.
 */

import { site, locales, locations, getLocale, verified } from '../data/site.mjs';
import { path, absolute, asset, alternates, localePrefix } from '../lib/urls.mjs';
import { esc, attr, cx, each, join, jsonLd, formatHours } from '../lib/util.mjs';
import { icons, socialIcon, picture, button } from './components.mjs';
import { FALLBACK_WIDTH } from '../data/media.mjs';

/** tel: link, or null when no number is verified yet. */
export const telHref = (raw) => {
  const n = String(raw || '').replace(/[^\d+]/g, '');
  return n ? `tel:${n}` : null;
};

/** wa.me link with a prefilled message. */
export function whatsappHref(number, message) {
  const n = String(number || '').replace(/\D/g, '');
  if (!n) return null;
  return `https://wa.me/${n}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// <head>
// ─────────────────────────────────────────────────────────────────────────────

function head({ localeCode, content, title, description, pathname, alts, schema, ogImage, ogType, noindex, article }) {
  const loc = getLocale(localeCode);
  const canonical = absolute(pathname);
  const fullTitle = title.includes(site.brand) ? title : `${title} | ${site.brand}`;
  const ogImageUrl = absolute(asset(`img/${ogImage || 'og-default'}-${FALLBACK_WIDTH}.jpg`));

  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">

<!-- Canonical. Prevents the same content being indexed under more than one URL
     (with/without trailing slash, with tracking parameters, http vs https). -->
<link rel="canonical" href="${esc(canonical)}">

${
  noindex
    ? '<meta name="robots" content="noindex, follow">'
    : `<!-- max-image-preview:large opts into full-size image thumbnails in results,
     which is a large click-through gain for a visual business like a gym.
     max-snippet/max-video-preview:-1 remove the default length limits. -->
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`
}

<!-- hreflang. Every locale lists every other locale plus itself; the set must
     be reciprocal or Google discards it entirely. x-default points at the
     French root, which is what an unmatched visitor should land on. -->
${each(
  alts,
  (alt) => `<link rel="alternate" hreflang="${esc(alt.hreflang)}" href="${esc(alt.href)}">`
)}

<!-- Open Graph: controls the card shown in WhatsApp, Messenger and Facebook.
     WhatsApp is how most of this audience will actually share the link. -->
<meta property="og:type" content="${esc(ogType || 'website')}">
<meta property="og:site_name" content="${esc(site.legalName)}">
<meta property="og:locale" content="${esc(loc.ogLocale)}">
${each(
  locales.filter((l) => l.code !== localeCode),
  (l) => `<meta property="og:locale:alternate" content="${esc(l.ogLocale)}">`
)}
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(ogImageUrl)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(site.legalName)}">
${
  article
    ? `<meta property="article:published_time" content="${esc(article.date)}">
<meta property="article:modified_time" content="${esc(article.updated || article.date)}">
<meta property="article:author" content="${esc(site.owner.name)}">`
    : ''
}

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ogImageUrl)}">

<!-- Geo meta. Not a ranking factor on its own, but some local aggregators and
     map services still read it. -->
<meta name="geo.region" content="MA-CS">
<meta name="geo.placename" content="Berrechid">
<meta name="author" content="${esc(site.legalName)}">

${verified(site.verification.google) ? `<meta name="google-site-verification" content="${esc(verified(site.verification.google))}">` : ''}
${verified(site.verification.bing) ? `<meta name="msvalidate.01" content="${esc(verified(site.verification.bing))}">` : ''}

<!-- Icons and installability -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#08080b">
<meta name="apple-mobile-web-app-title" content="${esc(site.brand)}">

<!-- Fonts are self-hosted, so there is no third-party connection to open and
     nothing to consent to under GDPR-style rules. Preloading the two faces
     used above the fold stops the headline reflowing once they arrive. -->
<link rel="preload" href="${asset('fonts/anton-latin-400-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${asset(
    localeCode === 'ar' ? 'fonts/cairo-arabic-wght-normal.woff2' : 'fonts/inter-latin-wght-normal.woff2'
  )}" as="font" type="font/woff2" crossorigin>

<link rel="stylesheet" href="${asset('css/main.css')}">

<!-- RSS, so the blog can be followed and picked up by aggregators. -->
<link rel="alternate" type="application/rss+xml" title="${esc(site.brand)} — ${esc(content.nav.blog)}" href="${localePrefix(
    localeCode
  )}/rss.xml">

<!-- Structured data: one @graph describing the business, this page and its
     entities. See src/lib/schema.mjs for what each node is for. -->
<script type="application/ld+json">
${jsonLd(schema)}
</script>
${
  verified(site.analytics.plausibleDomain)
    ? `
<!-- Plausible: cookieless, so no consent banner is required. -->
<script defer data-domain="${esc(verified(site.analytics.plausibleDomain))}" src="https://plausible.io/js/script.js"></script>`
    : ''
}${
    verified(site.analytics.gaMeasurementId)
      ? `
<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(verified(site.analytics.gaMeasurementId))}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${esc(
          verified(site.analytics.gaMeasurementId)
        )}');</script>`
      : ''
  }`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────────────────────

function navItems(localeCode, content) {
  return [
    { key: 'clubs', label: content.nav.clubs },
    { key: 'disciplines', label: content.nav.disciplines },
    { key: 'pricing', label: content.nav.pricing },
    { key: 'coach', label: content.nav.coach },
    { key: 'gallery', label: content.nav.gallery },
    { key: 'blog', label: content.nav.blog },
    { key: 'contact', label: content.nav.contact },
  ].map((item) => ({ ...item, href: path(localeCode, content, item.key) }));
}

function logo(localeCode, content, { tag = 'a' } = {}) {
  const inner = `<span class="logo__mark" aria-hidden="true">
  <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
    <rect width="40" height="40" rx="10" fill="url(#lg)"/>
    <path d="M11 14v12M29 14v12M11 20h18" stroke="#0a0a0c" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M8 17v6M32 17v6" stroke="#0a0a0c" stroke-width="2.2" stroke-linecap="round"/>
    <defs><linearGradient id="lg" x1="0" y1="0" x2="40" y2="40">
      <stop stop-color="#ff7a3d"/><stop offset="1" stop-color="#e02f2f"/>
    </linearGradient></defs>
  </svg>
</span>
<span class="logo__text">
  <span class="logo__name">${esc(site.brand)}</span>
  <span class="logo__sub">Berrechid</span>
</span>`;

  return tag === 'a'
    ? `<a class="logo" href="${path(localeCode, content, 'home')}" aria-label="${esc(site.legalName)}">${inner}</a>`
    : `<span class="logo">${inner}</span>`;
}

/**
 * Language switcher. Each entry links to the SAME page in the other language,
 * not to that language's homepage — which is both better for users and what
 * Google expects given the hreflang set.
 */
function languageSwitcher(localeCode, content, alts, { id = 'lang' } = {}) {
  const byCode = Object.fromEntries(alts.filter((a) => a.code !== 'x-default').map((a) => [a.code, a.href]));
  const current = getLocale(localeCode);

  return `<div class="lang">
  <button class="lang__btn" type="button" aria-expanded="false" aria-controls="${id}-menu" data-lang-toggle>
    <span class="lang__icon" aria-hidden="true">${icons.globe()}</span>
    <span class="lang__current">${esc(current.shortLabel)}</span>
  </button>
  <ul class="lang__menu" id="${id}-menu" role="list">
${each(
  locales,
  (l) => `    <li>
      <a href="${esc(byCode[l.code] || path(l.code, content, 'home'))}" lang="${esc(l.code)}" hreflang="${esc(
    l.code
  )}"${l.code === localeCode ? ' aria-current="true"' : ''}>
        <span>${esc(l.label)}</span><span class="lang__code">${esc(l.shortLabel)}</span>
      </a>
    </li>`
)}
  </ul>
</div>`;
}

function header({ localeCode, content, alts, activeKey }) {
  const items = navItems(localeCode, content);
  const tel = telHref(site.contact.tel);
  const wa = whatsappHref(site.contact.whatsapp, content.home.cta.title);

  return `<header class="site-header" data-header>
  <div class="site-header__inner">
    ${logo(localeCode, content)}

    <nav class="nav" aria-label="${esc(content.ui.quickLinks)}">
      <ul class="nav__list">
${each(
  items,
  (item) =>
    `        <li><a class="nav__link${item.key === activeKey ? ' is-active' : ''}" href="${esc(item.href)}"${
      item.key === activeKey ? ' aria-current="page"' : ''
    }>${esc(item.label)}</a></li>`
)}
      </ul>
    </nav>

    <div class="site-header__actions">
      ${languageSwitcher(localeCode, content, alts, { id: 'lang-desktop' })}
      ${
        tel
          ? `<a class="iconbtn" href="${esc(tel)}" aria-label="${esc(content.ui.callNow)}">${icons.phone()}</a>`
          : ''
      }
      ${button({
        href: wa || path(localeCode, content, 'contact'),
        label: content.ui.freeTrial,
        variant: 'primary',
        icon: 'arrow',
        external: Boolean(wa),
        className: 'btn--sm site-header__cta',
      })}
      <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="${esc(
        content.ui.openMenu
      )}" data-menu-toggle>
        <span class="burger__box" aria-hidden="true"><span></span><span></span></span>
      </button>
    </div>
  </div>
</header>

<!-- Mobile menu. Hidden from the accessibility tree until opened, so a closed
     menu's links are not announced or focusable. -->
<div class="mobilemenu" id="mobile-menu" data-menu hidden>
  <div class="mobilemenu__inner">
    <nav aria-label="${esc(content.ui.quickLinks)}">
      <ul class="mobilemenu__list">
${each(
  items,
  (item, i) =>
    `        <li style="--i:${i}"><a href="${esc(item.href)}"${
      item.key === activeKey ? ' aria-current="page"' : ''
    }><span class="mobilemenu__num">0${i + 1}</span><span>${esc(item.label)}</span></a></li>`
)}
      </ul>
    </nav>
    <div class="mobilemenu__foot">
      ${languageSwitcher(localeCode, content, alts, { id: 'lang-mobile' })}
      <div class="mobilemenu__cta">
        ${tel ? `<a class="btn btn--ghost btn--sm" href="${esc(tel)}">${icons.phone()}<span>${esc(content.ui.callNow)}</span></a>` : ''}
        ${
          wa
            ? `<a class="btn btn--primary btn--sm" href="${esc(wa)}" target="_blank" rel="noopener">${icons.whatsapp()}<span>${esc(
                content.ui.whatsapp
              )}</span></a>`
            : ''
        }
      </div>
    </div>
  </div>
</div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────

function footer({ localeCode, content, alts }) {
  const items = navItems(localeCode, content);
  const tel = telHref(site.contact.tel);
  const email = verified(site.contact.email);
  const social = Object.entries(site.social).filter(([, url]) => verified(url));
  const year = new Date().getFullYear();

  return `<footer class="site-footer">
  <div class="site-footer__top">
    <div class="site-footer__brand">
      ${logo(localeCode, content, { tag: 'span' })}
      <p class="site-footer__tagline">${esc(content.footer.tagline)}</p>
      ${
        social.length
          ? `<ul class="social" role="list">
${each(
  social,
  ([key, url]) =>
    `        <li><a href="${esc(verified(url))}" target="_blank" rel="noopener me" aria-label="${esc(key)}">${socialIcon(
      key
    )}</a></li>`
)}
      </ul>`
          : ''
      }
    </div>

    <nav class="site-footer__nav" aria-label="${esc(content.ui.quickLinks)}">
      <h2 class="site-footer__h">${esc(content.ui.quickLinks)}</h2>
      <ul role="list">
${each(items, (item) => `        <li><a href="${esc(item.href)}">${esc(item.label)}</a></li>`)}
      </ul>
    </nav>

    <div class="site-footer__clubs">
      <h2 class="site-footer__h">${esc(content.ui.ourClubs)}</h2>
      <ul role="list">
${each(
  locations,
  (loc) => `        <li>
          <a href="${path(localeCode, content, 'club', loc.slug)}">${esc(loc.name)}</a>
          <span>${esc(loc.locality)}, ${esc(loc.countryName[localeCode] || loc.countryName.fr)}</span>
        </li>`
)}
      </ul>
    </div>

    <div class="site-footer__contact">
      <h2 class="site-footer__h">${esc(content.nav.contact)}</h2>
      <ul role="list">
        ${tel ? `<li>${icons.phone()}<a href="${esc(tel)}">${esc(site.contact.tel)}</a></li>` : ''}
        ${email ? `<li>${icons.mail()}<a href="mailto:${esc(email)}">${esc(email)}</a></li>` : ''}
        <li>${icons.mapPin()}<span>${esc(locations[0].locality)}, ${esc(locations[0].region)}</span></li>
      </ul>
      ${languageSwitcher(localeCode, content, alts, { id: 'lang-footer' })}
    </div>
  </div>

  <div class="site-footer__bottom">
    <p>© ${year} ${esc(site.legalName)}. ${esc(content.ui.allRightsReserved)}.</p>
    <p class="site-footer__note">${esc(content.footer.builtNote)}</p>
    <a class="site-footer__top-link" href="#top">${esc(content.ui.backToTop)} ${icons.arrowDown()}</a>
  </div>
</footer>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Floating WhatsApp button
// ─────────────────────────────────────────────────────────────────────────────

function floatingContact({ content }) {
  const wa = whatsappHref(site.contact.whatsapp, content.home.cta.title);
  if (!wa) return '';
  return `<a class="fab" href="${esc(wa)}" target="_blank" rel="noopener" data-fab>
  <span class="fab__icon">${icons.whatsapp()}</span>
  <span class="fab__label">${esc(content.ui.whatsapp)}</span>
</a>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Document
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Renders a complete HTML document.
 *
 * @param {object} o
 * @param {string} o.localeCode
 * @param {object} o.content      Locale content module
 * @param {string} o.title        <title> and og:title (brand appended)
 * @param {string} o.description  meta description, ~150–160 chars
 * @param {string} o.pathname     This page's path, for canonical + og:url
 * @param {Array}  o.alts         hreflang alternates
 * @param {object} o.schema       JSON-LD @graph
 * @param {string} o.body         Page markup
 * @param {string} [o.activeKey]  Nav key to mark as current
 * @param {string} [o.ogImage]    Media key for the share image
 * @param {string} [o.bodyClass]
 * @param {boolean}[o.noindex]
 */
export function layout({
  localeCode,
  content,
  title,
  description,
  pathname,
  alts,
  schema,
  body,
  activeKey = '',
  ogImage = '',
  ogType = 'website',
  bodyClass = '',
  noindex = false,
  article = null,
}) {
  const loc = getLocale(localeCode);

  return `<!doctype html>
<html lang="${esc(loc.htmlLang)}" dir="${esc(loc.dir)}" class="no-js">
<head>
${head({ localeCode, content, title, description, pathname, alts, schema, ogImage, ogType, noindex, article })}
<script>
  // Flip a class as early as possible so CSS can distinguish a JS-capable
  // browser without a flash of unstyled or already-revealed content.
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');
</script>
</head>
<body class="${cx(bodyClass)}" id="top">

<a class="skip" href="#main">${esc(content.ui.skipToContent)}</a>

<!-- Preloader. Removed by app.js on load, and hidden outright for visitors who
     have asked for reduced motion. -->
<div class="loader" data-loader aria-hidden="true">
  <div class="loader__inner">
    <span class="loader__brand">${esc(site.brand)}</span>
    <span class="loader__bar"><i></i></span>
  </div>
</div>

<div class="grain" aria-hidden="true"></div>

${header({ localeCode, content, alts, activeKey })}

<main id="main">
${body}
</main>

${footer({ localeCode, content, alts })}
${floatingContact({ content })}

<!-- Motion libraries are self-hosted: no CDN dependency, no third-party
     connection, and they cannot disappear from under the site later. -->
<script src="${asset('vendor/gsap.min.js')}" defer></script>
<script src="${asset('vendor/ScrollTrigger.min.js')}" defer></script>
<script src="${asset('vendor/lenis.min.js')}" defer></script>
<script src="${asset('js/app.js')}" defer></script>
</body>
</html>
`;
}

export { navItems, formatHours };
