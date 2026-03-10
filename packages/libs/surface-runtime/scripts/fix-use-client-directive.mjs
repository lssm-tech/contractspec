#!/usr/bin/env node
/**
 * Post-build: move "use client" directive to the top of output files.
 * Bun's transpiler places it after imports; Next.js/Turbopack requires it first.
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = join(__dirname, '..');
const DIST_DIRS = ['dist', 'dist/node', 'dist/browser'];

/** Match "use client" or 'use client' as directive (with optional semicolon and newline). */
const DIRECTIVE_REGEX = /["']use client["']\s*;?\s*\n?/g;

function* walkJsFiles(dir, base = '') {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const rel = join(base, e.name);
      if (e.isDirectory()) {
        yield* walkJsFiles(join(dir, e.name), rel);
      } else if (e.name.endsWith('.js')) {
        yield join(dir, e.name);
      }
    }
  } catch {
    // Directory may not exist (e.g. browser only)
  }
}

function fixFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  if (!DIRECTIVE_REGEX.test(content)) return false;
  DIRECTIVE_REGEX.lastIndex = 0;
  content = content.replace(DIRECTIVE_REGEX, '');
  content = '"use client";\n' + content;
  writeFileSync(filePath, content, 'utf8');
  return true;
}

let fixed = 0;
for (const distDir of DIST_DIRS) {
  const absDir = join(PACKAGE_ROOT, distDir);
  for (const filePath of walkJsFiles(absDir)) {
    if (fixFile(filePath)) fixed++;
  }
}
if (fixed > 0) {
  console.log(
    `[fix-use-client-directive] moved directive to top in ${fixed} file(s)`
  );
}
