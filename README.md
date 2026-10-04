# Fitness Hamouchi Gym — website

Trilingual (French / Arabic / English) website for the two clubs in Berrechid:
**Fitness Hamouchi Gym** and **Club Nour**.

Static HTML, no framework, no runtime dependencies. 39 indexable pages, full
structured data, self-hosted fonts, and a design built to be fast on the
mid-range Android phones most of your visitors actually use.

---

## Quick start

```bash
npm run media     # generate images (needs ImageMagick) — only needed once
npm run build     # render the site into dist/
npm start         # preview at http://localhost:3000
```

While editing:

```bash
npm run dev       # rebuilds on every change, serves on :3000
npm run check     # verifies the built site: links, assets, metadata, schema
```

Requirements: Node 18+, and ImageMagick + ffmpeg for `npm run media`
(`sudo apt install imagemagick ffmpeg`, or `brew install imagemagick ffmpeg`).

---

## ⚠️ Before you publish — the launch checklist

**The site currently contains placeholder business data that you must replace.**

Every time you run `npm run build`, it prints a checklist of every unverified
value. Work through it until it reports zero.

All of it lives in **one file: `src/data/site.mjs`**. Values look like this:

```js
tel: TODO('+212600000000', 'Main phone number in E.164 format.'),
```

To fill one in, delete the wrapper and keep the quotes:

```js
tel: '+212612345678',
```

### What must be replaced

| Item | Where | Why it matters |
|---|---|---|
| **Domain** | `site.url` | Every canonical tag and sitemap URL is built from this. Wrong domain = the site will not index. |
| **Phone + WhatsApp** | `site.contact` | The WhatsApp button and every call-to-action are hidden until these are set. |
| **Both addresses** | `locations[].street`, `.postalCode` | This is the single most important field for appearing in Google Maps. |
| **Both map pin coordinates** | `locations[].geo` | Right-click your pin in Google Maps → click the coordinates to copy them. |
| **Google Maps links** | `locations[].mapsUrl`, `.mapsEmbed` | Enables the "Directions" button and the embedded map. |
| **Opening hours** | `STANDARD_HOURS` | Currently a sensible guess. Google shows these directly in results. |
| **Prices** | `plans[].price` | Until set, every card reads "on request". |
| **Headline numbers** | `stats` | ⚠️ These **do** display while unverified. 500 members, 10 years, 6 coaches, 800 m² are placeholders — correct them or remove the section. |
| **Founding year** | `site.founded` | |
| **Email** | `site.contact.email` | |

### Why unverified data is withheld from structured data

Values still wrapped in `TODO()` render on the page but are **deliberately
excluded from the JSON-LD structured data**.

That is not caution for its own sake. Google cross-checks the name, address and
phone number in your structured data against your Google Business Profile and
third-party directories. Inconsistent business details ("NAP mismatch") are one
of the quickest ways to fall *out* of the local map pack. A placeholder address
in your schema is worse than no address at all.

Prices are stricter still: an unverified price does not even render. A visitor
who reads "250 MAD" and is quoted 400 at the desk is a lost sale and a lost
reputation, so the card says "on request" until you put the real number in.

**Never invent reviews.** `testimonials` in `site.mjs` is empty on purpose —
fabricated review markup is an explicit Google manual-action trigger. Collect
real ones from your Google Business Profile and paste them in; the section
appears automatically once the array is non-empty.

---

## Adding your real photos and videos

I could not pull media from your Facebook and Instagram — this build
environment blocks both domains, and neither allows automated downloading in
any case. So every image is currently generated placeholder artwork, and the
site is built so your real photos drop straight in.

### The process

1. **Collect your originals.** Download from your phone or camera, not from the
   Instagram or Facebook app — both re-compress what they serve you, and the
   re-compressed version will look soft on a large screen.

2. **Name each file after its slot**, listed in `src/data/media.mjs`:

   ```
   src/assets/img/source/hero-main.jpg
   src/assets/img/source/club-fitness-hamouchi-1.jpg
   src/assets/img/source/coach-khalid-hamouchi.jpg
   ```

   `.jpg .jpeg .png .webp .heic .avif` all work.

3. **Run the pipeline:**

   ```bash
   npm run media && npm run build
   ```

Each photo is cropped to the right aspect ratio, resized into every responsive
width, converted to WebP with a JPEG fallback, and **stripped of all metadata**
— which matters, because phone photos carry GPS coordinates in their EXIF data
and publishing them would leak the exact location every shot was taken.

`npm run media` prints which slots are still placeholders, with a note on what
belongs in each. Fill them in any order; the site is never broken in between.

