#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = process.cwd();

/**
 * Recursively finds all package.json files in a directory
 */
const findPackageJsonFiles = (dir, files = []) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Skip node_modules, .turbo, and .next directories
    if (
      entry.name === 'node_modules' ||
      entry.name === '.turbo' ||
      entry.name === '.next'
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      findPackageJsonFiles(fullPath, files);
    } else if (entry.name === 'package.json') {
      files.push(fullPath);
    }
  }

  return files;
};

/**
 * Automatically discovers all publishable packages in the monorepo.
 * A package is publishable if:
 * 1. It has a package.json file
 * 2. It does NOT have "private": true in package.json
 * 3. It has publish:pkg script (for root package)
 */
const discoverPublishablePackages = () => {
  const packages = [];

  // Check if root package.json should be published
  const rootManifestPath = path.join(repoRoot, 'package.json');
  try {
    const rootManifest = JSON.parse(fs.readFileSync(rootManifestPath, 'utf8'));
    if (
      rootManifest.name &&
      rootManifest.version &&
      rootManifest.private !== true &&
      rootManifest.scripts?.['publish:pkg']
    ) {
      packages.push({
        name: rootManifest.name,
        dir: '.',
        version: rootManifest.version,
      });
      console.log(`[discover] Including root package: ${rootManifest.name}@${rootManifest.version}`);
    }
  } catch (error) {
    console.warn(`[discover] Error reading root package.json:`, error.message);
  }

  // Discover packages in the packages/ directory
  const packagesRoot = path.join(repoRoot, 'packages');
  const packageJsonFiles = findPackageJsonFiles(packagesRoot);

  for (const fullPath of packageJsonFiles) {
    const pkgDir = path.relative(repoRoot, path.dirname(fullPath));

    try {
      const manifest = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

      // Skip private packages
      if (manifest.private === true) {
        console.log(
          `[discover] Skipping private package: ${manifest.name || pkgDir}`
        );
        continue;
      }

      // Skip tool packages (they are dev dependencies for the monorepo)
      if (
        pkgDir.startsWith('packages/tools/') ||
        manifest.name?.startsWith('@lssm/tool.')
      ) {
        console.log(
          `[discover] Skipping tool package: ${manifest.name || pkgDir}`
        );
        continue;
      }

      // Skip packages without a name
      if (!manifest.name) {
        console.log(`[discover] Skipping package without name: ${pkgDir}`);
        continue;
      }

      packages.push({
        name: manifest.name,
        dir: pkgDir,
        version: manifest.version,
      });
    } catch (error) {
      console.warn(`[discover] Error reading ${fullPath}:`, error.message);
    }
  }

  console.log(`\n[discover] Found ${packages.length} publishable packages:\n`);
  packages.forEach((pkg) => {
    console.log(`  - ${pkg.name}@${pkg.version} (${pkg.dir})`);
  });
  console.log('');

  return packages;
};

// Build the package map
const packagesByName = new Map(
  discoverPublishablePackages().map((pkg) => [pkg.name, pkg])
);

/**
 * Publishes a single package using bun publish.
 *
 * bun publish automatically:
 * - Strips workspace: and catalog: protocols from package.json
 * - Handles authentication via NPM_CONFIG_TOKEN env var
 *
 * @see https://bun.com/docs/pm/cli/publish.md
 */
const publishSinglePackage = ({ name, dir }, dryRun, npmTag = 'latest') => {
  const pkgDir = path.join(repoRoot, dir);
  const manifestPath = path.join(pkgDir, 'package.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const version = manifest.version;

  console.log(`\n[publish] ${name}@${version} (tag: ${npmTag})`);

  if (dryRun) {
    console.log(
      `[publish] DRY_RUN=true → running bun publish --dry-run for ${name}@${version}`
    );
    try {
      execSync(`bun publish --access public --tag ${npmTag} --dry-run`, {
        cwd: pkgDir,
        stdio: 'inherit',
      });
    } catch {
      // Dry run failures are informational only
    }
    return { name, version, published: false, reason: 'dry-run' };
  }

  try {
    // bun publish with --tolerate-republish exits 0 if version already exists
    // This is cleaner than manually checking npm view beforehand
    execSync(
      `bun publish --access public --tag ${npmTag} --tolerate-republish`,
      {
        cwd: pkgDir,
        stdio: 'inherit',
      }
    );

    console.log(`[publish] ✓ Published ${name}@${version}`);
    return { name, version, published: true };
  } catch (error) {
    console.error(`[publish] ✗ Failed to publish ${name}@${version}`);
    console.error(error.message);
    return { name, version, published: false, reason: 'error', error };
  }
};

/**
 * Publishes packages to npm using bun publish.
 *
 * @param {Object} options
 * @param {string[]} [options.packageNames] - Specific packages to publish (all if empty)
 * @param {boolean} [options.dryRun] - If true, runs bun publish --dry-run
 * @param {string} [options.npmTag] - npm tag to use (default: 'latest')
 */
export async function publishPackages({
  packageNames,
  dryRun,
  npmTag = 'latest',
} = {}) {
  const targets =
    packageNames && packageNames.length > 0
      ? packageNames
      : Array.from(packagesByName.keys());

  const results = [];
  const failed = [];

  for (const name of targets) {
    const descriptor = packagesByName.get(name);
    if (!descriptor) {
      console.warn(`[publish] Package ${name} is not in the release map.`);
      continue;
    }

    const result = publishSinglePackage(descriptor, dryRun, npmTag);
    results.push(result);

    if (result.reason === 'error') {
      failed.push(result);
    }
  }

  // Summary
  console.log('\n[publish] === Summary ===');
  const published = results.filter((r) => r.published);
  const skipped = results.filter((r) => !r.published && r.reason !== 'error');

  if (published.length > 0) {
    console.log(`\n[publish] ✓ Published ${published.length} packages:`);
    published.forEach((r) => console.log(`  - ${r.name}@${r.version}`));
  }

  if (skipped.length > 0) {
    console.log(`\n[publish] ⊘ Skipped ${skipped.length} packages:`);
    skipped.forEach((r) =>
      console.log(`  - ${r.name}@${r.version} (${r.reason})`)
    );
  }

  if (failed.length > 0) {
    console.log(`\n[publish] ✗ Failed ${failed.length} packages:`);
    failed.forEach((r) => console.log(`  - ${r.name}@${r.version}`));
    // Exit with error if any packages failed
    process.exitCode = 1;
  }

  return results;
}

// CLI execution
const currentFilePath = fileURLToPath(import.meta.url);
const isExecutedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === currentFilePath;

if (isExecutedDirectly) {
  const dryRun = process.env.DRY_RUN === 'true' || process.env.DRY_RUN === '1';
  const npmTag = process.env.NPM_TAG || 'latest';
  await publishPackages({ dryRun, npmTag });
}
