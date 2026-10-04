#!/usr/bin/env node
/**
 * Static file server for previewing dist/.
 *
 * Mirrors how a real static host behaves, which matters for checking the site
 * before deploying:
 *   • /clubs/      → dist/clubs/index.html
 *   • /clubs       → 308 to /clubs/   (so relative links resolve the same way)
 *   • unknown path → dist/404.html with a real 404 status
 *
 * `node scripts/serve.mjs --port 4000` to change the port.
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

const argv = process.argv.slice(2);
const portArg = argv.indexOf('--port');
const PORT = Number(portArg !== -1 ? argv[portArg + 1] : process.env.PORT || 3000);
const HOST = argv.includes('--host') ? '0.0.0.0' : '127.0.0.1';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

const isFile = async (p) => {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
};

const server = createServer(async (req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }

  // Block traversal outside dist/.
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  let filePath = join(DIST, safe);
  if (!filePath.startsWith(DIST)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  // Directory → index.html, redirecting to the trailing-slash form first.
  if (safe.endsWith('/')) {
    filePath = join(filePath, 'index.html');
  } else if (!extname(safe)) {
    if (await isFile(join(DIST, safe, 'index.html'))) {
      res.writeHead(308, { Location: `${pathname}/` }).end();
      return;
    }
  }

  if (await isFile(filePath)) {
    const body = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': TYPES[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'Content-Length': body.length,
    });
    res.end(body);
    return;
  }

  const notFound = join(DIST, '404.html');
  if (await isFile(notFound)) {
    const body = await readFile(notFound);
    res.writeHead(404, { 'Content-Type': TYPES['.html'], 'Content-Length': body.length });
    res.end(body);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' }).end('404');
});

server.listen(PORT, HOST, () => {
  console.log(`\n  Serving dist/ → \u001b[36mhttp://localhost:${PORT}\u001b[0m\n`);
});
