/**
 * Reusable markup components. Templates compose these; none of them contain
 * copy, which all comes from the locale content files.
 */

import { esc, attr, cx, each, join } from '../lib/util.mjs';
import { asset } from '../lib/urls.mjs';
import { FALLBACK_WIDTH, image, heightFor, widthsFor } from '../data/media.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────
// Inline SVG rather than an icon font: no extra request, no flash of invisible
// icons, and each one inherits currentColor so it themes for free.
// `aria-hidden` because every icon here sits next to a text label or inside a
// button that already has an accessible name.

const svg = (body, { size = 24, stroke = true } = {}) =>
  `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${stroke ? 'none' : 'currentColor'}"${
    stroke ? ' stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"' : ''
  } aria-hidden="true" focusable="false">${body}</svg>`;

export const icons = {
  arrow: () => svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  arrowDown: () => svg('<path d="M12 5v14M6 13l6 6 6-6"/>'),
  menu: () => svg('<path d="M3 6h18M3 12h18M3 18h18"/>'),
  close: () => svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  phone: () =>
    svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>'),
  whatsapp: () =>
    svg(
      '<path d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9c0 1.75.46 3.46 1.34 4.97L2 22l5.27-1.38a9.9 9.9 0 0 0 4.77 1.22h.01A9.9 9.9 0 0 0 22 11.96 9.86 9.86 0 0 0 12.04 2zm0 18.1h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.82.83-3.05-.19-.31a8.2 8.2 0 0 1-1.26-4.37 8.21 8.21 0 0 1 14.03-5.8 8.15 8.15 0 0 1 2.42 5.82 8.22 8.22 0 0 1-8.24 8.21zm4.52-6.15c-.25-.12-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12s-.64.8-.79.97c-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-1.98-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.01-.38.11-.5.1-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.03-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.43.06-.65.3-.23.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.73 2.64 4.2 3.7.58.26 1.04.41 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.45-.59 1.65-1.17.21-.57.21-1.06.15-1.16-.06-.1-.23-.17-.48-.3z"/>',
      { stroke: false }
    ),
  instagram: () =>
    svg(
      '<path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.42.56.21.96.47 1.38.89.42.42.68.82.89 1.38.17.42.37 1.06.42 2.23.06 1.25.07 1.65.07 4.85s-.01 3.6-.07 4.85c-.05 1.17-.25 1.8-.42 2.23a3.7 3.7 0 0 1-.89 1.38 3.7 3.7 0 0 1-1.38.89c-.42.17-1.06.37-2.23.42-1.25.06-1.65.07-4.85.07s-3.6-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.38-.89 3.7 3.7 0 0 1-.89-1.38c-.17-.42-.37-1.06-.42-2.23C2.21 15.6 2.2 15.2 2.2 12s.01-3.6.07-4.85c.05-1.17.25-1.8.42-2.23a3.7 3.7 0 0 1 .89-1.38 3.7 3.7 0 0 1 1.38-.89c.42-.17 1.06-.37 2.23-.42C8.44 2.21 8.84 2.2 12 2.2zm0 1.8c-3.14 0-3.5.01-4.73.07-.94.04-1.4.2-1.72.32-.4.16-.66.34-.95.63-.29.29-.47.55-.63.95-.12.32-.28.78-.32 1.72C3.61 8.72 3.6 9.08 3.6 12s.01 3.28.07 4.51c.04.94.2 1.4.32 1.72.16.4.34.66.63.95.29.29.55.47.95.63.32.12.78.28 1.72.32 1.23.06 1.59.07 4.71.07s3.48-.01 4.71-.07c.94-.04 1.4-.2 1.72-.32.4-.16.66-.34.95-.63.29-.29.47-.55.63-.95.12-.32.28-.78.32-1.72.06-1.23.07-1.59.07-4.51s-.01-3.28-.07-4.51c-.04-.94-.2-1.4-.32-1.72a2.5 2.5 0 0 0-.63-.95 2.5 2.5 0 0 0-.95-.63c-.32-.12-.78-.28-1.72-.32C15.48 4.01 15.12 4 12 4zm0 3.06a4.94 4.94 0 1 1 0 9.88 4.94 4.94 0 0 1 0-9.88zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28zm6.28-2.08a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z"/>',
      { stroke: false }
    ),
  facebook: () =>
    svg(
      '<path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z"/>',
      { stroke: false }
    ),
  tiktok: () =>
    svg(
      '<path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-1.84-2.48V9.78a5.68 5.68 0 1 0 4.93 5.62V8.9a7.3 7.3 0 0 0 4.27 1.38V7.19a4.25 4.25 0 0 1-3.21-1.37z"/>',
      { stroke: false }
    ),
  youtube: () =>
    svg(
      '<path d="M21.6 7.2s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C16.9 4.1 12 4.1 12 4.1h-.01s-4.9 0-6.7.2c-.4.05-1.3.05-2.1.9-.6.6-.8 2-.8 2S2.2 8.8 2.2 10.5v1.6c0 1.6.2 3.3.2 3.3s.2 1.4.8 2c.8.8 1.8.8 2.2.9 1.8.2 6.6.2 6.6.2s4.9 0 6.7-.2c.4-.05 1.3-.05 2.1-.9.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1.6c0-1.7-.2-3.3-.2-3.3zM9.9 14.6V8.8l6.3 2.9-6.3 2.9z"/>',
      { stroke: false }
    ),
  mapPin: () => svg('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/>'),
  clock: () => svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  check: () => svg('<path d="M20 6 9 17l-5-5"/>'),
  mail: () => svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>'),
  plus: () => svg('<path d="M12 5v14M5 12h14"/>'),
  play: () => svg('<path d="M6 4l14 8-14 8z"/>', { stroke: false }),
  globe: () => svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>'),
  star: () => svg('<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1z"/>', { stroke: false }),
  quote: () => svg('<path d="M7 7h4v4a4 4 0 0 1-4 4V7zm8 0h4v4a4 4 0 0 1-4 4V7z"/>', { stroke: false }),
};

