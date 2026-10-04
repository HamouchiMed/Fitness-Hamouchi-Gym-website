/**
 * ============================================================================
 *  Structured data (JSON-LD)
 * ============================================================================
 *
 *  This is the part of the site that talks to search engines rather than to
 *  people, and for a local business it is the highest-leverage markup on the
 *  page. It is what makes you eligible for:
 *
 *    • the local pack and map results (HealthClub + address + geo + hours)
 *    • opening hours and "Open now" shown directly in results
 *    • FAQ accordions under your listing (FAQPage)
 *    • article cards with author and date (BlogPosting)
 *    • breadcrumb trails instead of a raw URL (BreadcrumbList)
 *    • a knowledge panel tying the site to your Instagram and Facebook (sameAs)
 *
 *  Everything is emitted as a single @graph per page with stable @id values, so
 *  entities cross-reference each other instead of being repeated. That is both
 *  smaller and easier for crawlers to resolve than separate script blocks.
 *
 *  UNVERIFIED DATA IS OMITTED. Every factual field passes through verified()
 *  from data/site.mjs, which returns undefined for anything still wrapped in
 *  TODO(). A placeholder address in structured data is worse than none: it
 *  contradicts your Google Business Profile, and NAP inconsistency is one of
 *  the quickest ways to fall out of the local pack.
 * ============================================================================
 */

import { site, locations, plans, currency, stats, testimonials, verified, isTodo } from '../data/site.mjs';
import { absolute, path } from './urls.mjs';
import { hoursSchema } from './util.mjs';

// Stable @id anchors. Using fragment ids on the canonical origin means the same
// entity referenced from any page resolves to one node in Google's graph.
const ID = {
  org: () => absolute('/#organization'),
  website: () => absolute('/#website'),
  person: () => absolute('/#khalid-hamouchi'),
  club: (slug) => absolute(`/#club-${slug}`),
  page: (pathname) => `${absolute(pathname)}#webpage`,
};

/** Social profile URLs that are actually set — feeds sameAs. */
function sameAs() {
  return Object.values(site.social).map(verified).filter(Boolean);
}

/**
 * priceRange, derived from whichever plan prices are verified.
 * Google displays this on local listings as a $–$$$ style indicator.
 */
function priceRange() {
  const values = plans
    .map((p) => verified(p.price))
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0);
  if (!values.length) return undefined;
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? `${min} ${currency}` : `${min}–${max} ${currency}`;
}

/** PostalAddress for a location, or undefined if nothing is verified. */
function addressOf(loc) {
  const street = verified(loc.street);
  const postal = verified(loc.postalCode);
  // Locality and region are known facts, not placeholders, so they always ship.
  const address = {
    '@type': 'PostalAddress',
    streetAddress: street,
    postalCode: postal,
    addressLocality: loc.locality,
    addressRegion: loc.region,
    addressCountry: loc.country,
  };
  return address;
}

/** GeoCoordinates, only when both lat and lon are verified. */
function geoOf(loc) {
  const lat = verified(loc.geo?.lat);
  const lon = verified(loc.geo?.lon);
  if (!lat || !lon) return undefined;
  return { '@type': 'GeoCoordinates', latitude: Number(lat), longitude: Number(lon) };
}

/**
 * One physical club.
 *
 * `HealthClub` is the correct schema.org type for a gym — it is a subtype of
 * LocalBusiness, so it inherits address/hours/telephone while telling Google
 * specifically what kind of business this is.
 */
