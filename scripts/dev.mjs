#!/usr/bin/env node
/**
 * Development server — `npm run dev`.
 *
 * Rebuilds when anything in src/ changes and serves dist/ on port 3000.
 * No file watching library: node:fs.watch with a debounce is enough, and
 * keeping the project dependency-free means it still runs in five years.
 *
 * Images are NOT regenerated on change — that is slow and rarely what you
 * want mid-edit. Run `npm run media` yourself after adding photos.
 */

import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');

let building = false;
let queued = false;

function build() {
  if (building) {
    queued = true;
    return;
  }
  building = true;

  const started = Date.now();
  const child = spawn(process.execPath, [join(ROOT, 'build.mjs')], { stdio: 'inherit' });

  child.on('exit', () => {
    building = false;
    console.log(`\u001b[2m  rebuilt in ${Date.now() - started}ms\u001b[0m\n`);
    if (queued) {
      queued = false;
      build();
    }
  });
}

let timer;
function onChange(_event, filename) {
  if (!filename) return;
  // Ignore generated images and the editor's own temp files.
  const name = String(filename);
  if (name.includes('assets/img/') || name.startsWith('.') || name.endsWith('~')) return;

  clearTimeout(timer);
  timer = setTimeout(() => {
    console.log(`\u001b[36m  changed: ${name}\u001b[0m`);
    build();
  }, 120);
}

console.log('\n  Watching src/ …\n');
build();

try {
  watch(SRC, { recursive: true }, onChange);
} catch {
  // recursive: true is unsupported on some Linux kernels; fall back to
  // watching the top-level directories individually.
  const dirs = ['data', 'content', 'lib', 'templates', 'templates/pages', 'assets/css', 'assets/js'];
  for (const d of dirs) {
    try {
      watch(join(SRC, d), onChange);
    } catch {
      /* directory may not exist — skip */
    }
  }
}

spawn(process.execPath, [join(ROOT, 'scripts', 'serve.mjs')], { stdio: 'inherit' });
