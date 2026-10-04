/**
 * Disciplines, pricing, coach and gallery pages.
 */

import { site, plans, locations, stats, verified } from '../../data/site.mjs';
import { path } from '../../lib/urls.mjs';
import { esc, each } from '../../lib/util.mjs';
import { images } from '../../data/media.mjs';
import {
  picture, button, sectionHead, icons, chip, checklist, accordion, stat,
} from '../components.mjs';
import { pageHero } from './clubs.mjs';
import { ctaBand, planCard } from './home.mjs';
import { whatsappHref } from '../layout.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// Disciplines
// ─────────────────────────────────────────────────────────────────────────────

export function disciplinesPage({ localeCode, content, crumbs }) {
  const p = content.pages.disciplines;

  return [
    pageHero({ kicker: p.kicker, title: p.title, lead: p.lead, crumbs, crumbLabel: content.ui.sitemapLabel }),

    `<section class="section">
  <div class="wrap discfull">
${each(
  content.disciplines,
  (d, i) => {
    // Which clubs teach this one — useful to the reader and a natural internal
    // link from a service page to the location pages.
    const taughtAt = locations.filter((l) => l.disciplines.includes(d.slug));
    return `    <article class="discrow reveal" id="${esc(d.slug)}" style="--i:${i}">
      <div class="discrow__media">
        ${picture({
          name: d.image,
          alt: `${d.name} — ${site.legalName}`,
          sizes: '(max-width: 900px) 100vw, 40vw',
          priority: i === 0,
        })}
      </div>
      <div class="discrow__body">
        <p class="discrow__index">0${i + 1}</p>
        <h2 class="discrow__name">${esc(d.name)}</h2>
        <p class="discrow__tagline">${esc(d.tagline)}</p>
        <p class="discrow__desc">${esc(d.description)}</p>
        ${checklist(d.bullets)}
        <ul class="chips" role="list">
          ${chip(d.level)}
          ${chip(d.duration, 'clock')}
        </ul>
        ${
          taughtAt.length
            ? `<p class="discrow__at">
          <span>${esc(content.ui.ourClubs)}:</span>
${each(
  taughtAt,
  (l) => `          <a href="${path(localeCode, content, 'club', l.slug)}">${esc(l.shortName)}</a>`,
  ''
)}
        </p>`
            : ''
        }
      </div>
    </article>`;
  }
)}
  </div>
</section>`,

    ctaBand({ localeCode, content }),
  ].join('\n\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Pricing
// ─────────────────────────────────────────────────────────────────────────────

export function pricingPage({ localeCode, content, crumbs }) {
  const p = content.pages.pricing;

  return [
    pageHero({ kicker: p.kicker, title: p.title, lead: p.lead, crumbs, crumbLabel: content.ui.sitemapLabel }),

    `<section class="section section--tight">
  <div class="wrap">
    <ul class="plans plans--full" role="list">
${each(plans, (plan, i) => planCard({ plan, content, localeCode, index: i }))}
    </ul>
  </div>
</section>`,

    `<section class="section">
  <div class="wrap included">
    <div class="included__col">
      ${sectionHead({ kicker: p.kicker, title: p.includedTitle })}
      ${checklist(p.included, 'included__list')}
    </div>
    <div class="included__col included__col--notes">
      <h2 class="included__h">${esc(p.notesTitle)}</h2>
      <ul class="notes" role="list">
${each(p.notes, (n) => `        <li>${esc(n)}</li>`)}
      </ul>
    </div>
  </div>
</section>`,

    // The pricing page is where price objections surface, so the FAQ belongs
    // here as well as on the home page. Note that only ONE page per locale
    // emits FAQPage structured data (the home page) — duplicating it would be
    // redundant markup for the same questions.
    `<section class="faq section" id="faq">
  <div class="wrap faq__grid">
    <div class="faq__head">${sectionHead({ kicker: content.home.faq.kicker, title: content.home.faq.title })}</div>
    <div class="faq__body">${accordion(content.faq, '', 'faq-pricing')}</div>
  </div>
</section>`,

    ctaBand({ localeCode, content }),
  ].join('\n\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Coach / about
// ─────────────────────────────────────────────────────────────────────────────

export function coachPage({ localeCode, content, crumbs }) {
  const p = content.pages.coach;
  const role = site.owner.role[localeCode] || site.owner.role.fr;

  return [
    pageHero({ kicker: p.kicker, title: p.title, lead: p.lead, crumbs, crumbLabel: content.ui.sitemapLabel }),

    `<section class="section section--tight">
  <div class="wrap coachbio">
    <div class="coachbio__media reveal">
      ${picture({
        name: site.owner.photo,
        alt: `${site.owner.name} — ${role}`,
        sizes: '(max-width: 900px) 80vw, 38vw',
        priority: true,
      })}
    </div>
    <div class="coachbio__body">
      <h2 class="coachbio__name">${esc(site.owner.name)}</h2>
      <p class="coachbio__role">${esc(role)}</p>
${each(content.home.coach.body, (para) => `      <p class="coachbio__p reveal">${esc(para)}</p>`)}
      <div class="coachbio__stats">
        ${stat({ value: String(stats.years), label: content.home.stats.years })}
        ${stat({ value: String(stats.coaches), label: content.home.stats.coaches })}
        ${stat({ value: String(stats.members), label: content.home.stats.members, suffix: '+' })}
      </div>
      ${
        site.owner.facebook
          ? `<div class="reveal">${button({
              href: site.owner.facebook,
              label: 'Facebook',
              variant: 'ghost',
              icon: 'facebook',
              external: true,
              className: 'btn--sm',
            })}</div>`
          : ''
      }
    </div>
  </div>
</section>`,

    `<section class="section method">
  <div class="wrap">
    ${sectionHead({ kicker: p.kicker, title: p.methodTitle, align: 'center' })}
    <ol class="method__grid">
${each(
  p.method,
  (m, i) => `      <li class="method__item reveal" style="--i:${i}">
        <span class="method__num">0${i + 1}</span>
        <h3 class="method__title">${esc(m.title)}</h3>
        <p class="method__body">${esc(m.body)}</p>
      </li>`
)}
    </ol>
  </div>
</section>`,

    ctaBand({ localeCode, content }),
  ].join('\n\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery
// ─────────────────────────────────────────────────────────────────────────────

export function galleryPage({ localeCode, content, crumbs }) {
  const p = content.pages.gallery;

  // Everything visual the site has: dedicated gallery slots, both clubs and
  // every discipline. Alt text is built from the subject so each image carries
  // a genuine description rather than a filename.
  const items = [
    ...['gallery-1', 'gallery-2', 'gallery-3', 'gallery-4', 'gallery-5', 'gallery-6'].map((name) => ({
      name,
      alt: `${site.legalName} — ${p.title}`,
    })),
    ...locations.flatMap((loc) =>
      loc.images.map((name) => ({ name, alt: `${loc.name}, ${loc.locality}` }))
    ),
    ...content.disciplines.map((d) => ({ name: d.image, alt: `${d.name} — ${site.legalName}` })),
  ].filter((item) => images[item.name]);

  return [
    pageHero({ kicker: p.kicker, title: p.title, lead: p.lead, crumbs, crumbLabel: content.ui.sitemapLabel }),

    `<section class="section section--tight">
  <div class="wrap">
    <ul class="masonry" role="list">
${each(
  items,
  (item, i) => `      <li class="masonry__item reveal" style="--i:${i % 6}">
        ${picture({
          name: item.name,
          alt: item.alt,
          sizes: '(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw',
          priority: i === 0,
        })}
      </li>`
)}
    </ul>
  </div>
</section>`,

    ctaBand({ localeCode, content }),
  ].join('\n\n');
}