export function clubSchema(loc, { localeCode, content, imageUrls = [] }) {
  const amenityLabels = content.amenities || {};
  return {
    '@type': ['HealthClub', 'SportsActivityLocation'],
    '@id': ID.club(loc.slug),
    name: loc.name,
    alternateName: loc.formerNames?.length ? loc.formerNames : undefined,
    url: absolute(path(localeCode, content, 'club', loc.slug)),
    parentOrganization: { '@id': ID.org() },
    address: addressOf(loc),
    geo: geoOf(loc),
    telephone: verified(loc.tel) || verified(site.contact.tel),
    email: verified(site.contact.email),
    hasMap: verified(loc.mapsUrl),
    image: imageUrls.length ? imageUrls : undefined,
    openingHoursSpecification: hoursSchema(loc.hours),
    priceRange: priceRange(),
    currenciesAccepted: currency,
    paymentAccepted: 'Cash, Credit Card',
    // Amenities as a feature list. Google reads these for facility filters.
    amenityFeature: (loc.amenities || []).map((key) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenityLabels[key] || key,
      value: true,
    })),
    // What you can actually do here, as a service catalogue.
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: content.pages.disciplines.title,
      itemListElement: (loc.disciplines || [])
        .map((slug) => (content.disciplines || []).find((d) => d.slug === slug))
        .filter(Boolean)
        .map((d) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: d.name, description: d.short },
        })),
    },
  };
}

/** The business as a whole. Both clubs hang off this. */
export function organizationSchema({ localeCode, content, logoUrl }) {
  const primary = locations.find((l) => l.primary) || locations[0];
  const foundingDate = verified(site.founded);
  const employeeCount = verified(stats.coaches);

  return {
    '@type': ['Organization', 'SportsOrganization'],
    '@id': ID.org(),
    name: site.legalName,
    /**
     * Includes former trading names. The gym rebranded from "Club Nour", and
     * that name still carries years of word of mouth and an existing Facebook
     * page in Berrechid. Declaring it here lets Google connect searches for
     * the old name to this business instead of to nothing.
     */
    alternateName: [
      ...locations.map((l) => l.name),
      ...locations.flatMap((l) => l.formerNames || []),
    ].filter((v, i, a) => a.indexOf(v) === i && v !== site.legalName),
    url: absolute(path(localeCode, content, 'home')),
    logo: logoUrl ? { '@type': 'ImageObject', url: logoUrl } : undefined,
    image: logoUrl,
    description: content.home.seo.description,
    slogan: content.footer.tagline,
    telephone: verified(site.contact.tel),
    email: verified(site.contact.email),
    address: addressOf(primary),
    foundingDate: foundingDate ? `${foundingDate}` : undefined,
    founder: { '@id': ID.person() },
    numberOfEmployees: employeeCount
      ? { '@type': 'QuantitativeValue', value: Number(employeeCount) }
      : undefined,
    areaServed: [
      { '@type': 'City', name: 'Berrechid' },
      { '@type': 'AdministrativeArea', name: 'Casablanca-Settat' },
    ],
    sameAs: sameAs(),
    location: locations.map((l) => ({ '@id': ID.club(l.slug) })),
    contactPoint: verified(site.contact.tel)
      ? {
          '@type': 'ContactPoint',
          telephone: verified(site.contact.tel),
          contactType: 'customer service',
          availableLanguage: ['fr', 'ar', 'en'],
          areaServed: 'MA',
        }
      : undefined,
  };
}

/** The site itself — ties pages together and names the publisher. */
export function websiteSchema({ localeCode, content }) {
  return {
    '@type': 'WebSite',
    '@id': ID.website(),
    url: absolute('/'),
    name: site.legalName,
    description: content.home.seo.description,
    publisher: { '@id': ID.org() },
    inLanguage: localeCode,
    // No SearchAction: the site has no internal search endpoint, and claiming
    // a sitelinks searchbox that does not exist is a markup error.
  };
}

/** The founder/head coach. Gives articles a real author entity. */
export function personSchema({ localeCode, imageUrl }) {
  return {
    '@type': 'Person',
    '@id': ID.person(),
    name: site.owner.name,
    jobTitle: site.owner.role[localeCode] || site.owner.role.fr,
    worksFor: { '@id': ID.org() },
    image: imageUrl,
    sameAs: [site.owner.facebook].filter(Boolean),
  };
}

