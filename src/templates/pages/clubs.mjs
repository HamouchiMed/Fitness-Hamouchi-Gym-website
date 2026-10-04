/**
 * Clubs index and the per-location pages.
 *
 * The per-location page is the most important page on the site for local SEO.
 * One page per physical club, each with its own address, geo coordinates,
 * opening hours and phone number in both the visible content and the
 * structured data, is what allows both clubs to appear separately in the map
 * pack. Merging two locations onto one page means competing for one slot.
 */

import { site, locations, verified, isTodo } from '../../data/site.mjs';
import { path } from '../../lib/urls.mjs';
import { esc, each, formatHours } from '../../lib/util.mjs';
import {
  picture, button, sectionHead, sectionHead as head, icons, chip, checklist, breadcrumbs,
} from '../components.mjs';
import { telHref, whatsappHref } from '../layout.mjs';
import { ctaBand } from './home.mjs';

/** Shared page banner for inner pages. */
export function pageHero({ kicker, title, lead, crumbs, crumbLabel }) {
  return `<section class="phero">
  <div class="wrap">
    ${crumbs ? breadcrumbs(crumbs, crumbLabel) : ''}
    ${head({ kicker, title, lead, level: 1, className: 'phero__head' })}
  </div>
  <div class="phero__glow" aria-hidden="true"></div>
</section>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Clubs index
// ─────────────────────────────────────────────────────────────────────────────

export function clubsIndexPage({ localeCode, content, crumbs }) {
  const p = content.pages.clubs;

  return [
    pageHero({
      kicker: p.kicker,
      title: p.title,
      lead: p.lead,
      crumbs,
      crumbLabel: content.ui.sitemapLabel,
    }),

    `<section class="section">
  <div class="wrap clublist">
${each(
  locations,
  (loc, i) => {
    const hours = formatHours(loc.hours, content.ui);
    const tel = telHref(loc.tel) || telHref(site.contact.tel);
    const maps = verified(loc.mapsUrl);
    return `    <article class="clubrow reveal" style="--i:${i}">
      <div class="clubrow__media">
        ${picture({
          name: loc.images[0],
          alt: `${loc.name}, ${loc.locality}`,
          sizes: '(max-width: 900px) 100vw, 46vw',
        })}
      </div>
      <div class="clubrow__body">
        <p class="clubrow__index">0${i + 1}</p>
        <h2 class="clubrow__name">${esc(loc.name)}</h2>
        <p class="clubrow__meta">
          ${icons.mapPin()}<span>${esc(loc.street)}${esc(loc.street) ? ', ' : ''}${esc(loc.locality)}, ${esc(
      loc.countryName[localeCode] || loc.countryName.fr
    )}</span>
        </p>
        <dl class="clubrow__hours">
${each(hours, (row) => `          <div><dt>${esc(row.label)}</dt><dd>${esc(row.time)}</dd></div>`)}
        </dl>
        <ul class="chips" role="list">
${each(loc.amenities, (key) => chip(content.amenities[key]))}
        </ul>
        <div class="clubrow__actions">
          ${button({
            href: path(localeCode, content, 'club', loc.slug),
            label: content.ui.seeClub,
            variant: 'primary',
            className: 'btn--sm',
          })}
          ${tel ? `<a class="btn btn--ghost btn--sm" href="${esc(tel)}">${icons.phone()}<span>${esc(content.ui.callNow)}</span></a>` : ''}
          ${
            maps
              ? `<a class="btn btn--ghost btn--sm" href="${esc(maps)}" target="_blank" rel="noopener">${icons.mapPin()}<span>${esc(
                  content.ui.getDirections
                )}</span></a>`
              : ''
          }
        </div>
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
// Single club
// ─────────────────────────────────────────────────────────────────────────────

export function clubPage({ localeCode, content, location: loc, crumbs }) {
  const hours = formatHours(loc.hours, content.ui);
  const tel = telHref(loc.tel) || telHref(site.contact.tel);
  const wa = whatsappHref(site.contact.whatsapp, `${content.ui.freeTrial} — ${loc.name}`);
  const maps = verified(loc.mapsUrl);
  const embed = verified(loc.mapsEmbed);
  const clubDisciplines = loc.disciplines
    .map((slug) => content.disciplines.find((d) => d.slug === slug))
    .filter(Boolean);

  return [
    pageHero({
      kicker: `${loc.locality} · ${loc.countryName[localeCode] || loc.countryName.fr}`,
      title: loc.name,
      lead: content.pages.clubs.lead,
      crumbs,
      crumbLabel: content.ui.sitemapLabel,
    }),

    // Gallery of this club's images
    `<section class="clubgal">
  <ul class="clubgal__grid" role="list">
${each(
  loc.images,
  (name, i) => `    <li class="clubgal__item${i === 0 ? ' clubgal__item--lead' : ''} reveal" style="--i:${i}">
      ${picture({
        name,
        alt: `${loc.name} — ${content.pages.gallery.title}`,
        sizes: i === 0 ? '(max-width: 900px) 100vw, 60vw' : '(max-width: 900px) 50vw, 30vw',
        priority: i === 0,
      })}
    </li>`
)}
  </ul>
</section>`,

    // Practical information — the block that answers "where, when, how much"
    `<section class="section">
  <div class="wrap clubinfo">
    <div class="clubinfo__main">
      ${sectionHead({ kicker: content.pages.clubs.kicker, title: content.pages.contact.findUsTitle })}

      <dl class="deflist reveal">
        <div>
          <dt>${icons.mapPin()}${esc(content.ui.address)}</dt>
          <dd>
            ${esc(loc.street)}<br>
            ${esc(loc.postalCode)} ${esc(loc.locality)}<br>
            ${esc(loc.region)}, ${esc(loc.countryName[localeCode] || loc.countryName.fr)}
          </dd>
        </div>
        ${
          tel
            ? `<div>
          <dt>${icons.phone()}${esc(content.ui.phone)}</dt>
          <dd><a href="${esc(tel)}">${esc(loc.tel || site.contact.tel)}</a></dd>
        </div>`
            : ''
        }
        <div>
          <dt>${icons.clock()}${esc(content.ui.openingHours)}</dt>
          <dd>
            <ul class="hourlist" role="list">
${each(hours, (row) => `              <li><span>${esc(row.label)}</span><span>${esc(row.time)}</span></li>`)}
            </ul>
          </dd>
        </div>
      </dl>

      <div class="clubinfo__actions reveal">
        ${button({
          href: wa || path(localeCode, content, 'contact'),
          label: content.ui.freeTrial,
          variant: 'primary',
          external: Boolean(wa),
        })}
        ${
          maps
            ? `<a class="btn btn--ghost" href="${esc(maps)}" target="_blank" rel="noopener">${icons.mapPin()}<span>${esc(
                content.ui.getDirections
              )}</span></a>`
            : ''
        }
      </div>
    </div>

    <aside class="clubinfo__side">
      <h2 class="clubinfo__h">${esc(content.pages.disciplines.kicker)}</h2>
      <ul class="clubinfo__disc" role="list">
${each(
  clubDisciplines,
  (d) => `        <li>
          <a href="${path(localeCode, content, 'disciplines')}#${esc(d.slug)}">
            <strong>${esc(d.name)}</strong>
            <span>${esc(d.tagline)}</span>
          </a>
        </li>`
)}
      </ul>

      <h2 class="clubinfo__h">${esc(content.pages.pricing.includedTitle)}</h2>
      ${checklist(loc.amenities.map((k) => content.amenities[k]))}
    </aside>
  </div>
</section>`,

    // Map. An iframe is only emitted when a real embed URL exists — otherwise
    // the block degrades to a directions link rather than an empty frame.
    embed
      ? `<section class="mapsec">
  <iframe
    class="mapsec__frame"
    src="${esc(embed)}"
    title="${esc(loc.name)} — ${esc(content.pages.contact.findUsTitle)}"
    width="100%" height="460"
    style="border:0"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    allowfullscreen></iframe>
</section>`
      : `<section class="section">
  <div class="wrap">
    <div class="mapfallback reveal">
      <p>${icons.mapPin()}<span>${esc(loc.street)}, ${esc(loc.locality)}</span></p>
      ${
        maps
          ? button({ href: maps, label: content.ui.getDirections, variant: 'ghost', external: true, icon: 'arrow' })
          : ''
      }
    </div>
  </div>
</section>`,

    ctaBand({ localeCode, content }),
  ].join('\n\n');
}