/** Social icon chooser, by the key used in site.social. */
export const socialIcon = (key) => (icons[key] ? icons[key]() : icons.globe());

// ─────────────────────────────────────────────────────────────────────────────
// Responsive images
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A full responsive <picture>.
 *
 * Emits WebP first with a JPEG fallback, a srcset across every generated width,
 * and explicit width/height so the browser reserves the correct box before the
 * bytes arrive (zero layout shift).
 *
 * @param {object}  o
 * @param {string}  o.name      Key from src/data/media.mjs
 * @param {string}  o.alt       Real alternative text. Required.
 * @param {string}  o.sizes     CSS `sizes` — tells the browser how wide the
 *                              image will render so it can pick the right file.
 * @param {boolean} o.priority  True only for the one image above the fold:
 *                              eager loading + fetchpriority=high + no lazy.
 * @param {string}  o.className
 */
export function picture({ name, alt, sizes = '100vw', priority = false, className = '', ratioClass = true }) {
  const entry = image(name);
  const [rw, rh] = entry.ratio;
  const width = FALLBACK_WIDTH;
  const height = heightFor(name, width);

  // Only the widths actually generated for this entry (see widthsFor), so the
  // srcset never advertises a file that does not exist.
  const widths = widthsFor(name);
  const srcset = (ext) =>
    widths.map((w) => `${asset(`img/${name}-${w}.${ext}`)} ${w}w`).join(', ');

  // Non-priority images are lazy-loaded and decoded off the main thread, which
  // keeps scrolling smooth on the mid-range Android phones most visitors use.
  const loading = priority
    ? ' loading="eager" decoding="sync" fetchpriority="high"'
    : ' loading="lazy" decoding="async"';

  return `<picture class="${cx('pic', className)}"${
    ratioClass ? ` style="--ar:${rw}/${rh}"` : ''
  }>
  <source type="image/webp" srcset="${srcset('webp')}" sizes="${esc(sizes)}">
  <img src="${asset(`img/${name}-${width}.jpg`)}" srcset="${srcset('jpg')}" sizes="${esc(sizes)}"
       width="${width}" height="${height}" alt="${esc(alt)}"${loading}>
</picture>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Buttons & links
// ─────────────────────────────────────────────────────────────────────────────

export function button({
  href,
  label,
  variant = 'primary',
  icon = 'arrow',
  external = false,
  className = '',
  ariaLabel = '',
  dataset = {},
}) {
  const data = Object.entries(dataset)
    .map(([k, v]) => attr(`data-${k}`, v))
    .join('');
  return `<a class="${cx('btn', `btn--${variant}`, className)}" href="${esc(href)}"${
    external ? ' target="_blank" rel="noopener"' : ''
  }${attr('aria-label', ariaLabel)}${data}>
  <span class="btn__label">${esc(label)}</span>${icon ? `<span class="btn__icon">${icons[icon]()}</span>` : ''}
</a>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout primitives
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Section heading block. `kicker` is the small label above the title — it gives
 * scanners a one-word answer to "what is this section" before they read on.
 *
 * `level` keeps the heading hierarchy valid: exactly one <h1> per page, and no
 * skipped levels, which screen readers rely on for navigation.
 */
export function sectionHead({ kicker, title, lead, level = 2, align = 'start', className = '' }) {
  const H = `h${level}`;
  return `<header class="${cx('shead', `shead--${align}`, className)}">
  ${kicker ? `<p class="shead__kicker"><span class="shead__kickerLine" aria-hidden="true"></span>${esc(kicker)}</p>` : ''}
  <${H} class="shead__title split" data-split="lines">${esc(title)}</${H}>
  ${lead ? `<p class="shead__lead">${esc(lead)}</p>` : ''}
</header>`;
}

/** Decorative animated rule used between sections. */
export const rule = () => '<div class="rule" aria-hidden="true"><span></span></div>';

/**
 * Infinite marquee. Duplicated content is marked aria-hidden so screen readers
 * read the strip once instead of twice.
 */
export function marquee(items, { className = '' } = {}) {
  const row = (hidden) =>
    `<div class="marquee__row"${hidden ? ' aria-hidden="true"' : ''}>${each(
      items,
      (item) => `<span class="marquee__item">${esc(item)}<span class="marquee__dot">●</span></span>`,
      ''
    )}</div>`;
  return `<div class="${cx('marquee', className)}"><div class="marquee__track">${row(false)}${row(true)}</div></div>`;
}

/**
 * Accessible accordion built on <details>/<summary>.
 *
 * Using the native element means it works with JavaScript disabled and is
 * keyboard-operable for free — and, importantly for SEO, the answers are real
 * text in the DOM, which is what makes the FAQPage markup legitimate.
 */
export function accordion(items, { className = '', name = '' } = {}) {
  return `<div class="${cx('acc', className)}">
${each(
  items,
  (item, i) => `  <details class="acc__item"${name ? ` name="${esc(name)}"` : ''}${i === 0 ? ' open' : ''}>
    <summary class="acc__q">
      <span>${esc(item.q)}</span>
      <span class="acc__icon" aria-hidden="true">${icons.plus()}</span>
    </summary>
    <div class="acc__a"><p>${esc(item.a)}</p></div>
  </details>`
)}
</div>`;
}

/** Stat tile with a scroll-triggered count-up (value stays in the DOM for crawlers). */
export function stat({ value, label, suffix = '' }) {
  const numeric = String(value).replace(/[^\d.]/g, '');
  return `<div class="stat reveal">
  <p class="stat__value" data-count="${esc(numeric)}"><span>${esc(value)}</span>${
    suffix ? `<em>${esc(suffix)}</em>` : ''
  }</p>
  <p class="stat__label">${esc(label)}</p>
</div>`;
}

/** Small labelled chip, for amenities and levels. */
export const chip = (label, iconName) =>
  `<li class="chip">${iconName ? `<span class="chip__icon">${icons[iconName]()}</span>` : ''}<span>${esc(label)}</span></li>`;

/** Bulleted feature list with check marks. */
export const checklist = (items, className = '') =>
  `<ul class="${cx('checks', className)}">${each(
    items,
    (item) => `<li><span class="checks__icon">${icons.check()}</span><span>${esc(item)}</span></li>`
  )}</ul>`;

/** Breadcrumb trail. Mirrors the BreadcrumbList structured data exactly. */
export function breadcrumbs(items, label) {
  return `<nav class="crumbs" aria-label="${esc(label)}">
  <ol>
${each(
  items,
  (item, i) =>
    `    <li>${
      i === items.length - 1
        ? `<span aria-current="page">${esc(item.name)}</span>`
        : `<a href="${esc(item.path)}">${esc(item.name)}</a>`
    }</li>`
)}
  </ol>
</nav>`;
}

export { esc, cx, each, join, attr };
