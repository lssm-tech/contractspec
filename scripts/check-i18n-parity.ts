#!/usr/bin/env bun
/**
 * CI check: verify i18n catalog key parity across all instrumented packages.
 *
 * For each package that has an i18n module, this script:
 *   1. Imports the en, fr, and es catalogs
 *   2. Extracts the message keys from each
 *   3. Verifies all three catalogs have the exact same set of keys
 *   4. Reports any mismatches and exits with code 1 on failure
 *
 * Usage:
 *   bun run scripts/check-i18n-parity.ts
 *
 * @module scripts/check-i18n-parity
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { glob } from 'glob';

const ROOT = join(import.meta.dirname, '..');
const LOCALES = ['en', 'fr', 'es'] as const;

interface CatalogModule {
  messages: Record<string, unknown>;
  locale: string;
  fallback: string;
  meta: { key: string };
}

function extractKeys(mod: CatalogModule): string[] {
  return Object.keys(mod.messages).sort();
}

async function importCatalog(path: string): Promise<CatalogModule> {
  const mod = await import(path);
  // Catalogs export a named variable like `enMessages`, `frMessages`, `esMessages`
  const exportNames = Object.keys(mod);
  const catalogExport = exportNames.find((name) => name.endsWith('Messages'));
  if (!catalogExport) {
    throw new Error(
      `No *Messages export found in ${path}. Exports: ${exportNames.join(', ')}`
    );
  }
  return mod[catalogExport] as CatalogModule;
}

async function main() {
  // Find all packages with i18n catalogs
  const catalogDirs = await glob('packages/**/src/i18n/catalogs', {
    cwd: ROOT,
    absolute: false,
  });

  let failures = 0;
  let packages = 0;

  for (const catalogDir of catalogDirs.sort()) {
    const absDir = join(ROOT, catalogDir);
    const pkgRelative = catalogDir.replace('/src/i18n/catalogs', '');

    // Check all locales exist
    const missingLocales: string[] = [];
    for (const locale of LOCALES) {
      try {
        await readFile(join(absDir, `${locale}.ts`), 'utf-8');
      } catch {
        missingLocales.push(locale);
      }
    }

    if (missingLocales.length > 0) {
      console.error(
        `FAIL  ${pkgRelative}: missing catalogs: ${missingLocales.join(', ')}`
      );
      failures++;
      continue;
    }

    // Import all catalogs and extract keys
    const catalogs: Record<string, string[]> = {};
    let importError = false;

    for (const locale of LOCALES) {
      try {
        const mod = await importCatalog(join(absDir, `${locale}.ts`));
        catalogs[locale] = extractKeys(mod);
      } catch (err) {
        console.error(
          `FAIL  ${pkgRelative}/${locale}.ts: import error: ${err instanceof Error ? err.message : String(err)}`
        );
        importError = true;
        failures++;
      }
    }

    if (importError) continue;

    // Compare key sets
    const enKeys = catalogs['en']!;
    let pkgOk = true;

    for (const locale of ['fr', 'es'] as const) {
      const localeKeys = catalogs[locale]!;

      const missingInLocale = enKeys.filter((k) => !localeKeys.includes(k));
      const extraInLocale = localeKeys.filter((k) => !enKeys.includes(k));

      if (missingInLocale.length > 0) {
        console.error(
          `FAIL  ${pkgRelative}: ${locale} is missing ${missingInLocale.length} key(s): ${missingInLocale.slice(0, 5).join(', ')}${missingInLocale.length > 5 ? '...' : ''}`
        );
        pkgOk = false;
      }

      if (extraInLocale.length > 0) {
        console.error(
          `FAIL  ${pkgRelative}: ${locale} has ${extraInLocale.length} extra key(s): ${extraInLocale.slice(0, 5).join(', ')}${extraInLocale.length > 5 ? '...' : ''}`
        );
        pkgOk = false;
      }

      if (enKeys.length !== localeKeys.length) {
        console.error(
          `FAIL  ${pkgRelative}: en has ${enKeys.length} keys, ${locale} has ${localeKeys.length}`
        );
        pkgOk = false;
      }
    }

    if (!pkgOk) {
      failures++;
    } else {
      console.log(
        `  OK  ${pkgRelative} (${enKeys.length} keys × ${LOCALES.length} locales)`
      );
    }

    packages++;
  }

  console.log('');
  console.log(`Checked ${packages} packages, ${failures} failure(s).`);

  if (failures > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(2);
});
