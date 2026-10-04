/**
 * Home page.
 *
 * Section order follows how a cold visitor actually decides: what is this and
 * is it credible (hero, stats) → what can I do here (disciplines) → where is it
 * (clubs) → who will teach me (coach) → what does it look like (gallery) →
 * what does it cost (pricing) → my remaining objections (FAQ) → act (CTA).
 */

import { site, locations, plans, currency, stats, testimonials, verified } from '../../data/site.mjs';
import { path, asset } from '../../lib/urls.mjs';
import { esc, each, formatHours } from '../../lib/util.mjs';
import { heroVideo, images as mediaImages } from '../../data/media.mjs';
import {
  picture, button, sectionHead, marquee, accordion, stat, checklist, icons, chip, rule,
} from '../components.mjs';
import { telHref, whatsappHref } from '../layout.mjs';

/** The hero. Video background with a text overlay, or a still if no video. */
function hero({ localeCode, content }) {
  const h = content.home.hero;
  const wa = whatsappHref(site.contact.whatsapp, h.primaryCta);

  return `<section class="hero" data-hero>
  <div class="hero__media">
    <!-- The poster image is what counts for Largest Contentful Paint: it is
         marked high priority, while the video loads afterwards and fades in.
         A visitor on a slow connection sees a complete hero either way. -->
    ${picture({
      name: 'hero-poster',
      alt: `${site.legalName} — ${content.home.seo.title}`,
      sizes: '100vw',
      priority: true,
      className: 'hero__poster',
      ratioClass: false,
    })}
    <video class="hero__video" data-hero-video
           playsinline muted loop preload="none"
           poster="${asset(`img/${heroVideo.poster}-1600.jpg`)}"
           aria-hidden="true" tabindex="-1">
      <source src="${asset(`video/${heroVideo.name}.webm`)}" type="video/webm">
      <source src="${asset(`video/${heroVideo.name}.mp4`)}" type="video/mp4">
    </video>
    <div class="hero__scrim" aria-hidden="true"></div>
  </div>

  <div class="hero__content">
    <p class="hero__kicker reveal">
      <span class="dot" aria-hidden="true"></span>${esc(h.kicker)}
    </p>

    <!-- One h1 per page. Lines are separate spans so each can be animated
         independently, but they remain a single heading in the accessibility
         tree and a single string for search engines. -->
    <h1 class="hero__title">
${each(h.titleLines, (line, i) => `      <span class="hero__line"><span style="--d:${i * 0.08}s">${esc(line)}</span></span>`)}
    </h1>

    <p class="hero__lead reveal">${esc(h.lead)}</p>

    <div class="hero__actions reveal">
      ${button({
        href: wa || path(localeCode, content, 'contact'),
        label: h.primaryCta,
        variant: 'primary',
        external: Boolean(wa),
        className: 'btn--lg',
      })}
      ${button({
        href: path(localeCode, content, 'clubs'),
        label: h.secondaryCta,
        variant: 'ghost',
        icon: 'arrow',
        className: 'btn--lg',
      })}
    </div>
  </div>

  <a class="hero__scroll" href="#stats" aria-label="${esc(h.scrollHint)}">
    <span>${esc(h.scrollHint)}</span>
    <span class="hero__scrollLine" aria-hidden="true"></span>
  </a>
</section>`;
}

/** Scrolling strip of disciplines — cheap motion, reinforces the keyword set. */
function strip({ content }) {
  const items = content.disciplines.map((d) => d.name);
  return `<div class="strip">${marquee(items)}</div>`;
}

/** Headline numbers. */
function statsBand({ content }) {
  const s = content.home.stats;
  const entries = [
    { value: stats.members, label: s.members, suffix: '+' },
    { value: stats.years, label: s.years, suffix: '' },
    { value: stats.coaches, label: s.coaches, suffix: '' },
    { value: stats.surface, label: s.surface, suffix: '' },
  ];
  return `<section class="stats" id="stats" aria-label="${esc(s.title)}">
  <div class="wrap stats__grid">
${each(entries, (e) => stat({ value: String(e.value), label: e.label, suffix: e.suffix }))}
  </div>
</section>`;
}