### The three that matter most

- **`hero-main` / `hero-poster`** — the first thing anyone sees. A wide
  landscape shot of the busiest, best-looking part of the main club, with
  people training in it.
- **`coach-khalid-hamouchi`** — a real face raises conversion more than any
  other single image on a gym site.
- **`og-default`** — the card shown when someone shares the link on WhatsApp.
  Must be exactly 1200×630.

### Hero video

Drop footage at `src/assets/video/hero.source.mp4` and run `npm run media`. It
gets trimmed, scaled, muted and compressed to MP4 + WebM, and the poster frame
is extracted to match.

Keep it **6–12 seconds and silent**. It autoplays muted so sound is stripped
anyway, and a heavy video directly damages your Largest Contentful Paint score,
which Google ranks on. Without footage, a slow push-in over the poster image
stands in — which is what you are seeing now.

### One rule about photographing members

Get explicit permission before publishing a recognisable photo of anyone
training, and treat the women's area as off-limits unless everyone in frame has
agreed. This is both a legal matter under Morocco's Law 09-08 on personal data
and the fastest way to lose a member's trust.

---

## Deploying

### Vercel (recommended — `vercel.json` is already configured)

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Import **`HamouchiMed/Fitness-Hamouchi-Gym-website`**.
3. Change **Branch** to `claude/vibrant-fermi-9bvpqd` (or merge it to `main`
   first and deploy that).
4. Leave every build setting alone — Vercel reads them from `vercel.json`.
   Do **not** add an install command; the project has no dependencies.
5. Click **Deploy**.

That is the whole process. There is nothing to configure, because:

- **The images are committed.** Vercel's build container has no ImageMagick, so
  `npm run media` cannot run there. The generated images are in git on purpose,
  and `prebuild` detects them and does nothing. (Verified by building in a
  clean clone with `convert` and `ffmpeg` removed from `PATH`.)
- **The site URL fills itself in.** `site.url` reads
  `VERCEL_PROJECT_PRODUCTION_URL` at build time, so canonicals, hreflang and
  the sitemap all point at your real deployment from the first build, before
  you own a domain.
- **No `npm install` is needed.** Zero dependencies, Node 18+.

`vercel.json` handles clean URLs, trailing slashes, `/fr/*` → `/*` redirects,
per-asset cache headers, and security headers.

#### Connecting your own domain

1. **Settings → Domains** in the Vercel project, add the domain.
2. Point the DNS records where Vercel tells you (at your registrar).
3. Then **either** set `site.url` in `src/data/site.mjs` to the new domain and
   push, **or** add a `SITE_URL` environment variable in Vercel and redeploy.
   Either one takes precedence over the auto-detected URL.

Do step 3 before submitting anything to Google Search Console — otherwise your
sitemap will advertise the `.vercel.app` address.

### Automatic redeploys

Once imported, every push to that branch redeploys. So the workflow for
updating prices, hours or photos is just: edit, commit, push.

### Anywhere else

`dist/` is plain static files. Netlify, Cloudflare Pages, GitHub Pages or any
Apache/nginx host will serve it as-is. Every page is written as
`<path>/index.html`, so no rewrite rules are needed.

---

## After launch — what actually moves the needle

The site is built correctly, but **on-page SEO is maybe 30% of local ranking**.
In rough order of impact:

1. **Claim and complete your Google Business Profile.** For "salle de sport
   berrechid", the map pack sits above every normal result, and it is driven by
   your Business Profile, not your website. Both clubs need their own profile.
   Use the exact same name, address and phone as in `site.mjs` — character for
   character.

2. **Get reviews, and reply to all of them.** Review count and recency are
   among the strongest local ranking signals there are. Ask every member who
   finishes a good session. Reply to negative ones calmly and publicly.

3. **Post your real photos**, here and on the Business Profile. Profiles with
   photos get substantially more direction requests and calls.

