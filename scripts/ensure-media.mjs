#!/usr/bin/env node
/**
 * Runs before `npm run build`.
 *
 * If the generated images are missing — a fresh clone, or a CI checkout where
 * dist artefacts are not committed — this runs the media pipeline once so the
 * build has images to reference. If they are already there it does nothing, so
 * the common case stays fast.
 */

import { access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

import { images, FALLBACK_WIDTH } from '../src/data/media.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'src', 'assets', 'img');

const missing = [];
for (const name of Object.keys(images)) {
  try {
    await access(join(IMG, `${name}-${FALLBACK_WIDTH}.jpg`));
  } catch {
    missing.push(name);
  }
}

if (!missing.length) process.exit(0);

console.log(`\n  ${missing.length} image set(s) missing — running the media pipeline first.\n`);

const child = spawn(process.execPath, [join(ROOT, 'scripts', 'media.mjs')], { stdio: 'inherit' });
child.on('exit', (code) => {
  if (code !== 0) {
    console.error(
      '\n  Media generation failed. ImageMagick (`convert`) is required.\n' +
        '  Debian/Ubuntu: sudo apt install imagemagick ffmpeg\n' +
        '  macOS:         brew install imagemagick ffmpeg\n'
    );
  }
  process.exit(code ?? 0);
});