/** About block: two columns, image and copy. */
function intro({ localeCode, content }) {
  const i = content.home.intro;
  return `<section class="intro section">
  <div class="wrap intro__grid">
    <div class="intro__media reveal">
      ${picture({
        // The gym's own first image, rather than a hard-coded slot name, so
        // this keeps working if the location's photo set is reordered.
        name: locations[0].images[0],
        alt: `${locations[0].name} — ${content.amenities.musculation}`,
        sizes: '(max-width: 900px) 100vw, 48vw',
        className: 'intro__img',
      })}
      <div class="intro__badge">
        <span class="intro__badgeNum">${esc(String(stats.years))}</span>
        <span class="intro__badgeLabel">${esc(content.home.stats.years)}</span>
      </div>
    </div>

    <div class="intro__body">
      ${sectionHead({ kicker: i.kicker, title: i.title })}
${each(i.body, (p) => `      <p class="intro__p reveal">${esc(p)}</p>`)}
      ${checklist(i.bullets, 'reveal')}
      <div class="reveal">
        ${button({ href: path(localeCode, content, 'coach'), label: i.cta, variant: 'ghost' })}
      </div>
    </div>
  </div>
</section>`;
}

/** Discipline cards. */
function disciplines({ localeCode, content }) {
  const d = content.home.disciplines;
  const items = content.disciplines.slice(0, 6);

  return `<section class="disc section">
  <div class="wrap">
    ${sectionHead({ kicker: d.kicker, title: d.title, lead: d.lead })}

    <ul class="disc__grid" role="list">
${each(
  items,
  (item, i) => `      <li class="disc__card reveal" style="--i:${i}">
        <a href="${path(localeCode, content, 'disciplines')}#${esc(item.slug)}">
          <span class="disc__media">
            ${picture({
              name: item.image,
              alt: item.name,
              sizes: '(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw',
            })}
          </span>
          <span class="disc__body">
            <span class="disc__name">${esc(item.name)}</span>
            <span class="disc__tagline">${esc(item.tagline)}</span>
            <span class="disc__short">${esc(item.short)}</span>
            <span class="disc__go" aria-hidden="true">${icons.arrow()}</span>
          </span>
        </a>
      </li>`
)}
    </ul>

    <div class="disc__more reveal">
      ${button({ href: path(localeCode, content, 'disciplines'), label: content.ui.seeAll, variant: 'ghost' })}
    </div>
  </div>
</section>`;
}

/** Location cards with address and hours. */
function clubs({ localeCode, content }) {
  const c = content.home.clubs;

  return `<section class="clubs section">
  <div class="wrap">
    ${sectionHead({ kicker: c.kicker, title: c.title, lead: c.lead })}

    <div class="clubs__grid">
${each(
  locations,
  (loc, i) => {
    const hours = formatHours(loc.hours, content.ui);
    const tel = telHref(loc.tel);
    return `      <article class="clubcard reveal" style="--i:${i}">
        <div class="clubcard__media">
          ${picture({
            name: loc.images[0],
            alt: `${loc.name}, ${loc.locality}`,
            sizes: '(max-width: 900px) 100vw, 50vw',
          })}
          <span class="clubcard__tag">0${i + 1}</span>
        </div>
        <div class="clubcard__body">
          <h3 class="clubcard__name">${esc(loc.name)}</h3>
          <p class="clubcard__where">${icons.mapPin()}<span>${esc(loc.street)}, ${esc(loc.locality)}</span></p>
          <dl class="clubcard__hours">
${each(
  hours,
  (row) => `            <div><dt>${esc(row.label)}</dt><dd>${esc(row.time)}</dd></div>`
)}
          </dl>
          <ul class="chips" role="list">
${each(loc.amenities.slice(0, 5), (key) => chip(content.amenities[key]))}
          </ul>
          <div class="clubcard__actions">
            ${button({
              href: path(localeCode, content, 'club', loc.slug),
              label: content.ui.seeClub,
              variant: 'primary',
              className: 'btn--sm',
            })}
            ${tel ? `<a class="btn btn--ghost btn--sm" href="${esc(tel)}">${icons.phone()}<span>${esc(content.ui.callNow)}</span></a>` : ''}
          </div>
        </div>
      </article>`;
  }
)}
    </div>
  </div>
</section>`;
}