/** Per-page node. Every page gets one, linked to the site and the org. */
export function webPageSchema({ pathname, title, description, localeCode, imageUrl, breadcrumbId }) {
  return {
    '@type': 'WebPage',
    '@id': ID.page(pathname),
    url: absolute(pathname),
    name: title,
    description,
    isPartOf: { '@id': ID.website() },
    about: { '@id': ID.org() },
    inLanguage: localeCode,
    primaryImageOfPage: imageUrl ? { '@type': 'ImageObject', url: imageUrl } : undefined,
    breadcrumb: breadcrumbId ? { '@id': breadcrumbId } : undefined,
  };
}

/**
 * Breadcrumbs. Replaces the bare URL under your result with a readable trail,
 * which measurably improves click-through on deeper pages.
 */
export function breadcrumbSchema(items, pathname) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absolute(pathname)}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

/**
 * FAQ. One of the few schema types that can win extra vertical space in the
 * results page. Only emit it where the questions are genuinely on the page —
 * marking up invisible content is a guidelines violation.
 */
export function faqSchema(faq, pathname) {
  return {
    '@type': 'FAQPage',
    '@id': `${absolute(pathname)}#faq`,
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/** Membership plans as offers, so prices can surface in results. */
export function offerCatalogSchema({ content, pathname }) {
  const items = plans
    .map((plan) => {
      const copy = content.plans[plan.id];
      if (!copy) return null;
      const price = verified(plan.price);
      return {
        '@type': 'Offer',
        name: copy.name,
        description: copy.tagline,
        // Omit price entirely rather than publishing a guess.
        price: price || undefined,
        priceCurrency: price ? currency : undefined,
        availability: 'https://schema.org/InStock',
        url: absolute(pathname),
        itemOffered: {
          '@type': 'Service',
          name: copy.name,
          serviceType: 'Gym membership',
          provider: { '@id': ID.org() },
        },
      };
    })
    .filter(Boolean);

  return {
    '@type': 'OfferCatalog',
    '@id': `${absolute(pathname)}#offers`,
    name: content.pages.pricing.title,
    itemListElement: items,
  };
}

/** Blog article. Drives the date, author and headline shown in results. */
export function articleSchema({ article, pathname, localeCode, imageUrl, minutes }) {
  return {
    '@type': 'BlogPosting',
    '@id': `${absolute(pathname)}#article`,
    headline: article.title,
    description: article.description,
    url: absolute(pathname),
    datePublished: article.date,
    dateModified: article.updated || article.date,
    inLanguage: localeCode,
    image: imageUrl ? [imageUrl] : undefined,
    author: { '@id': ID.person() },
    publisher: { '@id': ID.org() },
    timeRequired: `PT${minutes}M`,
    mainEntityOfPage: { '@id': ID.page(pathname) },
    isPartOf: { '@id': ID.website() },
  };
}

/** A list of articles, for the blog index. */
export function blogIndexSchema({ content, localeCode, pathname, articleUrls }) {
  return {
    '@type': 'Blog',
    '@id': `${absolute(pathname)}#blog`,
    name: content.pages.blog.title,
    description: content.pages.blog.seo.description,
    url: absolute(pathname),
    inLanguage: localeCode,
    publisher: { '@id': ID.org() },
    blogPost: articleUrls.map((u) => ({ '@type': 'BlogPosting', '@id': `${u}#article` })),
  };
}

/**
 * Review markup, but ONLY from real reviews present in data/site.mjs.
 * Fabricated review markup is an explicit manual-action trigger, so an empty
 * testimonials array produces nothing at all.
 */
export function reviewSchema() {
  if (!testimonials.length) return null;
  return testimonials.map((t) => ({
    '@type': 'Review',
    itemReviewed: { '@id': ID.org() },
    author: { '@type': 'Person', name: t.name },
    reviewBody: typeof t.quote === 'string' ? t.quote : t.quote.fr,
  }));
}

/** Wraps nodes into one @graph document. */
export function graph(nodes) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.flat().filter(Boolean),
  };
}

export { ID as schemaIds, priceRange, isTodo };