4. **Submit the sitemap.** [Google Search Console](https://search.google.com/search-console)
   → add your domain → submit `https://yourdomain.ma/sitemap.xml`. Then put the
   verification token into `site.verification.google` and redeploy.

5. **Get listed in Moroccan directories** with identical details: Telecontact,
   Clubs.ma, Annuaire-Gratuit, Cybo. Consistency across these is what convinces
   Google your business details are real.

6. **Keep the blog going.** Three articles ship with the site, in all three
   languages. One genuinely useful article a month, answering something members
   actually ask, compounds over a year. Add them to `articles` in the three
   content files — but a slug must exist in **all three** locales or the build
   will fail, which is intentional: a half-translated article breaks the
   hreflang cluster.

7. **Link from your Instagram and Facebook bios.** Those are the two links you
   already control, and they are how your existing audience will find the site.

### Adding analytics

In `site.analytics`:

- `plausibleDomain` — privacy-friendly, cookieless, needs no consent banner.
  Recommended.
- `gaMeasurementId` — Google Analytics. More data, but it sets cookies, so you
  would need a consent banner to use it lawfully for EU visitors.

Leave both empty and **no tracking script is emitted at all**.

---

## How the project is organised

```
build.mjs                  The generator. Renders every page, writes sitemap,
                           robots.txt, RSS, manifest, favicon; runs SEO checks.

src/data/site.mjs          ← ALL business data. The file you will edit most.
src/data/media.mjs         Image manifest: every slot, its ratio, what goes in it.

src/content/fr.mjs         ← ALL copy, per language. No text lives in templates.
src/content/ar.mjs
src/content/en.mjs

src/lib/urls.mjs           URL scheme, hreflang, internal-link expansion.
src/lib/schema.mjs         JSON-LD builders — the structured data layer.
src/lib/util.mjs           Escaping, dates, opening hours, reading time.

src/templates/layout.mjs   <head>, header, footer — the document shell.
src/templates/components.mjs  Buttons, cards, images, accordion, icons.
src/templates/pages/*.mjs  One module per page type.

src/assets/css/main.css    The whole design system, in one documented file.
src/assets/js/app.js       Motion and behaviour. Everything degrades gracefully.
src/assets/fonts/          Self-hosted Anton, Inter, Cairo (SIL OFL).
src/assets/vendor/         Self-hosted GSAP + Lenis.

scripts/media.mjs          Image/video pipeline and placeholder generation.
scripts/check.mjs          Post-build verification.
scripts/serve.mjs          Static preview server.
scripts/dev.mjs            Watch + rebuild + serve.
```

### URL scheme

```
French (default)   /              /clubs/      /cours/      /blog/<slug>/
Arabic             /ar/           /ar/clubs/   /ar/cours/   /ar/blog/<slug>/
English            /en/           /en/clubs/   /en/classes/ /en/blog/<slug>/
```

French sits at the root rather than `/fr/` so the homepage's authority is not
split between two URLs. `/fr/*` redirects to `/*`.

### Common edits

| You want to… | Edit |
|---|---|
| Change a phone number, address, price | `src/data/site.mjs` |
| Change any wording | `src/content/fr.mjs` (and `ar` / `en`) |
| Add a blog article | `articles` in **all three** content files |
| Add a discipline | `disciplines` in all three, plus an image in `media.mjs` |
| Add a third club | `locations` in `site.mjs` — the page builds itself |
| Change colours or type | the tokens at the top of `src/assets/css/main.css` |

---

## What is built in

**SEO** — per-page titles and descriptions with length budgets enforced at
build time; canonical URLs; reciprocal hreflang across three locales plus
`x-default`; sitemap with alternates; robots.txt; RSS per locale; Open Graph and
Twitter cards; breadcrumbs.

**Structured data** — one `@graph` per page: `Organization`, `WebSite`,
`Person` (the coach), a `HealthClub` per location with address, geo, opening
hours, amenities and services, `FAQPage`, `OfferCatalog` for memberships,
`BlogPosting` for articles, `BreadcrumbList` throughout.

**Performance** — no framework, no CDN, no third-party requests. Self-hosted
fonts with subsetting and preload. Responsive WebP with JPEG fallback and
explicit dimensions on every image, so Cumulative Layout Shift is zero. The
hero video loads only after the page settles, and never on a metered or
data-saver connection.

**Accessibility** — skip link, visible focus styles throughout, one `<h1>` per
page with no skipped heading levels, alt text on every image, a focus-trapped
mobile menu, the FAQ built on native `<details>` so it works without
JavaScript, and a full `prefers-reduced-motion` path that disables smooth
scrolling, parallax, reveals and the hero video.

**Resilience** — with JavaScript disabled the site is fully readable and
navigable, the menu and FAQ still work, and the contact form still submits.
GSAP and Lenis are self-hosted and optional: if either fails to load, the page
falls back to IntersectionObserver and native scrolling rather than breaking.

---

## Licences

Fonts are SIL Open Font License (Anton, Inter, Cairo) — licence texts in
`src/assets/fonts/licenses/`. GSAP is used under its standard no-charge licence
(the free plugins only). Lenis is MIT. All are self-hosted, so the site has no
third-party runtime dependency.
