/**
 * Contact page and the 404 page.
 *
 * The contact form has no server behind it — this is a static site, and adding
 * a backend would mean a host, a database and a GDPR-relevant data store for
 * what is, in practice, a gym that answers on WhatsApp.
 *
 * So the form composes the message and hands it to a channel the business
 * already reads: WhatsApp if a number is configured, otherwise a mailto. That
 * is done in app.js; without JavaScript the form still submits as a plain
 * mailto via its action attribute, so it never silently fails.
 */

import { site, locations, verified } from '../../data/site.mjs';
import { path } from '../../lib/urls.mjs';
import { esc, each, formatHours } from '../../lib/util.mjs';
import { button, sectionHead, icons, checklist } from '../components.mjs';
import { pageHero } from './clubs.mjs';
import { telHref, whatsappHref } from '../layout.mjs';

export function contactPage({ localeCode, content, crumbs }) {
  const p = content.pages.contact;
  const f = p.form;
  const tel = telHref(site.contact.tel);
  const email = verified(site.contact.email);
  const wa = whatsappHref(site.contact.whatsapp, '');
  const waNumber = String(site.contact.whatsapp || '').replace(/\D/g, '');

  return [
    pageHero({ kicker: p.kicker, title: p.title, lead: p.lead, crumbs, crumbLabel: content.ui.sitemapLabel }),

    `<section class="section section--tight">
  <div class="wrap contact">

    <div class="contact__channels">
      <h2 class="contact__h">${esc(content.nav.contact)}</h2>
      <ul class="channels" role="list">
        ${
          wa
            ? `<li class="channel channel--wa">
          <a href="${esc(wa)}" target="_blank" rel="noopener">
            <span class="channel__icon">${icons.whatsapp()}</span>
            <span class="channel__body">
              <strong>${esc(content.ui.whatsapp)}</strong>
              <span>${esc(site.contact.whatsapp)}</span>
            </span>
            <span class="channel__go" aria-hidden="true">${icons.arrow()}</span>
          </a>
        </li>`
            : ''
        }
        ${
          tel
            ? `<li class="channel">
          <a href="${esc(tel)}">
            <span class="channel__icon">${icons.phone()}</span>
            <span class="channel__body">
              <strong>${esc(content.ui.callNow)}</strong>
              <span>${esc(site.contact.tel)}</span>
            </span>
            <span class="channel__go" aria-hidden="true">${icons.arrow()}</span>
          </a>
        </li>`
            : ''
        }
        ${
          email
            ? `<li class="channel">
          <a href="mailto:${esc(email)}">
            <span class="channel__icon">${icons.mail()}</span>
            <span class="channel__body">
              <strong>${esc(content.ui.email)}</strong>
              <span>${esc(email)}</span>
            </span>
            <span class="channel__go" aria-hidden="true">${icons.arrow()}</span>
          </a>
        </li>`
            : ''
        }
      </ul>

      <h2 class="contact__h">${esc(p.hoursTitle)}</h2>
      <ul class="hourlist hourlist--card" role="list">
${each(
  formatHours(locations[0].hours, content.ui),
  (row) => `        <li><span>${esc(row.label)}</span><span>${esc(row.time)}</span></li>`
)}
      </ul>

      <h2 class="contact__h">${esc(content.ui.ourClubs)}</h2>
      <ul class="contact__clubs" role="list">
${each(
  locations,
  (loc) => `        <li>
          <a href="${path(localeCode, content, 'club', loc.slug)}">
            <strong>${esc(loc.name)}</strong>
            <span>${esc(loc.street)}, ${esc(loc.locality)}</span>
          </a>
        </li>`
)}
      </ul>
    </div>

    <div class="contact__formwrap">
      <h2 class="contact__h">${esc(p.formTitle)}</h2>
      <p class="contact__note">${esc(p.formNote)}</p>

      <form class="form" data-contact-form
            action="${email ? `mailto:${esc(email)}` : '#'}"
            method="post" enctype="text/plain"
            data-wa="${esc(waNumber)}"
            ${email ? `data-email="${esc(email)}"` : ''}>

        <div class="field">
          <label for="cf-name">${esc(f.name)}</label>
          <input id="cf-name" name="name" type="text" required autocomplete="name"
                 placeholder="${esc(f.namePlaceholder)}">
        </div>

        <div class="field">
          <label for="cf-phone">${esc(f.phone)}</label>
          <!-- inputmode=tel brings up the numeric keypad on phones, which is
               where most of this traffic comes from. -->
          <input id="cf-phone" name="phone" type="tel" inputmode="tel" required autocomplete="tel"
                 placeholder="${esc(f.phonePlaceholder)}">
        </div>

        <div class="field">
          <label for="cf-club">${esc(f.club)}</label>
          <select id="cf-club" name="club">
${each(locations, (loc) => `            <option value="${esc(loc.name)}">${esc(loc.name)}</option>`)}
          </select>
        </div>

        <div class="field">
          <label for="cf-goal">${esc(f.goal)}</label>
          <select id="cf-goal" name="goal">
${each(f.goals, (g) => `            <option value="${esc(g)}">${esc(g)}</option>`)}
          </select>
        </div>

        <div class="field field--full">
          <label for="cf-message">${esc(f.message)}</label>
          <textarea id="cf-message" name="message" rows="5"
                    placeholder="${esc(f.messagePlaceholder)}"></textarea>
        </div>

        <div class="field field--full form__actions">
          <button class="btn btn--primary" type="submit">
            <span class="btn__label">${esc(f.submit)}</span>
            <span class="btn__icon">${icons.arrow()}</span>
          </button>
          ${
            wa
              ? `<a class="form__alt" href="${esc(wa)}" target="_blank" rel="noopener">${esc(f.whatsappInstead)}</a>`
              : ''
          }
        </div>
      </form>
    </div>
  </div>
</section>`,

    // Maps for both clubs, when embeds are configured.
    ...locations
      .filter((loc) => verified(loc.mapsEmbed))
      .map(
        (loc) => `<section class="mapsec">
  <h2 class="mapsec__title"><span class="wrap">${esc(loc.name)}</span></h2>
  <iframe class="mapsec__frame" src="${esc(verified(loc.mapsEmbed))}"
    title="${esc(loc.name)} — ${esc(p.findUsTitle)}"
    width="100%" height="420" style="border:0" loading="lazy"
    referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
</section>`
      ),
  ].join('\n\n');
}

export function notFoundPage({ localeCode, content }) {
  const p = content.pages.notFound;
  const links = [
    { key: 'home', label: content.nav.home },
    { key: 'clubs', label: content.nav.clubs },
    { key: 'disciplines', label: content.nav.disciplines },
    { key: 'pricing', label: content.nav.pricing },
    { key: 'contact', label: content.nav.contact },
  ];

  return `<section class="notfound">
  <div class="wrap notfound__inner">
    <p class="notfound__code" aria-hidden="true">404</p>
    <h1 class="notfound__title">${esc(p.title)}</h1>
    <p class="notfound__lead">${esc(p.lead)}</p>
    <ul class="notfound__links" role="list">
${each(
  links,
  (l) => `      <li><a href="${path(localeCode, content, l.key)}">${esc(l.label)}</a></li>`
)}
    </ul>
    ${button({ href: path(localeCode, content, 'home'), label: p.cta, variant: 'primary' })}
  </div>
</section>`;
}