/** Coach block. */
function coach({ localeCode, content }) {
  const c = content.home.coach;
  return `<section class="coachsec section">
  <div class="wrap coachsec__grid">
    <div class="coachsec__body">
      ${sectionHead({ kicker: c.kicker, title: c.title })}
${each(c.body, (p) => `      <p class="coachsec__p reveal">${esc(p)}</p>`)}
      <p class="coachsec__sig reveal">
        <strong>${esc(site.owner.name)}</strong>
        <span>${esc(site.owner.role[localeCode] || site.owner.role.fr)}</span>
      </p>
      <div class="reveal">
        ${button({ href: path(localeCode, content, 'coach'), label: c.cta, variant: 'ghost' })}
      </div>
    </div>
    <div class="coachsec__media reveal">
      ${picture({
        name: site.owner.photo,
        alt: `${site.owner.name} — ${site.owner.role[localeCode] || site.owner.role.fr}`,
        sizes: '(max-width: 900px) 70vw, 36vw',
        className: 'coachsec__img',
      })}
    </div>
  </div>
</section>`;
}

/** Gallery strip with a link to the full page. */
function gallery({ localeCode, content }) {
  const g = content.home.gallery;
  // First four gallery slots, read from the manifest rather than hard-coded.
  const names = Object.keys(mediaImages)
    .filter((n) => /^gallery-\d+$/.test(n))
    .sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1]))
    .slice(0, 4);
  return `<section class="gallerystrip section">
  <div class="wrap">
    ${sectionHead({ kicker: g.kicker, title: g.title, lead: g.lead })}
  </div>
  <ul class="gallerystrip__row" role="list">
${each(
  names,
  (name, i) => `    <li class="gallerystrip__item reveal" style="--i:${i}">
      ${picture({ name, alt: `${site.legalName} — ${content.pages.gallery.title}`, sizes: '(max-width: 700px) 60vw, 26vw' })}
    </li>`
)}
  </ul>
  <div class="wrap gallerystrip__more reveal">
    ${button({ href: path(localeCode, content, 'gallery'), label: content.ui.seeAll, variant: 'ghost' })}
  </div>
</section>`;
}

/** Pricing teaser: the three headline plans. */
function pricing({ localeCode, content }) {
  const p = content.home.pricing;
  const shown = plans.filter((pl) => ['seance', 'mensuel', 'annuel'].includes(pl.id));

  return `<section class="pricing section">
  <div class="wrap">
    ${sectionHead({ kicker: p.kicker, title: p.title, lead: p.lead })}

    <ul class="plans" role="list">
${each(shown, (plan, i) => planCard({ plan, content, localeCode, index: i }))}
    </ul>

    <div class="pricing__more reveal">
      ${button({ href: path(localeCode, content, 'pricing'), label: content.ui.seePricing, variant: 'ghost' })}
    </div>
  </div>
</section>`;
}

/** One plan card. Shared with the pricing page. */
export function planCard({ plan, content, localeCode, index = 0 }) {
  const copy = content.plans[plan.id];

  // Prices are the one field that deliberately does NOT render while
  // unverified. Everywhere else a TODO() placeholder shows on the page and is
  // merely withheld from structured data — but a price is a promise. Showing
  // "250 MAD" to someone who then walks in and is quoted 400 costs you the
  // sale and the trust. "On request" is honest, and the feature list still
  // does its job. Fill the real prices in src/data/site.mjs and the numbers
  // appear automatically.
  const price = verified(plan.price);
  const periodLabel = {
    session: content.ui.perSession,
    month: content.ui.perMonth,
    quarter: content.ui.perQuarter,
    year: content.ui.perYear,
  }[plan.period];
  const wa = whatsappHref(site.contact.whatsapp, `${content.ui.joinNow} — ${copy.name}`);

  return `      <li class="plan${plan.featured ? ' plan--featured' : ''} reveal" style="--i:${index}">
        ${plan.featured ? `<span class="plan__badge">${esc(content.ui.mostPopular)}</span>` : ''}
        <h3 class="plan__name">${esc(copy.name)}</h3>
        <p class="plan__tagline">${esc(copy.tagline)}</p>
        <p class="plan__price">
          ${
            price
              ? `<span class="plan__amount">${esc(price)}</span><span class="plan__cur">${esc(currency)}</span><span class="plan__period">${esc(
                  periodLabel
                )}</span>`
              : `<span class="plan__onrequest">${esc(content.ui.onRequest)}</span>`
          }
        </p>
        ${checklist(copy.features, 'plan__features')}
        ${button({
          href: wa || path(localeCode, content, 'contact'),
          label: content.ui.joinNow,
          variant: plan.featured ? 'primary' : 'ghost',
          external: Boolean(wa),
          className: 'btn--sm plan__cta',
        })}
      </li>`;
}

