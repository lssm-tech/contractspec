#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = process.cwd();

const packagesByName = new Map(
  [
    ['@lssm/lib.utils-typescript', 'packages/libs/utils-typescript'],
    ['@lssm/lib.logger', 'packages/libs/logger'],
    ['@lssm/lib.schema', 'packages/libs/schema'],
    ['@lssm/lib.contracts', 'packages/libs/contracts'],
    ['@lssm/lib.graphql-core', 'packages/libs/graphql-core'],
    ['@lssm/lib.graphql-prisma', 'packages/libs/graphql-prisma'],
    ['@lssm/lib.graphql-federation', 'packages/libs/graphql-federation'],
    ['@lssm/lib.error', 'packages/libs/error'],
    ['@lssm/lib.exporter', 'packages/libs/exporter'],
    ['@lssm/lib.ui-kit', 'packages/libs/ui-kit'],
    ['@lssm/lib.ui-kit-web', 'packages/libs/ui-kit-web'],
    ['@lssm/lib.design-system', 'packages/libs/design-system'],
    ['@lssm/lib.accessibility', 'packages/libs/accessibility'],
    [
      '@lssm/lib.presentation-runtime-core',
      'packages/libs/presentation-runtime-core',
    ],
    [
      '@lssm/lib.presentation-runtime-react',
      'packages/libs/presentation-runtime-react',
    ],
    [
      '@lssm/lib.presentation-runtime-react-native',
      'packages/libs/presentation-runtime-react-native',
    ],
    ['@lssm/lib.bus', 'packages/libs/bus'],
    ['@lssm/app.cli-database', 'packages/libs/database'],
    ['@lssm/app.cli-databases', 'packages/libs/databases'],
  ].map(([name, dir]) => [name, { name, dir }])
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

const publishSinglePackage = ({ name, dir }, versionMap, dryRun, npmTag = 'latest') => {
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

export async function publishPackages({ packageNames, dryRun, npmTag = 'latest' } = {}) {
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
