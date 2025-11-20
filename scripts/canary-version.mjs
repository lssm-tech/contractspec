#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = process.cwd();

// Duplicated from publish-packages.js to avoid ESM import issues or shared state
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
    ['@lssm/lib.database', 'packages/libs/database'],
    ['@lssm/lib.databases', 'packages/libs/databases'],
  ].map(([name, dir]) => [name, { name, dir }])
);

const readManifest = (pkgDir) => {
  const manifestPath = path.join(repoRoot, pkgDir, 'package.json');
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
};

const writeManifest = (pkgDir, manifest) => {
  const manifestPath = path.join(repoRoot, pkgDir, 'package.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
};

const generateCanaryVersion = (currentVersion) => {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:T.]/g, '')
    .slice(0, 14); // YYYYMMDDHHMMSS
  return `${currentVersion}-canary.${timestamp}`;
};

async function applyCanaryVersions() {
  console.log('[canary] Generating canary versions...');
  
  // 1. Read all current versions and generate new canary versions
  const versionMap = new Map();
  for (const { name, dir } of packagesByName.values()) {
    const manifest = readManifest(dir);
    const canaryVersion = generateCanaryVersion(manifest.version);
    versionMap.set(name, canaryVersion);
    console.log(`[canary] ${name}: ${manifest.version} -> ${canaryVersion}`);
  }

  // 2. Update all package.json files with new versions and resolved dependencies
  for (const { name, dir } of packagesByName.values()) {
    const manifest = readManifest(dir);
    manifest.version = versionMap.get(name);

    // Update workspace dependencies to point to the new canary versions
    for (const field of ['dependencies', 'devDependencies', 'peerDependencies']) {
      if (!manifest[field]) continue;
      
      for (const depName of Object.keys(manifest[field])) {
        if (versionMap.has(depName)) {
          // Force exact version match for internal deps in canary
          manifest[field][depName] = versionMap.get(depName);
        }
      }
    }

    writeManifest(dir, manifest);
  }

  console.log('[canary] All packages updated to canary versions.');
}

applyCanaryVersions().catch((err) => {
  console.error(err);
  process.exit(1);
});
