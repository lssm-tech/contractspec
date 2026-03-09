#!/usr/bin/env node
/**
 * Generates public/llms-full.txt by aggregating all package READMEs and metadata.
 * Run from packages/apps/web-landing: bun scripts/generate-llms-full.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webLandingRoot = path.resolve(__dirname, '..');
const monorepoRoot = path.resolve(webLandingRoot, '../../..');

const LAYERS = [
  'libs',
  'modules',
  'bundles',
  'apps',
  'examples',
  'tools',
  'integrations',
  'apps-registry',
];

function findPackageJsonFiles(dir, base = '') {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      const pkgPath = path.join(fullPath, 'package.json');
      if (fs.existsSync(pkgPath)) {
        results.push({ path: fullPath, relativePath: relPath });
      } else {
        results.push(...findPackageJsonFiles(fullPath, relPath));
      }
    }
  }
  return results;
}

function findPackages() {
  const packages = [];
  const packagesDir = path.join(monorepoRoot, 'packages');
  for (const layer of LAYERS) {
    const layerPath = path.join(packagesDir, layer);
    if (!fs.existsSync(layerPath)) continue;
    const found = findPackageJsonFiles(layerPath, layer);
    for (const { path: pkgPath, relativePath } of found) {
      packages.push({
        layer,
        path: pkgPath,
        relativePath: `packages/${relativePath}`,
      });
    }
  }
  return packages;
}

function getPackageSlug(pkgName) {
  if (!pkgName?.startsWith('@contractspec/')) return null;
  return pkgName.slice('@contractspec/'.length);
}

function generate() {
  const packages = findPackages();
  const output = [];
  const slugToReadme = {};

  output.push('# ContractSpec — LLM Guide (Full)');
  output.push('');
  output.push('> Aggregated content from all packages. For summary, see /llms');
  output.push('');
  output.push(`Generated: ${new Date().toISOString()}`);
  output.push(`Packages: ${packages.length}`);
  output.push('');
  output.push('---');
  output.push('');

  for (const pkg of packages) {
    const pkgJsonPath = path.join(pkg.path, 'package.json');
    const readmePath = path.join(pkg.path, 'README.md');

    let pkgJson;
    try {
      pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    } catch {
      continue;
    }

    const pkgName = pkgJson.name;
    const slug = getPackageSlug(pkgName);
    if (!slug) continue;

    const fullPath = pkg.relativePath;

    output.push(`## ${pkgName}`);
    output.push('');
    output.push(`Description: ${pkgJson.description || '(none)'}`);
    output.push(`Path: ${fullPath}`);
    output.push(`URL: /llms/${slug}`);
    output.push('');

    if (fs.existsSync(readmePath)) {
      const readme = fs.readFileSync(readmePath, 'utf8');
      output.push(readme);
      slugToReadme[slug] = `${pkg.relativePath}/README.md`;
    } else {
      output.push('(No README.md)');
    }

    output.push('');
    output.push('---');
    output.push('');
  }

  const outPath = path.join(webLandingRoot, 'public', 'llms-full.txt');
  fs.writeFileSync(outPath, output.join('\n'), 'utf8');
  console.log(`Wrote ${outPath} (${packages.length} packages)`);

  // Generate slug -> relative README path manifest for /llms/[slug] route resolver.
  // Avoids Turbopack "overly broad file pattern" warnings from runtime filesystem scanning.
  const manifestPath = path.join(
    webLandingRoot,
    'src',
    'lib',
    'llms-package-manifest.generated.json'
  );
  fs.writeFileSync(manifestPath, JSON.stringify(slugToReadme, null, 0), 'utf8');
  console.log(
    `Wrote ${manifestPath} (${Object.keys(slugToReadme).length} slugs)`
  );
}

generate();
