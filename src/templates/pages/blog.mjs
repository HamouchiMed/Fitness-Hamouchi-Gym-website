/**
 * Blog index and article pages.
 *
 * Why a gym site has a blog at all: the five commercial pages can only compete
 * for a handful of queries ("salle de sport berrechid" and close variants).
 * Articles reach people a few steps earlier — someone searching for a beginner
 * programme or what gyms cost in Morocco is not ready to sign up today, but
 * they are the same person who will search for a gym next month, and by then
 * they have already read your coaches' advice.
 */

import { site } from '../../data/site.mjs';
import { path, expandLinks } from '../../lib/urls.mjs';
import { esc, each, formatDate, readingTime } from '../../lib/util.mjs';
import { picture, button, sectionHead, icons, breadcrumbs } from '../components.mjs';
import { pageHero } from './clubs.mjs';
import { ctaBand } from './home.mjs';

export function blogIndexPage({ localeCode, content, crumbs }) {
  const p = content.pages.blog;
  // Newest first, so the index always leads with fresh content.
  const posts = [...content.articles].sort((a, b) => (a.date < b.date ? 1 : -1));

  return [
    pageHero({ kicker: p.kicker, title: p.title, lead: p.lead, crumbs, crumbLabel: content.ui.sitemapLabel }),

    `<section class="section section--tight">
  <div class="wrap">
    <ul class="bloggrid" role="list">
${each(
  posts,
  (a, i) => `      <li class="postcard postcard--lg reveal" style="--i:${i}">
        <a href="${path(localeCode, content, 'article', a.slug)}">
          <span class="postcard__media">${picture({
            name: a.image,
            alt: a.title,
            sizes: '(max-width: 800px) 100vw, 33vw',
            priority: i === 0,
          })}</span>
          <span class="postcard__body">
            <span class="postcard__meta">
              <time datetime="${esc(a.date)}">${esc(formatDate(a.date, localeCode))}</time>
              <span aria-hidden="true">·</span>
              <span>${readingTime(a.body)} ${esc(content.ui.readingTime)}</span>
            </span>
            <span class="postcard__title">${esc(a.title)}</span>
            <span class="postcard__desc">${esc(a.description)}</span>
            <span class="postcard__go">${esc(content.ui.readArticle)} ${icons.arrow()}</span>
          </span>
        </a>
      </li>`
)}
    </ul>
  </div>
</section>`,

    ctaBand({ localeCode, content }),
  ].join('\n\n');
}

export function articlePage({ localeCode, content, article, crumbs }) {
  const minutes = readingTime(article.body);
  const role = site.owner.role[localeCode] || site.owner.role.fr;

  // Other articles, for the "read next" block. Internal links between articles
  // keep readers on the site and help crawlers find every post.
  const related = content.articles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return [
    `<article class="post">
  <header class="post__head">
    <div class="wrap">
      ${breadcrumbs(crumbs, content.ui.sitemapLabel)}
      <h1 class="post__title split" data-split="lines">${esc(article.title)}</h1>
      <p class="post__lead">${esc(article.description)}</p>
      <div class="post__meta">
        <span class="post__author">
          ${icons.star()}
          <span><strong>${esc(content.ui.byAuthor)} ${esc(site.owner.name)}</strong><span>${esc(role)}</span></span>
        </span>
        <span class="post__dates">
          <time datetime="${esc(article.date)}">${esc(content.ui.published)} ${esc(
      formatDate(article.date, localeCode)
    )}</time>
          ${
            article.updated && article.updated !== article.date
              ? `<time datetime="${esc(article.updated)}">${esc(content.ui.updated)} ${esc(
                  formatDate(article.updated, localeCode)
                )}</time>`
              : ''
          }
          <span>${minutes} ${esc(content.ui.readingTime)}</span>
        </span>
      </div>
    </div>
  </header>

  <figure class="post__hero">
    ${picture({
      name: article.image,
      alt: article.title,
      sizes: '100vw',
      priority: true,
    })}
  </figure>

  <!-- The body is authored as HTML in the content files; {{placeholders}} are
       rewritten here into correct localised internal links. -->
  <div class="wrap post__bodywrap">
    <div class="prose post__body">
${expandLinks(article.body, localeCode, content)}
    </div>
  </div>
</article>`,

    related.length
      ? `<section class="section related">
  <div class="wrap">
    ${sectionHead({ kicker: content.pages.blog.kicker, title: content.ui.relatedArticles })}
    <ul class="bloggrid bloggrid--2" role="list">
${each(
  related,
  (a, i) => `      <li class="postcard reveal" style="--i:${i}">
        <a href="${path(localeCode, content, 'article', a.slug)}">
          <span class="postcard__media">${picture({
            name: a.image,
            alt: a.title,
            sizes: '(max-width: 800px) 100vw, 45vw',
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
    <div class="related__back reveal">
      ${button({ href: path(localeCode, content, 'blog'), label: content.pages.blog.title, variant: 'ghost' })}
    </div>
  </div>
</section>`
      : '',

    ctaBand({ localeCode, content }),
  ]
    .filter(Boolean)
    .join('\n\n');
}