/** Testimonials — rendered only when real reviews exist in data/site.mjs. */
function reviews({ localeCode, content }) {
  if (!testimonials.length) return '';
  return `<section class="reviews section">
  <div class="wrap">
    <ul class="reviews__grid" role="list">
${each(
  testimonials,
  (t, i) => `      <li class="review reveal" style="--i:${i}">
        <span class="review__quote" aria-hidden="true">${icons.quote()}</span>
        <blockquote><p>${esc(typeof t.quote === 'string' ? t.quote : t.quote[localeCode] || t.quote.fr)}</p></blockquote>
        <p class="review__who">
          <strong>${esc(t.name)}</strong>
          ${t.role ? `<span>${esc(typeof t.role === 'string' ? t.role : t.role[localeCode] || t.role.fr)}</span>` : ''}
        </p>
      </li>`
)}
    </ul>
  </div>
</section>`;
}

/** FAQ. The markup here is what makes the FAQPage structured data honest. */
function faq({ content }) {
  const f = content.home.faq;
  return `<section class="faq section" id="faq">
  <div class="wrap faq__grid">
    <div class="faq__head">
      ${sectionHead({ kicker: f.kicker, title: f.title })}
    </div>
    <div class="faq__body">
      ${accordion(content.faq, '', 'faq')}
    </div>
  </div>
</section>`;
}

/** Latest articles. */
function blogTeaser({ localeCode, content }) {
  const b = content.home.blog;
  const items = content.articles.slice(0, 3);
  if (!items.length) return '';

  return `<section class="bloglist section">
  <div class="wrap">
    ${sectionHead({ kicker: b.kicker, title: b.title, lead: b.lead })}
    <ul class="bloglist__grid" role="list">
${each(
  items,
  (a, i) => `      <li class="postcard reveal" style="--i:${i}">
        <a href="${path(localeCode, content, 'article', a.slug)}">
          <span class="postcard__media">${picture({
            name: a.image,
            alt: a.title,
            sizes: '(max-width: 800px) 100vw, 33vw',
          })}</span>
          <span class="postcard__body">
            <span class="postcard__title">${esc(a.title)}</span>
            <span class="postcard__desc">${esc(a.description)}</span>
            <span class="postcard__go">${esc(content.ui.readArticle)} ${icons.arrow()}</span>
          </span>
        </a>
      </li>`
)}
    </ul>
  </div>
</section>`;
}

/** Closing call to action. */
export function ctaBand({ localeCode, content }) {
  const c = content.home.cta;
  const wa = whatsappHref(site.contact.whatsapp, c.title);
  const tel = telHref(site.contact.tel);

  return `<section class="cta">
  <div class="wrap cta__inner">
    <p class="cta__kicker">${esc(c.kicker)}</p>
    <h2 class="cta__title split" data-split="lines">${esc(c.title)}</h2>
    <p class="cta__lead">${esc(c.lead)}</p>
    <div class="cta__actions">
      ${button({
        href: wa || path(localeCode, content, 'contact'),
        label: c.primary,
        variant: 'primary',
        external: Boolean(wa),
        className: 'btn--lg',
      })}
      ${
        tel
          ? `<a class="btn btn--outline btn--lg" href="${esc(tel)}">${icons.phone()}<span>${esc(c.secondary)}</span></a>`
          : ''
      }
    </div>
  </div>
</section>`;
}

export default function homePage({ localeCode, content }) {
  return [
    hero({ localeCode, content }),
    strip({ content }),
    statsBand({ content }),
    intro({ localeCode, content }),
    disciplines({ localeCode, content }),
    rule(),
    clubs({ localeCode, content }),
    coach({ localeCode, content }),
    gallery({ localeCode, content }),
    pricing({ localeCode, content }),
    reviews({ localeCode, content }),
    faq({ content }),
    blogTeaser({ localeCode, content }),
    ctaBand({ localeCode, content }),
  ].join('\n\n');
}
