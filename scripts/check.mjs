#!/usr/bin/env node
/**
 * Post-build verification — `npm run check`.
 *
 * Catches the class of mistake that does not throw during the build but costs
 * you traffic in production:
 *
 *   • internal links that 404
 *   • images referenced but never generated
 *   • pages missing a canonical, a title or a description
 *   • hreflang sets that are not reciprocal (Google discards the whole cluster
 *     if page A points at B but B does not point back at A)
 *   • more or fewer than one <h1>
 *   • images without alt text
 *   • JSON-LD that does not parse
 *   • sitemap entries that do not resolve to a built file
 *
 * Everything is checked against the built output in dist/, not the templates,
 * so it verifies what will actually be deployed.
 */

import { readdir, readFile, access } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

const problems = [];
const notes = [];
const add = (file, msg) => problems.push(`${file}: ${msg}`);

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

/** Every .html file under dist/. */
async function htmlFiles(dir = DIST, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await htmlFiles(full, acc);
    else if (entry.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

/** Maps a site-absolute URL path to the file that would serve it. */
function pathToFile(pathname) {
  const clean = pathname.split('#')[0].split('?')[0];
  if (clean.endsWith('/')) return join(DIST, clean, 'index.html');
  return join(DIST, clean);
}

const attrOf = (html, re) => {
  const m = html.match(re);
  return m ? m[1] : null;
};

/**
 * Validates vercel.json against the properties Vercel's schema accepts.
 *
 * Vercel rejects unknown properties outright — a stray key fails the import
 * with "should NOT have additional property", and because JSON has no comment
 * syntax, the tempting fix (adding a `comment` field to explain a rule) is
 * exactly what breaks it. Rationale for each rule lives in the README instead.
 */
async function checkVercelConfig() {
  const file = join(ROOT, 'vercel.json');
  if (!(await exists(file))) return;

  let config;
  try {
    config = JSON.parse(await readFile(file, 'utf8'));
  } catch (e) {
    add('vercel.json', `does not parse: ${e.message}`);
    return;
  }

  const TOP = new Set([
    '$schema', 'buildCommand', 'devCommand', 'installCommand', 'ignoreCommand',
    'outputDirectory', 'framework', 'cleanUrls', 'trailingSlash', 'redirects',
    'rewrites', 'headers', 'routes', 'regions', 'functions', 'crons', 'images',
    'public', 'git', 'rootDirectory',
  ]);
  const REDIRECT = new Set(['source', 'destination', 'permanent', 'statusCode', 'has', 'missing']);
  const HEADER_RULE = new Set(['source', 'headers', 'has', 'missing']);
  const HEADER_ENTRY = new Set(['key', 'value']);

  for (const key of Object.keys(config)) {
    if (!TOP.has(key)) add('vercel.json', `unknown top-level property "${key}" — Vercel will reject the import`);
  }
  (config.redirects || []).forEach((rule, i) => {
    for (const key of Object.keys(rule)) {
      if (!REDIRECT.has(key)) add('vercel.json', `redirects[${i}] has unsupported property "${key}"`);
    }
  });
  (config.headers || []).forEach((rule, i) => {
    for (const key of Object.keys(rule)) {
      if (!HEADER_RULE.has(key)) add('vercel.json', `headers[${i}] has unsupported property "${key}"`);
    }
    (rule.headers || []).forEach((entry, j) => {
      for (const key of Object.keys(entry)) {
        if (!HEADER_ENTRY.has(key)) {
          add('vercel.json', `headers[${i}].headers[${j}] has unsupported property "${key}"`);
        }
      }
    });
  });

  // The build would still succeed with these wrong, but the deploy would serve
  // the wrong directory.
  if (config.outputDirectory && config.outputDirectory !== 'dist') {
    add('vercel.json', `outputDirectory is "${config.outputDirectory}" but the build writes to dist/`);
  }
}

async function main() {
  await checkVercelConfig();

  if (!(await exists(DIST))) {
    console.error('\n  dist/ not found. Run `npm run build` first.\n');
    process.exitCode = 1;
    return;
  }

  const files = await htmlFiles();
  const pages = new Map();

  for (const file of files) {
    pages.set(file, await readFile(file, 'utf8'));
  }

  const hreflangMap = new Map(); // href -> Set of hrefs it declares

  for (const [file, html] of pages) {
    const rel = '/' + relative(DIST, file).replace(/index\.html$/, '').replace(/\\/g, '/');
    const isErrorPage = file.endsWith('404.html');
    const isRedirectStub = html.includes('http-equiv="refresh"');

    // ---- Head essentials ------------------------------------------------
    const title = attrOf(html, /<title>([^<]*)<\/title>/);
    if (!title || !title.trim()) add(rel, 'missing <title>');

    if (!isRedirectStub) {
      const desc = attrOf(html, /<meta name="description" content="([^"]*)"/);
      if (!desc || !desc.trim()) add(rel, 'missing meta description');
    }

    const canonical = attrOf(html, /<link rel="canonical" href="([^"]*)"/);
    if (!canonical) add(rel, 'missing canonical');

    // ---- Headings -------------------------------------------------------
    if (!isRedirectStub) {
      const h1s = html.match(/<h1[\s>]/g) || [];
      if (h1s.length === 0) add(rel, 'no <h1>');
      else if (h1s.length > 1) add(rel, `${h1s.length} <h1> elements — there should be exactly one`);
    }

    // ---- Images ---------------------------------------------------------
    const imgTags = html.match(/<img\b[^>]*>/g) || [];
    for (const tag of imgTags) {
      if (!/\salt=/.test(tag)) add(rel, 'an <img> has no alt attribute');
      if (!/\swidth=/.test(tag) || !/\sheight=/.test(tag)) {
        add(rel, 'an <img> has no width/height — this causes layout shift');
      }
    }

    // ---- JSON-LD --------------------------------------------------------
    const ldBlocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
    if (!isRedirectStub && ldBlocks.length === 0) add(rel, 'no JSON-LD structured data');
    for (const block of ldBlocks) {
      const json = block.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '');
      try {
        const parsed = JSON.parse(json);
        if (!parsed['@context']) add(rel, 'JSON-LD has no @context');
      } catch (e) {
        add(rel, `JSON-LD does not parse: ${e.message}`);
      }
    }

    // ---- hreflang -------------------------------------------------------
    if (!isErrorPage && !isRedirectStub) {
      const alts = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
      if (alts.length === 0) {
        add(rel, 'no hreflang alternates');
      } else {
        const self = canonical;
        const declared = new Set(alts.map((m) => m[2]));
        if (self && !declared.has(self)) {
          add(rel, 'hreflang set does not include this page itself (it must be self-referential)');
        }
        if (self) hreflangMap.set(self, declared);
      }
    }

    // ---- Internal links -------------------------------------------------
    const hrefs = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]);
    for (const href of new Set(hrefs)) {
      // Skip well-known non-file paths handled by the host.
      if (href.startsWith('//')) continue;
      const target = pathToFile(href);
      if (!(await exists(target))) {
        add(rel, `broken internal link → ${href}`);
      }
    }

    // ---- Referenced assets ----------------------------------------------
    const assets = [
      ...[...html.matchAll(/src="(\/assets\/[^"]+)"/g)].map((m) => m[1]),
      ...[...html.matchAll(/<link[^>]+href="(\/assets\/[^"]+)"/g)].map((m) => m[1]),
    ];
    // srcset entries too — a missing width variant is invisible until a
    // particular viewport asks for it.
    const srcsets = [...html.matchAll(/srcset="([^"]+)"/g)].map((m) => m[1]);
    for (const set of srcsets) {
      for (const part of set.split(',')) {
        const url = part.trim().split(/\s+/)[0];
        if (url && url.startsWith('/assets/')) assets.push(url);
      }
    }
    for (const asset of new Set(assets)) {
      if (!(await exists(join(DIST, asset)))) add(rel, `missing asset → ${asset}`);
    }
  }

  // ---- hreflang reciprocity ---------------------------------------------
  for (const [url, declared] of hreflangMap) {
    for (const other of declared) {
      if (other === url) continue;
      const back = hreflangMap.get(other);
      if (!back) continue; // target may be outside the built set
      if (!back.has(url)) {
        add(url, `hreflang is not reciprocal — ${other} does not point back`);
      }
    }
  }

  // ---- Well-known files --------------------------------------------------
  for (const f of [
    'sitemap.xml', 'robots.txt', 'manifest.webmanifest', '404.html',
    // Icons, all rendered from the logo artwork by scripts/media.mjs.
    'favicon.ico', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png',
  ]) {
    if (!(await exists(join(DIST, f)))) add('/', `missing ${f}`);
  }

  // ---- Sitemap integrity -------------------------------------------------
  const sitemapPath = join(DIST, 'sitemap.xml');
  if (await exists(sitemapPath)) {
    const xml = await readFile(sitemapPath, 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    notes.push(`${locs.length} URLs in sitemap.xml`);
    for (const loc of locs) {
      let p;
      try {
        p = new URL(loc).pathname;
      } catch {
        add('sitemap.xml', `invalid URL: ${loc}`);
        continue;
      }
      if (!(await exists(pathToFile(p)))) add('sitemap.xml', `points at a page that was not built: ${p}`);
    }
  }

  // ---- Report ------------------------------------------------------------
  const red = (s) => `\u001b[31m${s}\u001b[0m`;
  const green = (s) => `\u001b[32m${s}\u001b[0m`;
  const dim = (s) => `\u001b[2m${s}\u001b[0m`;

  console.log('');
  console.log(`  Checked ${files.length} pages in dist/`);
  for (const n of notes) console.log(dim(`  ${n}`));

  if (problems.length) {
    console.log('');
    console.log(red(`  ${problems.length} problem${problems.length > 1 ? 's' : ''}:`));
    // Collapse repeats — one missing asset referenced from 50 pages is one bug.
    const counts = new Map();
    for (const p of problems) counts.set(p, (counts.get(p) || 0) + 1);
    for (const [p, n] of [...counts].slice(0, 60)) {
      console.log(red(`    ✗ ${p}${n > 1 ? dim(` (×${n})`) : ''}`));
    }
    if (counts.size > 60) console.log(dim(`    … and ${counts.size - 60} more`));
    console.log('');
    process.exitCode = 1;
  } else {
    console.log('');
    console.log(green('  ✓ No broken links, missing assets, or malformed metadata.'));
    console.log('');
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
