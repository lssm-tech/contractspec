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

    // Skip node_modules and .turbo directories
    if (entry.name === 'node_modules' || entry.name === '.turbo') {
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
 */
const discoverPublishablePackages = () => {
  const packagesRoot = path.join(repoRoot, 'packages');
  const packageJsonFiles = findPackageJsonFiles(packagesRoot);

  const packages = [];

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

const workspacePrefix = 'workspace:';

const readManifest = (pkgDir) => {
  const manifestPath = path.join(repoRoot, pkgDir, 'package.json');
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
};

const buildLocalVersionMap = () => {
  const map = new Map();
  for (const { name, dir } of packagesByName.values()) {
    const manifest = readManifest(dir);
    map.set(name, manifest.version);
  }
  return map;
};

const resolveSpecifier = (rawValue, depName, versionMap) => {
  if (typeof rawValue !== 'string' || !rawValue.startsWith(workspacePrefix)) {
    return rawValue;
  }

  const linkedVersion = versionMap.get(depName);
  if (!linkedVersion) {
    console.warn(
      `[publish] ${depName} referenced via "${rawValue}" but no local version is available; leaving specifier untouched.`
    );
    return rawValue;
  }

  const hint = rawValue.slice(workspacePrefix.length);

  if (hint === '' || hint === '*' || hint === linkedVersion) {
    return linkedVersion;
  }

  if (hint === '^' || hint === '~') {
    return `${hint}${linkedVersion}`;
  }

  if (/^[~^]/.test(hint)) {
    return `${hint[0]}${linkedVersion}`;
  }

  const op = ['<=', '>=', '<', '>'].find((candidate) =>
    hint.startsWith(candidate)
  );
  if (op) {
    return `${op}${linkedVersion}`;
  }

  if (/^\d/.test(hint)) {
    return linkedVersion;
  }

  return linkedVersion;
};

const updateWorkspaceSpecifiers = (manifest, versionMap) => {
  let changed = false;
  for (const field of [
    'dependencies',
    'devDependencies',
    'optionalDependencies',
  ]) {
    const block = manifest[field];
    if (!block) continue;
    for (const dep of Object.keys(block)) {
      const replacement = resolveSpecifier(block[dep], dep, versionMap);
      if (replacement !== block[dep]) {
        block[dep] = replacement;
        changed = true;
      }
    }
  }
  return changed;
};

const getPublishedVersions = (packageName) => {
  try {
    const raw = execSync(`npm view ${packageName} versions --json`, {
      stdio: ['ignore', 'pipe', 'pipe'],
    })
      .toString()
      .trim();
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch {
    console.log(
      `[publish] No registry versions found for ${packageName}; treating as first release.`
    );
    return [];
  }
};

const publishSinglePackage = (
  { name, dir },
  versionMap,
  dryRun,
  npmTag = 'latest'
) => {
  const pkgDir = path.join(repoRoot, dir);
  const manifestPath = path.join(pkgDir, 'package.json');
  const original = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(original);
  const version = manifest.version;

  try {
    updateWorkspaceSpecifiers(manifest, versionMap);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

    console.log(`\n[publish] ${name}@${version} (tag: ${npmTag})`);

    if (dryRun) {
      console.log(
        `[publish] DRY_RUN=true → skipping npm publish for ${name}@${version}`
      );
      return { name, version, published: false, reason: 'dry-run' };
    }

    const publishedVersions = getPublishedVersions(name);
    const alreadyPublished = Array.isArray(publishedVersions)
      ? publishedVersions.includes(version)
      : publishedVersions === version;

    if (alreadyPublished) {
      console.log(`[publish] Skipping ${name}@${version} (already published).`);
      return { name, version, published: false, reason: 'already-published' };
    }

    execSync(`npm publish --access public --tag ${npmTag} --ignore-scripts`, {
      cwd: pkgDir,
      stdio: 'inherit',
    });

    return { name, version, published: true };
  } finally {
    fs.writeFileSync(manifestPath, original);
  }
};

export async function publishPackages({
  packageNames,
  dryRun,
  npmTag = 'latest',
} = {}) {
  const versionMap = buildLocalVersionMap();
  const targets =
    packageNames && packageNames.length > 0
      ? packageNames
      : Array.from(packagesByName.keys());

  const results = [];

  for (const name of targets) {
    const descriptor = packagesByName.get(name);
    if (!descriptor) {
      console.warn(`[publish] Package ${name} is not in the release map.`);
      continue;
    }
    results.push(publishSinglePackage(descriptor, versionMap, dryRun, npmTag));
  }

  return results;
}

const currentFilePath = fileURLToPath(import.meta.url);
const isExecutedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === currentFilePath;

if (isExecutedDirectly) {
  const dryRun = process.env.DRY_RUN === 'true' || process.env.DRY_RUN === '1';
  const npmTag = process.env.NPM_TAG || 'latest';
  await publishPackages({ dryRun, npmTag });
}
